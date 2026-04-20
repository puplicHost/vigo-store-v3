import { paymobService } from './paymob'
import prisma from './prisma'

export interface PaymentInitiationResult {
  success: boolean
  paymentUrl?: string
  message?: string
  transactionId?: string
}

/**
 * PaymentService (Pure Gateway Handler)
 * No DB writes to Order table allowed here.
 * Handles gateway communication logic only.
 */
export class PaymentService {
  /**
   * Initializes payment for an order based on the method
   */
  async initializePayment(order: any, shippingAddress: any): Promise<PaymentInitiationResult> {
    const { paymentMethod, totalAmount, id: orderId } = order

    // 1. Fetch Gateway Config (ReadOnly)
    const gateway = await prisma.paymentGateway.findUnique({
      where: { name: paymentMethod.toUpperCase() }
    })

    // Fallback logic (ReadOnly check)
    const isDev = process.env.NODE_ENV === 'development' || !gateway?.isEnabled
    
    if (paymentMethod.toUpperCase() === 'PAYMOB') {
      if (isDev && (!gateway?.config || !(gateway.config as any).apiKey)) {
        console.log(`[PAYMENT] Paymob selected but no config found. falling back to MOCK mode.`)
        return this.initializeMockPayment(orderId)
      }

      return this.initializePaymobPayment(order, gateway!.config as any, shippingAddress)
    }

    if (paymentMethod.toUpperCase() === 'COD') {
      return {
        success: true,
        message: 'Order confirmation via Cash on Delivery.'
      }
    }

    return {
      success: false,
      message: 'Method not supported by this settlement layer.'
    }
  }

  /**
   * Mock Payment for development
   */
  private initializeMockPayment(orderId: string): PaymentInitiationResult {
    return {
      success: true,
      paymentUrl: `/checkout/success?mock=true&orderId=${orderId}`,
      message: 'Redirecting to simulated secure terminal...'
    }
  }

  /**
   * Paymob Gateway Integration
   */
  private async initializePaymobPayment(order: any, config: any, shippingAddress: any): Promise<PaymentInitiationResult> {
    try {
      const authToken = await paymobService.authenticate(config.apiKey)
      const amountCents = Math.round(order.totalAmount * 100)

      const paymobOrderId = await paymobService.registerOrder(
        authToken,
        amountCents,
        'EGP',
        order.id
      )

      const paymentToken = await paymobService.createPaymentKey(
        authToken,
        paymobOrderId,
        amountCents,
        'EGP',
        Number(config.integrationId),
        {
          first_name: shippingAddress.firstName || 'Vigo',
          last_name: shippingAddress.lastName || 'Customer',
          email: shippingAddress.email || 'customer@vigo.com',
          phone_number: shippingAddress.phone || '01000000000'
        }
      )

      return {
        success: true,
        paymentUrl: `https://egypt.paymob.com/api/acceptance/iframes/${config.iframeId}?payment_token=${paymentToken}`
      }
    } catch (error) {
      console.error('[PAYMENT GATEWAY ERROR]', error)
      return {
        success: false,
        message: 'Digital settlement layer failed to initialize.'
      }
    }
  }
}

export const paymentService = new PaymentService()
