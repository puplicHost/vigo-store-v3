

interface PaymobAuthResponse {
  token: string
}

interface PaymobOrderResponse {
  id: number
}

interface PaymobPaymentKeyResponse {
  token: string
}

export class PaymobService {
  private baseUrl = 'https://egypt.paymob.com/api'

  async authenticate(apiKey: string): Promise<string> {
    const response = await $fetch<PaymobAuthResponse>(`${this.baseUrl}/auth/tokens`, {
      method: 'POST',
      body: { api_key: apiKey }
    })
    return response.token
  }

  async registerOrder(token: string, amountCents: number, currency: string, merchantOrderId: string): Promise<number> {
    const response = await $fetch<PaymobOrderResponse>(`${this.baseUrl}/ecommerce/orders`, {
      method: 'POST',
      body: {
        auth_token: token,
        delivery_needed: 'false',
        amount_cents: amountCents,
        currency: currency,
        merchant_order_id: merchantOrderId,
        items: []
      }
    })
    return response.id
  }

  async createPaymentKey(
    token: string, 
    orderId: number, 
    amountCents: number, 
    currency: string, 
    integrationId: number,
    billingData: {
      first_name: string
      last_name: string
      email: string
      phone_number: string
    }
  ): Promise<string> {
    const response = await $fetch<PaymobPaymentKeyResponse>(`${this.baseUrl}/acceptance/payment_keys`, {
      method: 'POST',
      body: {
        auth_token: token,
        amount_cents: amountCents,
        expiration: 3600,
        order_id: orderId,
        billing_data: {
          ...billingData,
          apartment: 'NA',
          floor: 'NA',
          street: 'NA',
          building: 'NA',
          shipping_method: 'PKG',
          postal_code: 'NA',
          city: 'Cairo',
          country: 'EG',
          state: 'Cairo'
        },
        currency: currency,
        integration_id: integrationId,
        lock_order_when_paid: 'false'
      }
    })
    return response.token
  }
}

export const paymobService = new PaymobService()
