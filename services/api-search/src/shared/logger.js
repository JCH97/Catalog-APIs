/**
 * Simple logger utility for info, warning, and error messages.
 * @namespace logger
 */
export const logger = {
  /**
   * Logs an info message.
   * @param {...any} args - The message or objects to log.
   */
  info: (...args) => console.log('[INFO]', ...args),
  /**
   * Logs a warning message.
   * @param {...any} args - The message or objects to log.
   */
  warn: (...args) => console.warn('[WARN]', ...args),
  /**
   * Logs an error message.
   * @param {...any} args - The message or objects to log.
   */
  error: (...args) => console.error('[ERROR]', ...args),
};
