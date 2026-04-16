<template>
  <div class="admin-table-container">
    <!-- Table Header with Actions -->
    <div v-if="showHeader" class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-4">
        <h2 v-if="title" class="font-serif italic text-xl text-on-surface">{{ title }}</h2>
        <slot name="headerActions"></slot>
      </div>
      <div class="flex items-center gap-3">
        <slot name="headerRight"></slot>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="space-y-4">
      <div v-for="i in 5" :key="i" class="bg-surface-container-lowest rounded-xl p-4 animate-pulse">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-lg bg-surface-container-low"></div>
          <div class="flex-1 space-y-2">
            <div class="h-4 bg-surface-container-low rounded w-1/3"></div>
            <div class="h-3 bg-surface-container-low rounded w-1/4"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!data || data.length === 0" class="bg-surface-container-lowest rounded-xl border border-outline-variant/10 p-12 text-center">
      <span class="material-symbols-outlined text-6xl text-on-surface-variant/30 mb-4">{{ emptyIcon }}</span>
      <p class="text-on-surface-variant font-body mb-2">{{ emptyMessage }}</p>
      <slot name="emptyAction">
        <button
          v-if="emptyActionText"
          @click="$emit('emptyActionClick')"
          class="mt-4 btn-gradient px-6 py-2 rounded-lg text-on-primary font-label text-[11px] uppercase tracking-[0.2em]"
        >
          {{ emptyActionText }}
        </button>
      </slot>
    </div>

    <!-- Table -->
    <div v-else class="bg-surface-container-lowest rounded-xl border border-outline-variant/10 shadow-sm shadow-primary/5 overflow-hidden">
      <table class="w-full">
        <thead class="bg-surface-container-low border-b border-outline-variant/10">
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              :class="[
                'text-left px-6 py-4 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant cursor-pointer hover:text-on-surface transition-colors',
                column.sortable ? 'hover:bg-surface-container-low' : ''
              ]"
              @click="column.sortable ? sortBy(column.key) : null"
            >
              <div class="flex items-center gap-2">
                {{ column.label }}
                <span v-if="column.sortable && sortKey === column.key" class="material-symbols-outlined text-sm">
                  {{ sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward' }}
                </span>
                <span v-else-if="column.sortable" class="material-symbols-outlined text-sm text-on-surface-variant/40">
                  sort
                </span>
              </div>
            </th>
            <th v-if="$slots.actions" class="text-right px-6 py-4 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, index) in paginatedData"
            :key="row.id || index"
            class="border-b border-outline-variant/10 hover:bg-surface-container-low/50 transition-colors"
          >
            <td
              v-for="column in columns"
              :key="column.key"
              class="px-6 py-4 text-sm text-on-surface font-body"
            >
              <slot :name="`cell-${column.key}`" :row="row" :value="row[column.key]">
                {{ row[column.key] }}
              </slot>
            </td>
            <td v-if="$slots.actions" class="px-6 py-4 text-right">
              <slot name="actions" :row="row"></slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="showPagination && totalPages > 1" class="flex items-center justify-between mt-6">
      <p class="text-sm text-on-surface-variant font-body">
        Showing {{ (currentPage - 1) * (pageSize ?? 10) + 1 }} to {{ Math.min(currentPage * (pageSize ?? 10), data.length) }} of {{ data.length }} results
      </p>
      <div class="flex items-center gap-2">
        <button
          @click="currentPage--"
          :disabled="currentPage === 1"
          class="p-2 rounded-lg bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span class="material-symbols-outlined text-sm">chevron_left</span>
        </button>
        <div class="flex items-center gap-1">
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="currentPage = page"
            :class="[
              'w-10 h-10 rounded-lg font-body text-sm transition-colors',
              currentPage === page
                ? 'bg-primary text-on-primary font-semibold'
                : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
            ]"
          >
            {{ page }}
          </button>
        </div>
        <button
          @click="currentPage++"
          :disabled="currentPage === totalPages"
          class="p-2 rounded-lg bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span class="material-symbols-outlined text-sm">chevron_right</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Column {
  key: string
  label: string
  sortable?: boolean
}

const props = defineProps<{
  columns: Column[]
  data: any[]
  loading?: boolean
  title?: string
  showHeader?: boolean
  showPagination?: boolean
  pageSize?: number
  emptyMessage?: string
  emptyIcon?: string
  emptyActionText?: string
}>()

const emit = defineEmits<{
  emptyActionClick: []
  sort: [key: string, order: 'asc' | 'desc']
}>()

const currentPage = ref(1)
const sortKey = ref('')
const sortOrder = ref<'asc' | 'desc'>('asc')

const totalPages = computed(() => Math.ceil(props.data.length / (props.pageSize ?? 10)))

const paginatedData = computed(() => {
  const pageSize = props.pageSize ?? 10
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return sortedData.value.slice(start, end)
})

const sortedData = computed(() => {
  if (!sortKey.value) return props.data
  
  return [...props.data].sort((a, b) => {
    const aVal = a[sortKey.value]
    const bVal = b[sortKey.value]
    
    if (aVal === bVal) return 0
    
    const comparison = aVal < bVal ? -1 : 1
    return sortOrder.value === 'asc' ? comparison : -comparison
  })
})

const visiblePages = computed(() => {
  const pages: number[] = []
  const maxVisible = 5
  
  if (totalPages.value <= maxVisible) {
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i)
    }
  } else {
    const startPage = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
    const endPage = Math.min(totalPages.value, startPage + maxVisible - 1)
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }
  }
  
  return pages
})

const sortBy = (key: string) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
  emit('sort', key, sortOrder.value)
}

// Reset to page 1 when data changes
watch(() => props.data, () => {
  currentPage.value = 1
})
</script>
