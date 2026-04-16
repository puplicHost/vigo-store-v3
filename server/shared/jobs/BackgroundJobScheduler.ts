/**
 * Background Job Scheduler
 * Handles scheduled and background tasks for the application
 * Uses in-memory queue for development, ready for BullMQ/Redis in production
 */

export interface Job {
  id: string
  type: string
  data: Record<string, unknown>
  scheduledAt?: Date
  attempts: number
  maxAttempts: number
  priority?: 'high' | 'normal' | 'low'
}

export interface JobHandler {
  type: string
  handler: (job: Job) => Promise<void>
}

export class BackgroundJobScheduler {
  private queue: Map<string, Job> = new Map()
  private handlers: Map<string, JobHandler> = new Map()
  private processing = false
  private intervalId: NodeJS.Timeout | null = null

  /**
   * Register a job handler
   */
  registerHandler(handler: JobHandler): void {
    this.handlers.set(handler.type, handler)
  }

  /**
   * Add a job to the queue
   */
  async addJob(job: Omit<Job, 'id' | 'attempts'>): Promise<string> {
    const jobId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const fullJob: Job = {
      ...job,
      id: jobId,
      attempts: 0,
      maxAttempts: job.maxAttempts || 3
    }

    this.queue.set(jobId, fullJob)
    return jobId
  }

  /**
   * Add a scheduled job
   */
  async scheduleJob(job: Omit<Job, 'id' | 'attempts'>, delayMs: number): Promise<string> {
    const jobId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const fullJob: Job = {
      ...job,
      id: jobId,
      attempts: 0,
      maxAttempts: job.maxAttempts || 3,
      scheduledAt: new Date(Date.now() + delayMs)
    }

    this.queue.set(jobId, fullJob)
    return jobId
  }

  /**
   * Start processing jobs
   */
  start(): void {
    if (this.processing) return

    this.processing = true
    this.intervalId = setInterval(() => {
      this.processQueue()
    }, 1000) // Process every second
  }

  /**
   * Stop processing jobs
   */
  stop(): void {
    this.processing = false
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
  }

  /**
   * Process the job queue
   */
  private async processQueue(): Promise<void> {
    if (!this.processing) return

    const now = Date.now()
    const readyJobs: Array<{ id: string; job: Job }> = []

    // Find ready jobs
    for (const [id, job] of this.queue.entries()) {
      const isReady = !job.scheduledAt || job.scheduledAt.getTime() <= now
      
      // Sort by priority
      if (isReady) {
        readyJobs.push({ id, job })
      }
    }

    // Sort by priority (high > normal > low)
    readyJobs.sort((a, b) => {
      const priorityOrder = { high: 3, normal: 2, low: 1 }
      const priorityA = priorityOrder[a.job.priority || 'normal']
      const priorityB = priorityOrder[b.job.priority || 'normal']
      return priorityB - priorityA
    })

    // Process ready jobs
    for (const { id, job } of readyJobs) {
      await this.processJob(id, job)
    }
  }

  /**
   * Process a single job
   */
  private async processJob(id: string, job: Job): Promise<void> {
    const handler = this.handlers.get(job.type)

    if (!handler) {
      console.error(`[Job Scheduler] No handler found for job type: ${job.type}`)
      this.queue.delete(id)
      return
    }

    try {
      await handler.handler(job)
      this.queue.delete(id)
      console.log(`[Job Scheduler] Job completed: ${job.type} (${id})`)
    } catch (error: any) {
      job.attempts++

      if (job.attempts >= job.maxAttempts) {
        console.error(`[Job Scheduler] Job failed after ${job.maxAttempts} attempts: ${job.type} (${id})`, error)
        this.queue.delete(id)
      } else {
        console.error(`[Job Scheduler] Job attempt ${job.attempts} failed, retrying: ${job.type} (${id})`, error)
        // Keep in queue for retry
      }
    }
  }

  /**
   * Get queue status
   */
  getQueueStatus(): {
    total: number
    byType: Record<string, number>
    byPriority: Record<string, number>
  } {
    const byType: Record<string, number> = {}
    const byPriority: Record<string, number> = { high: 0, normal: 0, low: 0 }

    for (const job of this.queue.values()) {
      byType[job.type] = (byType[job.type] || 0) + 1
      const priority = job.priority || 'normal'
      byPriority[priority] = (byPriority[priority] || 0) + 1
    }

    return {
      total: this.queue.size,
      byType,
      byPriority
    }
  }

  /**
   * Clear all jobs
   */
  clear(): void {
    this.queue.clear()
  }
}

// Singleton instance
export const backgroundJobScheduler = new BackgroundJobScheduler()

// Start the scheduler in production
if (process.env.NODE_ENV === 'production') {
  backgroundJobScheduler.start()
}
