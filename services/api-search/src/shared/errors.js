// Shared error definitions for the search service.

/**
 * Interface describing error objects returned in Result.
 * @typedef {Object} IResultError
 * @property {string} code - The error code.
 * @property {string} message - The error message.
 * @property {unknown} [details] - Additional error details.
 */

/**
 * Represents an application error.
 * @class
 */
export class AppError {
  /**
   * @constructor
   * @param {string} code - The error code.
   * @param {string} message - The error message.
   * @param {unknown} [details] - Additional error details.
   */
  constructor(code, message, details) {
    this.code = code;
    this.message = message;
    this.details = details;
  }

  /**
   * Throws the error as a JavaScript Error.
   */
  throw() {
    throw new Error(`${this.code}: ${this.message}`);
  }

  /**
   * Returns an Unauthorized error.
   * @param {string} [msg='Unauthorized'] - The error message.
   * @returns {AppError}
   */
  static Unauthorized(msg = 'Unauthorized') { return new AppError('UNAUTHORIZED', msg); }
  /**
   * Returns a NotFound error.
   * @param {string} [msg='Not found'] - The error message.
   * @returns {AppError}
   */
  static NotFound(msg = 'Not found') { return new AppError('NOT_FOUND', msg); }
  /**
   * Returns a Conflict error.
   * @param {string} [msg='Conflict'] - The error message.
   * @returns {AppError}
   */
  static Conflict(msg = 'Conflict') { return new AppError('CONFLICT', msg); }
  /**
   * Returns a Validation error.
   * @param {string} [msg='Validation error'] - The error message.
   * @param {unknown} [details] - Additional error details.
   * @returns {AppError}
   */
  static Validation(msg = 'Validation error', details) { return new AppError('VALIDATION', msg, details); }
  /**
   * Returns an Internal error.
   * @param {string} [msg='Internal error'] - The error message.
   * @param {unknown} [details] - Additional error details.
   * @returns {AppError}
   */
  static Internal(msg = 'Internal error', details) { return new AppError('INTERNAL', msg, details); }
}
