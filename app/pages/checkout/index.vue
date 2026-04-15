<template>
  <div class="min-h-screen bg-surface text-on-surface">
    <!-- TopNavBar -->
    <header class="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl shadow-[0_20px_40px_rgba(28,27,27,0.04)]">
      <div class="flex justify-between items-center px-12 py-6 w-full max-w-screen-2xl mx-auto">
        <div class="flex items-center gap-12">
          <NuxtLink to="/" class="text-2xl font-serif italic text-stone-900 tracking-tight">VIGO</NuxtLink>
          <nav class="hidden md:flex gap-8 font-serif tracking-tight">
            <NuxtLink to="/products" class="text-stone-600 hover:text-stone-900 transition-colors">Collections</NuxtLink>
            <a class="text-stone-600 hover:text-stone-900 transition-colors">New Arrivals</a>
            <a class="text-stone-600 hover:text-stone-900 transition-colors">Lookbook</a>
            <a class="text-stone-600 hover:text-stone-900 transition-colors">Our Story</a>
          </nav>
        </div>
        <div class="flex items-center gap-6">
          <NuxtLink v-if="!isAuthenticated" to="/auth/login" class="material-symbols-outlined text-stone-600 hover:opacity-80 transition-all duration-300">person</NuxtLink>
          <NuxtLink v-else to="/admin" class="material-symbols-outlined text-stone-600 hover:opacity-80 transition-all duration-300">dashboard</NuxtLink>
          <button class="material-symbols-outlined text-stone-600 hover:opacity-80 transition-all duration-300">shopping_bag</button>
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
            <p class="text-secondary font-body">Review your items and provide delivery details below.</p>
          </header>

          <!-- Steps Navigation -->
          <div class="flex gap-8 border-b border-outline-variant/20 pb-4">
            <div class="flex items-center gap-2 text-primary font-semibold">
              <span class="text-xs uppercase tracking-widest px-2 py-1 bg-primary/10 rounded">01</span>
              <span class="text-sm">Shipping</span>
            </div>
            <div class="flex items-center gap-2 text-secondary/50 font-medium">
              <span class="text-xs uppercase tracking-widest px-2 py-1 bg-surface-container rounded">02</span>
              <span class="text-sm">Payment</span>
            </div>
            <div class="flex items-center gap-2 text-secondary/50 font-medium">
              <span class="text-xs uppercase tracking-widest px-2 py-1 bg-surface-container rounded">03</span>
              <span class="text-sm">Review</span>
            </div>
          </div>

          <!-- Payment Method Selection -->
          <section class="space-y-6">
            <h3 class="text-sm uppercase tracking-widest font-semibold text-on-surface">Payment Method</h3>
            <div class="space-y-3">
              <!-- Cash on Delivery -->
              <label
                v-if="settings.isCodEnabled"
                class="flex items-center justify-between p-5 bg-surface-container-low rounded-xl cursor-pointer border border-transparent hover:border-primary/20 transition-all"
              >
                <div class="flex items-center gap-4">
                  <input v-model="paymentMethod" value="cod" class="text-primary focus:ring-primary border-outline-variant" name="payment" type="radio"/>
                  <div>
                    <span class="block text-sm font-semibold">Cash on Delivery</span>
                    <span class="block text-xs text-secondary mt-1">Pay when you receive your order</span>
                  </div>
                </div>
                <span class="material-symbols-outlined text-2xl text-secondary">payments</span>
              </label>

              <!-- Stripe Card Payment -->
              <label
                v-if="settings.isStripeEnabled"
                class="flex items-center justify-between p-5 bg-surface-container-low rounded-xl cursor-pointer border border-transparent hover:border-primary/20 transition-all"
              >
                <div class="flex items-center gap-4">
                  <input v-model="paymentMethod" value="stripe" class="text-primary focus:ring-primary border-outline-variant" name="payment" type="radio"/>
                  <div>
                    <span class="block text-sm font-semibold">Credit/Debit Card</span>
                    <span class="block text-xs text-secondary mt-1">Secure payment via Stripe</span>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-2xl text-secondary">credit_card</span>
                  <span v-if="settings.isTestMode" class="text-[10px] uppercase tracking-wider bg-warning/10 text-warning px-2 py-0.5 rounded">Test Mode</span>
                </div>
              </label>

              <!-- No payment methods available -->
              <div v-if="!settings.isCodEnabled && !settings.isStripeEnabled" class="p-5 bg-warning/10 rounded-xl text-center">
                <span class="text-warning text-sm">No payment methods are currently available. Please contact support.</span>
              </div>
            </div>
          </section>

          <!-- Shipping Form Section -->
          <section class="space-y-10">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
              <div class="flex flex-col">
                <label class="text-[10px] uppercase tracking-[0.2em] font-semibold text-secondary mb-1">First Name</label>
                <input v-model="shipping.firstName" class="input-minimal" placeholder="Julian" type="text"/>
              </div>
              <div class="flex flex-col">
                <label class="text-[10px] uppercase tracking-[0.2em] font-semibold text-secondary mb-1">Last Name</label>
                <input v-model="shipping.lastName" class="input-minimal" placeholder="Vandervalt" type="text"/>
              </div>
              <div class="md:col-span-2 flex flex-col">
                <label class="text-[10px] uppercase tracking-[0.2em] font-semibold text-secondary mb-1">Address line 1</label>
                <input v-model="shipping.address" class="input-minimal" placeholder="1242 Rue de l'Atelier" type="text"/>
              </div>
              <div class="flex flex-col">
                <label class="text-[10px] uppercase tracking-[0.2em] font-semibold text-secondary mb-1">City</label>
                <input v-model="shipping.city" class="input-minimal" placeholder="Paris" type="text"/>
              </div>
              <div class="flex flex-col">
                <label class="text-[10px] uppercase tracking-[0.2em] font-semibold text-secondary mb-1">Postal Code</label>
                <input v-model="shipping.postalCode" class="input-minimal" placeholder="75001" type="text"/>
              </div>
              <div class="md:col-span-2 flex flex-col">
                <label class="text-[10px] uppercase tracking-[0.2em] font-semibold text-secondary mb-1">Country / region</label>
                <select v-model="shipping.country" class="input-minimal appearance-none bg-none">
                  <option>France</option>
                  <option>United Kingdom</option>
                  <option>United States</option>
                  <option>Japan</option>
                  <option>Egypt</option>
                </select>
              </div>
            </div>

            <!-- Shipping Method Selection -->
            <div class="space-y-4">
              <h3 class="text-sm uppercase tracking-widest font-semibold text-on-surface">Shipping Method</h3>
              <div class="space-y-3">
                <label class="flex items-center justify-between p-5 bg-surface-container-low rounded-xl cursor-pointer border border-transparent hover:border-primary/20 transition-all">
                  <div class="flex items-center gap-4">
                    <input v-model="shippingMethod" value="standard" class="text-primary focus:ring-primary border-outline-variant" name="shipping" type="radio"/>
                    <div>
                      <span class="block text-sm font-semibold">Standard Atelier Delivery</span>
                      <span class="block text-xs text-secondary mt-1">3-5 business days</span>
                    </div>
                  </div>
                  <span class="text-sm font-medium">Free</span>
                </label>
                <label class="flex items-center justify-between p-5 bg-surface-container-lowest rounded-xl cursor-pointer border border-transparent hover:border-primary/20 transition-all shadow-sm">
                  <div class="flex items-center gap-4">
                    <input v-model="shippingMethod" value="express" class="text-primary focus:ring-primary border-outline-variant" name="shipping" type="radio"/>
                    <div>
                      <span class="block text-sm font-semibold">Express Maison Courier</span>
                      <span class="block text-xs text-secondary mt-1">Next day delivery</span>
                    </div>
                  </div>
                  <span class="text-sm font-medium">{{ settings.currency }}{{ settings.shippingFee.toFixed(2) }}</span>
                </label>
              </div>
            </div>
          </section>

          <div class="pt-8 flex justify-between items-center border-t border-outline-variant/10">
            <NuxtLink to="/products" class="text-sm font-medium text-secondary hover:text-on-surface transition-colors flex items-center gap-2">
              <span class="material-symbols-outlined text-base">arrow_back</span>
              Return to Shop
            </NuxtLink>
            <button @click="proceedToPayment" class="checkout-gradient text-on-primary px-10 py-4 rounded-xl text-sm font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow-lg">
              Continue to Payment
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
                    <span class="text-sm font-medium">{{ settings.currency }}{{ (item.price * item.quantity).toFixed(2) }}</span>
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
              <span class="font-medium">{{ settings.currency }}{{ subtotal.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-secondary">Shipping</span>
              <span class="text-primary font-medium">{{ shippingCost === 0 ? 'Free' : `${settings.currency}${shippingCost.toFixed(2)}` }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-secondary">Estimated Tax</span>
              <span class="font-medium">{{ settings.currency }}{{ tax.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-lg font-bold pt-4 border-t border-outline-variant/20">
              <span class="font-serif">Total</span>
              <span class="font-serif">{{ settings.currency }}{{ total.toFixed(2) }}</span>
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
const { isAuthenticated } = useAuth()
const { settings } = useSettings()

// Cart state (simplified - in production, use cart composable)
const cartItems = ref([
  {
    id: '1',
    name: 'Atelier Silk Blouse',
    price: 285,
    quantity: 1,
    size: 'M',
    image: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=200&q=80'
  },
  {
    id: '2',
    name: 'Nappa Leather Tote',
    price: 640,
    quantity: 1,
    size: 'Standard',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200&q=80'
  }
])

// Shipping form
const shipping = ref({
  firstName: '',
  lastName: '',
  address: '',
  city: '',
  postalCode: '',
  country: 'Egypt'
})

const shippingMethod = ref('standard')
const paymentMethod = ref('cod')
const promoCode = ref('')

// Computed totals
const subtotal = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
})

const shippingCost = computed(() => {
  // Apply free shipping threshold logic
  if (settings.value.freeShippingThreshold > 0 && subtotal.value >= settings.value.freeShippingThreshold) {
    return 0
  }
  return shippingMethod.value === 'express' ? settings.value.shippingFee : 0
})

const tax = computed(() => {
  return Math.round((subtotal.value * 0.2) * 100) / 100 // 20% tax with proper rounding
})

const total = computed(() => {
  return Math.round((subtotal.value + shippingCost.value + tax.value) * 100) / 100 // Proper rounding
})

const removeFromCart = (id) => {
  cartItems.value = cartItems.value.filter(item => item.id !== id)
}

const proceedToPayment = () => {
  // Validate shipping form
  if (!shipping.value.firstName || !shipping.value.lastName || !shipping.value.address || !shipping.value.city || !shipping.value.postalCode) {
    alert('Please complete all shipping information')
    return
  }

  // Validate payment method selection
  if (!paymentMethod.value) {
    alert('Please select a payment method')
    return
  }

  // Validate cart
  if (!cartItems.value.length) {
    alert('Your cart is empty')
    return
  }

  // Process payment based on selected method
  if (paymentMethod.value === 'cod') {
    // Cash on Delivery - create order with pending payment status
    createOrder('PENDING')
  } else if (paymentMethod.value === 'stripe') {
    // Stripe payment - redirect to Stripe checkout or show Stripe elements
    if (settings.value.isStripeEnabled) {
      alert('Stripe payment integration coming soon! For now, please use Cash on Delivery.')
    } else {
      alert('Card payments are currently disabled')
    }
  }
}

const createOrder = async (paymentStatus) => {
  try {
    const orderData = {
      items: cartItems.value.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price
      })),
      shippingAddress: {
        firstName: shipping.value.firstName,
        lastName: shipping.value.lastName,
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

    alert('Order placed successfully!')
    // Clear cart and redirect
    cartItems.value = []
    navigateTo('/orders', { replace: true })
  } catch (error) {
    alert(error.message || 'Failed to place order')
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
