// ============================================================
// EcoPulse AI — Achievements Logic Tests
// Tests for checkAchievements() unlock conditions
// ============================================================

import { describe, it, expect } from 'vitest';
import { checkAchievements } from '../achievements';
import type { CarbonReport, Goal, Recommendation } from '../../types';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Minimal CarbonReport stub for tests that just need a non-null report. */
function makeReport(): CarbonReport {
  return {
    id: 'test-report-1',
    totalKgCO2e: 5000,
    totalTonnesCO2e: 5.0,
    breakdown: [],
    benchmarks: { globalAverage: 4800, nationalAverage: 1900, ecoTarget: 2500 },
    createdAt: new Date().toISOString(),
    assessmentData: {
      transportation: { commuteDistanceKm: 10, vehicleType: 'car_petrol', publicTransportDays: 0, rideSharingFrequency: 'never' },
      diet: { dietType: 'mixed', localFoodPercentage: 20, foodWasteLevel: 'sometimes' },
      electricity: { monthlyBillUSD: 80, householdSize: 3, hasRenewableSource: false, applianceEfficiency: 'mixed' },
      shopping: { onlineShoppingFrequency: 'monthly', clothingItemsPerMonth: 2, electronicsPerYear: 2, prefersSustainableBrands: false },
      waste: { recyclingFrequency: 'sometimes', composting: false, singleUsePlasticFrequency: 'often' },
      water: { showerMinutesPerDay: 8, laundryLoadsPerWeek: 3, hasWaterEfficiency: false },
      travel: { domesticFlightsPerYear: 2, internationalFlightsPerYear: 0, hotelNightsPerYear: 5 },
      lifestyle: { ecoConsciousnessLevel: 3, budgetSensitivity: 'medium', willingnessToChange: 'medium' },
    },
  };
}

/** Create a completed recommendation with optional overrides. */
function makeRec(overrides?: Partial<Recommendation>): Recommendation {
  return {
    id: crypto.randomUUID(),
    title: 'Test Rec',
    description: 'A test recommendation',
    category: 'energy',
    difficulty: 'easy',
    impact: 'low',
    cost: 'free',
    estimatedReductionKg: 10,
    completed: true,
    completedAt: new Date().toISOString(),
    ...overrides,
  };
}

/** Create a goal with optional overrides. */
function makeGoal(overrides?: Partial<Goal>): Goal {
  return {
    id: crypto.randomUUID(),
    title: 'Test Goal',
    description: 'A test goal',
    category: 'energy',
    targetFrequency: 'daily',
    startDate: new Date().toISOString(),
    streak: 0,
    bestStreak: 0,
    progress: 0,
    status: 'active',
    checkins: [],
    ...overrides,
  };
}

// ===========================================================================
// checkAchievements — basic behavior
// ===========================================================================
describe('checkAchievements', () => {
  it('returns empty array when nothing qualifies', () => {
    const result = checkAchievements(null, [], [], []);
    expect(result).toEqual([]);
  });

  it('unlocks eco_beginner when a report exists', () => {
    const result = checkAchievements(makeReport(), [], [], []);
    const ids = result.map((a) => a.id);
    expect(ids).toContain('eco_beginner');
  });

  it('also unlocks carbon_aware when a report exists', () => {
    const result = checkAchievements(makeReport(), [], [], []);
    const ids = result.map((a) => a.id);
    expect(ids).toContain('carbon_aware');
  });

  it('unlocks first_action with 1 completed recommendation', () => {
    const recs = [makeRec()];
    const result = checkAchievements(null, [], recs, []);
    const ids = result.map((a) => a.id);
    expect(ids).toContain('first_action');
  });

  it('unlocks goal_setter with 1 goal', () => {
    const goals = [makeGoal()];
    const result = checkAchievements(null, goals, [], []);
    const ids = result.map((a) => a.id);
    expect(ids).toContain('goal_setter');
  });

  // -----------------------------------------------------------------------
  // Streak-based achievements
  // -----------------------------------------------------------------------
  it('unlocks week_warrior at 7-day streak', () => {
    const goals = [makeGoal({ bestStreak: 7 })];
    const result = checkAchievements(null, goals, [], []);
    const ids = result.map((a) => a.id);
    expect(ids).toContain('week_warrior');
  });

  it('does NOT unlock week_warrior at 6-day streak', () => {
    const goals = [makeGoal({ bestStreak: 6 })];
    const result = checkAchievements(null, goals, [], []);
    const ids = result.map((a) => a.id);
    expect(ids).not.toContain('week_warrior');
  });

  it('unlocks month_master at 30-day streak', () => {
    const goals = [makeGoal({ bestStreak: 30 })];
    const result = checkAchievements(null, goals, [], []);
    const ids = result.map((a) => a.id);
    expect(ids).toContain('month_master');
  });

  it('does NOT unlock month_master at 29-day streak', () => {
    const goals = [makeGoal({ bestStreak: 29 })];
    const result = checkAchievements(null, goals, [], []);
    const ids = result.map((a) => a.id);
    expect(ids).not.toContain('month_master');
  });

  // -----------------------------------------------------------------------
  // CO2 savings thresholds
  // -----------------------------------------------------------------------
  it('unlocks carbon_reducer at exactly 100kg saved', () => {
    const recs = [makeRec({ estimatedReductionKg: 100 })];
    const result = checkAchievements(null, [], recs, []);
    const ids = result.map((a) => a.id);
    expect(ids).toContain('carbon_reducer');
  });

  it('does NOT unlock carbon_reducer at 99kg saved', () => {
    const recs = [makeRec({ estimatedReductionKg: 99 })];
    const result = checkAchievements(null, [], recs, []);
    const ids = result.map((a) => a.id);
    expect(ids).not.toContain('carbon_reducer');
  });

  it('unlocks half_ton_hero at exactly 500kg saved', () => {
    const recs = [makeRec({ estimatedReductionKg: 500 })];
    const result = checkAchievements(null, [], recs, []);
    const ids = result.map((a) => a.id);
    expect(ids).toContain('half_ton_hero');
  });

  it('does NOT unlock half_ton_hero at 499kg saved', () => {
    const recs = [makeRec({ estimatedReductionKg: 499 })];
    const result = checkAchievements(null, [], recs, []);
    const ids = result.map((a) => a.id);
    expect(ids).not.toContain('half_ton_hero');
  });

  // -----------------------------------------------------------------------
  // Category-based achievements
  // -----------------------------------------------------------------------
  it('unlocks conscious_commuter with 3 transportation recommendations', () => {
    const recs = Array.from({ length: 3 }, () =>
      makeRec({ category: 'transportation' })
    );
    const result = checkAchievements(null, [], recs, []);
    const ids = result.map((a) => a.id);
    expect(ids).toContain('conscious_commuter');
  });

  it('unlocks green_eater with 3 food recommendations', () => {
    const recs = Array.from({ length: 3 }, () =>
      makeRec({ category: 'food' })
    );
    const result = checkAchievements(null, [], recs, []);
    const ids = result.map((a) => a.id);
    expect(ids).toContain('green_eater');
  });

  // -----------------------------------------------------------------------
  // Compound condition — sustainability_champion
  // -----------------------------------------------------------------------
  it('unlocks sustainability_champion with 15 recs + 3 active goals', () => {
    const recs = Array.from({ length: 15 }, () => makeRec());
    const goals = Array.from({ length: 3 }, () => makeGoal({ status: 'active' }));
    const result = checkAchievements(null, goals, recs, []);
    const ids = result.map((a) => a.id);
    expect(ids).toContain('sustainability_champion');
  });

  it('does NOT unlock sustainability_champion with 14 recs + 3 goals', () => {
    const recs = Array.from({ length: 14 }, () => makeRec());
    const goals = Array.from({ length: 3 }, () => makeGoal({ status: 'active' }));
    const result = checkAchievements(null, goals, recs, []);
    const ids = result.map((a) => a.id);
    expect(ids).not.toContain('sustainability_champion');
  });

  it('does NOT unlock sustainability_champion with 15 recs + 2 active goals', () => {
    const recs = Array.from({ length: 15 }, () => makeRec());
    const goals = Array.from({ length: 2 }, () => makeGoal({ status: 'active' }));
    const result = checkAchievements(null, goals, recs, []);
    const ids = result.map((a) => a.id);
    expect(ids).not.toContain('sustainability_champion');
  });

  it('does NOT unlock sustainability_champion when goals are completed, not active', () => {
    const recs = Array.from({ length: 15 }, () => makeRec());
    const goals = Array.from({ length: 3 }, () => makeGoal({ status: 'completed' }));
    const result = checkAchievements(null, goals, recs, []);
    const ids = result.map((a) => a.id);
    expect(ids).not.toContain('sustainability_champion');
  });

  // -----------------------------------------------------------------------
  // Already-unlocked filtering
  // -----------------------------------------------------------------------
  it('does NOT re-unlock already-unlocked achievements', () => {
    const result = checkAchievements(
      makeReport(),
      [makeGoal()],
      [makeRec()],
      ['eco_beginner', 'carbon_aware', 'first_action', 'goal_setter']
    );
    const ids = result.map((a) => a.id);

    expect(ids).not.toContain('eco_beginner');
    expect(ids).not.toContain('carbon_aware');
    expect(ids).not.toContain('first_action');
    expect(ids).not.toContain('goal_setter');
  });

  // -----------------------------------------------------------------------
  // Edge cases
  // -----------------------------------------------------------------------
  it('handles empty arrays gracefully', () => {
    const result = checkAchievements(null, [], [], []);
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(0);
  });

  it('handles null report gracefully', () => {
    const result = checkAchievements(null, [makeGoal()], [makeRec()], []);
    // Should not include eco_beginner or carbon_aware
    const ids = result.map((a) => a.id);
    expect(ids).not.toContain('eco_beginner');
    expect(ids).not.toContain('carbon_aware');
  });

  it('only counts completed recommendations', () => {
    const recs = [makeRec({ completed: false })];
    const result = checkAchievements(null, [], recs, []);
    const ids = result.map((a) => a.id);
    expect(ids).not.toContain('first_action');
  });

  it('unlocks multiple achievements simultaneously', () => {
    const recs = Array.from({ length: 15 }, (_, i) =>
      makeRec({
        estimatedReductionKg: 50,
        category: i < 3 ? 'transportation' : i < 6 ? 'food' : 'energy',
      })
    );
    const goals = Array.from({ length: 3 }, () =>
      makeGoal({ bestStreak: 30, status: 'active' })
    );

    const result = checkAchievements(makeReport(), goals, recs, []);
    const ids = result.map((a) => a.id);

    // Should unlock many at once
    expect(ids).toContain('eco_beginner');
    expect(ids).toContain('carbon_aware');
    expect(ids).toContain('first_action');
    expect(ids).toContain('goal_setter');
    expect(ids).toContain('week_warrior');
    expect(ids).toContain('month_master');
    expect(ids).toContain('conscious_commuter');
    expect(ids).toContain('green_eater');
    expect(ids).toContain('sustainability_champion');
    // totalSaved = 15 * 50 = 750 → carbon_reducer + half_ton_hero
    expect(ids).toContain('carbon_reducer');
    expect(ids).toContain('half_ton_hero');
  });

  it('newly unlocked achievements have unlockedAt set', () => {
    const result = checkAchievements(makeReport(), [], [], []);

    for (const achievement of result) {
      expect(achievement.unlockedAt).toBeDefined();
      expect(typeof achievement.unlockedAt).toBe('string');
    }
  });

  it('challenge_champion is always false (checked separately)', () => {
    // Even with lots of data, challenge_champion should not be unlocked here
    const recs = Array.from({ length: 20 }, () => makeRec());
    const goals = Array.from({ length: 5 }, () => makeGoal({ bestStreak: 100 }));
    const result = checkAchievements(makeReport(), goals, recs, []);
    const ids = result.map((a) => a.id);
    expect(ids).not.toContain('challenge_champion');
  });
});
