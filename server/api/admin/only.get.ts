export default defineEventHandler(async (event) => {
  const user = event.context.user

  // Check if user is authenticated
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized - Please login'
    })
  }

  // Check if user has admin privileges
  const allowedRoles = ['ADMIN', 'SUPER_ADMIN']
  if (!allowedRoles.includes(user.role)) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden - Admin access required'
    })
  }

  // Success response for admin users
  return {
    success: true,
    message: 'Welcome, Boss!',
    user: {
      userId: user.userId,
      email: user.email,
      role: user.role
    }
  }
})
