<template>
  <div class="min-h-screen bg-surface text-on-surface">
    <!-- TopNavBar -->
    <header class="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl shadow-[0_20px_40px_rgba(28,27,27,0.04)]">
      <div class="flex justify-between items-center px-12 py-6 w-full max-w-screen-2xl mx-auto">
        <div class="flex items-center gap-12">
          <NuxtLink to="/" class="text-2xl font-serif italic text-stone-900 tracking-tight">VIGO</NuxtLink>
          <nav class="hidden md:flex gap-10 items-center">
            <NuxtLink to="/" exact-active-class="text-primary border-b border-primary/30 pb-1" class="text-stone-600 hover:text-stone-900 transition-colors font-serif tracking-tight">Home</NuxtLink>
            <NuxtLink to="/products" active-class="text-primary border-b border-primary/30 pb-1" class="text-stone-600 hover:text-stone-900 transition-colors font-serif tracking-tight">Shop All</NuxtLink>
            <NuxtLink to="/about" active-class="text-primary border-b border-primary/30 pb-1" class="text-stone-600 hover:text-stone-900 transition-colors font-serif tracking-tight">About Us</NuxtLink>
          </nav>
        </div>
        <div class="flex items-center gap-6">
          <NuxtLink :to="isAuthenticated ? '/account' : '/auth/login'" class="material-symbols-outlined text-stone-600 hover:opacity-80 transition-all duration-300">person</NuxtLink>
          <NuxtLink v-if="isAuthenticated && ['SUPERADMIN', 'ADMIN', 'MANAGER'].includes(user?.role)" to="/admin" title="Dashboard" class="material-symbols-outlined text-stone-600 hover:opacity-80 transition-all duration-300">dashboard</NuxtLink>
          <NuxtLink v-if="isAuthenticated" to="/cart" class="material-symbols-outlined text-stone-600 hover:opacity-80 transition-all duration-300">shopping_bag</NuxtLink>
        </div>
      </div>
    </header>

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

              <!-- Visa / Card Payment -->
              <label :class="['relative flex flex-col items-center gap-4 p-8 rounded-2xl cursor-pointer border-2 transition-all duration-300', paymentMethod === 'stripe' ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10' : 'border-outline-variant/20 bg-surface-container-low hover:border-primary/30']">
                <input v-model="paymentMethod" value="stripe" class="sr-only" name="payment" type="radio"/>
                <div :class="['w-16 h-16 rounded-2xl flex items-center justify-center transition-colors', paymentMethod === 'stripe' ? 'bg-primary/10' : 'bg-surface-container']">
                  <span class="material-symbols-outlined text-3xl" :class="paymentMethod === 'stripe' ? 'text-primary' : 'text-secondary'">credit_card</span>
                </div>
                <div class="text-center">
                  <span class="block text-sm font-bold">Visa / Card</span>
                  <span class="block text-xs text-secondary mt-1">Pay securely online</span>
                </div>
                <div v-if="paymentMethod === 'stripe'" class="absolute top-3 right-3">
                  <span class="material-symbols-outlined text-primary text-xl">check_circle</span>
                </div>
              </label>
            </div>
          </section>

          <!-- Step 2: Card Details (Only for Visa) -->
          <Transition enter-active-class="transition-all duration-400 ease-out" enter-from-class="opacity-0 -translate-y-4" enter-to-class="opacity-100 translate-y-0" leave-active-class="transition-all duration-300 ease-in" leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-4">
            <section v-if="paymentMethod === 'stripe'" class="space-y-6">
              <div class="flex items-center gap-3">
                <span class="text-xs uppercase tracking-widest px-3 py-1.5 bg-primary/10 text-primary font-bold rounded-lg">02</span>
                <h3 class="text-sm uppercase tracking-widest font-semibold text-on-surface">Card Details</h3>
              </div>
              <div class="bg-surface-container-low rounded-2xl p-8 space-y-6 border border-outline-variant/10">
                <div class="flex flex-col">
                  <label class="text-[10px] uppercase tracking-[0.2em] font-semibold text-secondary mb-1">Cardholder Name</label>
                  <input v-model="cardDetails.name" class="input-minimal" placeholder="Name on card" type="text"/>
                </div>
                <div class="flex flex-col">
                  <label class="text-[10px] uppercase tracking-[0.2em] font-semibold text-secondary mb-1">Card Number</label>
                  <input v-model="cardDetails.number" class="input-minimal" placeholder="4242 4242 4242 4242" type="text" maxlength="19" @input="formatCardNumber"/>
                </div>
                <div class="grid grid-cols-2 gap-8">
                  <div class="flex flex-col">
                    <label class="text-[10px] uppercase tracking-[0.2em] font-semibold text-secondary mb-1">Expiry Date</label>
                    <input v-model="cardDetails.expiry" class="input-minimal" placeholder="MM / YY" type="text" maxlength="7" @input="formatExpiry"/>
                  </div>
                  <div class="flex flex-col">
                    <label class="text-[10px] uppercase tracking-[0.2em] font-semibold text-secondary mb-1">CVV</label>
                    <input v-model="cardDetails.cvv" class="input-minimal" placeholder="***" type="password" maxlength="4"/>
                  </div>
                </div>
                <div class="flex items-center gap-2 text-xs text-secondary pt-2">
                  <span class="material-symbols-outlined text-sm">lock</span>
                  <span>Your card information is encrypted and secure</span>
                </div>
              </div>
            </section>
          </Transition>

          <!-- Step 3: Shipping Information -->
          <section class="space-y-6">
            <div class="flex items-center gap-3">
              <span class="text-xs uppercase tracking-widest px-3 py-1.5 bg-primary/10 text-primary font-bold rounded-lg">{{ paymentMethod === 'stripe' ? '03' : '02' }}</span>
              <h3 class="text-sm uppercase tracking-widest font-semibold text-on-surface">Shipping Information</h3>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
              <div class="flex flex-col">
                <label class="text-[10px] uppercase tracking-[0.2em] font-semibold text-secondary mb-1">First Name</label>
                <input v-model="shipping.firstName" class="input-minimal" placeholder="Ahmed" type="text"/>
              </div>
              <div class="flex flex-col">
                <label class="text-[10px] uppercase tracking-[0.2em] font-semibold text-secondary mb-1">Last Name</label>
                <input v-model="shipping.lastName" class="input-minimal" placeholder="Mohamed" type="text"/>
              </div>
              <div class="flex flex-col">
                <label class="text-[10px] uppercase tracking-[0.2em] font-semibold text-secondary mb-1">Phone Number</label>
                <input v-model="shipping.phone" class="input-minimal" placeholder="01xxxxxxxxx" type="tel"/>
              </div>
              <div class="flex flex-col">
                <label class="text-[10px] uppercase tracking-[0.2em] font-semibold text-secondary mb-1">City / Governorate</label>
                <input v-model="shipping.city" class="input-minimal" placeholder="Cairo" type="text"/>
              </div>
              <div class="md:col-span-2 flex flex-col">
                <label class="text-[10px] uppercase tracking-[0.2em] font-semibold text-secondary mb-1">Full Address</label>
                <input v-model="shipping.address" class="input-minimal" placeholder="Street, building, floor, apartment" type="text"/>
              </div>
              <div class="flex flex-col">
                <label class="text-[10px] uppercase tracking-[0.2em] font-semibold text-secondary mb-1">Postal Code</label>
                <input v-model="shipping.postalCode" class="input-minimal" placeholder="11511" type="text"/>
              </div>
              <div class="flex flex-col">
                <label class="text-[10px] uppercase tracking-[0.2em] font-semibold text-secondary mb-1">Country</label>
                <select v-model="shipping.country" class="w-full input-minimal text-on-surface bg-surface" id="country">
                  <option value="Egypt">Egypt (مصر)</option>
                </select>
              </div>
            </div>

            <!-- Delivery Speed -->
            <div class="space-y-4 pt-6">
              <h4 class="text-xs uppercase tracking-widest font-semibold text-secondary">Delivery Speed</h4>
              <div class="space-y-3">
                <label :class="['flex items-center justify-between p-5 rounded-xl cursor-pointer border-2 transition-all', shippingMethod === 'standard' ? 'border-primary bg-primary/5' : 'border-outline-variant/20 bg-surface-container-low hover:border-primary/30']">
                  <div class="flex items-center gap-4">
                    <input v-model="shippingMethod" value="standard" class="text-primary focus:ring-primary border-outline-variant" name="shipping" type="radio"/>
                    <div>
                      <span class="block text-sm font-semibold">Standard Delivery</span>
                      <span class="block text-xs text-secondary mt-1">3-5 business days</span>
                    </div>
                  </div>
                  <span class="text-sm font-medium text-primary">Free</span>
                </label>
                <label :class="['flex items-center justify-between p-5 rounded-xl cursor-pointer border-2 transition-all', shippingMethod === 'express' ? 'border-primary bg-primary/5' : 'border-outline-variant/20 bg-surface-container-low hover:border-primary/30']">
                  <div class="flex items-center gap-4">
                    <input v-model="shippingMethod" value="express" class="text-primary focus:ring-primary border-outline-variant" name="shipping" type="radio"/>
                    <div>
                      <span class="block text-sm font-semibold">Express Delivery</span>
                      <span class="block text-xs text-secondary mt-1">Next day delivery</span>
                    </div>
                  </div>
                  <span class="text-sm font-medium">{{ settings?.currency || 'EGP' }} {{ settings?.shippingFee?.toFixed(2) || '0.00' }}</span>
                </label>
              </div>
            </div>
          </section>

          <!-- Submit -->
          <div class="pt-8 flex justify-between items-center border-t border-outline-variant/10">
            <NuxtLink to="/products" class="text-sm font-medium text-secondary hover:text-on-surface transition-colors flex items-center gap-2">
              <span class="material-symbols-outlined text-base">arrow_back</span>
              Return to Shop
            </NuxtLink>
            <button @click="proceedToPayment" class="checkout-gradient text-on-primary px-10 py-4 rounded-xl text-sm font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow-lg flex items-center gap-3">
              <span class="material-symbols-outlined text-lg">{{ paymentMethod === 'cod' ? 'local_shipping' : 'lock' }}</span>
              {{ paymentMethod === 'cod' ? 'Place Order' : 'Pay Now' }}
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

    <!-- Footer -->
    <footer class="bg-stone-100 w-full pt-20 pb-10">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-12 px-12 max-w-screen-2xl mx-auto font-body text-sm leading-relaxed tracking-wide">
        <div class="col-span-1">
          <span class="font-serif text-xl mb-4 block">VIGO ATELIER</span>
          <p class="text-stone-500">Crafting timeless garments for the modern visionary since 2024.</p>
        </div>
        <div>
          <h4 class="text-stone-900 font-semibold mb-6">Explore</h4>
          <ul class="space-y-3">
            <li><NuxtLink to="/products" class="text-stone-500 hover:underline decoration-amber-700/50 underline-offset-4 transition-all">Collections</NuxtLink></li>
            <li><a class="text-stone-500 hover:underline decoration-amber-700/50 underline-offset-4 transition-all">Sourcing</a></li>
            <li><a class="text-stone-500 hover:underline decoration-amber-700/50 underline-offset-4 transition-all">Lookbook</a></li>
          </ul>
        </div>
        <div>
          <h4 class="text-stone-900 font-semibold mb-6">Assistance</h4>
          <ul class="space-y-3">
            <li><a class="text-stone-500 hover:underline decoration-amber-700/50 underline-offset-4 transition-all">Shipping & Returns</a></li>
            <li><a class="text-stone-500 hover:underline decoration-amber-700/50 underline-offset-4 transition-all">Sustainability</a></li>
            <li><a class="text-stone-500 hover:underline decoration-amber-700/50 underline-offset-4 transition-all">Contact Us</a></li>
          </ul>
        </div>
        <div>
          <h4 class="text-stone-900 font-semibold mb-6">Newsletter</h4>
          <div class="flex border-b border-stone-300 pb-2">
            <input class="bg-transparent border-none focus:ring-0 text-sm w-full" placeholder="Your email address" type="email"/>
            <button class="material-symbols-outlined text-amber-700">arrow_forward</button>
          </div>
        </div>
      </div>
      <div class="mt-20 px-12 max-w-screen-2xl mx-auto border-t border-stone-200 pt-8 flex flex-col md:flex-row justify-between gap-4">
        <span class="text-stone-400 text-xs">© 2024 VIGO ATELIER. ALL RIGHTS RESERVED.</span>
        <div class="flex gap-6 text-xs text-stone-400">
          <a class="hover:text-stone-900 transition-colors">Privacy Policy</a>
          <a class="hover:text-stone-900 transition-colors">Wholesale</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
const { isAuthenticated, user } = useAuth()
const { settings } = useSettings()
const { toast } = useNotifications()

const { cartItems, cartTotal, removeFromCart, clearCart } = useCart()

// Shipping form
const shipping = ref({
  firstName: '',
  lastName: '',
  phone: '',
  address: '',
  city: '',
  postalCode: '',
  country: 'Egypt'
})

// Card details (for Visa payment)
const cardDetails = ref({
  name: '',
  number: '',
  expiry: '',
  cvv: ''
})

const shippingMethod = ref('standard')
const paymentMethod = ref('cod')
const promoCode = ref('')

// Card number formatting (adds spaces every 4 digits)
const formatCardNumber = (e) => {
  let value = e.target.value.replace(/\s/g, '').replace(/\D/g, '')
  value = value.match(/.{1,4}/g)?.join(' ') || value
  cardDetails.value.number = value
}

// Expiry date formatting (MM / YY)
const formatExpiry = (e) => {
  let value = e.target.value.replace(/\D/g, '')
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
  return shippingMethod.value === 'express' ? settings.value.shippingFee : 0
})

const tax = computed(() => {
  return Math.round((subtotal.value * 0.14) * 100) / 100 // 14% Egyptian VAT
})

const total = computed(() => {
  return Math.round((subtotal.value + shippingCost.value + tax.value) * 100) / 100
})


const proceedToPayment = () => {
  // Validate shipping form
  if (!shipping.value.firstName || !shipping.value.lastName || !shipping.value.address || !shipping.value.city || !shipping.value.phone) {
    toast.warning('Please complete all shipping information.')
    return
  }

  // Validate payment method selection
  if (!paymentMethod.value) {
    toast.warning('Please select a payment method')
    return
  }

  // Validate card details if Visa is selected
  if (paymentMethod.value === 'stripe') {
    if (!cardDetails.value.name || !cardDetails.value.number || !cardDetails.value.expiry || !cardDetails.value.cvv) {
      toast.warning('Please fill in all card details.')
      return
    }
    if (cardDetails.value.number.replace(/\s/g, '').length < 16) {
      toast.warning('Please enter a valid card number.')
      return
    }
    if (cardDetails.value.cvv.length < 3) {
      toast.warning('Please enter a valid CVV.')
      return
    }
  }

  // Validate cart
  if (!cartItems.value.length) {
    toast.warning('Your shopping bag is empty.')
    return
  }

  // Process payment based on selected method
  if (paymentMethod.value === 'cod') {
    createOrder('PENDING')
  } else if (paymentMethod.value === 'stripe') {
    // For now, create order with card payment status
    createOrder('PAID')
  }
}

const createOrder = async (paymentStatus) => {
  try {
    const orderData = {
      items: cartItems.value.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price
      })),
      shippingAddress: {
        firstName: shipping.value.firstName,
        lastName: shipping.value.lastName,
        phone: shipping.value.phone,
        address: shipping.value.address,
        city: shipping.value.city,
        postalCode: shipping.value.postalCode,
        country: shipping.value.country
      },
      totalAmount: total.value,
      paymentMethod: paymentMethod.value.toUpperCase(),
      paymentStatus
    }

    const response = await $apiFetch('/api/orders', {
      method: 'POST',
      body: orderData
    })

    toast.success('Your order has been placed successfully!')
    clearCart()
    navigateTo('/', { replace: true })
  } catch (error) {
    toast.error(error.message || 'Failed to place order')
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
