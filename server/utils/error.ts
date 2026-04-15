/**
 * Global API Error Handler
 * Standardizes error responses across all Nitro API routes
 */
export const handleError = (error: any) => {
  // Always log full error on server
  console.error('[API ERROR]', error)

  const isDev = process.env.NODE_ENV === 'development'

  // If it's already a Nuxt error (with statusCode), just return it
  if (error.statusCode) {
    return error
  }

  // Create a standardized Nuxt error
  return createError({
    statusCode: error.statusCode || 500,
    statusMessage: isDev
      ? error.message || 'Internal Server Error'
      : 'Internal Server Error',
    data: isDev ? { stack: error.stack } : undefined
  })
}
