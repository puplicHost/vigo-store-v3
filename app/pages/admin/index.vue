<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="font-serif italic text-3xl text-on-surface mb-2">Inventory</h1>
        <p class="text-on-surface-variant/70 text-sm font-body">Manage your product catalog</p>
      </div>
      <div class="flex items-center gap-4">
        <button
          @click="showArchived = !showArchived"
          class="px-4 py-3 rounded-lg border border-outline-variant/30 text-on-surface-variant font-label text-[11px] uppercase tracking-[0.15em] hover:bg-surface-container-low transition-colors flex items-center gap-2"
        >
          <span class="material-symbols-outlined text-lg">{{ showArchived ? 'inventory' : 'archive' }}</span>
          {{ showArchived ? 'Active' : 'Archived' }}
        </button>
        <button
          @click="showCreateModal = true"
          class="btn-gradient px-6 py-3 rounded-lg text-on-primary font-label text-[11px] uppercase tracking-[0.2em] flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <span class="material-symbols-outlined text-lg">add</span>
          Add Product
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex gap-4 mb-6">
      <div class="relative">
        <select
          v-model="selectedCategory"
          class="appearance-none bg-white border border-outline-variant/20 rounded-lg py-2.5 pl-4 pr-10 text-sm font-body focus:outline-none focus:border-primary/50 cursor-pointer"
        >
          <option value="">All Categories</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
        </select>
        <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-xl border border-outline-variant/10 shadow-sm shadow-primary/5 overflow-hidden">
      <table class="w-full">
        <thead class="bg-surface-container-low border-b border-outline-variant/10">
          <tr>
            <th class="text-left px-6 py-4 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Product</th>
            <th class="text-left px-6 py-4 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Category</th>
            <th class="text-left px-6 py-4 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Price</th>
            <th class="text-left px-6 py-4 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Stock</th>
            <th class="text-left px-6 py-4 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Status</th>
            <th class="text-right px-6 py-4 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-outline-variant/10">
          <tr v-if="pending" class="hover:bg-surface-container-low/50 transition-colors">
            <td colspan="6" class="px-6 py-12 text-center text-on-surface-variant">
              <span class="material-symbols-outlined text-3xl animate-spin">progress_activity</span>
            </td>
          </tr>
          <tr v-else-if="error" class="hover:bg-surface-container-low/50 transition-colors">
            <td colspan="6" class="px-6 py-12 text-center">
              <span class="text-error font-body">Failed to load products</span>
            </td>
          </tr>
          <tr v-else-if="!filteredProducts?.length" class="hover:bg-surface-container-low/50 transition-colors">
            <td colspan="6" class="px-6 py-12 text-center">
              <span class="text-on-surface-variant font-body">No products found. Create your first product to get started.</span>
            </td>
          </tr>
          <tr
            v-for="product in filteredProducts"
            :key="product.id"
            class="hover:bg-surface-container-low/50 transition-colors group"
          >
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-lg bg-surface-container-low overflow-hidden">
                  <img
                    v-if="product.images?.[0]"
                    :src="product.images[0]"
                    class="w-full h-full object-cover"
                    alt=""
                  />
                  <div v-else class="w-full h-full flex items-center justify-center">
                    <span class="material-symbols-outlined text-on-surface-variant/30">image</span>
                  </div>
                </div>
                <div>
                  <div class="font-medium text-on-surface font-body">{{ product.name }}</div>
                  <div class="text-xs text-on-surface-variant">{{ product.slug }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4">
              <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-secondary/50 text-on-secondary">
                {{ product.category?.name || 'Uncategorized' }}
              </span>
            </td>
            <td class="px-6 py-4 font-medium text-on-surface font-body">
              ${{ (product.price ?? 0).toFixed(2) }}
            </td>
            <td class="px-6 py-4">
              <span :class="[
                'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium',
                product.stock > 10 ? 'bg-success/10 text-success' :
                product.stock > 0 ? 'bg-warning/10 text-warning' :
                'bg-error/10 text-error'
              ]">
                {{ product.stock }} units
              </span>
            </td>
            <td class="px-6 py-4">
              <span v-if="product.isFeatured" class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                Featured
              </span>
              <span v-else class="text-on-surface-variant text-sm">-</span>
            </td>
            <td class="px-6 py-4 text-right">
              <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <NuxtLink
                  :to="`/admin/products/${product.id}/edit`"
                  class="p-2 rounded-lg hover:bg-surface-container-low text-on-surface-variant hover:text-primary transition-colors"
                >
                  <span class="material-symbols-outlined text-lg">edit</span>
                </NuxtLink>
                <button
                  v-if="!product.isDeleted"
                  @click="confirmArchive(product)"
                  class="p-2 rounded-lg hover:bg-warning/10 text-on-surface-variant hover:text-warning transition-colors"
                >
                  <span class="material-symbols-outlined text-lg">archive</span>
                </button>
                <button
                  v-else
                  @click="restoreProduct(product)"
                  class="p-2 rounded-lg hover:bg-success/10 text-on-surface-variant hover:text-success transition-colors"
                >
                  <span class="material-symbols-outlined text-lg">restore_from_trash</span>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Create Modal (Simplified) -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8">
        <div class="p-8 border-b border-outline-variant/10">
          <h2 class="font-serif italic text-2xl text-on-surface">New Product</h2>
        </div>
        <form @submit.prevent="createProduct" class="p-8 space-y-6">
          <div class="grid grid-cols-2 gap-6">
            <div>
              <label class="block font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant mb-2">Name</label>
              <input
                v-model="newProduct.name"
                type="text"
                class="w-full bg-transparent border border-outline-variant/30 rounded-lg py-3 px-4 focus:outline-none focus:border-primary transition-colors font-body"
                required
              />
            </div>
            <div>
              <label class="block font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant mb-2">Category</label>
              <select
                v-model="newProduct.categoryId"
                class="w-full bg-transparent border border-outline-variant/30 rounded-lg py-3 px-4 focus:outline-none focus:border-primary transition-colors font-body"
                required
              >
                <option value="">Select category</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
              </select>
            </div>
          </div>
          <div>
            <label class="block font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant mb-2">Description</label>
            <textarea
              v-model="newProduct.description"
              rows="3"
              class="w-full bg-transparent border border-outline-variant/30 rounded-lg py-3 px-4 focus:outline-none focus:border-primary transition-colors font-body resize-none"
            ></textarea>
          </div>
          <div>
            <label class="block font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant mb-2">Images</label>
            <div class="border-2 border-dashed border-outline-variant/30 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
              <input
                ref="fileInput"
                type="file"
                accept="image/*"
                multiple
                @change="handleImageUpload"
                class="hidden"
              />
              <button
                type="button"
                @click="() => fileInput?.click?.()"
                class="flex flex-col items-center gap-2 text-on-surface-variant hover:text-primary transition-colors"
              >
                <span class="material-symbols-outlined text-4xl">cloud_upload</span>
                <span class="font-label text-sm uppercase tracking-widest">Upload Images</span>
              </button>
              <div v-if="imagePreviews.length" class="mt-4 flex flex-wrap gap-2">
                <div v-for="(preview, index) in imagePreviews" :key="index" class="relative w-20 h-20 rounded-lg overflow-hidden">
                  <img :src="preview" class="w-full h-full object-cover" />
                  <button
                    type="button"
                    @click="removeImage(index)"
                    class="absolute top-1 right-1 bg-error text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </div>
              </div>
              <p v-else class="text-xs text-on-surface-variant/60 mt-2">Click to upload product images</p>
            </div>
          </div>
          <div class="grid grid-cols-3 gap-6">
            <div>
              <label class="block font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant mb-2">Price ($)</label>
              <input
                v-model.number="newProduct.price"
                type="number"
                step="0.01"
                min="0"
                class="w-full bg-transparent border border-outline-variant/30 rounded-lg py-3 px-4 focus:outline-none focus:border-primary transition-colors font-body"
                required
              />
            </div>
            <div>
              <label class="block font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant mb-2">Stock</label>
              <input
                v-model.number="newProduct.stock"
                type="number"
                min="0"
                class="w-full bg-transparent border border-outline-variant/30 rounded-lg py-3 px-4 focus:outline-none focus:border-primary transition-colors font-body"
                required
              />
            </div>
            <div>
              <label class="block font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant mb-2">Discount (%)</label>
              <input
                v-model.number="newProduct.discount"
                type="number"
                min="0"
                max="100"
                class="w-full bg-transparent border border-outline-variant/30 rounded-lg py-3 px-4 focus:outline-none focus:border-primary transition-colors font-body"
              />
            </div>
          </div>
          <div class="flex gap-3 pt-4">
            <button
              type="button"
              @click="showCreateModal = false"
              class="flex-1 py-3 rounded-lg border border-outline-variant/30 text-on-surface-variant font-label text-[11px] uppercase tracking-[0.15em] hover:bg-surface-container-low transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="creating"
              class="flex-1 btn-gradient py-3 rounded-lg text-on-primary font-label text-[11px] uppercase tracking-[0.15em] hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {{ creating ? 'Creating...' : 'Create Product' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Archive Confirmation -->
    <div v-if="deleteModal.show" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center">
        <span class="material-symbols-outlined text-5xl text-warning mb-4">archive</span>
        <h2 class="font-serif italic text-2xl text-on-surface mb-2">Archive Product?</h2>
        <p class="text-on-surface-variant mb-6 font-body">
          Are you sure you want to archive "{{ deleteModal.product?.name }}"? It will be hidden from the store but can be restored later.
        </p>
        <div class="flex gap-3">
          <button
            @click="deleteModal.show = false"
            class="flex-1 py-3 rounded-lg border border-outline-variant/30 text-on-surface-variant font-label text-[11px] uppercase tracking-[0.15em] hover:bg-surface-container-low transition-colors"
          >
            Cancel
          </button>
          <button
            @click="archiveProduct"
            :disabled="deleting"
            class="flex-1 bg-warning text-white py-3 rounded-lg font-label text-[11px] uppercase tracking-[0.15em] hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {{ deleting ? 'Archiving...' : 'Archive' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin',
  middleware: ['permissions'],
  permission: 'VIEW_PRODUCTS'
})

const showArchived = ref(false)

const { data: products, pending, error, refresh: refreshProducts } = await useApiFetch('/api/admin/products', {
  default: () => [],
  query: computed(() => ({ showArchived: showArchived.value ? 'true' : undefined }))
})
const { data: categories } = await useApiFetch('/api/admin/categories', {
  default: () => []
})

const { searchQuery, filterProducts } = useSearch()
const { toast } = useNotifications()
const selectedCategory = ref('')
const showCreateModal = ref(false)
const creating = ref(false)
const fileInput = ref(null)
const imagePreviews = ref([])

const newProduct = ref({
  name: '',
  description: '',
  price: 0,
  stock: 0,
  discount: null,
  categoryId: '',
  images: [],
  sizes: [],
  colors: []
})

const filteredProducts = computed(() => {
  if (!products.value) return []

  let filtered = products.value

  // Apply category filter
  if (selectedCategory.value) {
    filtered = filtered.filter(p => p.categoryId === selectedCategory.value)
  }

  // Apply search filter
  if (searchQuery.value) {
    filtered = filterProducts(filtered, searchQuery.value)
  }

  return filtered
})

const createProduct = async () => {
  // Validate category is selected
  if (!newProduct.value.categoryId) {
    toast.error('Please select a category')
    return
  }

  creating.value = true
  try {
    await $apiFetch('/api/admin/products', {
      method: 'POST',
      body: newProduct.value
    })
    toast.success('Product created successfully')
    newProduct.value = {
      name: '',
      description: '',
      price: 0,
      stock: 0,
      discount: null,
      categoryId: '',
      images: [],
      sizes: [],
      colors: []
    }
    imagePreviews.value = []
    showCreateModal.value = false
    await refreshProducts()
  } catch (err) {
    toast.error(err.data?.statusMessage || 'Failed to create product')
  } finally {
    creating.value = false
  }
}

const deleteModal = ref({
  show: false,
  product: null
})
const deleting = ref(false)

const confirmArchive = (product) => {
  deleteModal.value = { show: true, product }
}

const archiveProduct = async () => {
  if (!deleteModal.value.product?.id) {
    toast.error('Product ID is missing')
    return
  }
  deleting.value = true
  try {
    await $apiFetch(`/api/admin/products/${deleteModal.value.product.id}`, {
      method: 'DELETE'
    })
    toast.success(`Product "${deleteModal.value.product.name}" archived`)
    deleteModal.value.show = false
    await refreshProducts()
  } catch (err) {
    toast.error(err.data?.statusMessage || 'Failed to archive product')
  } finally {
    deleting.value = false
  }
}

const restoreProduct = async (product) => {
  if (!product?.id) {
    toast.error('Product ID is missing')
    return
  }
  try {
    await $apiFetch(`/api/admin/products/${product.id}/restore`, {
      method: 'PATCH'
    })
    toast.success(`Product "${product.name}" restored`)
    await refreshProducts()
  } catch (err) {
    toast.error(err.data?.statusMessage || 'Failed to restore product')
  }
}

const editProduct = (product) => {
  alert('Edit functionality coming soon!')
}

const handleImageUpload = (event) => {
  const files = event.target.files
  if (!files || files.length === 0) return

  Array.from(files).forEach(file => {
    if (!file.type.startsWith('image/')) return

    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreviews.value.push(e.target.result)
      // Convert to base64 for storage (in production, upload to server)
      newProduct.value.images.push(e.target.result)
    }
    reader.readAsDataURL(file)
  })
}

const removeImage = (index) => {
  imagePreviews.value.splice(index, 1)
  newProduct.value.images.splice(index, 1)
}
</script>