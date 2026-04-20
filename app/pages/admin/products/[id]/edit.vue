<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="font-serif italic text-3xl text-on-surface mb-2">Edit Product</h1>
        <p class="text-on-surface-variant/70 text-sm font-body">Update product information</p>
      </div>
      <NuxtLink
        to="/admin"
        class="flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors font-label text-[11px] uppercase tracking-[0.15em]"
      >
        <span class="material-symbols-outlined">arrow_back</span>
        Back to Inventory
      </NuxtLink>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="bg-surface-container-lowest rounded-xl border border-outline-variant/10 p-12 text-center">
      <span class="material-symbols-outlined text-4xl animate-spin text-primary">progress_activity</span>
      <p class="mt-4 text-on-surface-variant font-body">Loading product...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-surface-container-lowest rounded-xl border border-outline-variant/10 p-12 text-center">
      <span class="material-symbols-outlined text-4xl text-error">error</span>
      <p class="mt-4 text-error font-body">Failed to load product</p>
      <button
        @click="refresh()"
        class="mt-4 btn-gradient px-6 py-2 rounded-lg text-on-primary font-label text-[11px] uppercase tracking-[0.2em]"
      >
        Retry
      </button>
    </div>

    <!-- Edit Form -->
    <div v-else class="bg-surface-container-lowest rounded-xl border border-outline-variant/10 shadow-sm shadow-primary/5 p-8">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Product Name -->
        <div class="space-y-2">
          <label class="block font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant">
            Product Name *
          </label>
          <input
            v-model="form.name"
            type="text"
            required
            class="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg py-3 px-4 text-on-surface font-body focus:outline-none focus:border-primary/50 transition-colors"
            placeholder="Enter product name"
          />
        </div>

        <!-- Description -->
        <div class="space-y-2">
          <label class="block font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant">
            Description
          </label>
          <textarea
            v-model="form.description"
            rows="4"
            class="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg py-3 px-4 text-on-surface font-body focus:outline-none focus:border-primary/50 transition-colors resize-none"
            placeholder="Enter product description"
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Price -->
          <div class="space-y-2">
            <label class="block font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant">
              Price (EGP) *
            </label>
            <input
              v-model.number="form.price"
              type="number"
              step="0.01"
              min="0"
              required
              class="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg py-3 px-4 text-on-surface font-body focus:outline-none focus:border-primary/50 transition-colors"
              placeholder="0.00"
            />
          </div>

          <!-- Discount -->
          <div class="space-y-2">
            <label class="block font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant">
              Discount (%)
            </label>
            <input
              v-model.number="form.discount"
              type="number"
              min="0"
              max="100"
              class="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg py-3 px-4 text-on-surface font-body focus:outline-none focus:border-primary/50 transition-colors"
              placeholder="0"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Stock -->
          <div class="space-y-2">
            <label class="block font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant">
              Stock *
            </label>
            <input
              v-model.number="form.stock"
              type="number"
              min="0"
              required
              class="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg py-3 px-4 text-on-surface font-body focus:outline-none focus:border-primary/50 transition-colors"
              placeholder="0"
            />
          </div>

          <!-- Category -->
          <div class="space-y-2">
            <label class="block font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant">
              Category *
            </label>
            <select
              v-model="form.categoryId"
              required
              class="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg py-3 px-4 text-on-surface font-body focus:outline-none focus:border-primary/50 transition-colors appearance-none cursor-pointer"
            >
              <option value="">Select a category</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.name }}
              </option>
            </select>
          </div>
        </div>

        <!-- Sizes Selection -->
        <div class="space-y-4">
          <label class="block font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant">Available Sizes</label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="size in availableSizes"
              :key="size"
              type="button"
              @click="toggleSize(size)"
              :class="['px-4 py-2 rounded-lg text-xs font-label uppercase tracking-widest border-2 transition-all duration-200', form.sizes.includes(size) ? 'border-primary bg-primary/10 text-primary font-bold' : 'border-outline-variant/30 text-on-surface-variant hover:border-primary/30']"
            >
              {{ size }}
            </button>
          </div>
        </div>

        <!-- Colors Selection -->
        <div class="space-y-4">
          <label class="block font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant">Available Colors</label>
          <div class="flex flex-wrap items-center gap-3 mb-3">
            <div v-for="(color, index) in form.colors" :key="index" class="flex items-center gap-2 bg-surface-container-low rounded-full pl-1 pr-3 py-1 border border-outline-variant/20">
              <span class="w-6 h-6 rounded-full border border-outline-variant/30" :style="{ backgroundColor: color }"></span>
              <span class="text-xs font-body text-on-surface">{{ color }}</span>
              <button type="button" @click="removeColor(index)" class="text-on-surface-variant hover:text-error transition-colors ml-1">
                <span class="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
          </div>
          <div class="flex items-center gap-3 max-w-md">
            <input type="color" v-model="newColorValue" class="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent flex-shrink-0"/>
            <input
              v-model="newColorName"
              type="text"
              placeholder="Color name (e.g. Black)"
              class="flex-1 bg-surface-container-low border border-outline-variant/20 rounded-lg py-2.5 px-4 focus:outline-none focus:border-primary/50 transition-colors font-body text-sm text-on-surface"
              @keydown.enter.prevent="addColor"
            />
            <button type="button" @click="addColor" class="px-4 py-2.5 rounded-lg bg-primary/10 text-primary font-label text-[11px] uppercase tracking-widest hover:bg-primary/20 transition-colors">
              Add
            </button>
          </div>
        </div>

        <!-- Visibility & Status -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-surface-container-low/50 rounded-xl border border-outline-variant/10">
          <div class="flex items-center gap-3">
            <input
              v-model="form.isFeatured"
              type="checkbox"
              id="isFeatured"
              class="w-5 h-5 accent-primary"
            />
            <label for="isFeatured" class="font-body text-sm text-on-surface cursor-pointer">Featured Product</label>
          </div>
          <div class="flex items-center gap-3">
            <input
              v-model="form.isActive"
              type="checkbox"
              id="isActive"
              class="w-5 h-5 accent-primary"
            />
            <label for="isActive" class="font-body text-sm text-on-surface cursor-pointer">Active / Visible in Store</label>
          </div>
        </div>

        <!-- Images -->
        <div class="space-y-4">
          <label class="block font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant">
            Product Images
          </label>
          
          <div class="flex flex-wrap gap-4">
            <!-- Image Previews -->
            <div 
              v-for="(image, index) in form.images" 
              :key="index"
              class="relative w-24 h-24 rounded-lg overflow-hidden border border-outline-variant/20 group"
            >
              <img :src="image" class="w-full h-full object-cover" />
              <button 
                type="button"
                @click="removeImage(index)"
                class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <span class="material-symbols-outlined text-white">delete</span>
              </button>
            </div>

            <!-- Upload Button -->
            <button
              type="button"
              @click="() => fileInput?.click()"
              class="w-24 h-24 rounded-lg border-2 border-dashed border-outline-variant/30 flex flex-col items-center justify-center gap-1 text-on-surface-variant hover:border-primary hover:text-primary transition-all"
            >
              <span class="material-symbols-outlined">add_a_photo</span>
              <span class="text-[9px] uppercase font-bold">Add</span>
            </button>
          </div>
          
          <input
            ref="fileInput"
            type="file"
            multiple
            accept="image/*"
            class="hidden"
            @change="handleImageUpload"
          />
        </div>

        <!-- Submit Buttons -->
        <div class="flex items-center justify-end gap-4 pt-4 border-t border-outline-variant/10">
          <NuxtLink
            to="/admin"
            class="px-6 py-3 rounded-lg border border-outline-variant/30 text-on-surface font-label text-[11px] uppercase tracking-[0.2em] hover:bg-surface-container-low transition-colors"
          >
            Cancel
          </NuxtLink>
          <button
            type="submit"
            :disabled="saving"
            class="btn-gradient px-8 py-3 rounded-lg text-on-primary font-label text-[11px] uppercase tracking-[0.2em] flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <span v-if="saving" class="material-symbols-outlined animate-spin text-sm">progress_activity</span>
            <span v-else class="material-symbols-outlined text-sm">save</span>
            {{ saving ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['permissions'],
  permission: 'EDIT_PRODUCTS'
})

const route = useRoute()
const router = useRouter()
const productId = route.params.id
const { toast } = useNotifications()
const { triggerRefresh } = useDataRefresh()

const { data: product, pending, error, refresh } = await useApiFetch<any>(
  `/api/admin/products/${productId}`,
  { default: () => null }
)

const { data: categories } = await useApiFetch<any[]>('/api/admin/categories', {
  default: () => []
})

const form = reactive({
  name: '',
  description: '',
  price: 0,
  stock: 0,
  discount: 0,
  categoryId: '',
  isActive: true,
  isFeatured: false,
  images: [] as string[],
  sizes: [] as string[],
  colors: [] as string[]
})

const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL']
const newColorValue = ref('#000000')
const newColorName = ref('')

const toggleSize = (size: string) => {
  const idx = form.sizes.indexOf(size)
  if (idx >= 0) form.sizes.splice(idx, 1)
  else form.sizes.push(size)
}

const addColor = () => {
  const colorLabel = newColorName.value.trim() || newColorValue.value
  if (colorLabel && !form.colors.includes(colorLabel)) {
    form.colors.push(colorLabel)
    newColorName.value = ''
    newColorValue.value = '#000000'
  }
}

const removeColor = (index: number) => {
  form.colors.splice(index, 1)
}

const saving = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

// Initialize form when product loads
watch(() => product.value, (p) => {
  if (p) {
    form.name = p.name || ''
    form.description = p.description || ''
    form.price = p.price || 0
    form.stock = p.stock || 0
    form.discount = p.discount || 0
    form.categoryId = p.categoryId || ''
    form.isActive = p.isActive !== false
    form.isFeatured = p.isFeatured || false
    form.images = Array.isArray(p.images) ? [...p.images] : []
    form.sizes = Array.isArray(p.sizes) ? [...p.sizes] : []
    form.colors = Array.isArray(p.colors) ? [...p.colors] : []
  }
}, { immediate: true })

const handleImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (!files) return

  Array.from(files).forEach(file => {
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      if (result) form.images.push(result)
    }
    reader.readAsDataURL(file)
  })
}

const removeImage = (index: number) => {
  form.images.splice(index, 1)
}

async function handleSubmit() {
  saving.value = true
  try {
    await $apiFetch(`/api/admin/products/${productId}`, {
      method: 'PATCH',
      body: form
    })

    toast.success('Product updated successfully')
    triggerRefresh('products')
    router.push('/admin')
  } catch (err: any) {
    toast.error(err?.data?.statusMessage || 'Failed to update product')
  } finally {
    saving.value = false
  }
}
</script>
