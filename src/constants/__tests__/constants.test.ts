// ============================================================
// EcoPulse AI — Constants Tests
// Validate all exported constants for type, range, and value
// ============================================================

import { describe, it, expect } from 'vitest';
import {
  MAX_REPORT_HISTORY,
  PROGRESS_INCREMENT,
  WORK_DAYS_PER_YEAR,
  DAYS_PER_YEAR,
  WEEKS_PER_YEAR,
  KG_CO2_PER_TREE,
  MAX_RECOMMENDATIONS,
  GEMINI_MODEL,
  RATE_LIMIT_MAX_CALLS,
  SUMMARY_RATE_LIMIT,
  RATE_LIMIT_WINDOW_MS,
  REQUEST_TIMEOUT_MS,
  MAX_MESSAGE_LENGTH,
  SUGGESTED_PROMPTS_WITH_REPORT,
  SUGGESTED_PROMPTS_WITHOUT_REPORT,
  MAX_RESPONSE_WORDS,
  DEFAULT_REDUCTION_TARGET,
  FALLBACK_REDUCTION_KG,
  WEEK_WARRIOR_STREAK,
  MONTH_MASTER_STREAK,
  CARBON_REDUCER_THRESHOLD,
  HALF_TON_HERO_THRESHOLD,
  CATEGORY_RECS_THRESHOLD,
  CHAMPION_RECS_THRESHOLD,
  CHAMPION_GOALS_THRESHOLD,
} from '../index';

// ===========================================================================
// All exported constants are positive numbers
// ===========================================================================
describe('Constants — positive numeric values', () => {
  const numericConstants: Record<string, number> = {
    MAX_REPORT_HISTORY,
    PROGRESS_INCREMENT,
    WORK_DAYS_PER_YEAR,
    DAYS_PER_YEAR,
    WEEKS_PER_YEAR,
    KG_CO2_PER_TREE,
    MAX_RECOMMENDATIONS,
    RATE_LIMIT_MAX_CALLS,
    SUMMARY_RATE_LIMIT,
    RATE_LIMIT_WINDOW_MS,
    REQUEST_TIMEOUT_MS,
    MAX_MESSAGE_LENGTH,
    SUGGESTED_PROMPTS_WITH_REPORT,
    SUGGESTED_PROMPTS_WITHOUT_REPORT,
    MAX_RESPONSE_WORDS,
    DEFAULT_REDUCTION_TARGET,
    FALLBACK_REDUCTION_KG,
    WEEK_WARRIOR_STREAK,
    MONTH_MASTER_STREAK,
    CARBON_REDUCER_THRESHOLD,
    HALF_TON_HERO_THRESHOLD,
    CATEGORY_RECS_THRESHOLD,
    CHAMPION_RECS_THRESHOLD,
    CHAMPION_GOALS_THRESHOLD,
  };

  for (const [name, value] of Object.entries(numericConstants)) {
    it(`${name} is a positive number`, () => {
      expect(typeof value).toBe('number');
      expect(value).toBeGreaterThan(0);
    });
  }
});

// ===========================================================================
// Sensible ranges for rate limiting and timeout constants
// ===========================================================================
describe('Constants — sensible ranges', () => {
  it('RATE_LIMIT_MAX_CALLS is between 1 and 100', () => {
    expect(RATE_LIMIT_MAX_CALLS).toBeGreaterThanOrEqual(1);
    expect(RATE_LIMIT_MAX_CALLS).toBeLessThanOrEqual(100);
  });

  it('RATE_LIMIT_WINDOW_MS is between 1 second and 10 minutes', () => {
    expect(RATE_LIMIT_WINDOW_MS).toBeGreaterThanOrEqual(1000);
    expect(RATE_LIMIT_WINDOW_MS).toBeLessThanOrEqual(600_000);
  });

  it('REQUEST_TIMEOUT_MS is between 5 seconds and 2 minutes', () => {
    expect(REQUEST_TIMEOUT_MS).toBeGreaterThanOrEqual(5000);
    expect(REQUEST_TIMEOUT_MS).toBeLessThanOrEqual(120_000);
  });

  it('SUMMARY_RATE_LIMIT is smaller than RATE_LIMIT_MAX_CALLS', () => {
    expect(SUMMARY_RATE_LIMIT).toBeLessThanOrEqual(RATE_LIMIT_MAX_CALLS);
  });

  it('MAX_MESSAGE_LENGTH is between 100 and 10000', () => {
    expect(MAX_MESSAGE_LENGTH).toBeGreaterThanOrEqual(100);
    expect(MAX_MESSAGE_LENGTH).toBeLessThanOrEqual(10_000);
  });

  it('PROGRESS_INCREMENT divides evenly into 100', () => {
    expect(100 % PROGRESS_INCREMENT).toBe(0);
  });

  it('WORK_DAYS_PER_YEAR is reasonable (200-300)', () => {
    expect(WORK_DAYS_PER_YEAR).toBeGreaterThanOrEqual(200);
    expect(WORK_DAYS_PER_YEAR).toBeLessThanOrEqual(300);
  });

  it('DAYS_PER_YEAR is 365', () => {
    expect(DAYS_PER_YEAR).toBe(365);
  });

  it('WEEKS_PER_YEAR is 52', () => {
    expect(WEEKS_PER_YEAR).toBe(52);
  });

  it('DEFAULT_REDUCTION_TARGET is a fraction between 0 and 1', () => {
    expect(DEFAULT_REDUCTION_TARGET).toBeGreaterThan(0);
    expect(DEFAULT_REDUCTION_TARGET).toBeLessThan(1);
  });
});

// ===========================================================================
// GEMINI_MODEL
// ===========================================================================
describe('GEMINI_MODEL', () => {
  it('is a non-empty string', () => {
    expect(typeof GEMINI_MODEL).toBe('string');
    expect(GEMINI_MODEL.length).toBeGreaterThan(0);
  });

  it('contains "gemini"', () => {
    expect(GEMINI_MODEL.toLowerCase()).toContain('gemini');
  });
});

// ===========================================================================
// Guards against accidental value changes (snapshot-style)
// ===========================================================================
describe('Constants — value guards', () => {
  it('MAX_REPORT_HISTORY is 52', () => {
    expect(MAX_REPORT_HISTORY).toBe(52);
  });

  it('PROGRESS_INCREMENT is 5', () => {
    expect(PROGRESS_INCREMENT).toBe(5);
  });

  it('KG_CO2_PER_TREE is 22', () => {
    expect(KG_CO2_PER_TREE).toBe(22);
  });

  it('MAX_RECOMMENDATIONS is 8', () => {
    expect(MAX_RECOMMENDATIONS).toBe(8);
  });

  it('RATE_LIMIT_MAX_CALLS is 10', () => {
    expect(RATE_LIMIT_MAX_CALLS).toBe(10);
  });

  it('RATE_LIMIT_WINDOW_MS is 60000', () => {
    expect(RATE_LIMIT_WINDOW_MS).toBe(60_000);
  });

  it('REQUEST_TIMEOUT_MS is 30000', () => {
    expect(REQUEST_TIMEOUT_MS).toBe(30_000);
  });

  it('WEEK_WARRIOR_STREAK is 7', () => {
    expect(WEEK_WARRIOR_STREAK).toBe(7);
  });

  it('MONTH_MASTER_STREAK is 30', () => {
    expect(MONTH_MASTER_STREAK).toBe(30);
  });

  it('CARBON_REDUCER_THRESHOLD is 100', () => {
    expect(CARBON_REDUCER_THRESHOLD).toBe(100);
  });

  it('HALF_TON_HERO_THRESHOLD is 500', () => {
    expect(HALF_TON_HERO_THRESHOLD).toBe(500);
  });

  it('CHAMPION_RECS_THRESHOLD is 15', () => {
    expect(CHAMPION_RECS_THRESHOLD).toBe(15);
  });

  it('CHAMPION_GOALS_THRESHOLD is 3', () => {
    expect(CHAMPION_GOALS_THRESHOLD).toBe(3);
  });

  it('FALLBACK_REDUCTION_KG is 500', () => {
    expect(FALLBACK_REDUCTION_KG).toBe(500);
  });

  it('GEMINI_MODEL is gemini-2.5-flash', () => {
    expect(GEMINI_MODEL).toBe('gemini-2.5-flash');
  });
});
