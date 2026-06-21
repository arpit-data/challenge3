/**
 * @fileoverview EcoPulse AI — Logger Utility.
 * Production-safe, level-based logging with prefixed messages.
 */

/**
 * Log level enum to control verbosity.
 * Only messages at or above the configured level are emitted.
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/** Numeric priority for each log level (higher = more severe). */
const LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

/** Prefix prepended to all log messages for easy identification. */
const LOG_PREFIX = '[EcoPulse]';

/**
 * Determine the minimum log level based on the build environment.
 * In production builds, only warnings and errors are emitted.
 * In development builds, all levels are emitted.
 *
 * @returns The minimum log level for the current environment
 */
function getMinLevel(): LogLevel {
  try {
    return import.meta.env.DEV ? 'debug' : 'warn';
  } catch {
    return 'warn';
  }
}

/**
 * Check whether a message at the given level should be emitted.
 *
 * @param level - The level of the message to check
 * @returns True if the message should be logged
 */
function shouldLog(level: LogLevel): boolean {
  return LEVEL_PRIORITY[level] >= LEVEL_PRIORITY[getMinLevel()];
}

/**
 * Production-safe logger utility for EcoPulse AI.
 *
 * In development builds, all log levels are emitted.
 * In production builds, only `warn` and `error` are emitted.
 * All messages are prefixed with `[EcoPulse]` for easy filtering.
 *
 * @example
 * ```ts
 * import { logger } from '../utils/logger';
 *
 * logger.info('User completed assessment');
 * logger.warn('API rate limit approaching');
 * logger.error('Failed to initialize Gemini', error);
 * ```
 */
export const logger = ({
  /**
   * Log a debug-level message (development only).
   *
   * @param message - Primary log message
   * @param args - Additional data to log
   */
  debug(message: string, ...args: unknown[]): void {
    if (shouldLog('debug')) {
      console.debug(LOG_PREFIX, message, ...args);
    }
  },

  /**
   * Log an informational message (development only).
   *
   * @param message - Primary log message
   * @param args - Additional data to log
   */
  info(message: string, ...args: unknown[]): void {
    if (shouldLog('info')) {
      console.info(LOG_PREFIX, message, ...args);
    }
  },

  /**
   * Log a warning message (always emitted).
   *
   * @param message - Primary log message
   * @param args - Additional data to log
   */
  warn(message: string, ...args: unknown[]): void {
    if (shouldLog('warn')) {
      console.warn(LOG_PREFIX, message, ...args);
    }
  },

  /**
   * Log an error message (always emitted).
   *
   * @param message - Primary log message
   * @param args - Additional data to log
   */
  error(message: string, ...args: unknown[]): void {
    if (shouldLog('error')) {
      console.error(LOG_PREFIX, message, ...args);
    }
  },
} as const);

// Freeze the logger to prevent accidental mutation at runtime.
Object.freeze(logger);
