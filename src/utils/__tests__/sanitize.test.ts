// ============================================================
// EcoPulse AI — Sanitize Utility Tests
// XSS prevention, API key validation, and rate limiting
// ============================================================

import { describe, it, expect, beforeEach } from 'vitest';
import {
  stripHtmlTags,
  sanitizeUserInput,
  escapeHtml,
  validateApiKeyFormat,
  checkRateLimit,
  resetRateLimit,
} from '../sanitize';

// ===========================================================================
// stripHtmlTags
// ===========================================================================
describe('stripHtmlTags', () => {
  it('strips basic HTML tags', () => {
    expect(stripHtmlTags('<b>Hello</b>')).toBe('Hello');
    expect(stripHtmlTags('<p>Paragraph</p>')).toBe('Paragraph');
  });

  it('strips nested HTML tags', () => {
    expect(stripHtmlTags('<div><span>Nested</span></div>')).toBe('Nested');
  });

  it('strips self-closing tags', () => {
    expect(stripHtmlTags('Line<br/>Break')).toBe('LineBreak');
    expect(stripHtmlTags('Image<img src="x" />')).toBe('Image');
  });

  it('strips tags with attributes', () => {
    expect(stripHtmlTags('<a href="http://evil.com">Click</a>')).toBe('Click');
    expect(stripHtmlTags('<div class="cls" id="x">Text</div>')).toBe('Text');
  });

  it('returns empty string for empty input', () => {
    expect(stripHtmlTags('')).toBe('');
  });

  it('returns original string when no tags present', () => {
    expect(stripHtmlTags('Just plain text')).toBe('Just plain text');
  });

  it('handles multiple tags in a row', () => {
    expect(stripHtmlTags('<b>A</b><i>B</i><u>C</u>')).toBe('ABC');
  });

  it('strips script tags (content remains)', () => {
    expect(stripHtmlTags('<script>alert("xss")</script>')).toBe('alert("xss")');
  });

  it('strips tags with line breaks inside', () => {
    expect(stripHtmlTags('<div\n  class="x"\n>Hello</div\n>')).toBe('Hello');
  });
});

// ===========================================================================
// sanitizeUserInput — XSS vector prevention
// ===========================================================================
describe('sanitizeUserInput', () => {
  it('removes script tags', () => {
    const result = sanitizeUserInput('<script>alert("xss")</script>');
    expect(result).not.toContain('<script');
    expect(result).not.toContain('</script>');
  });

  it('removes javascript: URIs', () => {
    const result = sanitizeUserInput('click javascript:alert(1)');
    expect(result.toLowerCase()).not.toContain('javascript:');
  });

  it('removes javascript: URIs with whitespace', () => {
    const result = sanitizeUserInput('click javascript :alert(1)');
    expect(result.toLowerCase()).not.toContain('javascript');
    expect(result).not.toMatch(/javascript\s*:/i);
  });

  it('removes on* event handler attributes', () => {
    const result = sanitizeUserInput('hello onerror=alert(1)');
    expect(result).not.toMatch(/onerror\s*=/i);
  });

  it('removes onclick event handler', () => {
    const result = sanitizeUserInput('test onclick=malicious()');
    expect(result).not.toMatch(/onclick\s*=/i);
  });

  it('removes onmouseover event handler', () => {
    const result = sanitizeUserInput('test onmouseover=bad()');
    expect(result).not.toMatch(/onmouseover\s*=/i);
  });

  it('removes data:text/html URIs', () => {
    const result = sanitizeUserInput('data:text/html,<script>alert(1)</script>');
    expect(result.toLowerCase()).not.toContain('data:text/html');
  });

  it('strips HTML tags from input', () => {
    const result = sanitizeUserInput('<img src=x onerror=alert(1)>');
    expect(result).not.toContain('<img');
    expect(result).not.toContain('>');
  });

  it('handles complex XSS vectors', () => {
    const vector = '<svg/onload=alert(1)>';
    const result = sanitizeUserInput(vector);
    expect(result).not.toContain('<svg');
    expect(result).not.toMatch(/onload\s*=/i);
  });

  it('trims and normalizes whitespace', () => {
    const result = sanitizeUserInput('  hello   world  ');
    expect(result).toBe('hello world');
  });

  it('enforces max length', () => {
    const long = 'a'.repeat(5000);
    const result = sanitizeUserInput(long);
    expect(result.length).toBeLessThanOrEqual(2000);
  });

  it('uses custom max length', () => {
    const long = 'a'.repeat(200);
    const result = sanitizeUserInput(long, 50);
    expect(result.length).toBeLessThanOrEqual(50);
  });

  it('returns empty string for empty input', () => {
    expect(sanitizeUserInput('')).toBe('');
  });

  it('returns empty string for null-like input', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(sanitizeUserInput(null as any)).toBe('');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(sanitizeUserInput(undefined as any)).toBe('');
  });

  it('preserves safe text content', () => {
    const safe = 'I want to reduce my carbon footprint by 20%';
    expect(sanitizeUserInput(safe)).toBe(safe);
  });

  it('handles mixed safe content and XSS', () => {
    const input = 'Hello <script>alert(1)</script> World';
    const result = sanitizeUserInput(input);
    expect(result).toContain('Hello');
    expect(result).toContain('World');
    expect(result).not.toContain('<script');
  });
});

// ===========================================================================
// escapeHtml
// ===========================================================================
describe('escapeHtml', () => {
  it('escapes ampersands', () => {
    expect(escapeHtml('a & b')).toBe('a &amp; b');
  });

  it('escapes less-than and greater-than', () => {
    expect(escapeHtml('<div>')).toBe('&lt;div&gt;');
  });

  it('escapes double quotes', () => {
    expect(escapeHtml('"hello"')).toBe('&quot;hello&quot;');
  });

  it('escapes single quotes', () => {
    expect(escapeHtml("it's")).toBe("it&#39;s");
  });

  it('escapes all special characters together', () => {
    expect(escapeHtml('<a href="x">&\'test</a>')).toBe(
      '&lt;a href=&quot;x&quot;&gt;&amp;&#39;test&lt;/a&gt;'
    );
  });

  it('returns empty string for empty input', () => {
    expect(escapeHtml('')).toBe('');
  });

  it('leaves safe strings unchanged', () => {
    expect(escapeHtml('Hello World 123')).toBe('Hello World 123');
  });
});

// ===========================================================================
// validateApiKeyFormat
// ===========================================================================
describe('validateApiKeyFormat', () => {
  it('accepts a valid-looking API key (39 chars, alphanumeric)', () => {
    const key = 'AIzaSyA1234567890abcdefghijklmnopqrst';
    expect(validateApiKeyFormat(key)).toBe(true);
  });

  it('accepts keys with hyphens and underscores', () => {
    const key = 'AIzaSy-A_1234567890abcde';
    expect(validateApiKeyFormat(key)).toBe(true);
  });

  it('rejects keys shorter than 20 characters', () => {
    expect(validateApiKeyFormat('short')).toBe(false);
    expect(validateApiKeyFormat('a'.repeat(19))).toBe(false);
  });

  it('accepts keys exactly 20 characters', () => {
    expect(validateApiKeyFormat('a'.repeat(20))).toBe(true);
  });

  it('rejects keys longer than 100 characters', () => {
    expect(validateApiKeyFormat('a'.repeat(101))).toBe(false);
  });

  it('accepts keys exactly 100 characters', () => {
    expect(validateApiKeyFormat('a'.repeat(100))).toBe(true);
  });

  it('rejects keys with special characters', () => {
    expect(validateApiKeyFormat('AIzaSy!@#$%^&*()12345')).toBe(false);
    expect(validateApiKeyFormat('key with spaces 1234')).toBe(false);
  });

  it('rejects empty string', () => {
    expect(validateApiKeyFormat('')).toBe(false);
  });

  it('rejects null/undefined', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(validateApiKeyFormat(null as any)).toBe(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(validateApiKeyFormat(undefined as any)).toBe(false);
  });

  it('trims whitespace before validating', () => {
    const key = '  ' + 'a'.repeat(25) + '  ';
    expect(validateApiKeyFormat(key)).toBe(true);
  });
});

// ===========================================================================
// checkRateLimit
// ===========================================================================
describe('checkRateLimit', () => {
  beforeEach(() => {
    resetRateLimit(); // Clear all rate limit state between tests
  });

  it('allows calls within the limit', () => {
    expect(checkRateLimit('test-action', 3, 60000)).toBe(true);
    expect(checkRateLimit('test-action', 3, 60000)).toBe(true);
    expect(checkRateLimit('test-action', 3, 60000)).toBe(true);
  });

  it('blocks calls exceeding the limit', () => {
    // 3 calls allowed
    checkRateLimit('test-block', 3, 60000);
    checkRateLimit('test-block', 3, 60000);
    checkRateLimit('test-block', 3, 60000);

    // 4th should be blocked
    expect(checkRateLimit('test-block', 3, 60000)).toBe(false);
  });

  it('uses separate limits for different keys', () => {
    // Fill up key-a
    checkRateLimit('key-a', 1, 60000);
    expect(checkRateLimit('key-a', 1, 60000)).toBe(false);

    // key-b should be independent
    expect(checkRateLimit('key-b', 1, 60000)).toBe(true);
  });

  it('allows calls after reset', () => {
    checkRateLimit('reset-test', 1, 60000);
    expect(checkRateLimit('reset-test', 1, 60000)).toBe(false);

    resetRateLimit('reset-test');
    expect(checkRateLimit('reset-test', 1, 60000)).toBe(true);
  });

  it('resetRateLimit without key clears all limits', () => {
    checkRateLimit('a', 1, 60000);
    checkRateLimit('b', 1, 60000);

    resetRateLimit(); // Clear all

    expect(checkRateLimit('a', 1, 60000)).toBe(true);
    expect(checkRateLimit('b', 1, 60000)).toBe(true);
  });

  it('allows exactly maxCalls calls', () => {
    for (let i = 0; i < 5; i++) {
      expect(checkRateLimit('exact-5', 5, 60000)).toBe(true);
    }
    // 6th call should be blocked
    expect(checkRateLimit('exact-5', 5, 60000)).toBe(false);
  });

  it('handles maxCalls of 1 (single allowed call)', () => {
    expect(checkRateLimit('single', 1, 60000)).toBe(true);
    expect(checkRateLimit('single', 1, 60000)).toBe(false);
  });
});
