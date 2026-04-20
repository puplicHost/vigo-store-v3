import prisma from '../utils/prisma'

let cachedSettings: any = null;
let lastCacheTime = 0;
const CACHE_TTL = 60000; // 60 seconds

export default defineEventHandler(async (event) => {
  const path = event.node.req.url || ''

  // Skip maintenance check for:
  // - Admin routes (SUPER_ADMIN should still have access)
  // - Auth routes (login/logout)
  // - Maintenance page itself
  // - API routes that don't require maintenance check
  if (
    path.startsWith('/admin') ||
    path.startsWith('/auth') ||
    path.startsWith('/maintenance') ||
    path.startsWith('/api/auth') ||
    path.startsWith('/api/admin')
  ) {
    return
  }

  try {
    // Get settings to check maintenance mode
    const now = Date.now();
    if (!cachedSettings || (now - lastCacheTime > CACHE_TTL)) {
      cachedSettings = await prisma.settings.findFirst();
      lastCacheTime = now;
    }
    
    const settings = cachedSettings;

    // If maintenance mode is enabled, redirect to maintenance page
    if (settings?.maintenanceMode) {
      throw createError({
        statusCode: 503,
        statusMessage: 'Service Unavailable',
        data: {
          maintenanceMode: true,
          maintenanceMessage: settings.maintenanceMessage || 'We are currently performing maintenance. Please check back soon.'
        }
      })
    }
  } catch (error: any) {
    // If it's a 503 error (maintenance mode), let it through
    if (error.statusCode === 503) {
      throw error
    }
    // For other errors (like DB connection issues), log but don't block
    console.error('[Maintenance Middleware Error]:', error)
  }
})
