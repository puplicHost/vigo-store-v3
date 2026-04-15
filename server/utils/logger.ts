export const logger = {
  info: (msg: string, data?: any) => {
    if (process.env.NODE_ENV !== 'production') {
      console.info(msg, data)
    }
  },
  error: (msg: string, err?: any) => {
    console.error(msg, err)
  },
  warn: (msg: string, data?: any) => {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(msg, data)
    }
  },
  audit: (userId: string, action: string, target?: string, metadata?: any) => {
    console.log('[AUDIT]', {
      userId,
      action,
      target,
      metadata,
      timestamp: new Date().toISOString()
    })
  }
}
