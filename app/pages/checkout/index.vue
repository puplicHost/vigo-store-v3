<template>
  <div class="min-h-screen bg-stone-50 text-stone-900 selection:bg-primary/20">
    <main class="pt-32 pb-24 px-8 md:px-16 max-w-screen-2xl mx-auto min-h-screen w-full">
      
      <!-- Page Narrative -->
      <header class="mb-20">
        <nav class="mb-6 flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] text-stone-400 font-bold">
          <NuxtLink to="/cart" class="hover:text-stone-900 transition-colors italic">Bag Portfolio</NuxtLink>
          <span class="w-1 h-1 rounded-full bg-stone-200"></span>
          <span class="text-stone-900 italic font-medium">Order Finalization</span>
        </nav>
        <h1 class="text-6xl md:text-8xl font-serif font-bold tracking-tight text-stone-900 italic leading-none">Checkout</h1>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-20 xl:gap-32">
        <!-- Main Form Area -->
        <div class="lg:col-span-7 space-y-20">
          
          <!-- 01: Payment Selection -->
          <section class="space-y-10">
            <header class="flex items-center gap-4">
               <span class="text-[11px] font-bold uppercase tracking-[0.4em] text-primary">01 — MODALITY</span>
               <div class="h-px bg-stone-200 flex-grow"></div>
            </header>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div 
                v-for="method in [
                  { id: 'cod', label: 'Cash on Arrival', icon: 'payments', desc: 'Pay when you receive' },
                  { id: 'paymob', label: 'Credit Card', icon: 'credit_card', desc: 'Secure electronic portal' }
                ]" 
                :key="method.id"
                @click="paymentMethod = method.id"
                :class="[
                  'p-8 rounded-3xl cursor-pointer border-2 transition-all duration-500 bg-white group',
                  paymentMethod === method.id ? 'border-stone-900 shadow-2xl translate-y-[-4px]' : 'border-stone-100 opacity-50 grayscale hover:opacity-100 hover:grayscale-0'
                ]"
              >
                <div class="w-14 h-14 rounded-2xl bg-stone-50 flex items-center justify-center mb-6 group-hover:bg-primary/5 transition-colors">
                  <span class="material-symbols-outlined text-3xl font-light italic" :class="paymentMethod === method.id ? 'text-primary' : 'text-stone-300'">{{ method.icon }}</span>
                </div>
                <h3 class="text-xl font-serif font-bold italic mb-1">{{ method.label }}</h3>
                <p class="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-bold">{{ method.desc }}</p>
              </div>
            </div>
          </section>

          <!-- 02: Conditional Requirements -->
          <section class="space-y-10">
            <header class="flex items-center gap-4">
               <span class="text-[11px] font-bold uppercase tracking-[0.4em] text-primary">02 — REQUIREMENTS</span>
               <div class="h-px bg-stone-200 flex-grow"></div>
            </header>

            <Transition mode="out-in" enter-active-class="transition-all duration-500 ease-out" enter-from-class="opacity-0 translate-y-8" enter-to-class="opacity-100 translate-y-0">
              
              <!-- FOR COD: Only Logistics -->
              <div v-if="paymentMethod === 'cod'" :key="'cod'" class="bg-white p-10 md:p-14 rounded-[2.5rem] border-2 border-stone-100 shadow-sm space-y-12">
                <h4 class="text-xs font-bold font-serif italic uppercase tracking-[0.3em] text-stone-900 border-b border-stone-50 pb-4">Delivery Intelligence</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div class="flex flex-col gap-4">
                    <label class="text-[9px] uppercase tracking-[0.4em] font-bold text-stone-400">Recipient Name</label>
                    <input v-model="shipping.fullName" type="text" placeholder="As it appears in ID" class="text-xl font-serif italic bg-transparent border-b-2 border-stone-100 py-3 focus:outline-none focus:border-stone-950 transition-all"/>
                  </div>
                  <div class="flex flex-col gap-4">
                    <label class="text-[9px] uppercase tracking-[0.4em] font-bold text-stone-400">Contact Number</label>
                    <input v-model="shipping.phone" type="tel" placeholder="01xxxxxxxxx" class="text-xl font-serif italic bg-transparent border-b-2 border-stone-100 py-3 focus:outline-none focus:border-stone-950 transition-all"/>
                  </div>
                  <div class="flex flex-col gap-4 md:col-span-2">
                    <label class="text-[9px] uppercase tracking-[0.4em] font-bold text-stone-400">Governance / City</label>
                    <select v-model="shipping.city" class="text-xl font-serif italic bg-transparent border-b-2 border-stone-100 py-3 focus:outline-none focus:border-stone-950">
                       <option value="Cairo">Cairo (القاهرة)</option>
                       <option value="Giza">Giza (الجيزة)</option>
                       <option value="Alexandria">Alexandria (الإسكندرية)</option>
                    </select>
                  </div>
                  <div class="flex flex-col gap-4 md:col-span-2">
                    <label class="text-[9px] uppercase tracking-[0.4em] font-bold text-stone-400">Detailed Address</label>
                    <input v-model="shipping.address" type="text" placeholder="Street, Building, Floor" class="text-xl font-serif italic bg-transparent border-b-2 border-stone-100 py-3 focus:outline-none focus:border-stone-950 transition-all"/>
                  </div>
                </div>
              </div>

              <!-- FOR VISA: Card + Billing Email -->
              <div v-else :key="'paymob'" class="bg-white p-10 md:p-14 rounded-[2.5rem] border-2 border-stone-100 shadow-sm space-y-12">
                <h4 class="text-xs font-bold font-serif italic uppercase tracking-[0.3em] text-stone-900 border-b border-stone-50 pb-4">Digital Processing Intel</h4>
                
                <!-- Email for digital receipt -->
                <div class="flex flex-col gap-4">
                  <label class="text-[9px] uppercase tracking-[0.4em] font-bold text-stone-400">Fiscal Receipt Email</label>
                  <input v-model="shipping.email" type="email" placeholder="email@destination.com" class="text-xl font-serif italic bg-transparent border-b-2 border-stone-100 py-3 focus:outline-none focus:border-stone-950 transition-all"/>
                </div>

                <!-- Manual Card Fields -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8 border-t border-stone-50">
                  <div class="flex flex-col gap-4 md:col-span-2">
                    <label class="text-[9px] uppercase tracking-[0.4em] font-bold text-stone-400">Card Identity Number</label>
                    <input v-model="card.number" type="text" placeholder="4242 4242 4242 4242" @input="formatCardNumber" maxlength="19" class="text-xl font-serif italic bg-transparent border-b-2 border-stone-100 py-3 focus:outline-none focus:border-stone-950 transition-all font-mono"/>
                  </div>
                  <div class="flex flex-col gap-4">
                    <label class="text-[9px] uppercase tracking-[0.4em] font-bold text-stone-400">Expirty MM/YY</label>
                    <input v-model="card.expiry" type="text" placeholder="00 / 00" @input="formatExpiry" maxlength="7" class="text-xl font-serif italic bg-transparent border-b-2 border-stone-100 py-3 focus:outline-none focus:border-stone-950 transition-all"/>
                  </div>
                  <div class="flex flex-col gap-4">
                    <label class="text-[9px] uppercase tracking-[0.4em] font-bold text-stone-400">Security Cipher (CVV)</label>
                    <input v-model="card.cvv" type="password" placeholder="***" maxlength="3" class="text-xl font-serif italic bg-transparent border-b-2 border-stone-100 py-3 focus:outline-none focus:border-stone-950 transition-all"/>
                  </div>
                </div>

                <!-- Essential Delivery Info for Visa -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8 border-t border-stone-50">
                  <div class="flex flex-col gap-4">
                    <label class="text-[9px] uppercase tracking-[0.4em] font-bold text-stone-400">Sovereign Recipient</label>
                    <input v-model="shipping.fullName" type="text" placeholder="Full name" class="text-xl font-serif italic bg-transparent border-b-2 border-stone-100 py-3 focus:outline-none focus:border-stone-950 transition-all"/>
                  </div>
                  <div class="flex flex-col gap-4">
                    <label class="text-[9px] uppercase tracking-[0.4em] font-bold text-stone-400">Mobile Contact</label>
                    <input v-model="shipping.phone" type="tel" placeholder="01xxxxxxxxx" class="text-xl font-serif italic bg-transparent border-b-2 border-stone-100 py-3 focus:outline-none focus:border-stone-950 transition-all"/>
                  </div>
                </div>
              </div>
            </Transition>
          </section>

          <!-- Action Terminal -->
          <div class="flex flex-col md:flex-row items-center justify-between gap-12 pt-10 border-t border-stone-100">
             <NuxtLink to="/cart" class="text-[10px] uppercase tracking-[0.4em] font-bold text-stone-300 hover:text-stone-950 transition-all flex items-center gap-4 group">
               <span class="material-symbols-outlined text-sm group-hover:-translate-x-2 transition-transform">arrow_back</span>
               Back to Bag
             </NuxtLink>
             <button 
               @click="commitOrder" 
               :disabled="isProcessing"
               class="h-24 px-24 bg-stone-950 text-white rounded-full font-bold uppercase tracking-[0.5em] text-[12px] shadow-3xl hover:bg-primary transition-all transform hover:scale-[1.05] active:scale-[0.98] disabled:opacity-50 flex items-center gap-8"
             >
               <span v-if="isProcessing" class="material-symbols-outlined animate-spin text-2xl">loading</span>
               <span v-else class="material-symbols-outlined text-2xl">{{ paymentMethod === 'cod' ? 'local_shipping' : 'verified_user' }}</span>
               {{ isProcessing ? 'Archiving Commitment' : (paymentMethod === 'cod' ? 'Confirm Arrival' : 'Secure Modality') }}
             </button>
          </div>
        </div>

        <!-- Right Side Budgeting -->
        <aside class="lg:col-span-5 flex flex-col pt-4">
          <div class="sticky top-40 bg-white p-12 rounded-[3rem] border-2 border-stone-100 shadow-xl space-y-12">
            <h2 class="text-3xl font-serif font-bold italic border-b border-stone-50 pb-8 flex items-end justify-between">
              Final Summary
              <span class="text-[10px] font-bold text-stone-300 not-italic uppercase tracking-widest">{{ cartItemCount }} Items</span>
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

              <!-- Dynamic COD Fee -->
              <Transition enter-active-class="duration-300" enter-from-class="opacity-0 -translate-y-2" enter-to-class="opacity-100 translate-y-0">
                <div v-if="paymentMethod === 'cod'" class="flex justify-between items-center text-[11px] font-bold uppercase tracking-[0.3em] text-stone-500">
                  <span>COD Processing</span>
                  <span class="text-stone-950 tabular-nums font-body">+ {{ settings.currency }} 50</span>
                </div>
              </Transition>

              <!-- Dynamic Digital Discount -->
              <Transition enter-active-class="duration-300" enter-from-class="opacity-0 -translate-y-2" enter-to-class="opacity-100 translate-y-0">
                <div v-if="paymentMethod === 'paymob'" class="flex justify-between items-center text-[11px] font-bold uppercase tracking-[0.3em] text-primary">
                  <span>Digital Reward</span>
                  <span class="tabular-nums font-body">- {{ settings.currency }} {{ (subtotal * 0.05).toFixed(0) }}</span>
                </div>
              </Transition>

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
const paymentMethod = ref('cod')
const isProcessing = ref(false)

const shipping = ref({
  fullName: '',
  email: user.value?.email || '',
  phone: '',
  address: '',
  city: 'Cairo',
  landmark: ''
})

const card = ref({ number: '', expiry: '', cvv: '' })

// Number Formatting Architecture
const formatCardNumber = (e: any) => {
  let v = e.target.value.replace(/\D/g, '').substring(0, 16)
  let p = v.match(/.{1,4}/g)?.join(' ') || v
  card.value.number = p
}
const formatExpiry = (e: any) => {
  let v = e.target.value.replace(/\D/g, '').substring(0, 4)
  if (v.length >= 2) card.value.expiry = v.substring(0, 2) + ' / ' + v.substring(2, 4)
  else card.value.expiry = v
}

// Fiscal Intelligence Computation
const subtotal = computed(() => cartTotal.value || 0)
const shippingCost = computed(() => (subtotal.value >= (settings.value.freeShippingThreshold || 0)) ? 0 : (settings.value.shippingFee || 100))
const tax = computed(() => Math.round(subtotal.value * 0.14))
const total = computed(() => {
  const mod = paymentMethod.value === 'cod' ? 50 : -Math.round(subtotal.value * 0.05)
  return subtotal.value + shippingCost.value + tax.value + mod
})

const commitOrder = async () => {
  if (!cartItems.value.length) return
  if (!shipping.value.fullName || !shipping.value.phone || !shipping.value.address) {
    toast.warning('Logistics details required for archival.')
    return
  }
  if (paymentMethod.value === 'paymob' && !card.value.number) {
    toast.warning('Card credentials required for modal processing.')
    return
  }

  isProcessing.value = true
  try {
    const names = shipping.value.fullName.split(' ')
    await $apiFetch<any>('/api/orders', {
      method: 'POST',
      body: {
        items: cartItems.value.map(i => ({ productId: i.productId, quantity: i.quantity, price: i.price })),
        shippingAddress: {
          firstName: names[0] || '', lastName: names.slice(1).join(' ') || '',
          phone: shipping.value.phone, address: shipping.value.address,
          city: shipping.value.city, country: 'Egypt'
        },
        totalAmount: total.value,
        paymentMethod: paymentMethod.value.toUpperCase()
      }
    })
    toast.success('Commitment received.')
    clearCart()
    navigateTo('/')
  } catch (error: any) {
    toast.error('Processing failed.')
  } finally {
    isProcessing.value = false
  }
}

useHead({ title: `Archival | ${settings.value.siteName}` })
</script>
