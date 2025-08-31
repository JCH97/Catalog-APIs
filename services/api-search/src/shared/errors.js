// Shared error definitions for the search service.

/**
 * Interface describing error objects returned in Result.
 * @typedef {Object} IResultError
 * @property {string} code
 * @property {string} message
 * @property {unknown} [details]
 */

export class AppError {
  /**
   * @param {string} code
   * @param {string} message
   * @param {unknown} [details]
   */
  constructor(code, message, details) {
    this.code = code;
    this.message = message;
    this.details = details;
  }

  throw() {
    throw new Error(`${this.code}: ${this.message}`);
  }

  static Unauthorized(msg = 'Unauthorized') { return new AppError('UNAUTHORIZED', msg); }
  static NotFound(msg = 'Not found') { return new AppError('NOT_FOUND', msg); }
  static Conflict(msg = 'Conflict') { return new AppError('CONFLICT', msg); }
  static Validation(msg = 'Validation error', details) { return new AppError('VALIDATION', msg, details); }
  static Internal(msg = 'Internal error', details) { return new AppError('INTERNAL', msg, details); }
}