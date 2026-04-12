<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="font-serif italic text-3xl text-on-surface mb-2">Edit Category</h1>
        <p class="text-on-surface-variant/70 text-sm font-body">Update category information</p>
      </div>
      <NuxtLink
        to="/categories"
        class="flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors font-label text-[11px] uppercase tracking-[0.15em]"
      >
        <span class="material-symbols-outlined">arrow_back</span>
        Back to Categories
      </NuxtLink>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="bg-white rounded-xl border border-outline-variant/10 p-12 text-center">
      <span class="material-symbols-outlined text-4xl animate-spin text-primary">progress_activity</span>
      <p class="mt-4 text-on-surface-variant font-body">Loading category...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-white rounded-xl border border-outline-variant/10 p-12 text-center">
      <span class="material-symbols-outlined text-4xl text-error">error</span>
      <p class="mt-4 text-error font-body">Failed to load category</p>
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
        <!-- Category Name -->
        <div class="space-y-2">
          <label class="block font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant">
            Category Name *
          </label>
          <input
            v-model="form.name"
            type="text"
            required
            class="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg py-3 px-4 text-on-surface font-body focus:outline-none focus:border-primary/50 transition-colors"
            placeholder="Enter category name"
          />
        </div>

        <!-- Slug (Read Only) -->
        <div class="space-y-2">
          <label class="block font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant">
            Slug (Auto-generated)
          </label>
          <input
            :value="form.slug"
            type="text"
            disabled
            class="w-full bg-surface-container-high border border-outline-variant/10 rounded-lg py-3 px-4 text-on-surface-variant font-body cursor-not-allowed"
          />
        </div>

        <!-- Product Count (Read Only) -->
        <div class="space-y-2">
          <label class="block font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant">
            Products in this Category
          </label>
          <div class="w-full bg-surface-container-high border border-outline-variant/10 rounded-lg py-3 px-4 text-on-surface font-body">
            {{ category?._count?.products || 0 }} products
          </div>
        </div>

        <!-- Created At (Read Only) -->
        <div class="space-y-2">
          <label class="block font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant">
            Created At
          </label>
          <div class="w-full bg-surface-container-high border border-outline-variant/10 rounded-lg py-3 px-4 text-on-surface-variant font-body">
            {{ category?.createdAt ? new Date(category.createdAt).toLocaleString() : '-' }}
          </div>
        </div>

        <!-- Submit Buttons -->
        <div class="flex items-center justify-end gap-4 pt-4 border-t border-outline-variant/10">
          <NuxtLink
            to="/categories"
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
const categoryId = route.params.id

// Fetch category - we need to get it from the list since there's no single category endpoint
const { data: categories, pending, error, refresh } = await useApiFetch('/api/admin/categories', {
  default: () => []
})

const category = computed(() => {
  return categories.value?.find(c => c.id === categoryId)
})

// Form state
const form = reactive({
  name: '',
  slug: ''
})

const saving = ref(false)

// Initialize form when category loads
watch(() => category.value, (c) => {
  if (c) {
    form.name = c.name || ''
    form.slug = c.slug || ''
  }
}, { immediate: true })

// Update slug when name changes
watch(() => form.name, (name) => {
  form.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
})

async function handleSubmit() {
  saving.value = true

  try {
    await $apiFetch(`/api/admin/categories/${categoryId}`, {
      method: 'PATCH',
      body: { name: form.name }
    })

    alert('Category updated successfully!')
    router.push('/categories')
  } catch (err) {
    alert(err?.data?.statusMessage || 'Failed to update category')
  } finally {
    saving.value = false
  }
}
</script>
