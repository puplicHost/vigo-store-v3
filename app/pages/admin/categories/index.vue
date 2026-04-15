<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="font-serif italic text-3xl text-on-surface mb-2">{{ $t('sidebar.categories') }}</h1>
        <p class="text-on-surface-variant/70 text-sm font-body">{{ $t('products.subtitle') }}</p>
      </div>
      <button
        @click="showCreateModal = true"
        class="btn-gradient px-6 py-3 rounded-lg text-on-primary font-label text-[11px] uppercase tracking-[0.2em] flex items-center gap-2 hover:opacity-90 transition-opacity"
      >
        <span class="material-symbols-outlined text-lg">add</span>
        {{ $t('products.addProduct') }}
      </button>
    </div>

    <!-- Table -->
    <div class="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm shadow-primary/5 overflow-hidden transition-colors duration-300">
      <table class="w-full">
        <thead class="bg-surface-container-low border-b border-outline-variant/10">
          <tr>
            <th class="text-left px-6 py-4 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant rtl:text-right">{{ $t('products.category') }}</th>
            <th class="text-left px-6 py-4 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant rtl:text-right">{{ $t('sidebar.inventory') }}</th>
            <th class="text-left px-6 py-4 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant rtl:text-right">{{ $t('settings.general') }}</th>
            <th class="text-right px-6 py-4 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant rtl:text-left">{{ $t('products.actions') }}</th>
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
                  {{ category._count?.products || 0 }} {{ $t('products.units') }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-on-surface-variant font-body">
                {{ new Date(category.createdAt).toLocaleDateString() }}
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                  <button
                    @click="openEditModal(category)"
                    class="p-2 rounded-lg hover:bg-surface-container-low text-on-surface-variant hover:text-primary transition-colors"
                  >
                    <span class="material-symbols-outlined text-lg">edit</span>
                  </button>
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
      <div class="bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-md p-8 transition-colors duration-300">
        <h2 class="font-serif italic text-2xl text-on-surface mb-6">{{ $t('products.newProduct') }} ({{ $t('products.category') }})</h2>
        <form @submit.prevent="createCategory">
          <div class="mb-6">
            <label class="block font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant mb-2">
              {{ $t('products.name') }}
            </label>
            <input
              v-model="newCategoryName"
              type="text"
              :placeholder="$t('topbar.search')"
              class="w-full bg-transparent border border-outline-variant/30 rounded-lg py-3 px-4 focus:outline-none focus:border-primary transition-colors font-body text-on-surface"
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
      <div class="bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-md p-8 text-center transition-colors duration-300">
        <span class="material-symbols-outlined text-5xl text-error mb-4">warning</span>
        <h2 class="font-serif italic text-2xl text-on-surface mb-2">{{ $t('common.confirm') }}</h2>
        <p class="text-on-surface-variant mb-6 font-body">
          {{ $t('common.error') }}? "{{ deleteModal.category?.name }}"
        </p>
        <div class="flex gap-3">
          <button
            @click="deleteModal.show = false"
            class="flex-1 py-3 rounded-lg border border-outline-variant/30 text-on-surface-variant font-label text-[11px] uppercase tracking-[0.15em] hover:bg-surface-container-low transition-colors"
          >
            {{ $t('products.cancel') }}
          </button>
          <button
            @click="deleteCategory"
            :disabled="deleting"
            class="flex-1 bg-error text-white py-3 rounded-lg font-label text-[11px] uppercase tracking-[0.15em] hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {{ deleting ? $t('common.loading') : $t('common.delete') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="editModal.show" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-md p-8 transition-colors duration-300">
        <h2 class="font-serif italic text-2xl text-on-surface mb-6">{{ $t('products.actions') }} ({{ $t('products.category') }})</h2>
        <form @submit.prevent="updateCategory">
          <div class="mb-6">
            <label class="block font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant mb-2">
              {{ $t('products.name') }}
            </label>
            <input
              v-model="editModal.name"
              type="text"
              class="w-full bg-transparent border border-outline-variant/30 rounded-lg py-3 px-4 focus:outline-none focus:border-primary transition-colors font-body text-on-surface"
              required
            />
          </div>
          <div class="flex gap-3">
            <button
              type="button"
              @click="editModal.show = false"
              class="flex-1 py-3 rounded-lg border border-outline-variant/30 text-on-surface-variant font-label text-[11px] uppercase tracking-[0.15em] hover:bg-surface-container-low transition-colors"
            >
              {{ $t('products.cancel') }}
            </button>
            <button
              type="submit"
              :disabled="updating"
              class="flex-1 btn-gradient py-3 rounded-lg text-on-primary font-label text-[11px] uppercase tracking-[0.15em] hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {{ updating ? $t('common.loading') : $t('settings.save') }}
            </button>
          </div>
        </form>
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
  key: 'admin-categories-list',
  default: () => [],
  server: true
})

const { searchQuery, filterCategories } = useSearch()
const { lastRefreshEvent } = useDataRefresh()
const { toast } = useNotifications()

// Auto-refresh from other tabs
watch(() => lastRefreshEvent.value, (event) => {
  if (event?.dataType === 'categories') refresh()
})

const filteredCategories = computed(() => {
  if (!categories.value) return []
  const data = Array.isArray(categories.value) ? categories.value : (categories.value as any).categories || []
  return filterCategories(data, searchQuery.value)
})

const showCreateModal = ref(false)
const newCategoryName = ref('')
const creating = ref(false)

const editModal = ref({ show: false, id: '', name: '' })
const updating = ref(false)

const deleteModal = ref({ show: false, category: null as any })
const deleting = ref(false)

const createCategory = async () => {
  if (!newCategoryName.value.trim()) return
  creating.value = true
  try {
    await $apiFetch('/api/admin/categories', {
      method: 'POST',
      body: { name: newCategoryName.value }
    })
    toast.success('Category created')
    newCategoryName.value = ''
    showCreateModal.value = false
    await refresh()
  } catch (err: any) {
    toast.error(err?.data?.statusMessage || 'Failed to create category')
  } finally {
    creating.value = false
  }
}

const openEditModal = (category: any) => {
  editModal.value = { show: true, id: category.id, name: category.name }
}

const updateCategory = async () => {
  if (!editModal.value.name.trim()) return
  updating.value = true
  try {
    await $apiFetch(`/api/admin/categories/${editModal.value.id}`, {
      method: 'PUT',
      body: { name: editModal.value.name }
    })
    toast.success('Category updated')
    editModal.value.show = false
    await refresh()
  } catch (err: any) {
    toast.error(err?.data?.statusMessage || 'Failed to update category')
  } finally {
    updating.value = false
  }
}

const confirmDelete = (category: any) => {
  deleteModal.value = { show: true, category }
}

const deleteCategory = async () => {
  if (!deleteModal.value.category?.id) return
  deleting.value = true
  try {
    await $apiFetch(`/api/admin/categories/${deleteModal.value.category.id}`, {
      method: 'DELETE'
    })
    toast.success('Category deleted')
    deleteModal.value.show = false
    await refresh()
  } catch (err: any) {
    toast.error(err?.data?.statusMessage || 'Failed to delete category')
  } finally {
    deleting.value = false
  }
}
</script>