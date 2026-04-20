/**
 * Global API Error Handler
 * Standardizes error responses across all Nitro API routes
 * intercepts Prisma errors gracefully.
 */
export const handleError = (error: any) => {
  console.error('[API ERROR on SERVER]', error)

  const isDev = process.env.NODE_ENV === 'development'
  
  // 1. Prisma Global Interception
  // Prisma errors usually have a "code" property starting with P (e.g. P2002, P2003, P2025)
  if (error?.code?.startsWith('P2')) {
    let message = "حدث خطأ في قاعدة البيانات، يرجى المحاولة لاحقاً."
    let statusCode = 400

    switch (error.code) {
      case 'P2002':
        // Unique constraint failed
        message = "هذه البيانات مسجلة بالفعل بحساب آخر."
        break;
      case 'P2003':
        // Foreign key constraint failed
        message = "بعض البيانات المرتبطة غير موجودة أو تم حذفها مؤخراً."
        break;
      case 'P2025':
        // Record not found
        statusCode = 404
        message = "السجل المطلوب غير موجود في قاعدة البيانات."
        break;
    }

    return createError({
      statusCode,
      statusMessage: message
    })
  }

  // 2. Existing Nuxt errors (created via createError)
  if (error.statusCode) {
    // If it's already an error containing our statusMessage mapped inside a route logic
    return error
  }

  // 3. Fallback standard Nuxt error
  return createError({
    statusCode: 500,
    statusMessage: "حدث خطأ غير متوقع في الخادم.",
    data: isDev ? { stack: error.stack } : undefined
  })
}
