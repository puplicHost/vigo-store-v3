<template>
  <div class="min-h-screen bg-surface text-on-surface">
    <main class="pt-32 pb-24 px-12 max-w-screen-2xl mx-auto min-h-screen">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        <!-- Left Column: Checkout Flow -->
        <div class="lg:col-span-7 space-y-16">
          <!-- Header -->
          <header class="space-y-4">
            <h1 class="text-4xl font-serif text-on-surface tracking-tight">Complete your order</h1>
            <p class="text-secondary font-body">Choose your payment method, then fill in the required details.</p>
          </header>

          <!-- Step 1: Payment Method Selection -->
          <section class="space-y-6">
            <div class="flex items-center gap-3">
              <span class="text-xs uppercase tracking-widest px-3 py-1.5 bg-primary/10 text-primary font-bold rounded-lg">01</span>
              <h3 class="text-sm uppercase tracking-widest font-semibold text-on-surface">Choose Payment Method</h3>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Cash on Delivery -->
              <label :class="['relative flex flex-col items-center gap-4 p-8 rounded-2xl cursor-pointer border-2 transition-all duration-300', paymentMethod === 'cod' ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10' : 'border-outline-variant/20 bg-surface-container-low hover:border-primary/30']">
                <input v-model="paymentMethod" value="cod" class="sr-only" name="payment" type="radio"/>
                <div :class="['w-16 h-16 rounded-2xl flex items-center justify-center transition-colors', paymentMethod === 'cod' ? 'bg-primary/10' : 'bg-surface-container']">
                  <span class="material-symbols-outlined text-3xl" :class="paymentMethod === 'cod' ? 'text-primary' : 'text-secondary'">payments</span>
                </div>
                <div class="text-center">
                  <span class="block text-sm font-bold">Cash on Delivery</span>
                  <span class="block text-xs text-secondary mt-1">Pay when you receive</span>
                </div>
                <div v-if="paymentMethod === 'cod'" class="absolute top-3 right-3">
                  <span class="material-symbols-outlined text-primary text-xl">check_circle</span>
                </div>
              </label>

              <!-- Paymob (Egypt Card Payment) -->
              <label :class="['relative flex flex-col items-center gap-4 p-8 rounded-2xl cursor-pointer border-2 transition-all duration-300', paymentMethod === 'paymob' ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10' : 'border-outline-variant/20 bg-surface-container-low hover:border-primary/30']">
                <input v-model="paymentMethod" value="paymob" class="sr-only" name="payment" type="radio"/>
                <div :class="['w-16 h-16 rounded-2xl flex items-center justify-center transition-colors', paymentMethod === 'paymob' ? 'bg-primary/10' : 'bg-surface-container']">
                  <span class="material-symbols-outlined text-3xl" :class="paymentMethod === 'paymob' ? 'text-primary' : 'text-secondary'">account_balance</span>
                </div>
                <div class="text-center">
                  <span class="block text-sm font-bold">Credit/Debit Card</span>
                  <span class="block text-xs text-secondary mt-1">Pay via Paymob (Egypt)</span>
                </div>
                <div v-if="paymentMethod === 'paymob'" class="absolute top-3 right-3">
                  <span class="material-symbols-outlined text-primary text-xl">check_circle</span>
                </div>
              </label>

              <!-- Stripe (Global) -->
              <label v-if="settings?.isStripeEnabled" :class="['relative flex flex-col items-center gap-4 p-8 rounded-2xl cursor-pointer border-2 transition-all duration-300', paymentMethod === 'stripe' ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10' : 'border-outline-variant/20 bg-surface-container-low hover:border-primary/30']">
                <input v-model="paymentMethod" value="stripe" class="sr-only" name="payment" type="radio"/>
                <div :class="['w-16 h-16 rounded-2xl flex items-center justify-center transition-colors', paymentMethod === 'stripe' ? 'bg-primary/10' : 'bg-surface-container']">
                  <span class="material-symbols-outlined text-3xl" :class="paymentMethod === 'stripe' ? 'text-primary' : 'text-secondary'">public</span>
                </div>
                <div class="text-center">
                  <span class="block text-sm font-bold">Global Card</span>
                  <span class="block text-xs text-secondary mt-1">Accept international cards</span>
                </div>
                <div v-if="paymentMethod === 'stripe'" class="absolute top-3 right-3">
                  <span class="material-symbols-outlined text-primary text-xl">check_circle</span>
                </div>
              </label>
            </div>
          </section>

          <!-- Step 2: Dynamic Information Form -->
          <Transition mode="out-in" enter-active-class="transition-all duration-500 ease-out" enter-from-class="opacity-0 translate-y-4" enter-to-class="opacity-100 translate-y-0" leave-active-class="transition-all duration-300 ease-in" leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-4">
            <!-- COD Form: Delivery Focus -->
            <section v-if="paymentMethod === 'cod'" :key="'cod-form'" class="space-y-8">
              <div class="flex items-center gap-3">
                <span class="text-xs uppercase tracking-widest px-3 py-1.5 bg-primary/10 text-primary font-bold rounded-lg">02</span>
                <h3 class="text-sm uppercase tracking-widest font-semibold text-on-surface">Delivery Details</h3>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10 bg-surface-container-low/30 p-8 rounded-3xl border border-outline-variant/5">
                <div class="flex flex-col">
                  <label class="text-[10px] uppercase tracking-[0.2em] font-semibold text-secondary mb-1">Full Name</label>
                  <input v-model="shipping.fullName" class="input-minimal" placeholder="Full name for delivery" type="text"/>
                </div>
                <div class="flex flex-col">
                  <label class="text-[10px] uppercase tracking-[0.2em] font-semibold text-secondary mb-1">Primary Phone</label>
                  <input v-model="shipping.phone" class="input-minimal" placeholder="01xxxxxxxxx" type="tel"/>
                </div>
                <div class="flex flex-col md:col-span-2">
                  <label class="text-[10px] uppercase tracking-[0.2em] font-semibold text-secondary mb-1">Detailed Delivery Address</label>
                  <input v-model="shipping.address" class="input-minimal" placeholder="Street name, building number, floor, apartment" type="text"/>
                </div>
                <div class="flex flex-col">
                  <label class="text-[10px] uppercase tracking-[0.2em] font-semibold text-secondary mb-1">Governorate / City</label>
                  <select v-model="shipping.city" class="input-minimal bg-transparent">
                    <option value="">Select Location</option>
                    <option value="Cairo">Cairo</option>
                    <option value="Giza">Giza</option>
                    <option value="Alexandria">Alexandria</option>
                    <option value="Other">Other Governorate</option>
                  </select>
                </div>
                <div class="flex flex-col">
                  <label class="text-[10px] uppercase tracking-[0.2em] font-semibold text-secondary mb-1">Nearby Landmark (Optional)</label>
                  <input v-model="shipping.landmark" class="input-minimal" placeholder="Near to..." type="text"/>
                </div>
              </div>
            </section>

            <!-- Paymob Form: Full Visa Details UI -->
            <section v-else-if="paymentMethod === 'paymob'" :key="'card-form'" class="space-y-8">
              <div class="flex items-center gap-3">
                <span class="text-xs uppercase tracking-widest px-3 py-1.5 bg-primary/10 text-primary font-bold rounded-lg">02</span>
                <h3 class="text-sm uppercase tracking-widest font-semibold text-on-surface">Payment Details</h3>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10 bg-surface-container-low/30 p-8 rounded-3xl border border-outline-variant/5">
                <div class="flex flex-col md:col-span-2">
                  <label class="text-[10px] uppercase tracking-[0.2em] font-semibold text-secondary mb-1">Cardholder Name</label>
                  <input v-model="cardDetails.name" class="input-minimal" placeholder="Name exactly as it appears on your card" type="text"/>
                </div>
                <div class="flex flex-col md:col-span-2">
                  <label class="text-[10px] uppercase tracking-[0.2em] font-semibold text-secondary mb-1">Card Number</label>
                  <input v-model="cardDetails.number" class="input-minimal" placeholder="4242 4242 4242 4242" type="text" maxlength="19" @input="formatCardNumber"/>
                </div>
                <div class="flex flex-col">
                  <label class="text-[10px] uppercase tracking-[0.2em] font-semibold text-secondary mb-1">Expiry Date</label>
                  <input v-model="cardDetails.expiry" class="input-minimal" placeholder="MM / YY" type="text" maxlength="7" @input="formatExpiry"/>
                </div>
                <div class="flex flex-col">
                  <label class="text-[10px] uppercase tracking-[0.2em] font-semibold text-secondary mb-1">CVV/CVC</label>
                  <input v-model="cardDetails.cvv" class="input-minimal" placeholder="***" type="password" maxlength="4"/>
                </div>
                <!-- Contact & Shipping fields needed for creating the order -->
                <div class="border-t border-outline-variant/10 md:col-span-2 pt-6 mb-2 mt-2">
                  <span class="text-xs uppercase tracking-widest font-bold text-on-surface">Contact & Delivery</span>
                </div>
                <div class="flex flex-col">
                  <label class="text-[10px] uppercase tracking-[0.2em] font-semibold text-secondary mb-1">Email Address</label>
                  <input v-model="shipping.email" class="input-minimal" placeholder="name@example.com" type="email"/>
                </div>
                <div class="flex flex-col">
                  <label class="text-[10px] uppercase tracking-[0.2em] font-semibold text-secondary mb-1">Phone Number</label>
                  <input v-model="shipping.phone" class="input-minimal" placeholder="01xxxxxxxxx" type="tel"/>
                </div>
                <div class="flex flex-col md:col-span-2">
                  <label class="text-[10px] uppercase tracking-[0.2em] font-semibold text-secondary mb-1">Detailed Delivery Address</label>
                  <input v-model="shipping.address" class="input-minimal" placeholder="Street name, building number" type="text"/>
                </div>
              </div>
            </section>
          </Transition>

          <!-- Submit -->
          <div class="pt-12 flex flex-col sm:flex-row justify-between items-center gap-8 border-t border-outline-variant/10">
            <NuxtLink to="/cart" class="text-[10px] font-label uppercase tracking-widest text-secondary hover:text-on-surface transition-colors flex items-center gap-2">
              <span class="material-symbols-outlined text-base">arrow_back</span>
              Return to shopping bag
            </NuxtLink>
            <button 
              @click="proceedToPayment" 
              :disabled="isProcessing"
              class="w-full sm:w-auto px-16 py-5 bg-stone-900 text-white rounded-xl font-label uppercase tracking-[0.3em] text-xs font-bold shadow-2xl transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-center gap-4"
            >
              <span v-if="isProcessing" class="material-symbols-outlined text-lg animate-spin">progress_activity</span>
              <span v-else class="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">{{ paymentMethod === 'cod' ? 'local_shipping' : 'payments' }}</span>
              <span>{{ isProcessing ? 'Processing' : (paymentMethod === 'cod' ? 'Confirm Delivery' : 'Secure Payment') }}</span>
            </button>
          </div>
        </div>

        <!-- Right Column: Order Summary & Cart Items -->
        <aside class="lg:col-span-5 bg-surface-container-low rounded-[2rem] p-8 lg:p-12 sticky top-32">
          <h2 class="text-2xl font-serif mb-10">Order Summary</h2>
          
          <div v-if="!cartItems?.length" class="text-center py-12 text-secondary">
            Your cart is empty
          </div>
          <div v-else class="space-y-8 mb-10 max-h-[400px] overflow-y-auto pr-4">
            <div v-for="item in cartItems" :key="item.id" class="flex gap-6 group">
              <div class="relative w-24 h-32 flex-shrink-0 bg-stone-200 rounded-lg overflow-hidden">
                <img 
                  v-if="item.image" 
                  :src="item.image" 
                  :alt="item.name"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div v-else class="w-full h-full flex items-center justify-center">
                  <span class="material-symbols-outlined text-on-surface-variant/30">image</span>
                </div>
                <div class="absolute top-2 right-2 flex items-center justify-center bg-white/60 backdrop-blur-md rounded-full w-6 h-6 text-[10px] font-bold">
                  {{ item.quantity }}
                </div>
              </div>
              <div class="flex flex-col justify-between py-1 flex-grow">
                <div>
                  <div class="flex justify-between items-start">
                    <h3 class="text-sm font-semibold text-on-surface">{{ item.name }}</h3>
                    <span class="text-sm font-medium">{{ settings?.currency || 'EGP' }} {{ (item.price * item.quantity).toFixed(2) }}</span>
                  </div>
                  <p class="text-xs text-secondary mt-1">{{ item.size || 'Standard' }}</p>
                </div>
                <button @click="removeFromCart(item.id)" class="text-xs text-secondary hover:text-error transition-colors flex items-center gap-1">
                  <span class="material-symbols-outlined text-[14px]">close</span>
                  Remove
                </button>
              </div>
            </div>
          </div>

          <!-- Breakdown -->
          <div class="space-y-4 pt-8 border-t border-outline-variant/20">
            <div class="flex justify-between text-sm">
              <span class="text-secondary">Subtotal</span>
              <span class="font-medium">{{ settings?.currency || 'EGP' }} {{ subtotal.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-secondary">Shipping</span>
              <span class="text-primary font-medium">{{ shippingCost === 0 ? 'Free' : `${settings?.currency || 'EGP'} ${shippingCost.toFixed(2)}` }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-secondary">Estimated Tax</span>
              <span class="font-medium">{{ settings?.currency || 'EGP' }} {{ tax.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-lg font-bold pt-4 border-t border-outline-variant/20">
              <span class="font-serif">Total</span>
              <span class="font-serif">{{ settings?.currency || 'EGP' }} {{ total.toFixed(2) }}</span>
            </div>
          </div>

          <!-- Promo Code -->
          <div class="mt-10 flex gap-4">
            <input v-model="promoCode" class="input-minimal flex-grow py-2" placeholder="Promo Code" type="text"/>
            <button class="text-xs font-bold uppercase tracking-widest py-2 px-4 border-b border-on-surface">Apply</button>
          </div>

          <!-- Security Badge -->
          <div class="mt-12 flex items-center justify-center gap-6 opacity-40">
            <div class="flex items-center gap-1.5 grayscale">
              <span class="material-symbols-outlined text-lg">verified_user</span>
              <span class="text-[10px] uppercase font-bold tracking-tighter">Secure Checkout</span>
            </div>
            <div class="flex items-center gap-1.5 grayscale">
              <span class="material-symbols-outlined text-lg">local_shipping</span>
              <span class="text-[10px] uppercase font-bold tracking-tighter">Tracked Delivery</span>
            </div>
          </div>
        </aside>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const { isAuthenticated, user } = useAuth()
const { settings } = useSettings()
const { toast } = useNotifications()

const { cartItems, cartTotal, removeFromCart, clearCart } = useCart()

// Shipping form dynamic fields based on payment method
const shipping = ref({
  fullName: '',
  email: user.value?.email || '',
  phone: '',
  address: '',
  city: 'Cairo', // default for paymob fallback
  landmark: '',
})

// Card details UI State (For MVP visual collection, standard Paymob will use Iframe)
const cardDetails = ref({
  name: '',
  number: '',
  expiry: '',
  cvv: ''
})

const paymentMethod = ref('cod')
const promoCode = ref('')

// Formatting hooks
const formatCardNumber = (e: Event) => {
  const target = e.target as HTMLInputElement
  let value = target.value.replace(/\s/g, '').replace(/\D/g, '')
  value = value.match(/.{1,4}/g)?.join(' ') || value
  cardDetails.value.number = value
}

const formatExpiry = (e: Event) => {
  const target = e.target as HTMLInputElement
  let value = target.value.replace(/\D/g, '')
  if (value.length >= 2) {
    value = value.slice(0, 2) + ' / ' + value.slice(2, 4)
  }
  cardDetails.value.expiry = value
}

const subtotal = computed(() => {
  return cartTotal.value || 0
})

const shippingCost = computed(() => {
  if (settings.value.freeShippingThreshold > 0 && subtotal.value >= settings.value.freeShippingThreshold) {
    return 0
  }
  // Simplified for MVP, could be dynamically tied to governorate later
  return settings.value.shippingFee || 100
})

const tax = computed(() => {
  return Math.round((subtotal.value * 0.14) * 100) / 100 // 14% Egyptian VAT
})

const total = computed(() => {
  return Math.round((subtotal.value + shippingCost.value + tax.value) * 100) / 100
})

const isProcessing = ref(false)

const proceedToPayment = () => {
  if (!cartItems.value.length) {
    toast.warning('Your shopping bag is empty.', 'Empty Cart')
    return
  }

  // Validate specific fields based on payment method
  if (paymentMethod.value === 'cod') {
    if (!shipping.value.fullName || !shipping.value.phone || !shipping.value.address || !shipping.value.city) {
      toast.warning('Please complete all required delivery details.', 'Incomplete Form')
      return
    }
  } else if (paymentMethod.value === 'paymob') {
    if (!shipping.value.fullName || !shipping.value.email || !shipping.value.phone) {
      toast.warning('Please provide your complete billing and contact information.', 'Incomplete Form')
      return
    }
  }

  createOrder('PENDING')
}

const createOrder = async (paymentStatus) => {
  isProcessing.value = true
  try {
    // Standardize naming for backend
    const _firstName = shipping.value.fullName.split(' ')[0] || ''
    const _lastName = shipping.value.fullName.split(' ').slice(1).join(' ') || ''

    const orderData = {
      items: cartItems.value.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price
      })),
      shippingAddress: {
        firstName: _firstName,
        lastName: _lastName,
        phone: shipping.value.phone,
        address: shipping.value.address,
        city: shipping.value.city,
        landmark: shipping.value.landmark || '',
        country: 'Egypt'
      },
      totalAmount: total.value,
      paymentMethod: paymentMethod.value.toUpperCase(),
      paymentStatus
    }

    const response = await $apiFetch<any>('/api/orders', {
      method: 'POST',
      body: orderData
    })

    if (response?.paymentUrl) {
      // Redirect to Paymob Iframe
      window.location.href = response.paymentUrl
      return
    }

    toast.success('Your order has been placed successfully!', 'Order Success')
    clearCart()
    navigateTo('/', { replace: true })
  } catch (error: any) {
    console.error('[Checkout Error]:', error)
    toast.error(error.data?.statusMessage || 'Failed to place order', 'Payment Error')
  } finally {
    isProcessing.value = false
  }
}
</script>

<style scoped>
.input-minimal {
  background: transparent;
  border: none;
  border-bottom: 1px solid rgba(209, 197, 180, 0.5);
  border-radius: 0;
  padding: 0.75rem 0;
  transition: border-color 0.3s ease;
}
.input-minimal:focus {
  outline: none;
  box-shadow: none;
  border-bottom: 2px solid #775a19;
}
.checkout-gradient {
  background: linear-gradient(135deg, #775a19 0%, #c5a059 100%);
}
</style>
