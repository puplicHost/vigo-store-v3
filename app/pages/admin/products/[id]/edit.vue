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
    <div v-if="pending" class="bg-white rounded-xl border border-outline-variant/10 p-12 text-center">
      <span class="material-symbols-outlined text-4xl animate-spin text-primary">progress_activity</span>
      <p class="mt-4 text-on-surface-variant font-body">Loading product...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-white rounded-xl border border-outline-variant/10 p-12 text-center">
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
    <div v-else class="bg-white rounded-xl border border-outline-variant/10 shadow-sm shadow-primary/5 p-8">
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
              Price ($) *
            </label>
            <input
              v-model="form.price"
              type="number"
              step="0.01"
              min="0"
              required
              class="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg py-3 px-4 text-on-surface font-body focus:outline-none focus:border-primary/50 transition-colors"
              placeholder="0.00"
            />
          </div>

          <!-- Stock -->
          <div class="space-y-2">
            <label class="block font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant">
              Stock *
            </label>
            <input
              v-model="form.stock"
              type="number"
              min="0"
              required
              class="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg py-3 px-4 text-on-surface font-body focus:outline-none focus:border-primary/50 transition-colors"
              placeholder="0"
            />
          </div>
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

        <!-- Status -->
        <div class="space-y-2">
          <label class="block font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant">
            Status
          </label>
          <div class="flex gap-4">
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                v-model="form.isActive"
                type="radio"
                :value="true"
                class="w-4 h-4 text-primary border-outline-variant/30 focus:ring-primary"
              />
              <span class="text-on-surface font-body text-sm">Active</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                v-model="form.isActive"
                type="radio"
                :value="false"
                class="w-4 h-4 text-primary border-outline-variant/30 focus:ring-primary"
              />
              <span class="text-on-surface font-body text-sm">Inactive</span>
            </label>
          </div>
        </div>

        <!-- Featured -->
        <div class="flex items-center gap-2">
          <input
            v-model="form.isFeatured"
            type="checkbox"
            class="w-4 h-4 text-primary border-outline-variant/30 rounded focus:ring-primary"
          />
          <label class="text-on-surface font-body text-sm cursor-pointer">
            Featured Product
          </label>
        </div>

        <!-- Images -->
        <div class="space-y-2">
          <label class="block font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant">
            Image URLs (comma separated)
          </label>
          <textarea
            v-model="imagesInput"
            rows="3"
            class="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg py-3 px-4 text-on-surface font-body focus:outline-none focus:border-primary/50 transition-colors resize-none"
            placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
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
            <span v-if="saving" class="material-symbols-outlined animate-spin">progress_activity</span>
            <span v-else class="material-symbols-outlined">save</span>
            {{ saving ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin'
})

const route = useRoute()
const router = useRouter()
const productId = route.params.id

const { data: product, pending, error, refresh } = await useApiFetch(
  productId ? `/api/admin/products/${productId}` : null,
  { default: () => null }
)
const { data: categories } = await useApiFetch('/api/admin/categories', {
  default: () => []
})

// Form state
const form = reactive({
  name: '',
  description: '',
  price: 0,
  stock: 0,
  categoryId: '',
  isActive: true,
  isFeatured: false
})

const imagesInput = ref('')
const saving = ref(false)

// Initialize form when product loads
watch(() => product.value, (p) => {
  if (p) {
    form.name = p.name || ''
    form.description = p.description || ''
    form.price = p.price || 0
    form.stock = p.stock || 0
    form.categoryId = p.categoryId || ''
    form.isActive = p.isActive !== false
    form.isFeatured = p.isFeatured || false
    imagesInput.value = p.images?.join(', ') || ''
  }
}, { immediate: true })

async function handleSubmit() {
  saving.value = true

  try {
    const images = imagesInput.value
      .split(',')
      .map(url => url.trim())
      .filter(url => url.length > 0)

    const payload = {
      ...form,
      price: parseFloat(form.price),
      stock: parseInt(form.stock),
      images
    }

    await $apiFetch(`/api/admin/products/${productId}`, {
      method: 'PATCH',
      body: payload
    })

    alert('Product updated successfully!')
    router.push('/admin')
  } catch (err) {
    alert(err?.data?.statusMessage || 'Failed to update product')
  } finally {
    saving.value = false
  }
}
</script>
