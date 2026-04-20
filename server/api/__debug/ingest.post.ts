import { appendFile, mkdir } from 'node:fs/promises'
import { join } from 'node:path'

/**
 * Dev-only: append one NDJSON line for Cursor debug sessions (writes under .cursor/).
 */
export default defineEventHandler(async (event) => {
  if (process.env.NODE_ENV === 'production') {
    throw createError({ statusCode: 404, statusMessage: 'Not found' })
  }
  const payload = await readBody(event).catch(() => null)
  const line = `${JSON.stringify(payload && typeof payload === 'object' ? payload : { raw: payload })}\n`
  const dir = join(process.cwd(), '.cursor')
  await mkdir(dir, { recursive: true })
  await appendFile(join(dir, 'debug-ee6663.log'), line, 'utf8')
  return { ok: true }
})
