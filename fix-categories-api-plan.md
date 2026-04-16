# Fix Categories API Plan

## Problem
The `/api/admin/categories` endpoint returns 500 error with "Failed to fetch categories".

## Root Cause Analysis
1. **Auth middleware not running**: The `auth` middleware is not registered in `nuxt.config.ts` route rules
2. **User context missing**: Since auth middleware doesn't run, `event.context.user` is always `null`
3. **requireAdmin fails**: When `requireAdmin(event)` is called, it throws an error because user is null
4. **Error caught and re-thrown**: The error is caught in the try-catch and re-thrown as 500

## Solution Steps

### Step 1: Add auth middleware to nuxt.config.ts
Add `auth` to the middleware list in route rules:
```typescript
routeRules: {
  '/api/**': {
    middleware: ['request-id', 'auth', 'rate-limit'],
    cors: true
  }
}
```

### Step 2: Adjust rate limiting for development
The rate limiting is too aggressive for development. Options:
- Increase limits significantly for development
- Skip rate limiting for admin endpoints
- Keep current but ensure user is authenticated first

### Step 3: Verify auth middleware is working
- Check that JWT_SECRET is set in environment
- Verify token is being sent from client
- Ensure token verification works correctly

### Step 4: Test the fix
- Restart the dev server
- Login to admin panel
- Navigate to categories page
- Verify categories load successfully

## Additional Considerations
- The i18n missing keys (`dashboard.orders.*`) are a separate issue
- Those need to be added to `locales/en.json`
