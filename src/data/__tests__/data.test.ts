// ============================================================
// EcoPulse AI — Data Validation Tests
// Comprehensive tests for all exported data structures
// ============================================================

import { describe, it, expect } from 'vitest';
import { getDefaultAssessment, SAMPLE_LEADERBOARD } from '../defaults';
import { BUILT_IN_RECOMMENDATIONS } from '../recommendations';
import { BUILT_IN_CHALLENGES } from '../challenges';
import { BUILT_IN_ACHIEVEMENTS } from '../achievements';
import type { CarbonCategory } from '../../types';

// ===========================================================================
// getDefaultAssessment
// ===========================================================================
describe('getDefaultAssessment', () => {
  it('returns an object with all required top-level sections', () => {
    const assessment = getDefaultAssessment();

    expect(assessment).toHaveProperty('transportation');
    expect(assessment).toHaveProperty('diet');
    expect(assessment).toHaveProperty('electricity');
    expect(assessment).toHaveProperty('shopping');
    expect(assessment).toHaveProperty('waste');
    expect(assessment).toHaveProperty('water');
    expect(assessment).toHaveProperty('travel');
    expect(assessment).toHaveProperty('lifestyle');
  });

  it('has correct types for transportation fields', () => {
    const { transportation } = getDefaultAssessment();

    expect(typeof transportation.commuteDistanceKm).toBe('number');
    expect(typeof transportation.vehicleType).toBe('string');
    expect(typeof transportation.publicTransportDays).toBe('number');
    expect(typeof transportation.rideSharingFrequency).toBe('string');
  });

  it('has correct types for diet fields', () => {
    const { diet } = getDefaultAssessment();

    expect(typeof diet.dietType).toBe('string');
    expect(typeof diet.localFoodPercentage).toBe('number');
    expect(typeof diet.foodWasteLevel).toBe('string');
  });

  it('has correct types for electricity fields', () => {
    const { electricity } = getDefaultAssessment();

    expect(typeof electricity.monthlyBillUSD).toBe('number');
    expect(typeof electricity.householdSize).toBe('number');
    expect(typeof electricity.hasRenewableSource).toBe('boolean');
    expect(typeof electricity.applianceEfficiency).toBe('string');
  });

  it('has correct types for shopping fields', () => {
    const { shopping } = getDefaultAssessment();

    expect(typeof shopping.onlineShoppingFrequency).toBe('string');
    expect(typeof shopping.clothingItemsPerMonth).toBe('number');
    expect(typeof shopping.electronicsPerYear).toBe('number');
    expect(typeof shopping.prefersSustainableBrands).toBe('boolean');
  });

  it('has correct types for waste fields', () => {
    const { waste } = getDefaultAssessment();

    expect(typeof waste.recyclingFrequency).toBe('string');
    expect(typeof waste.composting).toBe('boolean');
    expect(typeof waste.singleUsePlasticFrequency).toBe('string');
  });

  it('has correct types for water fields', () => {
    const { water } = getDefaultAssessment();

    expect(typeof water.showerMinutesPerDay).toBe('number');
    expect(typeof water.laundryLoadsPerWeek).toBe('number');
    expect(typeof water.hasWaterEfficiency).toBe('boolean');
  });

  it('has correct types for travel fields', () => {
    const { travel } = getDefaultAssessment();

    expect(typeof travel.domesticFlightsPerYear).toBe('number');
    expect(typeof travel.internationalFlightsPerYear).toBe('number');
    expect(typeof travel.hotelNightsPerYear).toBe('number');
  });

  it('has correct types for lifestyle fields', () => {
    const { lifestyle } = getDefaultAssessment();

    expect(typeof lifestyle.ecoConsciousnessLevel).toBe('number');
    expect(typeof lifestyle.budgetSensitivity).toBe('string');
    expect(typeof lifestyle.willingnessToChange).toBe('string');
  });

  it('returns a fresh copy on each call (not the same reference)', () => {
    const a = getDefaultAssessment();
    const b = getDefaultAssessment();

    expect(a).toEqual(b);
    expect(a).not.toBe(b);
    expect(a.transportation).not.toBe(b.transportation);
    expect(a.diet).not.toBe(b.diet);
  });

  it('mutations to one copy do not affect subsequent calls', () => {
    const first = getDefaultAssessment();
    first.transportation.commuteDistanceKm = 999;

    const second = getDefaultAssessment();
    expect(second.transportation.commuteDistanceKm).not.toBe(999);
  });

  it('numeric defaults are non-negative', () => {
    const a = getDefaultAssessment();

    expect(a.transportation.commuteDistanceKm).toBeGreaterThanOrEqual(0);
    expect(a.transportation.publicTransportDays).toBeGreaterThanOrEqual(0);
    expect(a.diet.localFoodPercentage).toBeGreaterThanOrEqual(0);
    expect(a.electricity.monthlyBillUSD).toBeGreaterThanOrEqual(0);
    expect(a.electricity.householdSize).toBeGreaterThanOrEqual(1);
    expect(a.shopping.clothingItemsPerMonth).toBeGreaterThanOrEqual(0);
    expect(a.shopping.electronicsPerYear).toBeGreaterThanOrEqual(0);
    expect(a.water.showerMinutesPerDay).toBeGreaterThanOrEqual(0);
    expect(a.water.laundryLoadsPerWeek).toBeGreaterThanOrEqual(0);
    expect(a.travel.domesticFlightsPerYear).toBeGreaterThanOrEqual(0);
    expect(a.travel.internationalFlightsPerYear).toBeGreaterThanOrEqual(0);
    expect(a.travel.hotelNightsPerYear).toBeGreaterThanOrEqual(0);
  });
});

// ===========================================================================
// SAMPLE_LEADERBOARD
// ===========================================================================
describe('SAMPLE_LEADERBOARD', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(SAMPLE_LEADERBOARD)).toBe(true);
    expect(SAMPLE_LEADERBOARD.length).toBeGreaterThan(0);
  });

  it('has sequential ranks starting from 1', () => {
    for (let i = 0; i < SAMPLE_LEADERBOARD.length; i++) {
      expect(SAMPLE_LEADERBOARD[i].rank).toBe(i + 1);
    }
  });

  it('every entry has all required fields', () => {
    for (const entry of SAMPLE_LEADERBOARD) {
      expect(entry).toHaveProperty('rank');
      expect(entry).toHaveProperty('name');
      expect(entry).toHaveProperty('avatar');
      expect(entry).toHaveProperty('streak');
      expect(entry).toHaveProperty('totalCO2SavedKg');
    }
  });

  it('all names are non-empty strings', () => {
    for (const entry of SAMPLE_LEADERBOARD) {
      expect(typeof entry.name).toBe('string');
      expect(entry.name.length).toBeGreaterThan(0);
    }
  });

  it('all avatars are non-empty strings', () => {
    for (const entry of SAMPLE_LEADERBOARD) {
      expect(typeof entry.avatar).toBe('string');
      expect(entry.avatar.length).toBeGreaterThan(0);
    }
  });

  it('all streaks and CO2 saved values are positive', () => {
    for (const entry of SAMPLE_LEADERBOARD) {
      expect(entry.streak).toBeGreaterThan(0);
      expect(entry.totalCO2SavedKg).toBeGreaterThan(0);
    }
  });

  it('ranks are in ascending order', () => {
    for (let i = 1; i < SAMPLE_LEADERBOARD.length; i++) {
      expect(SAMPLE_LEADERBOARD[i].rank).toBeGreaterThan(SAMPLE_LEADERBOARD[i - 1].rank);
    }
  });
});

// ===========================================================================
// BUILT_IN_RECOMMENDATIONS
// ===========================================================================
describe('BUILT_IN_RECOMMENDATIONS', () => {
  const ALL_CATEGORIES: CarbonCategory[] = [
    'transportation', 'food', 'energy', 'shopping', 'waste', 'travel', 'water',
  ];

  it('is a non-empty array', () => {
    expect(Array.isArray(BUILT_IN_RECOMMENDATIONS)).toBe(true);
    expect(BUILT_IN_RECOMMENDATIONS.length).toBeGreaterThan(0);
  });

  it('covers all CarbonCategory values', () => {
    const categories = new Set(BUILT_IN_RECOMMENDATIONS.map((r) => r.category));

    for (const cat of ALL_CATEGORIES) {
      expect(categories.has(cat)).toBe(true);
    }
  });

  it('all estimatedReductionKg values are positive', () => {
    for (const rec of BUILT_IN_RECOMMENDATIONS) {
      expect(rec.estimatedReductionKg).toBeGreaterThan(0);
    }
  });

  it('has no duplicate titles', () => {
    const titles = BUILT_IN_RECOMMENDATIONS.map((r) => r.title);
    const uniqueTitles = new Set(titles);

    expect(uniqueTitles.size).toBe(titles.length);
  });

  it('all entries have required fields', () => {
    for (const rec of BUILT_IN_RECOMMENDATIONS) {
      expect(typeof rec.title).toBe('string');
      expect(rec.title.length).toBeGreaterThan(0);
      expect(typeof rec.description).toBe('string');
      expect(rec.description.length).toBeGreaterThan(0);
      expect(typeof rec.category).toBe('string');
      expect(typeof rec.difficulty).toBe('string');
      expect(typeof rec.impact).toBe('string');
      expect(typeof rec.cost).toBe('string');
      expect(typeof rec.estimatedReductionKg).toBe('number');
    }
  });

  it('difficulty values are valid', () => {
    const validDifficulties = ['easy', 'moderate', 'advanced'];
    for (const rec of BUILT_IN_RECOMMENDATIONS) {
      expect(validDifficulties).toContain(rec.difficulty);
    }
  });

  it('impact values are valid', () => {
    const validImpacts = ['low', 'medium', 'high'];
    for (const rec of BUILT_IN_RECOMMENDATIONS) {
      expect(validImpacts).toContain(rec.impact);
    }
  });

  it('cost values are valid', () => {
    const validCosts = ['free', 'low', 'medium'];
    for (const rec of BUILT_IN_RECOMMENDATIONS) {
      expect(validCosts).toContain(rec.cost);
    }
  });
});

// ===========================================================================
// BUILT_IN_CHALLENGES
// ===========================================================================
describe('BUILT_IN_CHALLENGES', () => {
  const ALL_CATEGORIES: CarbonCategory[] = [
    'transportation', 'food', 'energy', 'shopping', 'waste', 'travel', 'water',
  ];

  it('is a non-empty array', () => {
    expect(Array.isArray(BUILT_IN_CHALLENGES)).toBe(true);
    expect(BUILT_IN_CHALLENGES.length).toBeGreaterThan(0);
  });

  it('tasks.length matches durationDays for every challenge', () => {
    for (const challenge of BUILT_IN_CHALLENGES) {
      expect(challenge.tasks.length).toBe(challenge.durationDays);
    }
  });

  it('all categories from challenges are valid CarbonCategory values', () => {
    for (const challenge of BUILT_IN_CHALLENGES) {
      expect(ALL_CATEGORIES).toContain(challenge.category);
    }
  });

  it('covers most CarbonCategory values', () => {
    const categories = new Set(BUILT_IN_CHALLENGES.map((c) => c.category));
    // Challenges cover at least transportation, food, energy, shopping, waste, water
    expect(categories.size).toBeGreaterThanOrEqual(5);
  });

  it('all challenges have required fields', () => {
    for (const challenge of BUILT_IN_CHALLENGES) {
      expect(typeof challenge.id).toBe('string');
      expect(challenge.id.length).toBeGreaterThan(0);
      expect(typeof challenge.title).toBe('string');
      expect(challenge.title.length).toBeGreaterThan(0);
      expect(typeof challenge.description).toBe('string');
      expect(challenge.description.length).toBeGreaterThan(0);
      expect(typeof challenge.durationDays).toBe('number');
      expect(challenge.durationDays).toBeGreaterThan(0);
      expect(typeof challenge.co2SavingsKg).toBe('number');
      expect(challenge.co2SavingsKg).toBeGreaterThan(0);
      expect(typeof challenge.badgeReward).toBe('string');
      expect(challenge.badgeReward.length).toBeGreaterThan(0);
      expect(typeof challenge.difficulty).toBe('string');
      expect(Array.isArray(challenge.tasks)).toBe(true);
    }
  });

  it('tasks have sequential day numbers', () => {
    for (const challenge of BUILT_IN_CHALLENGES) {
      for (let i = 0; i < challenge.tasks.length; i++) {
        expect(challenge.tasks[i].day).toBe(i + 1);
      }
    }
  });

  it('all tasks start uncompleted', () => {
    for (const challenge of BUILT_IN_CHALLENGES) {
      for (const task of challenge.tasks) {
        expect(task.completed).toBe(false);
      }
    }
  });

  it('has unique challenge IDs', () => {
    const ids = BUILT_IN_CHALLENGES.map((c) => c.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });
});

// ===========================================================================
// BUILT_IN_ACHIEVEMENTS
// ===========================================================================
describe('BUILT_IN_ACHIEVEMENTS', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(BUILT_IN_ACHIEVEMENTS)).toBe(true);
    expect(BUILT_IN_ACHIEVEMENTS.length).toBeGreaterThan(0);
  });

  it('has unique IDs', () => {
    const ids = BUILT_IN_ACHIEVEMENTS.map((a) => a.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('all tiers are valid', () => {
    const validTiers = ['bronze', 'silver', 'gold', 'platinum'];
    for (const achievement of BUILT_IN_ACHIEVEMENTS) {
      expect(validTiers).toContain(achievement.tier);
    }
  });

  it('all four tiers are represented', () => {
    const tiers = new Set(BUILT_IN_ACHIEVEMENTS.map((a) => a.tier));
    expect(tiers.has('bronze')).toBe(true);
    expect(tiers.has('silver')).toBe(true);
    expect(tiers.has('gold')).toBe(true);
    expect(tiers.has('platinum')).toBe(true);
  });

  it('all achievements have required fields', () => {
    for (const achievement of BUILT_IN_ACHIEVEMENTS) {
      expect(typeof achievement.id).toBe('string');
      expect(achievement.id.length).toBeGreaterThan(0);
      expect(typeof achievement.title).toBe('string');
      expect(achievement.title.length).toBeGreaterThan(0);
      expect(typeof achievement.description).toBe('string');
      expect(achievement.description.length).toBeGreaterThan(0);
      expect(typeof achievement.icon).toBe('string');
      expect(achievement.icon.length).toBeGreaterThan(0);
      expect(typeof achievement.category).toBe('string');
      expect(typeof achievement.criteria).toBe('string');
      expect(achievement.criteria.length).toBeGreaterThan(0);
      expect(typeof achievement.tier).toBe('string');
    }
  });

  it('has no duplicate titles', () => {
    const titles = BUILT_IN_ACHIEVEMENTS.map((a) => a.title);
    const uniqueTitles = new Set(titles);
    expect(uniqueTitles.size).toBe(titles.length);
  });
});
