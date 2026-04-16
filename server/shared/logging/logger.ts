/**
 * Structured Logger - Enterprise-grade logging
 * Provides consistent logging format across the application
 */

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error'
}

export interface LogContext {
  correlationId?: string
  userId?: string
  role?: string
  endpoint?: string
  method?: string
  [key: string]: unknown
}

export class Logger {
  private static context: LogContext = {}

  /**
   * Set global logging context (typically from middleware)
   */
  static setContext(context: LogContext) {
    this.context = { ...this.context, ...context }
  }

  /**
   * Clear logging context (typically after request ends)
   */
  static clearContext() {
    this.context = {}
  }

  /**
   * Format log entry with timestamp and context
   */
  private static format(level: LogLevel, message: string, extra?: Record<string, unknown>) {
    const timestamp = new Date().toISOString()
    const logData = {
      timestamp,
      level,
      message,
      ...this.context,
      ...extra
    }

    return JSON.stringify(logData)
  }

  /**
   * Log debug message (only in development)
   */
  static debug(message: string, extra?: Record<string, unknown>) {
    if (process.env.NODE_ENV === 'development') {
      console.debug(this.format(LogLevel.DEBUG, message, extra))
    }
  }

  /**
   * Log info message
   */
  static info(message: string, extra?: Record<string, unknown>) {
    console.log(this.format(LogLevel.INFO, message, extra))
  }

  /**
   * Log warning message
   */
  static warn(message: string, extra?: Record<string, unknown>) {
    console.warn(this.format(LogLevel.WARN, message, extra))
  }

  /**
   * Log error message
   */
  static error(message: string, extra?: Record<string, unknown>) {
    console.error(this.format(LogLevel.ERROR, message, extra))
  }

}
