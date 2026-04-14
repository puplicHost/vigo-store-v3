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
          class="appearance-none bg-white border border-outline-variant/20 rounded-lg py-2.5 pl-4 pr-10 text-sm font-body focus:outline-none focus:border-primary/50 cursor-pointer"
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
    <div class="bg-white rounded-xl border border-outline-variant/10 shadow-sm shadow-primary/5 overflow-hidden">
      <table class="w-full">
        <thead class="bg-surface-container-low border-b border-outline-variant/10">
          <tr>
            <th class="text-left px-6 py-4 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">User</th>
            <th class="text-left px-6 py-4 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Role</th>
            <th class="text-left px-6 py-4 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Orders</th>
            <th class="text-left px-6 py-4 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Created</th>
            <th class="text-right px-6 py-4 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Actions</th>
          </tr>
        </thead>
        <ClientOnly>
          <template #fallback>
            <tbody class="divide-y divide-outline-variant/10">
              <tr class="hover:bg-surface-container-low/50 transition-colors">
                <td colspan="5" class="px-6 py-12 text-center">
                  <span class="text-on-surface-variant font-body">Loading...</span>
                </td>
              </tr>
            </tbody>
          </template>
          <tbody class="divide-y divide-outline-variant/10">
            <tr v-if="pending" class="hover:bg-surface-container-low/50 transition-colors">
              <td colspan="5" class="px-6 py-12 text-center text-on-surface-variant">
                <span class="material-symbols-outlined text-3xl animate-spin">progress_activity</span>
              </td>
            </tr>
            <tr v-else-if="error" class="hover:bg-surface-container-low/50 transition-colors">
              <td colspan="5" class="px-6 py-12 text-center">
                <span class="text-error font-body">Failed to load users</span>
              </td>
            </tr>
            <tr v-else-if="!filteredUsers?.length" class="hover:bg-surface-container-low/50 transition-colors">
              <td colspan="5" class="px-6 py-12 text-center">
                <span class="text-on-surface-variant font-body">No users found.</span>
              </td>
            </tr>
            <tr
              v-for="(user, index) in filteredUsers"
              :key="user.id || index"
              class="hover:bg-surface-container-low/50 transition-colors"
            >
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center">
                    <span class="material-symbols-outlined text-on-surface-variant">person</span>
                  </div>
                  <div>
                    <div class="font-medium text-on-surface font-body">{{ user.name || 'No name' }}</div>
                    <div class="text-xs text-on-surface-variant">{{ user.email }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <span :class="[
                  'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
                  user.role === 'SUPER_ADMIN' ? 'bg-purple-100 text-purple-700 border border-purple-200' :
                  user.role === 'ADMIN' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                  user.role === 'MANAGER' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                  user.role === 'SALES' ? 'bg-green-100 text-green-700 border border-green-200' :
                  'bg-gray-100 text-gray-700 border border-gray-200'
                ]">
                  <span class="w-1.5 h-1.5 rounded-full" :class="[
                    user.role === 'SUPER_ADMIN' ? 'bg-purple-500' :
                    user.role === 'ADMIN' ? 'bg-blue-500' :
                    user.role === 'MANAGER' ? 'bg-amber-500' :
                    user.role === 'SALES' ? 'bg-green-500' :
                    'bg-gray-500'
                  ]"></span>
                  {{ user.role }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-on-surface-variant font-body">
                {{ user._count?.orders || 0 }}
              </td>
              <td class="px-6 py-4 text-sm text-on-surface-variant font-body">
                {{ user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-' }}
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center justify-end gap-2">
                  <button
                    @click="editUser(user)"
                    class="p-2 text-on-surface-variant hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                    title="Edit User"
                  >
                    <span class="material-symbols-outlined text-sm">edit</span>
                  </button>
                  <button
                    v-if="auth.user.value?.role === 'SUPER_ADMIN'"
                    @click="confirmDelete(user)"
                    class="p-2 text-on-surface-variant hover:text-error hover:bg-error/5 rounded-lg transition-colors"
                    title="Delete User"
                  >
                    <span class="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </ClientOnly>
      </table>
    </div>

    <!-- Create User Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 w-full max-w-md mx-4">
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
      <div class="bg-white rounded-xl p-6 w-full max-w-md mx-4">
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

<script setup>
definePageMeta({
  layout: 'admin'
})

const auth = useAuth()
const roleFilter = ref('ALL')
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const userToDelete = ref(null)

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

const { data: users, pending, error, refresh } = await useApiFetch('/api/admin/users', {
  default: () => []
})

const filteredUsers = computed(() => {
  if (!users.value || !Array.isArray(users.value)) return []
  if (roleFilter.value === 'ALL') return users.value
  return users.value.filter(u => u.role === roleFilter.value)
})

const createUser = async () => {
  try {
    await $fetch('/api/admin/users', {
      method: 'POST',
      body: newUser.value
    })
    showCreateModal.value = false
    newUser.value = { name: '', email: '', password: '', role: 'USER' }
    refresh()
  } catch (err) {
    alert('Failed to create user')
  }
}

const editUser = (user) => {
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
    await $fetch(`/api/admin/users/${editingUser.value.id}`, {
      method: 'PATCH',
      body: {
        name: editingUser.value.name,
        email: editingUser.value.email,
        password: editingUser.value.password || undefined,
        role: editingUser.value.role
      }
    })
    showEditModal.value = false
    refresh()
  } catch (err) {
    alert('Failed to update user')
  }
}

const confirmDelete = (user) => {
  userToDelete.value = user
  showDeleteModal.value = true
}

const deleteUser = async () => {
  try {
    await $fetch(`/api/admin/users/${userToDelete.value.id}`, {
      method: 'DELETE'
    })
    showDeleteModal.value = false
    userToDelete.value = null
    refresh()
  } catch (err) {
    alert('Failed to delete user')
  }
}
</script>
