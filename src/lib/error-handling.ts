/**
 * Error handling utilities for consistent error responses throughout the app
 */

export enum ErrorCode {
  // Validation errors
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',

  // Not found errors
  NOT_FOUND = 'NOT_FOUND',
  GAME_NOT_FOUND = 'GAME_NOT_FOUND',
  GROUP_NOT_FOUND = 'GROUP_NOT_FOUND',
  ASSIGNMENT_NOT_FOUND = 'ASSIGNMENT_NOT_FOUND',
  STUDENT_NOT_FOUND = 'STUDENT_NOT_FOUND',

  // Duplicate/Conflict errors
  DUPLICATE_ENTRY = 'DUPLICATE_ENTRY',
  ALREADY_EXISTS = 'ALREADY_EXISTS',
  ALREADY_JOINED = 'ALREADY_JOINED',
  DUPLICATE_JOIN_CODE = 'DUPLICATE_JOIN_CODE',

  // Foreign key/Reference errors
  FOREIGN_KEY_VIOLATION = 'FOREIGN_KEY_VIOLATION',
  CANNOT_DELETE_ASSIGNED_GAME = 'CANNOT_DELETE_ASSIGNED_GAME',
  CANNOT_DELETE_GROUP_WITH_MEMBERS = 'CANNOT_DELETE_GROUP_WITH_MEMBERS',

  // Permission errors
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_OWNER = 'NOT_OWNER',

  // Network errors
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT = 'TIMEOUT',

  // Server errors
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',

  // Unknown
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export interface AppError {
  code: ErrorCode;
  message: string;
  details?: string;
  statusCode?: number;
  field?: string; // For field-specific validation errors
}

/**
 * Create a standardized error response
 */
export function createErrorResponse(
  code: ErrorCode,
  message: string,
  details?: string,
  statusCode: number = 400,
  field?: string
): AppError {
  return {
    code,
    message,
    details,
    statusCode,
    field,
  };
}

/**
 * Check if an error is a network error
 */
export function isNetworkError(error: any): boolean {
  return (
    error instanceof TypeError &&
    (error.message === 'Failed to fetch' ||
      error.message === 'Network request failed' ||
      error.message.includes('network'))
  );
}

/**
 * Check if an error is a timeout error
 */
export function isTimeoutError(error: any): boolean {
  return (
    error.name === 'AbortError' || error.message?.includes('timeout') || error.code === 'ETIMEDOUT'
  );
}

/**
 * Transform Prisma errors to user-friendly messages
 * Prisma error codes: https://www.prisma.io/docs/reference/api-reference/error-reference
 */
export function handlePrismaError(error: any): AppError {
  // Unique constraint violation (e.g., duplicate join code)
  if (error.code === 'P2002') {
    const field = error.meta?.target?.[0] || 'field';

    if (field === 'joinCode') {
      return createErrorResponse(
        ErrorCode.DUPLICATE_JOIN_CODE,
        'This join code is already in use. Please try again.',
        'A group with this join code already exists',
        409,
        'joinCode'
      );
    }

    return createErrorResponse(
      ErrorCode.DUPLICATE_ENTRY,
      `A record with this ${field} already exists`,
      error.message,
      409,
      field
    );
  }

  // Foreign key constraint violation (e.g., deleting game that's assigned)
  if (error.code === 'P2003') {
    return createErrorResponse(
      ErrorCode.FOREIGN_KEY_VIOLATION,
      'Cannot perform this action due to existing references',
      'This record is referenced by other data and cannot be deleted',
      400
    );
  }

  // Record not found
  if (error.code === 'P2025') {
    return createErrorResponse(
      ErrorCode.NOT_FOUND,
      'The requested record was not found',
      error.message,
      404
    );
  }

  // Failed to connect to database
  if (error.code === 'P1001') {
    return createErrorResponse(
      ErrorCode.DATABASE_ERROR,
      'Unable to connect to the database',
      'Please try again later',
      503
    );
  }

  // Database timeout
  if (error.code === 'P1008') {
    return createErrorResponse(
      ErrorCode.TIMEOUT,
      'Database operation timed out',
      'The request took too long to process',
      504
    );
  }

  // Default Prisma error
  return createErrorResponse(
    ErrorCode.DATABASE_ERROR,
    'A database error occurred',
    error.message,
    500
  );
}

/**
 * Handle common application errors
 */
export function handleAppError(error: any): AppError {
  // Already an AppError
  if (error.code && Object.values(ErrorCode).includes(error.code)) {
    return error as AppError;
  }

  // Prisma errors
  if (error.code?.startsWith('P')) {
    return handlePrismaError(error);
  }

  // Network errors
  if (isNetworkError(error)) {
    return createErrorResponse(
      ErrorCode.NETWORK_ERROR,
      'Network connection failed',
      'Please check your internet connection and try again',
      0 // No HTTP status for network errors
    );
  }

  // Timeout errors
  if (isTimeoutError(error)) {
    return createErrorResponse(
      ErrorCode.TIMEOUT,
      'Request timed out',
      'The operation took too long to complete. Please try again',
      504
    );
  }

  // Validation errors (Zod)
  if (error.name === 'ZodError') {
    const firstError = error.errors?.[0];
    return createErrorResponse(
      ErrorCode.VALIDATION_ERROR,
      firstError?.message || 'Validation failed',
      'Please check your input and try again',
      400,
      firstError?.path?.join('.')
    );
  }

  // Default unknown error
  return createErrorResponse(
    ErrorCode.UNKNOWN_ERROR,
    'An unexpected error occurred',
    error.message || 'Unknown error',
    500
  );
}

/**
 * Get user-friendly error message based on error code
 */
export function getUserFriendlyMessage(error: AppError): string {
  switch (error.code) {
    case ErrorCode.NETWORK_ERROR:
      return 'Unable to connect. Please check your internet connection.';

    case ErrorCode.TIMEOUT:
      return 'The request is taking longer than expected. Please try again.';

    case ErrorCode.NOT_FOUND:
    case ErrorCode.GAME_NOT_FOUND:
    case ErrorCode.GROUP_NOT_FOUND:
    case ErrorCode.ASSIGNMENT_NOT_FOUND:
      return 'The requested item could not be found.';

    case ErrorCode.ALREADY_JOINED:
      return 'You have already joined this group.';

    case ErrorCode.DUPLICATE_JOIN_CODE:
      return 'This join code is already in use. Please try again.';

    case ErrorCode.CANNOT_DELETE_ASSIGNED_GAME:
      return 'Cannot delete this game because it has been assigned to students.';

    case ErrorCode.CANNOT_DELETE_GROUP_WITH_MEMBERS:
      return 'Cannot delete this group because it still has members.';

    case ErrorCode.UNAUTHORIZED:
      return 'You must be logged in to perform this action.';

    case ErrorCode.FORBIDDEN:
    case ErrorCode.NOT_OWNER:
      return 'You do not have permission to perform this action.';

    case ErrorCode.DATABASE_ERROR:
      return 'A database error occurred. Please try again.';

    case ErrorCode.VALIDATION_ERROR:
    case ErrorCode.INVALID_INPUT:
      return error.message;

    default:
      return error.message || 'An unexpected error occurred. Please try again.';
  }
}

/**
 * Check if game can be deleted (no assignments)
 */
export async function canDeleteGame(gameId: string): Promise<boolean> {
  try {
    const assignmentsData = localStorage.getItem('dev_assignments');
    if (!assignmentsData) return true;

    const assignments = JSON.parse(assignmentsData);
    const hasAssignments = assignments.some((a: any) => a.gameId === gameId);

    return !hasAssignments;
  } catch (error) {
    console.error('Error checking if game can be deleted:', error);
    return false;
  }
}

/**
 * Check if student has already joined group
 */
export async function hasStudentJoinedGroup(studentId: string, groupId: string): Promise<boolean> {
  try {
    const membersData = localStorage.getItem('dev_group_members');
    if (!membersData) return false;

    const members = JSON.parse(membersData);
    return members.some((m: any) => m.studentId === studentId && m.groupId === groupId);
  } catch (error) {
    console.error('Error checking if student joined group:', error);
    return false;
  }
}

/**
 * Format date handling browser timezone vs UTC
 */
export function formatDateForDisplay(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  // Format in user's local timezone
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
}

/**
 * Convert local date to UTC for storage
 */
export function convertToUTC(date: Date | string): Date {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Date(dateObj.toISOString());
}

/**
 * Convert UTC date to local timezone
 */
export function convertFromUTC(date: Date | string): Date {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Date(dateObj.toLocaleString());
}
