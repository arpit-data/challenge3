// ============================================================
// EcoPulse AI — Gemini Service Fallback Tests
// Tests for offline/fallback behavior, suggested prompts,
// rate limiting, and input validation in the AI service layer.
// ============================================================

import { describe, it, expect, beforeEach } from 'vitest';
import { sendMessage, getSuggestedPrompts, generateWeeklySummary, generateAIRecommendations } from '../geminiService';
import { resetRateLimit } from '../../utils/sanitize';
import type { CarbonReport, Goal, Recommendation } from '../../types';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Build a minimal CarbonReport fixture for testing fallback responses.
 */
function makeReport(overrides?: Partial<CarbonReport>): CarbonReport {
  return {
    id: 'test-report-1',
    totalKgCO2e: 6200,
    totalTonnesCO2e: 6.2,
    breakdown: [
      { category: 'transportation', kgCO2e: 2100, percentage: 34, label: 'Transportation', icon: '🚗', color: '#FF6B6B' },
      { category: 'food', kgCO2e: 1500, percentage: 24, label: 'Food & Diet', icon: '🍽️', color: '#F9A826' },
      { category: 'energy', kgCO2e: 1200, percentage: 19, label: 'Home Energy', icon: '⚡', color: '#48CAE4' },
      { category: 'shopping', kgCO2e: 600, percentage: 10, label: 'Shopping', icon: '🛒', color: '#9B5DE5' },
      { category: 'waste', kgCO2e: 400, percentage: 6, label: 'Waste', icon: '♻️', color: '#2D6A4F' },
      { category: 'travel', kgCO2e: 250, percentage: 4, label: 'Travel', icon: '✈️', color: '#E07A00' },
      { category: 'water', kgCO2e: 150, percentage: 3, label: 'Water', icon: '💧', color: '#0096C7' },
    ],
    benchmarks: { globalAverage: 4000, nationalAverage: 8000, ecoTarget: 2000 },
    createdAt: new Date().toISOString(),
    assessmentData: {
      transportation: { commuteDistanceKm: 15, vehicleType: 'car_petrol', publicTransportDays: 0, rideSharingFrequency: 'never' },
      diet: { dietType: 'mixed', foodWasteLevel: 'sometimes', localFoodPercentage: 30 },
      electricity: { monthlyBillUSD: 80, applianceEfficiency: 'mixed', hasRenewableSource: false, householdSize: 3 },
      shopping: { onlineShoppingFrequency: 'monthly', clothingItemsPerMonth: 2, electronicsPerYear: 2, prefersSustainableBrands: false },
      waste: { recyclingFrequency: 'sometimes', composting: false, singleUsePlasticFrequency: 'sometimes' },
      water: { showerMinutesPerDay: 8, laundryLoadsPerWeek: 4, hasWaterEfficiency: false },
      travel: { domesticFlightsPerYear: 2, internationalFlightsPerYear: 1, hotelNightsPerYear: 10 },
      lifestyle: { ecoConsciousnessLevel: 3, budgetSensitivity: 'medium', willingnessToChange: 'medium' },
    },
    ...overrides,
  };
}

function makeGoal(overrides?: Partial<Goal>): Goal {
  return {
    id: 'goal-1',
    title: 'Bike to work',
    description: 'Commute by bicycle 3 days a week',
    category: 'transportation',
    targetFrequency: '3x/week',
    startDate: new Date().toISOString(),
    streak: 5,
    bestStreak: 10,
    progress: 60,
    status: 'active',
    checkins: [],
    ...overrides,
  };
}

function makeRecommendation(overrides?: Partial<Recommendation>): Recommendation {
  return {
    id: 'rec-1',
    title: 'Switch to LED bulbs',
    description: 'Replace old bulbs with LEDs',
    category: 'energy',
    difficulty: 'easy',
    impact: 'medium',
    cost: 'low',
    estimatedReductionKg: 120,
    completed: false,
    ...overrides,
  };
}

// ===========================================================================
// getSuggestedPrompts
// ===========================================================================
describe('getSuggestedPrompts', () => {
  it('returns generic prompts when no report is available', () => {
    const prompts = getSuggestedPrompts(null);

    expect(prompts).toBeInstanceOf(Array);
    expect(prompts.length).toBeGreaterThanOrEqual(3);
    // Should contain beginner-friendly prompts
    expect(prompts.some((p) => p.toLowerCase().includes('carbon footprint'))).toBe(true);
  });

  it('returns personalized prompts when report is available', () => {
    const report = makeReport();
    const prompts = getSuggestedPrompts(report);

    expect(prompts).toBeInstanceOf(Array);
    expect(prompts.length).toBeGreaterThanOrEqual(4);
    // Should reference the top category (transportation)
    expect(prompts.some((p) => p.toLowerCase().includes('transportation'))).toBe(true);
  });

  it('includes top category name from breakdown', () => {
    const report = makeReport({
      breakdown: [
        { category: 'food', kgCO2e: 3000, percentage: 50, label: 'Food & Diet', icon: '🍽️', color: '#F9A826' },
        { category: 'energy', kgCO2e: 3000, percentage: 50, label: 'Home Energy', icon: '⚡', color: '#48CAE4' },
      ],
    });
    const prompts = getSuggestedPrompts(report);

    expect(prompts.some((p) => p.toLowerCase().includes('food'))).toBe(true);
  });

  it('handles empty breakdown array gracefully', () => {
    const report = makeReport({ breakdown: [] });
    const prompts = getSuggestedPrompts(report);

    expect(prompts).toBeInstanceOf(Array);
    expect(prompts.length).toBeGreaterThanOrEqual(1);
  });
});

// ===========================================================================
// sendMessage — Fallback Behavior (No API Key)
// ===========================================================================
describe('sendMessage fallback behavior', () => {
  beforeEach(() => {
    resetRateLimit();
  });

  it('returns a fallback response when no API key is provided', async () => {
    const response = await sendMessage('Tell me about my footprint', makeReport(), [], []);
    expect(typeof response).toBe('string');
    expect(response.length).toBeGreaterThan(0);
  });

  it('returns footprint-related fallback for "footprint" keyword', async () => {
    const report = makeReport();
    const response = await sendMessage('What is my carbon footprint?', report, [], []);

    expect(response).toContain(String(report.totalTonnesCO2e));
    expect(response.toLowerCase()).toContain('transportation');
  });

  it('returns footprint prompt to assess when no report exists', async () => {
    const response = await sendMessage('What is my footprint score?', null, [], []);

    expect(response.toLowerCase()).toContain('assessment');
  });

  it('returns transportation tips for "car" keyword', async () => {
    const response = await sendMessage('How can I reduce my car emissions?', null, [], []);

    expect(response.toLowerCase()).toContain('transport');
  });

  it('returns food tips for "diet" keyword', async () => {
    const response = await sendMessage('Tell me about diet impact', null, [], []);

    expect(response.toLowerCase()).toContain('food');
  });

  it('returns energy tips for "energy" keyword', async () => {
    const response = await sendMessage('How to save energy at home?', null, [], []);

    expect(response.toLowerCase()).toContain('led');
  });

  it('returns easy wins for "start" keyword', async () => {
    const response = await sendMessage('Where should I start?', null, [], []);

    expect(response.toLowerCase()).toContain('easy');
  });

  it('returns reduction strategy for "reduce" keyword', async () => {
    const report = makeReport();
    const response = await sendMessage('How do I reduce my emissions?', report, [], []);

    expect(response).toContain('15%');
    // Should include calculated target based on report
    const expectedTarget = Math.round(report.totalKgCO2e * 0.15);
    expect(response).toContain(String(expectedTarget));
  });

  it('returns default encouraging response for unrecognized input', async () => {
    const response = await sendMessage('Tell me something interesting', null, [], []);

    expect(response.toLowerCase()).toContain('sustainability');
  });

  it('returns validation message for empty input', async () => {
    const response = await sendMessage('', null, [], []);

    expect(response.toLowerCase()).toContain('valid message');
  });

  it('handles XSS attempts gracefully and still returns response', async () => {
    const response = await sendMessage('<script>alert("xss")</script>Where should I start?', null, [], []);

    expect(response).not.toContain('<script');
    expect(typeof response).toBe('string');
    expect(response.length).toBeGreaterThan(0);
  });
});

// ===========================================================================
// sendMessage — Rate Limiting
// ===========================================================================
describe('sendMessage rate limiting', () => {
  beforeEach(() => {
    resetRateLimit();
  });

  it('returns rate limit message when too many calls are made', async () => {
    // Exhaust the rate limit (10 calls)
    for (let i = 0; i < 10; i++) {
      await sendMessage(`message ${i}`, null, [], []);
    }

    // 11th call should be rate-limited
    const response = await sendMessage('one more', null, [], []);
    expect(response).toContain('too quickly');
  });

  it('allows calls within the rate limit', async () => {
    const response = await sendMessage('Hello', null, [], []);
    expect(response).not.toContain('too quickly');
  });
});

// ===========================================================================
// generateWeeklySummary — Fallback Behavior
// ===========================================================================
describe('generateWeeklySummary fallback', () => {
  beforeEach(() => {
    resetRateLimit();
  });

  it('returns prompt to complete assessment when no report', async () => {
    const response = await generateWeeklySummary(null, [], []);

    expect(response.toLowerCase()).toContain('assessment');
  });

  it('returns a structured summary fallback when no API key', async () => {
    const report = makeReport();
    const goals = [makeGoal()];
    const recs = [
      makeRecommendation({ completed: true, estimatedReductionKg: 120 }),
      makeRecommendation({ id: 'rec-2', completed: false, estimatedReductionKg: 200 }),
    ];

    const response = await generateWeeklySummary(report, goals, recs);

    // Should contain key stats
    expect(response).toContain(String(report.totalTonnesCO2e));
    expect(response).toContain('1'); // 1 completed recommendation
    expect(response).toContain('120'); // 120 kg saved
    expect(response).toContain('1'); // 1 active goal
  });

  it('includes the top category in the fallback summary', async () => {
    const report = makeReport();
    const response = await generateWeeklySummary(report, [], []);

    expect(response).toContain('Transportation');
  });
});

// ===========================================================================
// generateAIRecommendations — Fallback Behavior
// ===========================================================================
describe('generateAIRecommendations fallback', () => {
  it('returns default recommendations when no report', async () => {
    const recs = await generateAIRecommendations(null);

    expect(recs).toBeInstanceOf(Array);
    expect(recs.length).toBe(5);
    // Default recs should mention concrete actions
    expect(recs.some((r) => r.toLowerCase().includes('led'))).toBe(true);
    expect(recs.some((r) => r.toLowerCase().includes('meatless'))).toBe(true);
  });

  it('returns default recommendations when no API key (report provided)', async () => {
    const report = makeReport();
    const recs = await generateAIRecommendations(report);

    expect(recs).toBeInstanceOf(Array);
    expect(recs.length).toBe(5);
  });

  it('each recommendation is a non-empty string', async () => {
    const recs = await generateAIRecommendations(null);

    recs.forEach((rec) => {
      expect(typeof rec).toBe('string');
      expect(rec.length).toBeGreaterThan(0);
    });
  });
});
