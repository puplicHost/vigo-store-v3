export function debugProjectLog(payload: {
  hypothesisId: string
  location: string
  message: string
  data?: Record<string, unknown>
}) {
  // Server rejects non-dev in ingest handler; avoid gating on import.meta.dev (can differ from Nitro NODE_ENV).
  if (!import.meta.client) return

  const csrfToken = useCookie('csrf_token')
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (csrfToken.value) {
    headers['x-csrf-token'] = csrfToken.value
  }

  fetch('/api/__debug/ingest', {
    method: 'POST',
    headers,
    credentials: 'include',
    body: JSON.stringify({
      sessionId: 'ee6663',
      ...payload,
      timestamp: Date.now()
    })
  }).catch(() => {})
}
