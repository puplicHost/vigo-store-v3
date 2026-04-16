/**
 * Error Mapper - Converts Domain Errors to HTTP responses
 * Ensures consistent error responses across all API endpoints
 */

import {
  DomainError,
  ValidationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  DatabaseError,
  UnexpectedError
} from '../../../shared/errors/domain-errors'

export interface ErrorResponse {
  statusCode: number
  statusMessage: string
  errorCode: string
  details?: Record<string, unknown>
}

export class ErrorMapper {
  /**
   * Maps a domain error to an HTTP error response
   */
  static toHttp(error: DomainError): ErrorResponse {
    const isDev = process.env.NODE_ENV === 'development'

    switch (error.constructor) {
      case ValidationError:
        return {
          statusCode: 400,
          statusMessage: error.message,
          errorCode: error.code,
          details: isDev ? error.details : undefined
        }

      case AuthorizationError:
        return {
          statusCode: 403,
          statusMessage: error.message,
          errorCode: error.code,
          details: isDev ? error.details : undefined
        }

      case NotFoundError:
        return {
          statusCode: 404,
          statusMessage: error.message,
          errorCode: error.code,
          details: isDev ? error.details : undefined
        }

      case ConflictError:
        return {
          statusCode: 409,
          statusMessage: error.message,
          errorCode: error.code,
          details: isDev ? error.details : undefined
        }

      case DatabaseError:
        return {
          statusCode: 500,
          statusMessage: 'Database operation failed',
          errorCode: error.code,
          details: isDev ? error.details : undefined
        }

      case UnexpectedError:
      default:
        return {
          statusCode: 500,
          statusMessage: 'An unexpected error occurred',
          errorCode: error.code,
          details: isDev ? error.details : undefined
        }
    }
  }

  /**
   * Wraps a function with error mapping
   * Use this in API handlers to automatically convert domain errors to HTTP errors
   */
  static async withErrorMapping<T>(
    fn: () => Promise<T>
  ): Promise<T> {
    try {
      return await fn()
    } catch (error) {
      if (error instanceof DomainError) {
        const httpError = this.toHttp(error)
        throw createError({
          statusCode: httpError.statusCode,
          statusMessage: httpError.statusMessage,
          data: {
            errorCode: httpError.errorCode,
            details: httpError.details
          }
        })
      }
      // Re-throw non-domain errors (they may be Nitro errors)
      throw error
    }
  }
}
