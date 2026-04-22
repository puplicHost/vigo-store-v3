<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="font-serif italic text-3xl text-on-surface mb-2">Users</h1>
        <p class="text-on-surface-variant/70 text-sm font-body">Manage staff and customer accounts</p>
      </div>
      <button
        v-if="auth.user.value?.role === 'SUPER_ADMIN'"
        @click="showCreateModal = true"
        class="bg-primary text-white px-4 py-2.5 rounded-lg font-body text-sm hover:bg-primary/90 transition-colors flex items-center gap-2"
      >
        <span class="material-symbols-outlined text-sm">add</span>
        Add User
      </button>
    </div>

    <!-- Filters -->
    <div class="flex gap-4 mb-6">
      <div class="relative">
        <select
          v-model="roleFilter"
class="appearance-none bg-surface-container-lowest border border-outline-variant/20 rounded-lg py-2.5 pl-4 pr-10 text-sm font-body focus:outline-none focus:border-primary/50 cursor-pointer"
        >
          <option value="ALL">All Roles</option>
          <option value="USER">User</option>
          <option value="SALES">Sales</option>
          <option value="MANAGER">Manager</option>
          <option value="ADMIN">Admin</option>
          <option value="SUPER_ADMIN">Super Admin</option>
        </select>
        <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
      </div>
    </div>

    <!-- Table -->
    <AdminTable
      :columns="columns"
      :data="filteredUsers"
      :loading="pending"
      :show-pagination="true"
      :pageSize="10"
      empty-message="No users found."
      empty-icon="person"
    >
      <template #cell-name="{ row }">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center">
            <span class="material-symbols-outlined text-on-surface-variant">person</span>
          </div>
          <div>
            <div class="font-medium text-on-surface font-body">{{ row.name || 'No name' }}</div>
            <div class="text-xs text-on-surface-variant">{{ row.email }}</div>
          </div>
        </div>
      </template>

      <template #cell-role="{ row }">
        <span :class="[
          'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
          row.role === 'SUPER_ADMIN' ? 'bg-purple-100 text-purple-700 border border-purple-200' :
          row.role === 'ADMIN' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
          row.role === 'MANAGER' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
          row.role === 'SALES' ? 'bg-green-100 text-green-700 border border-green-200' :
          'bg-gray-100 text-gray-700 border border-gray-200'
        ]">
          <span class="w-1.5 h-1.5 rounded-full" :class="[
            row.role === 'SUPER_ADMIN' ? 'bg-purple-500' :
            row.role === 'ADMIN' ? 'bg-blue-500' :
            row.role === 'MANAGER' ? 'bg-amber-500' :
            row.role === 'SALES' ? 'bg-green-500' :
            'bg-gray-500'
          ]"></span>
          {{ row.role }}
        </span>
      </template>

      <template #cell-_count="{ row }">
        <span class="text-sm text-on-surface-variant font-body">{{ row._count?.orders || 0 }}</span>
      </template>

      <template #cell-createdAt="{ row }">
        <span class="text-sm text-on-surface-variant font-body">{{ row.createdAt ? new Date(row.createdAt).toLocaleDateString() : '-' }}</span>
      </template>

      <template #actions="{ row }">
        <div class="flex items-center justify-end gap-2">
          <button
            @click="editUser(row)"
            class="p-2 text-on-surface-variant hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
            title="Edit User"
          >
            <span class="material-symbols-outlined text-sm">edit</span>
          </button>
          <button
            v-if="auth.user.value?.role === 'SUPER_ADMIN'"
            @click="confirmDelete(row)"
            class="p-2 text-on-surface-variant hover:text-error hover:bg-error/5 rounded-lg transition-colors"
            title="Delete User"
          >
            <span class="material-symbols-outlined text-sm">delete</span>
          </button>
        </div>
      </template>
    </AdminTable>

    <!-- Create User Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-surface-container-lowest rounded-xl p-6 w-full max-w-md mx-4">
        <h2 class="text-xl font-serif italic text-on-surface mb-4">Add New User</h2>
        <form @submit.prevent="createUser">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-body text-on-surface-variant mb-1">Name</label>
              <input
                v-model="newUser.name"
                type="text"
                required
                class="w-full border border-outline-variant/20 rounded-lg px-4 py-2.5 text-sm font-body focus:outline-none focus:border-primary/50"
              />
            </div>
            <div>
              <label class="block text-sm font-body text-on-surface-variant mb-1">Email</label>
              <input
                v-model="newUser.email"
                type="email"
                required
                class="w-full border border-outline-variant/20 rounded-lg px-4 py-2.5 text-sm font-body focus:outline-none focus:border-primary/50"
              />
            </div>
            <div>
              <label class="block text-sm font-body text-on-surface-variant mb-1">Password</label>
              <input
                v-model="newUser.password"
                type="password"
                required
                class="w-full border border-outline-variant/20 rounded-lg px-4 py-2.5 text-sm font-body focus:outline-none focus:border-primary/50"
              />
            </div>
            <div>
              <label class="block text-sm font-body text-on-surface-variant mb-1">Role</label>
              <select
                v-model="newUser.role"
                required
                class="w-full border border-outline-variant/20 rounded-lg px-4 py-2.5 text-sm font-body focus:outline-none focus:border-primary/50"
              >
                <option value="USER">User</option>
                <option value="SALES">Sales</option>
                <option value="MANAGER">Manager</option>
                <option value="ADMIN">Admin</option>
                <option value="SUPER_ADMIN">Super Admin</option>
              </select>
            </div>
          </div>
          <div class="flex gap-3 mt-6">
            <button
              type="button"
              @click="showCreateModal = false"
              class="flex-1 px-4 py-2.5 border border-outline-variant/20 rounded-lg font-body text-sm hover:bg-surface-container-low transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="flex-1 px-4 py-2.5 bg-primary text-white rounded-lg font-body text-sm hover:bg-primary/90 transition-colors"
            >
              Create User
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Edit User Modal -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-surface-container-lowest rounded-xl p-6 w-full max-w-md mx-4">
        <h2 class="text-xl font-serif italic text-on-surface mb-4">Edit User</h2>
        <form @submit.prevent="updateUser">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-body text-on-surface-variant mb-1">Name</label>
              <input
                v-model="editingUser.name"
                type="text"
                class="w-full border border-outline-variant/20 rounded-lg px-4 py-2.5 text-sm font-body focus:outline-none focus:border-primary/50"
              />
            </div>
            <div>
              <label class="block text-sm font-body text-on-surface-variant mb-1">Email</label>
              <input
                v-model="editingUser.email"
                type="email"
                class="w-full border border-outline-variant/20 rounded-lg px-4 py-2.5 text-sm font-body focus:outline-none focus:border-primary/50"
              />
            </div>
            <div>
              <label class="block text-sm font-body text-on-surface-variant mb-1">New Password (optional)</label>
              <input
                v-model="editingUser.password"
                type="password"
                placeholder="Leave blank to keep current"
                class="w-full border border-outline-variant/20 rounded-lg px-4 py-2.5 text-sm font-body focus:outline-none focus:border-primary/50"
              />
            </div>
            <div v-if="auth.user.value?.role === 'SUPER_ADMIN'">
              <label class="block text-sm font-body text-on-surface-variant mb-1">Role</label>
              <select
                v-model="editingUser.role"
                class="w-full border border-outline-variant/20 rounded-lg px-4 py-2.5 text-sm font-body focus:outline-none focus:border-primary/50"
              >
                <option value="USER">User</option>
                <option value="SALES">Sales</option>
                <option value="MANAGER">Manager</option>
                <option value="ADMIN">Admin</option>
                <option value="SUPER_ADMIN">Super Admin</option>
              </select>
            </div>
          </div>
          <div class="flex gap-3 mt-6">
            <button
              type="button"
              @click="showEditModal = false"
              class="flex-1 px-4 py-2.5 border border-outline-variant/20 rounded-lg font-body text-sm hover:bg-surface-container-low transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="flex-1 px-4 py-2.5 bg-primary text-white rounded-lg font-body text-sm hover:bg-primary/90 transition-colors"
            >
              Update User
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 w-full max-w-sm mx-4">
        <h2 class="text-xl font-serif italic text-on-surface mb-2">Delete User</h2>
        <p class="text-on-surface-variant font-body mb-6">
          Are you sure you want to delete {{ userToDelete?.name || userToDelete?.email }}? This action cannot be undone.
        </p>
        <div class="flex gap-3">
          <button
            @click="showDeleteModal = false"
            class="flex-1 px-4 py-2.5 border border-outline-variant/20 rounded-lg font-body text-sm hover:bg-surface-container-low transition-colors"
          >
            Cancel
          </button>
          <button
            @click="deleteUser"
            class="flex-1 px-4 py-2.5 bg-error text-white rounded-lg font-body text-sm hover:bg-error/90 transition-colors"
          >
            Delete
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
  permission: 'VIEW_USERS'
})

const { data: usersResponse, pending, error, refresh: refreshUsers } = await useApiFetch('/api/admin/users', {
  default: () => []
})

const auth = useAuth()
const { searchQuery, filterUsers } = useSearch()
const roleFilter = ref('ALL')
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const userToDelete = ref<any>(null)
const { toast } = useNotifications()

const columns = [
  { key: 'name', label: 'User' },
  { key: 'role', label: 'Role' },
  { key: '_count', label: 'Orders' },
  { key: 'createdAt', label: 'Created' }
] as any[]

const newUser = ref({
  name: '',
  email: '',
  password: '',
  role: 'USER'
})

const editingUser = ref({
  id: '',
  name: '',
  email: '',
  password: '',
  role: 'USER'
})

const users = computed(() => Array.isArray(usersResponse.value) ? usersResponse.value : (usersResponse.value?.users || []))

const filteredUsers = computed(() => {
  if (!users.value || !Array.isArray(users.value)) return []

  let filtered = users.value

  // Apply role filter
  if (roleFilter.value !== 'ALL') {
    filtered = filtered.filter((u: any) => u.role === roleFilter.value)
  }

  // Apply search filter
  if (searchQuery.value) {
    filtered = filterUsers(filtered, searchQuery.value)
  }

  return filtered
})

const createUser = async () => {
  try {
    await $apiFetch('/api/admin/users', {
      method: 'POST',
      body: newUser.value
    })
    showCreateModal.value = false
    newUser.value = { name: '', email: '', password: '', role: 'USER' }
    await refreshUsers()
    toast.success('User created successfully')
  } catch (err: any) {
    toast.error(err.data?.statusMessage || 'Failed to create user')
  }
}

const editUser = (user: any) => {
  editingUser.value = {
    id: user.id,
    name: user.name || '',
    email: user.email,
    password: '',
    role: user.role
  }
  showEditModal.value = true
}

const updateUser = async () => {
  try {
    await $apiFetch(`/api/admin/users/${editingUser.value.id}`, {
      method: 'PATCH',
      body: {
        name: editingUser.value.name,
        email: editingUser.value.email,
        password: editingUser.value.password || undefined,
        role: editingUser.value.role
      }
    })
    showEditModal.value = false
    await refreshUsers()
    toast.success('User updated successfully')
  } catch (err: any) {
    toast.error(err.data?.statusMessage || 'Failed to update user')
  }
}

const confirmDelete = (user: any) => {
  userToDelete.value = user
  showDeleteModal.value = true
}

const deleteUser = async () => {
  if (!userToDelete.value) return
  try {
    await $apiFetch(`/api/admin/users/${userToDelete.value.id}`, {
      method: 'DELETE'
    })
    showDeleteModal.value = false
    userToDelete.value = null
    await refreshUsers()
    toast.success('User deleted successfully')
  } catch (err: any) {
    toast.error(err.data?.statusMessage || 'Failed to delete user')
  }
}
</script>
