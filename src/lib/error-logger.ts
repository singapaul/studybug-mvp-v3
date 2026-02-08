/**
 * Error logging utility for tracking errors and warnings
 * Currently uses console, can be extended to send to analytics services later
 */

import { AppError, ErrorCode } from './error-handling';

export enum LogLevel {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL',
}

interface LogContext {
  userId?: string;
  userRole?: string;
  sessionId?: string;
  page?: string;
  action?: string;
  [key: string]: any;
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  error?: any;
  context?: LogContext;
  stack?: string;
}

/**
 * Format log entry for console output
 */
function formatLogEntry(entry: LogEntry): string {
  const { timestamp, level, message, context, error } = entry;

  let output = `[${timestamp}] ${level}: ${message}`;

  if (context) {
    output += `\n  Context: ${JSON.stringify(context, null, 2)}`;
  }

  if (error) {
    output += `\n  Error: ${error.message || error}`;
    if (error.stack) {
      output += `\n  Stack: ${error.stack}`;
    }
  }

  return output;
}

/**
 * Get current timestamp in ISO format
 */
function getTimestamp(): string {
  return new Date().toISOString();
}

/**
 * Get context from current session (if available)
 */
function getSessionContext(): LogContext {
  const context: LogContext = {
    page: window.location.pathname,
    sessionId: sessionStorage.getItem('sessionId') || undefined,
  };

  // Try to get user info from session storage
  try {
    const sessionData = sessionStorage.getItem('auth_session');
    if (sessionData) {
      const session = JSON.parse(sessionData);
      context.userId = session.user?.id;
      context.userRole = session.user?.role;
    }
  } catch (error) {
    // Ignore errors getting session data
  }

  return context;
}

/**
 * Core logging function
 */
function log(level: LogLevel, message: string, error?: any, additionalContext?: LogContext): void {
  const entry: LogEntry = {
    timestamp: getTimestamp(),
    level,
    message,
    error: error ? { message: error.message, code: error.code, ...error } : undefined,
    context: {
      ...getSessionContext(),
      ...additionalContext,
    },
    stack: error?.stack,
  };

  // Console output with appropriate styling
  switch (level) {
    case LogLevel.INFO:
      console.info(formatLogEntry(entry));
      break;
    case LogLevel.WARNING:
      console.warn(formatLogEntry(entry));
      break;
    case LogLevel.ERROR:
    case LogLevel.CRITICAL:
      console.error(formatLogEntry(entry));
      break;
  }

  // Store in localStorage for debugging (keep last 100 entries)
  try {
    const logs = JSON.parse(localStorage.getItem('app_logs') || '[]');
    logs.push(entry);

    // Keep only last 100 logs
    if (logs.length > 100) {
      logs.shift();
    }

    localStorage.setItem('app_logs', JSON.stringify(logs));
  } catch (error) {
    // Ignore localStorage errors
  }

  // TODO: Send to analytics service (e.g., Sentry, LogRocket, etc.)
  // if (level === LogLevel.ERROR || level === LogLevel.CRITICAL) {
  //   sendToAnalytics(entry);
  // }
}

/**
 * Log informational message
 */
export function logInfo(message: string, context?: LogContext): void {
  log(LogLevel.INFO, message, undefined, context);
}

/**
 * Log warning message
 */
export function logWarning(message: string, error?: any, context?: LogContext): void {
  log(LogLevel.WARNING, message, error, context);
}

/**
 * Log error message
 */
export function logError(message: string, error?: any, context?: LogContext): void {
  log(LogLevel.ERROR, message, error, context);
}

/**
 * Log critical error message
 */
export function logCritical(message: string, error?: any, context?: LogContext): void {
  log(LogLevel.CRITICAL, message, error, context);
}

/**
 * Log application error (AppError type)
 */
export function logAppError(appError: AppError, context?: LogContext): void {
  const level =
    appError.code === ErrorCode.INTERNAL_ERROR || appError.code === ErrorCode.DATABASE_ERROR
      ? LogLevel.CRITICAL
      : LogLevel.ERROR;

  log(
    level,
    appError.message,
    {
      code: appError.code,
      details: appError.details,
      statusCode: appError.statusCode,
      field: appError.field,
    },
    context
  );
}

/**
 * Clear all stored logs
 */
export function clearLogs(): void {
  try {
    localStorage.removeItem('app_logs');
    console.info('[Logger] All logs cleared');
  } catch (error) {
    console.error('[Logger] Failed to clear logs:', error);
  }
}

/**
 * Get all stored logs
 */
export function getLogs(): LogEntry[] {
  try {
    return JSON.parse(localStorage.getItem('app_logs') || '[]');
  } catch (error) {
    console.error('[Logger] Failed to get logs:', error);
    return [];
  }
}

/**
 * Export logs as JSON file (for debugging)
 */
export function exportLogs(): void {
  try {
    const logs = getLogs();
    const blob = new Blob([JSON.stringify(logs, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `app-logs-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    console.info('[Logger] Logs exported successfully');
  } catch (error) {
    console.error('[Logger] Failed to export logs:', error);
  }
}

/**
 * Track user action (for analytics)
 */
export function trackAction(action: string, details?: Record<string, any>): void {
  logInfo(`Action: ${action}`, {
    action,
    ...details,
  });

  // TODO: Send to analytics service
  // analytics.track(action, details);
}

/**
 * Track page view
 */
export function trackPageView(pageName: string): void {
  logInfo(`Page view: ${pageName}`, {
    action: 'page_view',
    page: pageName,
  });

  // TODO: Send to analytics service
  // analytics.page(pageName);
}

/**
 * Performance monitoring helper
 */
export function measurePerformance<T>(
  operationName: string,
  operation: () => T | Promise<T>
): T | Promise<T> {
  const startTime = performance.now();

  try {
    const result = operation();

    // Handle async operations
    if (result instanceof Promise) {
      return result
        .then((value) => {
          const duration = performance.now() - startTime;
          logInfo(`Performance: ${operationName}`, {
            action: 'performance',
            operation: operationName,
            duration: `${duration.toFixed(2)}ms`,
          });
          return value;
        })
        .catch((error) => {
          const duration = performance.now() - startTime;
          logError(`Performance (failed): ${operationName}`, error, {
            action: 'performance',
            operation: operationName,
            duration: `${duration.toFixed(2)}ms`,
          });
          throw error;
        });
    }

    // Handle sync operations
    const duration = performance.now() - startTime;
    logInfo(`Performance: ${operationName}`, {
      action: 'performance',
      operation: operationName,
      duration: `${duration.toFixed(2)}ms`,
    });

    return result;
  } catch (error) {
    const duration = performance.now() - startTime;
    logError(`Performance (failed): ${operationName}`, error, {
      action: 'performance',
      operation: operationName,
      duration: `${duration.toFixed(2)}ms`,
    });
    throw error;
  }
}
