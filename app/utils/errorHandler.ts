export function getErrorMessage(error: any): string {
  // Extract status code from various possible error structures
  const status = error?.statusCode || error?.status || error?.response?.status || error?.data?.statusCode

  // Handle network / completely unhandled errors
  if (!status && error?.name === 'FetchError') {
    return "فشل الاتصال بالخادم، يرجى التأكد من اتصالك بالإنترنت."
  }

  // If the backend sent a specific translated/custom message (e.g., from our Prisma handler), use it directly!
  // But we make sure it's not a generic raw Prisma message.
  const backendMessage = error?.data?.statusMessage || error?.statusMessage || error?.response?._data?.statusMessage
  if (backendMessage && !backendMessage.includes('Prisma') && !backendMessage.includes('Internal Server')) {
    return backendMessage
  }

  // Map known status codes to human-readable Arabic
  switch (status) {
    case 400:
      return "البيانات المدخلة غير صحيحة، يرجى مراجعة الحقول."
    case 401:
      return "يجب عليك تسجيل الدخول أولاً للمتابعة."
    case 403:
      return "عفواً، غير مسموح لك بتنفيذ هذا الإجراء."
    case 404:
      return "العنصر المطلوب غير موجود."
    case 422:
      return "تعذر معالجة الطلب، صيغة البيانات غير صحيحة."
    case 429:
      return "تم إرسال طلبات كثيرة جداً، يرجى المحاولة لاحقاً."
    case 500:
    case 502:
    case 503:
    case 504:
      return "عفواً، حدث خطأ ما في أنظمتنا. يرجى المحاولة مرة أخرى لاحقاً."
    default:
      return "عفواً، حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى لاحقاً."
  }
}
