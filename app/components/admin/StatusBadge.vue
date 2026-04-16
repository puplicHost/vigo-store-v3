<template>
  <span :class="['inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border', badgeClass]">
    <span v-if="showIcon" :class="['material-symbols-outlined text-sm', iconClass]">{{ iconName }}</span>
    <span v-if="showDot" :class="['w-1.5 h-1.5 rounded-full', dotClass]"></span>
    <slot>{{ statusLabel }}</slot>
  </span>
</template>

<script setup lang="ts">
const props = defineProps<{
  status?: string
  type?: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled' | 'stock' | 'featured' | 'admin' | 'super_admin' | 'manager' | 'sales' | 'user'
  showDot?: boolean
  showIcon?: boolean
}>()

const badgeClass = computed(() => {
  const s = props.type || props.status?.toLowerCase()
  switch (s) {
    case 'pending': return 'bg-amber-500/10 text-amber-600 border-amber-500/20'
    case 'paid': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
    case 'shipped': return 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20'
    case 'delivered': return 'bg-blue-500/10 text-blue-600 border-blue-500/20'
    case 'cancelled': return 'bg-red-500/10 text-red-600 border-red-500/20'
    case 'stock': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
    case 'featured': return 'bg-primary/10 text-primary border-primary/20'
    case 'super_admin': return 'bg-purple-500/10 text-purple-600 border-purple-500/20'
    case 'admin': return 'bg-blue-500/10 text-blue-600 border-blue-500/20'
    case 'manager': return 'bg-amber-500/10 text-amber-600 border-amber-500/20'
    case 'sales': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
    case 'user': return 'bg-surface-container-low text-on-surface-variant border-outline-variant/20'
    default: return 'bg-surface-container-low text-on-surface-variant border-outline-variant/20'
  }
})

const dotClass = computed(() => {
  const s = props.type || props.status?.toLowerCase()
  switch (s) {
    case 'pending': return 'bg-amber-500'
    case 'paid': return 'bg-emerald-500'
    case 'shipped': return 'bg-indigo-500'
    case 'delivered': return 'bg-blue-500'
    case 'cancelled': return 'bg-red-500'
    case 'stock': return 'bg-emerald-500'
    case 'featured': return 'bg-primary'
    case 'super_admin': return 'bg-purple-500'
    case 'admin': return 'bg-blue-500'
    case 'manager': return 'bg-amber-500'
    case 'sales': return 'bg-emerald-500'
    case 'user': return 'bg-on-surface-variant'
    default: return 'bg-on-surface-variant'
  }
})

const iconClass = computed(() => {
  const s = props.type || props.status?.toLowerCase()
  switch (s) {
    case 'pending': return 'text-amber-500'
    case 'paid': return 'text-emerald-500'
    case 'shipped': return 'text-indigo-500'
    case 'delivered': return 'text-blue-500'
    case 'cancelled': return 'text-red-500'
    case 'stock': return 'text-emerald-500'
    case 'featured': return 'text-primary'
    case 'super_admin': return 'text-purple-500'
    case 'admin': return 'text-blue-500'
    case 'manager': return 'text-amber-500'
    case 'sales': return 'text-emerald-500'
    case 'user': return 'text-on-surface-variant'
    default: return 'text-on-surface-variant'
  }
})

const iconName = computed(() => {
  const s = props.type || props.status?.toLowerCase()
  switch (s) {
    case 'pending': return 'schedule'
    case 'paid': return 'check_circle'
    case 'shipped': return 'local_shipping'
    case 'delivered': return 'delivery_dining'
    case 'cancelled': return 'cancel'
    case 'stock': return 'inventory'
    case 'featured': return 'star'
    case 'super_admin': return 'verified'
    case 'admin': return 'admin_panel_settings'
    case 'manager': return 'supervisor_account'
    case 'sales': return 'trending_up'
    case 'user': return 'person'
    default: return 'help'
  }
})

const statusLabel = computed(() => {
  return props.status || 'Unknown'
})
</script>
