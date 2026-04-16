/**
 * Request ID Middleware
 * Generates and attaches a correlation ID to each request for observability
 */

import { getRandomValues } from 'crypto'

export default defineEventHandler((event) => {
  // Generate or get existing correlation ID from headers
  let correlationId = getRequestHeader(event, 'x-correlation-id') || getRequestHeader(event, 'x-request-id')
  
  if (!correlationId) {
    // Generate a random correlation ID
    const bytes = getRandomValues(new Uint8Array(8))
    correlationId = Array.from(bytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
  }

  // Attach to event context for use in handlers and logger
  event.context.correlationId = correlationId

  // Set response header for client-side tracking
  setResponseHeader(event, 'x-correlation-id', correlationId)
})
