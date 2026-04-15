<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="font-serif italic text-3xl text-on-surface mb-2">Categories</h1>
        <p class="text-on-surface-variant/70 text-sm font-body">Manage your product categories</p>
      </div>
      <button
        @click="showCreateModal = true"
        class="btn-gradient px-6 py-3 rounded-lg text-on-primary font-label text-[11px] uppercase tracking-[0.2em] flex items-center gap-2 hover:opacity-90 transition-opacity"
      >
        <span class="material-symbols-outlined text-lg">add</span>
        Add Category
      </button>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-xl border border-outline-variant/10 shadow-sm shadow-primary/5 overflow-hidden">
      <table class="w-full">
        <thead class="bg-surface-container-low border-b border-outline-variant/10">
          <tr>
            <th class="text-left px-6 py-4 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Category Name</th>
            <th class="text-left px-6 py-4 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Products</th>
            <th class="text-left px-6 py-4 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Created</th>
            <th class="text-right px-6 py-4 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Actions</th>
          </tr>
        </thead>
        <ClientOnly>
          <template #fallback>
            <tbody class="divide-y divide-outline-variant/10">
              <tr class="hover:bg-surface-container-low/50 transition-colors">
                <td colspan="4" class="px-6 py-12 text-center">
                  <span class="text-on-surface-variant font-body">Loading...</span>
                </td>
              </tr>
            </tbody>
          </template>
          <tbody class="divide-y divide-outline-variant/10">
            <tr v-if="pending" class="hover:bg-surface-container-low/50 transition-colors">
              <td colspan="4" class="px-6 py-12 text-center">
                <span class="text-on-surface-variant material-symbols-outlined text-3xl animate-spin">progress_activity</span>
              </td>
            </tr>
            <tr v-else-if="error" class="hover:bg-surface-container-low/50 transition-colors">
              <td colspan="4" class="px-6 py-12 text-center">
                <span class="text-error font-body">Failed to load categories</span>
              </td>
            </tr>
            <tr v-else-if="!filteredCategories?.length" class="hover:bg-surface-container-low/50 transition-colors">
              <td colspan="4" class="px-6 py-12 text-center">
                <span class="text-on-surface-variant font-body">No categories found. Create your first category to get started.</span>
              </td>
            </tr>
            <tr
              v-for="category in filteredCategories"
              :key="category.id"
              class="hover:bg-surface-container-low/50 transition-colors group"
            >
              <td class="px-6 py-4">
                <div class="font-medium text-on-surface font-body">{{ category.name }}</div>
              </td>
              <td class="px-6 py-4">
                <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                  {{ category.products?.length || 0 }} products
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-on-surface-variant font-body">
                {{ new Date(category.createdAt).toLocaleDateString() }}
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <NuxtLink
                    :to="`/admin/categories/${category.id}/edit`"
                    class="p-2 rounded-lg hover:bg-surface-container-low text-on-surface-variant hover:text-primary transition-colors"
                  >
                    <span class="material-symbols-outlined text-lg">edit</span>
                  </NuxtLink>
                  <button
                    @click="confirmDelete(category)"
                    class="p-2 rounded-lg hover:bg-error/10 text-on-surface-variant hover:text-error transition-colors"
                  >
                    <span class="material-symbols-outlined text-lg">delete</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </ClientOnly>
      </table>
    </div>

    <!-- Create Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <h2 class="font-serif italic text-2xl text-on-surface mb-6">New Category</h2>
        <form @submit.prevent="createCategory">
          <div class="mb-6">
            <label class="block font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant mb-2">
              Category Name
            </label>
            <input
              v-model="newCategoryName"
              type="text"
              placeholder="e.g., Summer Collection"
              class="w-full bg-transparent border border-outline-variant/30 rounded-lg py-3 px-4 focus:outline-none focus:border-primary transition-colors font-body"
              required
            />
          </div>
          <div class="flex gap-3">
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
              {{ creating ? 'Creating...' : 'Create' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation -->
    <div v-if="deleteModal.show" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center">
        <span class="material-symbols-outlined text-5xl text-error mb-4">warning</span>
        <h2 class="font-serif italic text-2xl text-on-surface mb-2">Delete Category?</h2>
        <p class="text-on-surface-variant mb-6 font-body">
          Are you sure you want to delete "{{ deleteModal.category?.name }}"? This action cannot be undone.
        </p>
        <div class="flex gap-3">
          <button
            @click="deleteModal.show = false"
            class="flex-1 py-3 rounded-lg border border-outline-variant/30 text-on-surface-variant font-label text-[11px] uppercase tracking-[0.15em] hover:bg-surface-container-low transition-colors"
          >
            Cancel
          </button>
          <button
            @click="deleteCategory"
            :disabled="deleting"
            class="flex-1 bg-error text-white py-3 rounded-lg font-label text-[11px] uppercase tracking-[0.15em] hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {{ deleting ? 'Deleting...' : 'Delete' }}
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
  permission: 'VIEW_CATEGORIES'
})

const { data: categories, pending, error, refresh } = await useApiFetch('/api/admin/categories', {
  default: () => [],
  server: true
})

const { searchQuery, filterCategories } = useSearch()
const { triggerRefresh, lastRefreshEvent } = useDataRefresh()

// Auto-refresh from other tabs
watch(() => lastRefreshEvent.value, (event) => {
  if (event?.dataType === 'categories') {
    refresh()
  }
})

const filteredCategories = computed(() => {
  const filtered = filterCategories(categories.value, searchQuery.value)
  return filtered?.filter(c => c) || []
})

const showCreateModal = ref(false)
const newCategoryName = ref('')
const creating = ref(false)

const deleteModal = ref({
  show: false,
  category: null
})

const createCategory = async () => {
  creating.value = true
  try {
    const response = await $apiFetch('/api/admin/categories', {
      method: 'POST',
      body: { name: newCategoryName.value }
    })
    newCategoryName.value = ''
    showCreateModal.value = false
    triggerRefresh('categories')
    await refresh()
  } catch (err: any) {
    alert(err.message || 'Failed to create category')
  } finally {
    creating.value = false
  }
}

const confirmDelete = (category: any) => {
  deleteModal.value = { show: true, category }
}

const deleting = ref(false)
const deleteCategory = async () => {
  deleting.value = true
  try {
    const response = await $apiFetch(`/api/admin/categories/${deleteModal.value.category.id}`, {
      method: 'DELETE'
    })
    deleteModal.value.show = false
    triggerRefresh('categories')
    await refresh()
  } catch (err: any) {
    alert(err.message || 'Failed to delete category')
  } finally {
    deleting.value = false
  }
}

const editCategory = (category) => {
  // TODO: Implement edit modal
  alert('Edit functionality coming soon!')
}
</script>