// ============================================================
// EcoPulse AI — Input Sanitization & Security Utilities
// XSS prevention, API key validation, and rate limiting
// ============================================================

/**
 * Strips HTML tags from user input to prevent XSS attacks.
 * Removes all HTML/XML tags including self-closing tags.
 *
 * @param input - Raw user input string
 * @returns Sanitized string with HTML tags removed
 *
 * @example
 * ```ts
 * stripHtmlTags('<b>Hello</b>') // 'Hello'
 * stripHtmlTags('<script>alert("xss")</script>') // 'alert("xss")'
 * ```
 */
export function stripHtmlTags(input: string): string {
  if (!input) return '';
  return input.replace(/<[^>]*>/g, '');
}

/**
 * Sanitizes user input for safe display and processing.
 * Removes HTML tags, trims whitespace, and normalizes the string.
 *
 * @param input - Raw user input
 * @param maxLength - Maximum allowed length (default: 2000)
 * @returns Sanitized, truncated string
 */
export function sanitizeUserInput(input: string, maxLength: number = 2000): string {
  if (!input || typeof input !== 'string') return '';

  let sanitized = input;

  // Remove null bytes (can bypass certain filters)
  sanitized = sanitized.replace(/\0/g, '');

  // Remove HTML tags
  sanitized = stripHtmlTags(sanitized);

  // Remove javascript: protocol URIs
  sanitized = sanitized.replace(/javascript\s*:/gi, '');

  // Remove on* event handler attributes
  sanitized = sanitized.replace(/\bon\w+\s*=/gi, '');

  // Remove data: URIs that could contain scripts
  sanitized = sanitized.replace(/data\s*:\s*text\/html/gi, '');

  // Remove vbscript: protocol URIs
  sanitized = sanitized.replace(/vbscript\s*:/gi, '');

  // Trim and normalize whitespace
  sanitized = sanitized.trim().replace(/\s+/g, ' ');

  // Enforce max length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.slice(0, maxLength);
  }

  return sanitized;
}

/**
 * Escapes HTML special characters to prevent injection.
 *
 * @param input - String to escape
 * @returns HTML-safe string
 */
export function escapeHtml(input: string): string {
  if (!input) return '';
  const escapeMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return input.replace(/[&<>"']/g, (char) => escapeMap[char] || char);
}

/**
 * Validates the format of a Google Gemini API key.
 * Checks that the key matches expected patterns before sending to the API.
 *
 * @param apiKey - The API key to validate
 * @returns True if the key format appears valid
 */
export function validateApiKeyFormat(apiKey: string): boolean {
  if (!apiKey || typeof apiKey !== 'string') return false;

  // Google API keys are typically 39 characters, alphanumeric with hyphens/underscores
  const trimmed = apiKey.trim();

  // Must be at least 20 characters and contain only valid characters
  if (trimmed.length < 20 || trimmed.length > 100) return false;

  // Only allow alphanumeric, hyphens, underscores
  return /^[a-zA-Z0-9\-_]+$/.test(trimmed);
}

/**
 * Simple rate limiter that tracks call timestamps per action key.
 * Prevents abuse of API calls and expensive operations.
 */
const rateLimitMap = new Map<string, number[]>();

/**
 * Check if an action is rate-limited.
 *
 * @param key - Unique identifier for the action (e.g., 'gemini-chat')
 * @param maxCalls - Maximum calls allowed in the window
 * @param windowMs - Time window in milliseconds (default: 60000 = 1 minute)
 * @returns True if the action is allowed, false if rate-limited
 *
 * @example
 * ```ts
 * if (!checkRateLimit('gemini-chat', 10, 60000)) {
 *   throw new Error('Too many requests. Please wait a moment.');
 * }
 * ```
 */
export function checkRateLimit(
  key: string,
  maxCalls: number,
  windowMs: number = 60000
): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(key) || [];

  // Remove timestamps outside the window
  const validTimestamps = timestamps.filter((t) => now - t < windowMs);

  if (validTimestamps.length >= maxCalls) {
    rateLimitMap.set(key, validTimestamps);
    return false; // Rate limited
  }

  validTimestamps.push(now);
  rateLimitMap.set(key, validTimestamps);
  return true; // Allowed
}

/**
 * Reset rate limit state for a specific key (useful for testing).
 *
 * @param key - The rate limit key to reset
 */
export function resetRateLimit(key?: string): void {
  if (key) {
    rateLimitMap.delete(key);
  } else {
    rateLimitMap.clear();
  }
}
