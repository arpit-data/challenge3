// ============================================================
// EcoPulse AI — Logger Utility Tests
// Validate logger methods, safety, and immutability
// ============================================================

import { describe, it, expect } from 'vitest';
import { logger } from '../logger';

// ===========================================================================
// Method existence
// ===========================================================================
describe('logger — method existence', () => {
  it('has a debug method', () => {
    expect(typeof logger.debug).toBe('function');
  });

  it('has an info method', () => {
    expect(typeof logger.info).toBe('function');
  });

  it('has a warn method', () => {
    expect(typeof logger.warn).toBe('function');
  });

  it('has an error method', () => {
    expect(typeof logger.error).toBe('function');
  });

  it('has exactly 4 methods', () => {
    const methods = Object.keys(logger).filter((k) => typeof (logger as any)[k] === 'function');
    expect(methods).toHaveLength(4);
    expect(methods.sort()).toEqual(['debug', 'error', 'info', 'warn']);
  });
});

// ===========================================================================
// Methods don't throw
// ===========================================================================
describe('logger — methods do not throw', () => {
  it('debug does not throw', () => {
    expect(() => logger.debug('test message')).not.toThrow();
  });

  it('info does not throw', () => {
    expect(() => logger.info('test message')).not.toThrow();
  });

  it('warn does not throw', () => {
    expect(() => logger.warn('test message')).not.toThrow();
  });

  it('error does not throw', () => {
    expect(() => logger.error('test message')).not.toThrow();
  });

  it('debug with extra args does not throw', () => {
    expect(() => logger.debug('test', { data: 123 }, 'extra')).not.toThrow();
  });

  it('info with extra args does not throw', () => {
    expect(() => logger.info('test', [1, 2, 3])).not.toThrow();
  });

  it('warn with extra args does not throw', () => {
    expect(() => logger.warn('warning', new Error('test'))).not.toThrow();
  });

  it('error with extra args does not throw', () => {
    expect(() => logger.error('error', new Error('test'), { context: 'test' })).not.toThrow();
  });

  it('handles empty string message', () => {
    expect(() => logger.debug('')).not.toThrow();
    expect(() => logger.info('')).not.toThrow();
    expect(() => logger.warn('')).not.toThrow();
    expect(() => logger.error('')).not.toThrow();
  });

  it('handles undefined/null extra args', () => {
    expect(() => logger.debug('test', undefined, null)).not.toThrow();
    expect(() => logger.error('test', undefined, null)).not.toThrow();
  });
});

// ===========================================================================
// Logger object is frozen (as const)
// ===========================================================================
describe('logger — immutability', () => {
  it('logger object is frozen', () => {
    expect(Object.isFrozen(logger)).toBe(true);
  });

  it('cannot add new properties', () => {
    expect(() => {
      (logger as any).custom = () => {};
    }).toThrow();
  });

  it('cannot reassign existing methods', () => {
    expect(() => {
      (logger as any).debug = () => {};
    }).toThrow();
  });

  it('cannot delete methods', () => {
    expect(() => {
      delete (logger as any).debug;
    }).toThrow();
  });
});

// ===========================================================================
// Logger methods return void
// ===========================================================================
describe('logger — return values', () => {
  it('debug returns undefined', () => {
    const result = logger.debug('test');
    expect(result).toBeUndefined();
  });

  it('info returns undefined', () => {
    const result = logger.info('test');
    expect(result).toBeUndefined();
  });

  it('warn returns undefined', () => {
    const result = logger.warn('test');
    expect(result).toBeUndefined();
  });

  it('error returns undefined', () => {
    const result = logger.error('test');
    expect(result).toBeUndefined();
  });
});
