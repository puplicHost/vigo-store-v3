<template>
  <div class="min-h-screen bg-white text-on-surface selection:bg-primary/10">
    <main class="pt-32 pb-24 px-6 md:px-12 max-w-screen-2xl mx-auto min-h-screen">
      
      <!-- Page Narrative -->
      <header class="mb-24 text-center">
        <h1 class="text-6xl md:text-8xl font-serif font-bold tracking-tight text-stone-900 italic leading-none mb-6">Checkout</h1>
        <div class="flex items-center justify-center gap-4 text-[10px] uppercase tracking-[0.6em] text-stone-300 font-bold">
           <span>Bag Archive</span>
           <span class="w-1.5 h-1.5 rounded-full bg-stone-100"></span>
           <span class="text-stone-900">Modality</span>
        </div>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-20 xl:gap-32">
        <!-- Main Form Area -->
        <div class="lg:col-span-7 space-y-24">
          
          <!-- 01: Payment Selection -->
          <section class="space-y-12">
            <header class="space-y-4">
               <span class="text-[10px] font-bold uppercase tracking-[0.5em] text-primary italic">Selection 01</span>
               <h2 class="text-4xl font-serif italic text-stone-900 tracking-tight font-bold">Payment Modality</h2>
            </header>
            
            <div class="grid grid-cols-1 gap-8">
              <div 
                v-for="method in [
                  { id: 'PAYMOB', label: 'Digital Portal', icon: 'verified_user', desc: 'Secure electronic transfer via Paymob' }
                ]" 
                :key="method.id"
                @click="paymentMethod = method.id"
                :class="[
                  'p-10 rounded-[2.5rem] cursor-pointer border transition-all duration-700 bg-stone-50/30 group',
                  paymentMethod === method.id ? 'border-primary ring-8 ring-primary/5 shadow-2xl scale-[1.02]' : 'border-stone-100 opacity-60 hover:opacity-100'
                ]"
              >
                <div class="w-16 h-16 rounded-full bg-white border border-stone-100 flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform">
                  <span class="material-symbols-outlined text-3xl font-light italic" :class="paymentMethod === method.id ? 'text-primary' : 'text-stone-300'">{{ method.icon }}</span>
                </div>
                <h3 class="text-2xl font-serif font-bold italic mb-2">{{ method.label }}</h3>
                <p class="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-bold italic">{{ method.desc }}</p>
              </div>
            </div>
          </section>

          <!-- 02: Conditional Requirements -->
          <section class="space-y-12">
             <header class="space-y-4 text-left">
               <span class="text-[10px] font-bold uppercase tracking-[0.5em] text-stone-300 italic">Selection 02</span>
               <h2 class="text-4xl font-serif italic text-stone-900 tracking-tight font-bold">Logistics Intelligence</h2>
            </header>

            <Transition mode="out-in" enter-active-class="transition-all duration-700 ease-out" enter-from-class="opacity-0 translate-y-12" enter-to-class="opacity-100 translate-y-0">
              
              <!-- PAYMOB: Shipping + Billing Email -->
              <div :key="'paymob'" class="space-y-16">
                <!-- Fiscal Receipt Email -->
                <div class="flex flex-col gap-4 group">
                  <label class="text-[10px] uppercase tracking-[0.4em] font-bold text-stone-300 group-focus-within:text-primary transition-colors">Fiscal Receipt Destination</label>
                  <input v-model="shipping.email" type="email" placeholder="concierge@atelier.com" class="text-xl font-serif italic bg-transparent border-b border-stone-100 py-4 focus:outline-none focus:border-primary transition-all placeholder:text-stone-100"/>
                </div>

                <!-- Shipping Information -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-12 bg-stone-50/30 p-10 md:p-14 rounded-[3rem] border border-stone-100">
                   <div class="md:col-span-2 grid grid-cols-2 gap-12">
                     <div class="flex flex-col gap-4 group text-left">
                        <label class="text-[10px] uppercase tracking-[0.4em] font-bold text-stone-300 group-focus-within:text-primary transition-colors">Recipient</label>
                        <input v-model="shipping.fullName" type="text" placeholder="Name" class="text-lg font-serif italic bg-transparent border-b border-stone-100 py-4 focus:outline-none focus:border-primary transition-all"/>
                     </div>
                     <div class="flex flex-col gap-4 group text-left">
                        <label class="text-[10px] uppercase tracking-[0.4em] font-bold text-stone-300 group-focus-within:text-primary transition-colors">Phone</label>
                        <input v-model="shipping.phone" type="tel" placeholder="Mobile" class="text-lg font-serif italic bg-transparent border-b border-stone-100 py-4 focus:outline-none focus:border-primary transition-all"/>
                     </div>
                     <div class="flex flex-col gap-4 group text-left">
                        <label class="text-[10px] uppercase tracking-[0.4em] font-bold text-stone-300 group-focus-within:text-primary transition-colors">City</label>
                        <select v-model="shipping.city" class="text-lg font-serif italic bg-transparent border-b border-stone-100 py-4 focus:outline-none focus:border-primary transition-all">
                           <option value="Cairo">Cairo (القاهرة)</option>
                           <option value="Giza">Giza (الجيزة)</option>
                           <option value="Alexandria">Alexandria (الإسكندرية)</option>
                        </select>
                     </div>
                     <div class="flex flex-col gap-4 group text-left">
                        <label class="text-[10px] uppercase tracking-[0.4em] font-bold text-stone-300 group-focus-within:text-primary transition-colors">Address</label>
                        <input v-model="shipping.address" type="text" placeholder="Street, Building, Apartment" class="text-lg font-serif italic bg-transparent border-b border-stone-100 py-4 focus:outline-none focus:border-primary transition-all"/>
                     </div>
                  </div>
                </div>
              </div>
            </Transition>
          </section>

          <!-- Action Terminal -->
          <div class="flex flex-col md:flex-row items-center justify-between gap-12 pt-16 border-t border-stone-50">
             <NuxtLink to="/cart" class="text-[10px] uppercase tracking-[0.5em] font-bold text-stone-300 hover:text-stone-950 transition-all flex items-center gap-6 group">
               <span class="material-symbols-outlined text-sm group-hover:-translate-x-3 transition-transform italic">arrow_back</span>
               Return to Bag Portfolio
             </NuxtLink>
             <button 
               @click="commitOrder" 
               :disabled="isProcessing"
               class="h-24 px-20 md:px-32 bg-stone-900 text-white rounded-full font-bold uppercase tracking-[0.6em] text-[12px] shadow-3xl hover:bg-primary transition-all duration-700 transform hover:scale-[1.05] active:scale-95 disabled:opacity-50 flex items-center gap-10"
             >
               <span v-if="isProcessing" class="material-symbols-outlined animate-spin text-2xl italic">progress_activity</span>
               <span v-else class="material-symbols-outlined text-2xl italic">offline_pin</span>
               {{ isProcessing ? 'Processing Commitment' : 'Secure Modality' }}
             </button>
          </div>
        </div>

        <!-- Right Side Budgeting -->
        <aside class="lg:col-span-5 flex flex-col">
          <div class="sticky top-40 bg-stone-50/50 p-12 rounded-[4rem] border border-stone-100 shadow-sm space-y-16 mt-10">
            <h2 class="text-4xl font-serif font-bold italic border-b border-stone-100 pb-10 flex items-end justify-between">
              Order Narrative
              <span class="text-[10px] font-bold text-stone-300 not-italic uppercase tracking-[0.3em] italic">{{ cartItemCount }} Curated Items</span>
            </h2>

            <div class="space-y-8">
              <div class="flex justify-between items-center text-[11px] font-bold uppercase tracking-[0.3em] text-stone-500">
                <span>Value Subtotal</span>
                <span class="text-stone-950 tabular-nums">{{ settings.currency }} {{ subtotal.toFixed(0) }}</span>
              </div>
              <div class="flex justify-between items-center text-[11px] font-bold uppercase tracking-[0.3em] text-stone-500">
                <span>Logistics Path</span>
                <span v-if="shippingCost === 0" class="text-primary italic font-serif">Complimentary</span>
                <span v-else class="text-stone-950 tabular-nums font-body">{{ settings.currency }} {{ shippingCost.toFixed(0) }}</span>
              </div>

              <!-- Digital Payment Discount -->
              <div class="flex justify-between items-center text-[11px] font-bold uppercase tracking-[0.3em] text-primary">
                <span>Digital Reward</span>
                <span class="tabular-nums font-body">- {{ settings.currency }} {{ (subtotal * 0.05).toFixed(0) }}</span>
              </div>

              <div class="flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.3em] text-stone-300">
                <span>Inclusive VAT</span>
                <span class="tabular-nums font-body">{{ settings.currency }} {{ tax.toFixed(0) }}</span>
              </div>
            </div>

            <div class="pt-12 border-t-2 border-stone-100 space-y-4">
              <span class="text-[10px] font-bold uppercase tracking-[0.4em] text-stone-300">Total Selection Commitment</span>
              <div class="flex items-baseline justify-between">
                <span class="text-5xl font-serif font-bold italic tracking-tighter text-stone-950 tabular-nums">
                  {{ settings.currency }} {{ total.toFixed(0) }}
                </span>
              </div>
            </div>
            
            <div class="bg-stone-50 p-6 rounded-2xl flex items-center justify-center gap-4 grayscale opacity-40">
               <span class="material-symbols-outlined">shield_locked</span>
               <span class="text-[9px] uppercase tracking-widest font-bold">Encrypted Processing Terminal</span>
            </div>
          </div>
        </aside>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const { user } = useAuth()
const { settings } = useSettings()
const { toast } = useNotifications()
const { cartItems, cartTotal, cartItemCount, clearCart } = useCart()

// Reactive Machine
const paymentMethod = ref('PAYMOB')
const isProcessing = ref(false)

const shipping = ref({
  fullName: '',
  email: user.value?.email || '',
  phone: '',
  address: '',
  city: 'Cairo'
})


// Fiscal Intelligence Computation
const subtotal = computed(() => cartTotal.value || 0)
const shippingCost = computed(() => (subtotal.value >= (settings.value.freeShippingThreshold || 0)) ? 0 : (settings.value.shippingFee || 100))
const tax = computed(() => Math.round(subtotal.value * 0.14))
const total = computed(() => {
  const mod = -Math.round(subtotal.value * 0.05) // Digital payment discount
  return subtotal.value + shippingCost.value + tax.value + mod
})

const commitOrder = async () => {
  console.log('commitOrder triggered')
  console.log('shipping:', shipping.value)
  console.log('cartItems:', cartItems.value)

  if (!cartItems.value.length) { 
    toast.warning('Your cart is empty'); 
    return 
  }
  
  // Validate variant selections
  const incompleteItems = cartItems.value.filter(
    item => item.requiresSelection && (!item.size || !item.color)
  )
  if (incompleteItems.length > 0) {
    toast.warning('Please select size and color for all products before checkout', 'Configuration Required')
    navigateTo('/cart')
    return
  }
  
  const isShippingValid = 
    shipping.value.fullName &&
    shipping.value.phone &&
    shipping.value.email &&
    shipping.value.city &&
    shipping.value.address
  
  if (!isShippingValid) { 
    toast.warning('Please complete all shipping information'); 
    return 
  }

  isProcessing.value = true
  
  try {
    const names = shipping.value.fullName.split(' ')
    const payload = {
      items: cartItems.value.map(i => ({ 
        productId: i.productId, 
        quantity: i.quantity, 
        price: i.price,
        size: i.size,
        color: i.color
      })),
      shippingAddress: {
        firstName: names[0] || '', 
        lastName: names.slice(1).join(' ') || '',
        phone: shipping.value.phone, 
        address: shipping.value.address,
        city: shipping.value.city,
        country: 'Egypt',
        email: shipping.value.email
      },
      totalAmount: total.value,
      paymentMethod: 'PAYMOB'
    }

    console.log('ORDER PAYLOAD:', payload)

    const response = await $apiFetch('/api/orders', { method: 'POST', body: payload })
    
    console.log('API RESPONSE:', response)
    console.log('PAYMENT URL:', response?.paymentUrl)
    
    // Critical safety check: paymentUrl must exist for PAYMOB
    if (!response?.paymentUrl) {
      toast.error('Payment initialization failed. No payment URL returned.')
      return
    }
    
    // Redirect to Paymob hosted checkout
    toast.success(response.message || 'Redirecting to payment terminal...')
    window.location.href = response.paymentUrl
  } catch (error) {
    console.error('ORDER ERROR:', error)
    // Show only the translated, user-friendly error message
    toast.error(error.message || 'حدث خطأ غير متوقع في معالجة طلبك.')
  } finally {
    isProcessing.value = false
  }
}

useHead({ title: `Archival | ${settings.value.siteName}` })
</script>
