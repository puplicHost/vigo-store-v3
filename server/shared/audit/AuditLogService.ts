/**
 * Audit Log Service
 * Tracks all admin mutations for security and compliance
 */

import prisma from '../../utils/prisma'
import { Logger } from '../logging/logger'

export interface AuditLogEntry {
  userId: string
  userRole: string
  action: string
  resource: string
  resourceId?: string
  changes?: Record<string, { from: unknown; to: unknown }>
  metadata?: Record<string, unknown>
  ipAddress?: string
  userAgent?: string
  correlationId?: string
}

export class AuditLogService {
  /**
   * Log an audit entry
   */
  async log(entry: AuditLogEntry): Promise<void> {
    try {
      // Log to database (if AuditLog model exists)
      // For now, log to console with structured format
      Logger.info('[AUDIT]', {
        userId: entry.userId,
        userRole: entry.userRole,
        action: entry.action,
        resource: entry.resource,
        resourceId: entry.resourceId,
        changes: entry.changes,
        metadata: entry.metadata,
        ipAddress: entry.ipAddress,
        userAgent: entry.userAgent,
        correlationId: entry.correlationId,
        timestamp: new Date().toISOString()
      })

      // TODO: Store in database when AuditLog model is added to schema
      // await prisma.auditLog.create({ data: entry })
    } catch (error: any) {
      // Log errors but don't fail the operation
      Logger.error('[Audit Log Error]', error)
    }
  }

  /**
   * Log a create action
   */
  async logCreate(params: {
    userId: string
    userRole: string
    resource: string
    resourceId: string
    data: Record<string, unknown>
    event?: any
  }): Promise<void> {
    const ipAddress = this.getIpAddress(params.event)
    const userAgent = this.getUserAgent(params.event)
    const correlationId = params.event?.context?.correlationId

    await this.log({
      userId: params.userId,
      userRole: params.userRole,
      action: 'CREATE',
      resource: params.resource,
      resourceId: params.resourceId,
      changes: {
        created: { from: null, to: params.data }
      },
      metadata: { data: params.data },
      ipAddress,
      userAgent,
      correlationId
    })
  }

  /**
   * Log an update action
   */
  async logUpdate(params: {
    userId: string
    userRole: string
    resource: string
    resourceId: string
    changes: Record<string, { from: unknown; to: unknown }>
    event?: any
  }): Promise<void> {
    const ipAddress = this.getIpAddress(params.event)
    const userAgent = this.getUserAgent(params.event)
    const correlationId = params.event?.context?.correlationId

    await this.log({
      userId: params.userId,
      userRole: params.userRole,
      action: 'UPDATE',
      resource: params.resource,
      resourceId: params.resourceId,
      changes: params.changes,
      ipAddress,
      userAgent,
      correlationId
    })
  }

  /**
   * Log a delete action
   */
  async logDelete(params: {
    userId: string
    userRole: string
    resource: string
    resourceId: string
    deletedData: Record<string, unknown>
    event?: any
  }): Promise<void> {
    const ipAddress = this.getIpAddress(params.event)
    const userAgent = this.getUserAgent(params.event)
    const correlationId = params.event?.context?.correlationId

    await this.log({
      userId: params.userId,
      userRole: params.userRole,
      action: 'DELETE',
      resource: params.resource,
      resourceId: params.resourceId,
      changes: {
        deleted: { from: params.deletedData, to: null }
      },
      metadata: { deletedData: params.deletedData },
      ipAddress,
      userAgent,
      correlationId
    })
  }

  /**
   * Log a status change action
   */
  async logStatusChange(params: {
    userId: string
    userRole: string
    resource: string
    resourceId: string
    fromStatus: string
    toStatus: string
    event?: any
  }): Promise<void> {
    const ipAddress = this.getIpAddress(params.event)
    const userAgent = this.getUserAgent(params.event)
    const correlationId = params.event?.context?.correlationId

    await this.log({
      userId: params.userId,
      userRole: params.userRole,
      action: 'STATUS_CHANGE',
      resource: params.resource,
      resourceId: params.resourceId,
      changes: {
        status: { from: params.fromStatus, to: params.toStatus }
      },
      ipAddress,
      userAgent,
      correlationId
    })
  }

  /**
   * Extract IP address from event
   */
  private getIpAddress(event: any): string | undefined {
    try {
      return getRequestHeader(event, 'x-forwarded-for') || 
             getRequestHeader(event, 'x-real-ip') || 
             event.node?.req?.socket?.remoteAddress
    } catch {
      return undefined
    }
  }

  /**
   * Extract user agent from event
   */
  private getUserAgent(event: any): string | undefined {
    try {
      return getRequestHeader(event, 'user-agent')
    } catch {
      return undefined
    }
  }
}

// Singleton instance
export const auditLogService = new AuditLogService()
