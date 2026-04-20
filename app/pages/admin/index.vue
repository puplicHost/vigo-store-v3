<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="font-serif italic text-3xl text-on-surface mb-2">{{ $t('products.title') }}</h1>
        <p class="text-on-surface-variant/70 text-sm font-body">{{ $t('products.subtitle') }}</p>
      </div>
      <div class="flex items-center gap-4">
        <button
          @click="showArchived = !showArchived"
          class="px-4 py-3 rounded-lg border border-outline-variant/30 text-on-surface-variant font-label text-[11px] uppercase tracking-[0.15em] hover:bg-surface-container-low transition-colors flex items-center gap-2"
        >
          <span class="material-symbols-outlined text-lg">{{ showArchived ? 'inventory' : 'archive' }}</span>
          {{ showArchived ? $t('products.active') : $t('products.archived') }}
        </button>
        <button
          @click="showCreateModal = true"
          class="btn-gradient px-6 py-3 rounded-lg text-on-primary font-label text-[11px] uppercase tracking-[0.2em] flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <span class="material-symbols-outlined text-lg">add</span>
          {{ $t('products.addProduct') }}
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex gap-4 mb-6">
      <div class="relative">
        <select
          v-model="selectedCategory"
          class="appearance-none bg-surface-container-lowest border border-outline-variant/20 rounded-lg py-2.5 pl-4 pr-10 text-sm font-body text-on-surface focus:outline-none focus:border-primary/50 cursor-pointer transition-colors"
        >
          <option value="">{{ $t('products.allCategories') }}</option>
          <option v-for="cat in (categories || [])" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
        </select>
        <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm shadow-primary/5 overflow-hidden transition-colors duration-300">
      <table class="w-full">
        <thead class="bg-surface-container-low border-b border-outline-variant/10">
          <tr>
            <th class="text-left px-6 py-4 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant rtl:text-right">{{ $t('products.product') }}</th>
            <th class="text-left px-6 py-4 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant rtl:text-right">{{ $t('products.category') }}</th>
            <th class="text-left px-6 py-4 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant rtl:text-right">{{ $t('products.price') }}</th>
            <th class="text-left px-6 py-4 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant rtl:text-right">{{ $t('products.stock') }}</th>
            <th class="text-left px-6 py-4 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant rtl:text-right">{{ $t('products.status') }}</th>
            <th class="text-right px-6 py-4 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant rtl:text-left">{{ $t('products.actions') }}</th>
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
          <template v-else>
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
                  (product.stock ?? 0) > 10 ? 'bg-success/10 text-success' :
                  (product.stock ?? 0) > 0 ? 'bg-warning/10 text-warning' :
                  'bg-error/10 text-error'
                ]">
                  {{ (product.stock ?? 0) }} {{ $t('products.units') }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span v-if="product.isFeatured" class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                  {{ $t('products.featured') }}
                </span>
                <span v-else class="text-on-surface-variant text-sm">-</span>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
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
                  <!-- Permanent Delete Button -->
                  <button
                    @click="confirmPermanentDelete(product)"
                    class="p-2 rounded-lg hover:bg-error/10 text-on-surface-variant hover:text-error transition-colors"
                    title="Permanent Delete"
                  >
                    <span class="material-symbols-outlined text-lg">delete_forever</span>
                  </button>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <!-- Create Modal (Simplified) -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div class="bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-2xl my-8 transition-colors duration-300">
        <div class="p-8 border-b border-outline-variant/10">
          <h2 class="font-serif italic text-2xl text-on-surface">{{ $t('products.newProduct') }}</h2>
        </div>
        <form @submit.prevent="createProduct" class="p-8 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant mb-2">{{ $t('products.name') }}</label>
              <input
                v-model="newProduct.name"
                type="text"
                class="w-full bg-transparent border border-outline-variant/30 rounded-lg py-3 px-4 focus:outline-none focus:border-primary transition-colors font-body text-on-surface"
                required
              />
            </div>
            <div>
              <label class="block font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant mb-2">{{ $t('products.category') }}</label>
              <select
                v-model="newProduct.categoryId"
                class="w-full bg-transparent border border-outline-variant/30 rounded-lg py-3 px-4 focus:outline-none focus:border-primary transition-colors font-body text-on-surface"
                required
              >
                <option value="">{{ $t('products.selectCategory') }}</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
              </select>
            </div>
          </div>
          <div>
            <label class="block font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant mb-2">{{ $t('products.description') }}</label>
            <textarea
              v-model="newProduct.description"
              rows="3"
              class="w-full bg-transparent border border-outline-variant/30 rounded-lg py-3 px-4 focus:outline-none focus:border-primary transition-colors font-body text-on-surface resize-none"
            ></textarea>
          </div>
          <div>
            <label class="block font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant mb-2">{{ $t('products.images') }}</label>
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
                <span class="font-label text-sm uppercase tracking-widest">{{ $t('products.uploadImages') }}</span>
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
              <p v-else class="text-xs text-on-surface-variant/60 mt-2">{{ $t('products.clickToUpload') }}</p>
            </div>
          </div>

          <!-- Sizes Selection -->
          <div>
            <label class="block font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant mb-3">Available Sizes</label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="size in availableSizes"
                :key="size"
                type="button"
                @click="toggleSize(size)"
                :class="['px-4 py-2.5 rounded-lg text-xs font-label uppercase tracking-widest border-2 transition-all duration-200', newProduct.sizes.includes(size) ? 'border-primary bg-primary/10 text-primary font-bold' : 'border-outline-variant/30 text-on-surface-variant hover:border-primary/30']"
              >
                {{ size }}
              </button>
            </div>
          </div>

          <!-- Colors -->
          <div>
            <label class="block font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant mb-3">Colors</label>
            <div class="flex flex-wrap items-center gap-3 mb-3">
              <div v-for="(color, index) in newProduct.colors" :key="index" class="flex items-center gap-2 bg-surface-container-low rounded-full pl-1 pr-3 py-1 border border-outline-variant/20">
                <span class="w-6 h-6 rounded-full border border-outline-variant/30" :style="{ backgroundColor: color }"></span>
                <span class="text-xs font-body text-on-surface">{{ color }}</span>
                <button type="button" @click="removeColor(index)" class="text-on-surface-variant hover:text-error transition-colors ml-1">
                  <span class="material-symbols-outlined text-sm">close</span>
                </button>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <input type="color" v-model="newColorValue" class="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent"/>
              <input
                v-model="newColorName"
                type="text"
                placeholder="Color name (e.g. Black, Navy)"
                class="flex-1 bg-transparent border border-outline-variant/30 rounded-lg py-2.5 px-4 focus:outline-none focus:border-primary transition-colors font-body text-sm text-on-surface"
                @keydown.enter.prevent="addColor"
              />
              <button type="button" @click="addColor" class="px-4 py-2.5 rounded-lg bg-primary/10 text-primary font-label text-[11px] uppercase tracking-widest hover:bg-primary/20 transition-colors">
                Add
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label class="block font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant mb-2">{{ $t('products.price') }} (EGP)</label>
              <input
                v-model.number="newProduct.price"
                type="number"
                step="0.01"
                min="0"
                class="w-full bg-transparent border border-outline-variant/30 rounded-lg py-3 px-4 focus:outline-none focus:border-primary transition-colors font-body text-on-surface"
                required
              />
            </div>
            <div>
              <label class="block font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant mb-2">{{ $t('products.stock') }}</label>
              <input
                v-model.number="newProduct.stock"
                type="number"
                min="0"
                class="w-full bg-transparent border border-outline-variant/30 rounded-lg py-3 px-4 focus:outline-none focus:border-primary transition-colors font-body text-on-surface"
                required
              />
            </div>
            <div>
              <label class="block font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant mb-2">{{ $t('products.discount') }} (%)</label>
              <input
                v-model.number="newProduct.discount"
                type="number"
                min="0"
                max="100"
                class="w-full bg-transparent border border-outline-variant/30 rounded-lg py-3 px-4 focus:outline-none focus:border-primary transition-colors font-body text-on-surface"
              />
            </div>
          </div>
          <div class="flex gap-3 pt-4">
            <button
              type="button"
              @click="showCreateModal = false"
              class="flex-1 py-3 rounded-lg border border-outline-variant/30 text-on-surface-variant font-label text-[11px] uppercase tracking-[0.15em] hover:bg-surface-container-low transition-colors"
            >
              {{ $t('products.cancel') }}
            </button>
            <button
              type="submit"
              :disabled="creating"
              class="flex-1 btn-gradient py-3 rounded-lg text-on-primary font-label text-[11px] uppercase tracking-[0.15em] hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {{ creating ? $t('products.creating') : $t('products.create') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Archive Confirmation -->
    <div v-if="deleteModal.show" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-md p-8 text-center transition-colors duration-300">
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

    <!-- Permanent Delete Confirmation -->
    <div v-if="permanentDeleteModal.show" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-md p-8 text-center border-2 border-error/10 transition-colors duration-300">
        <span class="material-symbols-outlined text-5xl text-error mb-4">delete_forever</span>
        <h2 class="font-serif italic text-2xl text-on-surface mb-2">Permanent Delete?</h2>
        <p class="text-on-surface-variant mb-6 font-body">
          Are you sure you want to delete "{{ permanentDeleteModal.product?.name }}"? <br/>
          <span class="text-error font-bold text-xs uppercase tracking-widest mt-2 block">This action cannot be undone and will remove all product data.</span>
        </p>
        <div class="flex gap-3">
          <button
            @click="permanentDeleteModal.show = false"
            class="flex-1 py-3 rounded-lg border border-outline-variant/30 text-on-surface-variant font-label text-[11px] uppercase tracking-[0.15em] hover:bg-surface-container-low transition-colors"
          >
            Cancel
          </button>
          <button
            @click="deleteProductPermanently"
            :disabled="deletingProducts[permanentDeleteModal.product?.id] || deleting"
            class="flex-1 bg-error text-white py-3 rounded-lg font-label text-[11px] uppercase tracking-[0.15em] hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {{ deletingProducts[permanentDeleteModal.product?.id] || deleting ? 'Deleting...' : 'Delete Permanently' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['permissions'],
  permission: 'VIEW_PRODUCTS'
})

const showArchived = ref(false)
const selectedCategory = ref('')
const { searchQuery, filterProducts } = useSearch()
const { toast } = useNotifications()
const { lastRefreshEvent } = useDataRefresh()

// Fetch products with dynamic key based on showArchived to prevent caching
const productsKey = computed(() => `admin-products-${showArchived.value ? 'archived' : 'active'}`)
const { data: productsData, pending, error, refresh: refreshProducts } = await useApiFetch('/api/admin/products', {
  key: productsKey,
  query: computed(() => ({ 
    showArchived: showArchived.value ? 'true' : undefined 
  }))
})

// Fetch categories with stable key
const { data: categoriesData, refresh: refreshCategories } = await useApiFetch('/api/admin/categories', {
  key: 'admin-categories'
})

// Extract safe data
const products = computed(() => {
  if (!productsData.value) return []
  return (productsData.value as any)?.items || Array.isArray(productsData.value) ? productsData.value : []
})
const categories = computed(() => {
  if (!categoriesData.value) return []
  const data = (categoriesData.value as any)?.categories || (categoriesData.value as any)?.items || Array.isArray(categoriesData.value) ? categoriesData.value : []
  return data as any[]
})

// Watch for manual refresh triggers
watch(() => showArchived.value, () => refreshProducts())

// Auto-refresh from other tabs
watch(
  () => lastRefreshEvent.value,
  (event) => {
    if (event?.dataType === 'products') refreshProducts()
  }
)

const showCreateModal = ref(false)
const creating = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const imagePreviews = ref<string[]>([])

const newProduct = ref({
  name: '',
  description: '',
  price: 0,
  stock: 0,
  discount: 0,
  categoryId: '',
  images: [] as string[],
  sizes: [] as string[],
  colors: [] as string[]
})

// Clothing sizes & colors helpers
const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL']
const newColorValue = ref('#000000')
const newColorName = ref('')

const toggleSize = (size: string) => {
  const idx = newProduct.value.sizes.indexOf(size)
  if (idx >= 0) {
    newProduct.value.sizes.splice(idx, 1)
  } else {
    newProduct.value.sizes.push(size)
  }
}

const addColor = () => {
  const colorLabel = newColorName.value.trim() || newColorValue.value
  if (colorLabel && !newProduct.value.colors.includes(colorLabel)) {
    newProduct.value.colors.push(colorLabel)
    newColorName.value = ''
    newColorValue.value = '#000000'
  }
}

const removeColor = (index: number) => {
  newProduct.value.colors.splice(index, 1)
}

const filteredProducts = computed(() => {
  const productsArray = Array.isArray(products.value) ? products.value : []
  let filtered = [...productsArray]

  if (selectedCategory.value) {
    filtered = filtered.filter(p => p.categoryId === selectedCategory.value)
  }

  if (searchQuery.value) {
    filtered = filterProducts(filtered, searchQuery.value)
  }

  return filtered
})

const createProduct = async () => {
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
    
    // Reset form
    newProduct.value = {
      name: '',
      description: '',
      price: 0,
      stock: 0,
      discount: 0,
      categoryId: '',
      images: [],
      sizes: [],
      colors: []
    }
    imagePreviews.value = []
    showCreateModal.value = false
    await refreshProducts()
  } catch (err: any) {
    toast.error(err?.data?.statusMessage || err?.message || 'Failed to create product')
  } finally {
    creating.value = false
  }
}

const deleteModal = ref({ show: false, product: null as any })
const permanentDeleteModal = ref({ show: false, product: null as any })
const deleting = ref(false)
const deletingProducts = ref<Record<string, boolean>>({})

const confirmArchive = (product: any) => {
  deleteModal.value = { show: true, product }
}

const confirmPermanentDelete = (product: any) => {
  permanentDeleteModal.value = { show: true, product }
}

const deleteProductPermanently = async () => {
  const productId = permanentDeleteModal.value.product?.id
  if (!productId) return
  
  // Loading guard to prevent duplicate requests
  if (deletingProducts.value[productId]) {
    console.log('Delete already in progress for product:', productId)
    return
  }
  
  deletingProducts.value[productId] = true
  deleting.value = true
  
  console.log('Deleting product:', productId)
  
  try {
    await $apiFetch(`/api/admin/products/${productId}?permanent=true`, {
      method: 'DELETE'
    })
    console.log('Delete success:', productId)
    
    // Remove product from local list immediately
    if ((productsData.value as any)?.items) {
      productsData.value = {
        ...(productsData.value as any),
        items: (productsData.value as any).items.filter((p: any) => p.id !== productId)
      }
    } else if (Array.isArray(productsData.value)) {
      productsData.value = productsData.value.filter((p: any) => p.id !== productId)
    }
    
    toast.success(`Product deleted permanently`)
    permanentDeleteModal.value.show = false
    await refreshProducts()
  } catch (err: any) {
    console.log('Delete error:', productId, err)
    
    // If 404, product was already deleted - remove from local list
    if (err?.statusCode === 404) {
      console.log('Product already deleted, removing from local list:', productId)
      if ((productsData.value as any)?.items) {
        productsData.value = {
          ...(productsData.value as any),
          items: (productsData.value as any).items.filter((p: any) => p.id !== productId)
        }
      } else if (Array.isArray(productsData.value)) {
        productsData.value = productsData.value.filter((p: any) => p.id !== productId)
      }
      
      toast.success('Product deleted permanently')
      permanentDeleteModal.value.show = false
      return
    }
    
    toast.error(err?.data?.statusMessage || err?.message || 'Failed to delete product')
  } finally {
    deletingProducts.value[productId] = false
    deleting.value = false
  }
}

const archiveProduct = async () => {
  if (!deleteModal.value.product?.id) return
  deleting.value = true
  try {
    await $apiFetch(`/api/admin/products/${deleteModal.value.product.id}`, {
      method: 'DELETE'
    })
    toast.success('Product archived')
    deleteModal.value.show = false
    await refreshProducts()
  } catch (err: any) {
    toast.error(err?.data?.statusMessage || err?.message || 'Failed to archive product')
  } finally {
    deleting.value = false
  }
}

const restoreProduct = async (product: any) => {
  try {
    await $apiFetch(`/api/admin/products/${product.id}/restore`, {
      method: 'PATCH'
    })
    toast.success('Product restored')
    await refreshProducts()
  } catch (err: any) {
    toast.error(err?.data?.statusMessage || err?.message || 'Failed to restore product')
  }
}

const handleImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (!files) return

  Array.from(files).forEach(file => {
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      imagePreviews.value.push(result)
      // TODO: Implement actual file upload to server/cloud
      newProduct.value.images.push(result)
    }
    reader.readAsDataURL(file)
  })
}

const removeImage = (index: number) => {
  imagePreviews.value.splice(index, 1)
  newProduct.value.images.splice(index, 1)
}
</script>
>