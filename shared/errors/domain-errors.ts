/**
 * Domain Errors - Enterprise-grade error handling
 * All domain errors should extend this base class or use these predefined error types
 */

export class DomainError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly details?: Record<string, unknown>
  ) {
    super(message)
    this.name = 'DomainError'
  }
}

export class ValidationError extends DomainError {
  constructor(message: string, details?: Record<string, unknown>) {
    super('VALIDATION_ERROR', message, details)
    this.name = 'ValidationError'
  }
}

export class AuthorizationError extends DomainError {
  constructor(message: string, details?: Record<string, unknown>) {
    super('AUTHORIZATION_ERROR', message, details)
    this.name = 'AuthorizationError'
  }
}

export class NotFoundError extends DomainError {
  constructor(resource: string, identifier?: string) {
    const message = identifier 
      ? `${resource} with identifier '${identifier}' not found`
      : `${resource} not found`
    super('NOT_FOUND', message, { resource, identifier })
    this.name = 'NotFoundError'
  }
}

export class ConflictError extends DomainError {
  constructor(message: string, details?: Record<string, unknown>) {
    super('CONFLICT_ERROR', message, details)
    this.name = 'ConflictError'
  }
}

export class DatabaseError extends DomainError {
  constructor(message: string, details?: Record<string, unknown>) {
    super('DATABASE_ERROR', message, details)
    this.name = 'DatabaseError'
  }
}

export class UnexpectedError extends DomainError {
  constructor(message: string, details?: Record<string, unknown>) {
    super('UNEXPECTED_ERROR', message, details)
    this.name = 'UnexpectedError'
  }
}
