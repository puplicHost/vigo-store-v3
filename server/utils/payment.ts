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
   * Load Paymob configuration with fallback chain:
   * 1. PaymentGateway table
   * 2. Settings table
   * 3. Environment variables
   * 4. Throw explicit error if all fail
   */
  private async loadPaymobConfig(): Promise<{ apiKey: string; integrationId: number; iframeId: string; hmacSecret: string }> {
    // Fallback 1: PaymentGateway table
    const gateway = await prisma.paymentGateway.findUnique({
      where: { name: 'PAYMOB' }
    })

    if (gateway?.config) {
      const config = gateway.config as any
      if (config.apiKey && config.integrationId && config.iframeId && config.hmacSecret) {
        console.log('[PAYMENT] Paymob config loaded from PaymentGateway table')
        return {
          apiKey: config.apiKey,
          integrationId: Number(config.integrationId),
          iframeId: config.iframeId,
          hmacSecret: config.hmacSecret
        }
      }
    }

    // Fallback 2: Settings table
    const settings = await prisma.settings.findUnique({
      where: { id: 'default' }
    })

    if (settings?.paymobApiKey && settings?.paymobIntegrationId && settings?.paymobIframeId && settings?.paymobHmacSecret) {
      console.log('[PAYMENT] Paymob config loaded from Settings table')
      return {
        apiKey: settings.paymobApiKey,
        integrationId: Number(settings.paymobIntegrationId),
        iframeId: settings.paymobIframeId,
        hmacSecret: settings.paymobHmacSecret
      }
    }

    // Fallback 3: Environment variables
    const envApiKey = process.env.PAYMOB_API_KEY
    const envIntegrationId = process.env.PAYMOB_INTEGRATION_ID
    const envIframeId = process.env.PAYMOB_IFRAME_ID
    const envHmacSecret = process.env.PAYMOB_HMAC_SECRET

    if (envApiKey && envIntegrationId && envIframeId && envHmacSecret) {
      console.log('[PAYMENT] Paymob config loaded from Environment variables')
      return {
        apiKey: envApiKey,
        integrationId: Number(envIntegrationId),
        iframeId: envIframeId,
        hmacSecret: envHmacSecret
      }
    }

    // Fallback 4: Explicit error
    throw new Error('PAYMOB configuration is missing from PaymentGateway, Settings, and Environment Variables')
  }

  /**
   * Initializes payment for an order (PAYMOB only)
   */
  async initializePayment(order: any, shippingAddress: any): Promise<PaymentInitiationResult> {
    const { paymentMethod, id: orderId } = order

    if (paymentMethod.toUpperCase() !== 'PAYMOB') {
      return {
        success: false,
        message: 'Only PAYMOB payment method is supported.'
      }
    }

    try {
      const config = await this.loadPaymobConfig()
      return this.initializePaymobPayment(order, config, shippingAddress)
    } catch (error: any) {
      console.error('[PAYMENT] Paymob config load failed:', error.message)
      // Fallback to mock mode in development only
      if (process.env.NODE_ENV === 'development') {
        console.log('[PAYMENT] Development mode: falling back to MOCK payment')
        return this.initializeMockPayment(orderId)
      }
      throw error
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
