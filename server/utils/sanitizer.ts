/**
 * Simple input sanitizer
 * Trims whitespace and escapes basic HTML tags to prevent simple XSS
 */
export const sanitize = (str: string): string => {
  if (typeof str !== 'string') return str
  return str.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

/**
 * Object keys sanitizer
 * Recursively sanitizes string properties of an object
 */
export const sanitizeObject = (obj: any): any => {
  if (!obj || typeof obj !== 'object') return obj
  
  const sanitized: any = Array.isArray(obj) ? [] : {}
  
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      sanitized[key] = sanitize(obj[key])
    } else if (typeof obj[key] === 'object') {
      sanitized[key] = sanitizeObject(obj[key])
    } else {
      sanitized[key] = obj[key]
    }
  }
  
  return sanitized
}
