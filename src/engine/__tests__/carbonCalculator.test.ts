// ============================================================
// EcoPulse AI — Carbon Calculator Tests
// Comprehensive tests for all carbon calculation functions
// ============================================================

import { describe, it, expect } from 'vitest';
import {
  calculateTransportation,
  calculateDiet,
  calculateElectricity,
  calculateShopping,
  calculateWaste,
  calculateWater,
  calculateTravel,
  generateCarbonReport,
  treesEquivalent,
  getComparisonText,
} from '../carbonCalculator';
import { EMISSION_FACTORS } from '../emissionFactors';
import type { AssessmentData } from '../../types';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Build a full AssessmentData fixture with sensible defaults.
 * Override any section via the partial parameter.
 */
function makeAssessment(partial?: Partial<AssessmentData>): AssessmentData {
  return {
    transportation: {
      commuteDistanceKm: 15,
      vehicleType: 'car_petrol',
      publicTransportDays: 0,
      rideSharingFrequency: 'never',
    },
    diet: {
      dietType: 'mixed',
      foodWasteLevel: 'sometimes',
      localFoodPercentage: 30,
    },
    electricity: {
      monthlyBillUSD: 80,
      applianceEfficiency: 'mixed',
      hasRenewableSource: false,
      householdSize: 3,
    },
    shopping: {
      onlineShoppingFrequency: 'monthly',
      clothingItemsPerMonth: 2,
      electronicsPerYear: 2,
      prefersSustainableBrands: false,
    },
    waste: {
      recyclingFrequency: 'sometimes',
      composting: false,
      singleUsePlasticFrequency: 'sometimes',
    },
    water: {
      showerMinutesPerDay: 8,
      laundryLoadsPerWeek: 4,
      hasWaterEfficiency: false,
    },
    travel: {
      domesticFlightsPerYear: 2,
      internationalFlightsPerYear: 1,
      hotelNightsPerYear: 10,
    },
    lifestyle: {
      ecoConsciousnessLevel: 3,
      budgetSensitivity: 'medium',
      willingnessToChange: 'medium',
    },
    ...partial,
  };
}

// ===========================================================================
// calculateTransportation
// ===========================================================================
describe('calculateTransportation', () => {
  it('calculates petrol car commute with no public transport or rideshare', () => {
    const result = calculateTransportation({
      commuteDistanceKm: 20,
      vehicleType: 'car_petrol',
      publicTransportDays: 0,
      rideSharingFrequency: 'never',
    });

    // 20 km * 2 (round-trip) * 0.192 * 250 work days = 1920
    expect(result).toBeCloseTo(1920, 0);
  });

  it('returns zero for bicycle commute', () => {
    const result = calculateTransportation({
      commuteDistanceKm: 10,
      vehicleType: 'bicycle',
      publicTransportDays: 0,
      rideSharingFrequency: 'never',
    });

    expect(result).toBe(0);
  });

  it('returns zero for walking commute', () => {
    const result = calculateTransportation({
      commuteDistanceKm: 2,
      vehicleType: 'walk',
      publicTransportDays: 0,
      rideSharingFrequency: 'never',
    });

    expect(result).toBe(0);
  });

  it('returns zero when commuteDistanceKm is 0', () => {
    const result = calculateTransportation({
      commuteDistanceKm: 0,
      vehicleType: 'car_petrol',
      publicTransportDays: 0,
      rideSharingFrequency: 'never',
    });

    expect(result).toBe(0);
  });

  it('accounts for public transport days reducing vehicle days', () => {
    const noPT = calculateTransportation({
      commuteDistanceKm: 10,
      vehicleType: 'car_petrol',
      publicTransportDays: 0,
      rideSharingFrequency: 'never',
    });

    const withPT = calculateTransportation({
      commuteDistanceKm: 10,
      vehicleType: 'car_petrol',
      publicTransportDays: 3,
      rideSharingFrequency: 'never',
    });

    // Public transport has lower per-km emissions than petrol, so total should drop
    expect(withPT).toBeLessThan(noPT);
  });

  it('correctly computes public transport emissions portion', () => {
    // 5 days/week all public transport → 5*52 = 260 pt days
    // Vehicle days = max(0, 250-260) = 0
    const result = calculateTransportation({
      commuteDistanceKm: 10,
      vehicleType: 'car_petrol',
      publicTransportDays: 5,
      rideSharingFrequency: 'never',
    });

    // All trips via public transport: 10*2 * 0.089 * 260 = 462.8
    expect(result).toBeCloseTo(462.8, 0);
  });

  it('applies rideshare multiplier correctly', () => {
    const base = calculateTransportation({
      commuteDistanceKm: 20,
      vehicleType: 'car_petrol',
      publicTransportDays: 0,
      rideSharingFrequency: 'never',
    });

    const always = calculateTransportation({
      commuteDistanceKm: 20,
      vehicleType: 'car_petrol',
      publicTransportDays: 0,
      rideSharingFrequency: 'always',
    });

    // 'always' multiplier = 0.75
    expect(always).toBeCloseTo(base * 0.75, 1);
  });

  it('produces lower emissions for EV vs petrol', () => {
    const petrol = calculateTransportation({
      commuteDistanceKm: 30,
      vehicleType: 'car_petrol',
      publicTransportDays: 0,
      rideSharingFrequency: 'never',
    });

    const ev = calculateTransportation({
      commuteDistanceKm: 30,
      vehicleType: 'car_ev',
      publicTransportDays: 0,
      rideSharingFrequency: 'never',
    });

    expect(ev).toBeLessThan(petrol);
    // EV factor is ~27.6% of petrol → EV should be roughly 27.6% of petrol
    expect(ev / petrol).toBeCloseTo(0.053 / 0.192, 1);
  });

  it('handles hybrid vehicle type', () => {
    const result = calculateTransportation({
      commuteDistanceKm: 25,
      vehicleType: 'car_hybrid',
      publicTransportDays: 0,
      rideSharingFrequency: 'never',
    });

    // 25*2*0.106*250 = 1325
    expect(result).toBeCloseTo(1325, 0);
  });

  it('handles diesel vehicle type', () => {
    const result = calculateTransportation({
      commuteDistanceKm: 25,
      vehicleType: 'car_diesel',
      publicTransportDays: 0,
      rideSharingFrequency: 'never',
    });

    // 25*2*0.171*250 = 2137.5
    expect(result).toBeCloseTo(2137.5, 0);
  });

  it('handles motorcycle vehicle type', () => {
    const result = calculateTransportation({
      commuteDistanceKm: 15,
      vehicleType: 'motorcycle',
      publicTransportDays: 0,
      rideSharingFrequency: 'never',
    });

    // 15*2*0.103*250 = 772.5
    expect(result).toBeCloseTo(772.5, 0);
  });

  it('handles vehicleType "none"', () => {
    const result = calculateTransportation({
      commuteDistanceKm: 10,
      vehicleType: 'none',
      publicTransportDays: 0,
      rideSharingFrequency: 'never',
    });

    expect(result).toBe(0);
  });

  it('clamps vehicle days to zero when PT days exceed work days', () => {
    // 7 pt days/week → 7*52 = 364, work days = 250, vehicle days = max(0, 250-364) = 0
    const result = calculateTransportation({
      commuteDistanceKm: 10,
      vehicleType: 'car_petrol',
      publicTransportDays: 7,
      rideSharingFrequency: 'never',
    });

    // All public transport: 10*2 * 0.089 * 364 = 648.08
    expect(result).toBeCloseTo(648.08, 0);
  });
});

// ===========================================================================
// calculateDiet
// ===========================================================================
describe('calculateDiet', () => {
  it('returns base vegan emissions with no waste and no local food', () => {
    const result = calculateDiet({
      dietType: 'vegan',
      foodWasteLevel: 'never',
      localFoodPercentage: 0,
    });

    expect(result).toBeCloseTo(1500, 0);
  });

  it('returns higher emissions for meat_heavy diet', () => {
    const vegan = calculateDiet({
      dietType: 'vegan',
      foodWasteLevel: 'never',
      localFoodPercentage: 0,
    });

    const meatHeavy = calculateDiet({
      dietType: 'meat_heavy',
      foodWasteLevel: 'never',
      localFoodPercentage: 0,
    });

    expect(meatHeavy).toBeGreaterThan(vegan);
    expect(meatHeavy).toBeCloseTo(3300, 0);
  });

  it('applies food waste multiplier correctly', () => {
    const noWaste = calculateDiet({
      dietType: 'mixed',
      foodWasteLevel: 'never',
      localFoodPercentage: 0,
    });

    const oftenWaste = calculateDiet({
      dietType: 'mixed',
      foodWasteLevel: 'often',
      localFoodPercentage: 0,
    });

    // 'often' multiplier = 1.22
    expect(oftenWaste).toBeCloseTo(noWaste * 1.22, 0);
  });

  it('applies local food reduction correctly', () => {
    const noLocal = calculateDiet({
      dietType: 'mixed',
      foodWasteLevel: 'never',
      localFoodPercentage: 0,
    });

    const halfLocal = calculateDiet({
      dietType: 'mixed',
      foodWasteLevel: 'never',
      localFoodPercentage: 50,
    });

    // localReduction = (50/10) * 0.05 = 0.25, so halfLocal = noLocal * 0.75
    expect(halfLocal).toBeCloseTo(noLocal * 0.75, 0);
  });

  it('handles 100% local food', () => {
    const result = calculateDiet({
      dietType: 'mixed',
      foodWasteLevel: 'never',
      localFoodPercentage: 100,
    });

    // localReduction = (100/10) * 0.05 = 0.50, base * 0.50
    expect(result).toBeCloseTo(2500 * 0.5, 0);
  });

  it('handles zero local food percentage', () => {
    const result = calculateDiet({
      dietType: 'vegetarian',
      foodWasteLevel: 'never',
      localFoodPercentage: 0,
    });

    expect(result).toBeCloseTo(1700, 0);
  });

  it('never returns a negative value', () => {
    // Extreme local food would reduce a lot but Math.max(0, ...) should prevent negatives
    const result = calculateDiet({
      dietType: 'vegan',
      foodWasteLevel: 'never',
      localFoodPercentage: 100,
    });

    expect(result).toBeGreaterThanOrEqual(0);
  });

  it('stacks food waste and local food reductions', () => {
    const result = calculateDiet({
      dietType: 'mixed',
      foodWasteLevel: 'always',
      localFoodPercentage: 50,
    });

    // base=2500, waste multiplier=1.35, local reduction=(50/10)*0.05=0.25
    // 2500 * 1.35 * (1 - 0.25) = 2500 * 1.35 * 0.75 = 2531.25
    expect(result).toBeCloseTo(2531.25, 0);
  });
});

// ===========================================================================
// calculateElectricity
// ===========================================================================
describe('calculateElectricity', () => {
  it('calculates basic electricity emissions', () => {
    const result = calculateElectricity({
      monthlyBillUSD: 100,
      applianceEfficiency: 'mixed',
      hasRenewableSource: false,
      householdSize: 1,
    });

    // 100 * 12 * 5.0 * 1.0 / 1 = 6000
    expect(result).toBeCloseTo(6000, 0);
  });

  it('divides by household size for per-capita emissions', () => {
    const single = calculateElectricity({
      monthlyBillUSD: 100,
      applianceEfficiency: 'mixed',
      hasRenewableSource: false,
      householdSize: 1,
    });

    const family = calculateElectricity({
      monthlyBillUSD: 100,
      applianceEfficiency: 'mixed',
      hasRenewableSource: false,
      householdSize: 4,
    });

    expect(family).toBeCloseTo(single / 4, 0);
  });

  it('applies renewable source reduction (80%)', () => {
    const noRenew = calculateElectricity({
      monthlyBillUSD: 100,
      applianceEfficiency: 'mixed',
      hasRenewableSource: false,
      householdSize: 1,
    });

    const withRenew = calculateElectricity({
      monthlyBillUSD: 100,
      applianceEfficiency: 'mixed',
      hasRenewableSource: true,
      householdSize: 1,
    });

    expect(withRenew).toBeCloseTo(noRenew * 0.2, 0);
  });

  it('applies appliance efficiency multiplier — old appliances', () => {
    const mixed = calculateElectricity({
      monthlyBillUSD: 100,
      applianceEfficiency: 'mixed',
      hasRenewableSource: false,
      householdSize: 1,
    });

    const old = calculateElectricity({
      monthlyBillUSD: 100,
      applianceEfficiency: 'old',
      hasRenewableSource: false,
      householdSize: 1,
    });

    expect(old).toBeCloseTo(mixed * 1.3, 0);
  });

  it('applies appliance efficiency multiplier — efficient appliances', () => {
    const result = calculateElectricity({
      monthlyBillUSD: 100,
      applianceEfficiency: 'efficient',
      hasRenewableSource: false,
      householdSize: 1,
    });

    // 100 * 12 * 5.0 * 0.75 = 4500
    expect(result).toBeCloseTo(4500, 0);
  });

  it('returns zero when monthly bill is zero', () => {
    const result = calculateElectricity({
      monthlyBillUSD: 0,
      applianceEfficiency: 'mixed',
      hasRenewableSource: false,
      householdSize: 1,
    });

    expect(result).toBe(0);
  });

  it('stacks efficiency and renewable reductions', () => {
    const result = calculateElectricity({
      monthlyBillUSD: 200,
      applianceEfficiency: 'efficient',
      hasRenewableSource: true,
      householdSize: 2,
    });

    // 200 * 12 * 5.0 * 0.75 * 0.20 / 2 = 900
    expect(result).toBeCloseTo(900, 0);
  });

  it('handles large household size', () => {
    const result = calculateElectricity({
      monthlyBillUSD: 200,
      applianceEfficiency: 'mixed',
      hasRenewableSource: false,
      householdSize: 10,
    });

    // 200 * 12 * 5.0 / 10 = 1200
    expect(result).toBeCloseTo(1200, 0);
  });

  it('never returns a negative value', () => {
    const result = calculateElectricity({
      monthlyBillUSD: 10,
      applianceEfficiency: 'efficient',
      hasRenewableSource: true,
      householdSize: 5,
    });

    expect(result).toBeGreaterThanOrEqual(0);
  });
});

// ===========================================================================
// calculateShopping
// ===========================================================================
describe('calculateShopping', () => {
  it('calculates monthly shopping with defaults', () => {
    const result = calculateShopping({
      onlineShoppingFrequency: 'monthly',
      clothingItemsPerMonth: 2,
      electronicsPerYear: 1,
      prefersSustainableBrands: false,
    });

    // Online: 12 * 4.8 = 57.6
    // Clothing: 2 * 12 * 23 = 552
    // Electronics: 1 * 300 = 300
    // Total: 57.6 + 552 + 300 = 909.6
    expect(result).toBeCloseTo(909.6, 0);
  });

  it('applies sustainable brand reduction (15%)', () => {
    const base = calculateShopping({
      onlineShoppingFrequency: 'monthly',
      clothingItemsPerMonth: 2,
      electronicsPerYear: 1,
      prefersSustainableBrands: false,
    });

    const sustainable = calculateShopping({
      onlineShoppingFrequency: 'monthly',
      clothingItemsPerMonth: 2,
      electronicsPerYear: 1,
      prefersSustainableBrands: true,
    });

    expect(sustainable).toBeCloseTo(base * 0.85, 0);
  });

  it('handles daily online shopping frequency', () => {
    const result = calculateShopping({
      onlineShoppingFrequency: 'daily',
      clothingItemsPerMonth: 0,
      electronicsPerYear: 0,
      prefersSustainableBrands: false,
    });

    // 250 orders * 4.8 = 1200
    expect(result).toBeCloseTo(1200, 0);
  });

  it('handles rarely online shopping frequency', () => {
    const result = calculateShopping({
      onlineShoppingFrequency: 'rarely',
      clothingItemsPerMonth: 0,
      electronicsPerYear: 0,
      prefersSustainableBrands: false,
    });

    // 6 orders * 4.8 = 28.8
    expect(result).toBeCloseTo(28.8, 0);
  });

  it('handles zero clothing and electronics', () => {
    const result = calculateShopping({
      onlineShoppingFrequency: 'rarely',
      clothingItemsPerMonth: 0,
      electronicsPerYear: 0,
      prefersSustainableBrands: false,
    });

    // Only online: 6 * 4.8 = 28.8
    expect(result).toBeCloseTo(28.8, 0);
  });

  it('calculates high electronics purchases', () => {
    const result = calculateShopping({
      onlineShoppingFrequency: 'rarely',
      clothingItemsPerMonth: 0,
      electronicsPerYear: 5,
      prefersSustainableBrands: false,
    });

    // Online: 6*4.8=28.8, Electronics: 5*300=1500, Total: 1528.8
    expect(result).toBeCloseTo(1528.8, 0);
  });

  it('weekly shopping increases online order emissions', () => {
    const monthly = calculateShopping({
      onlineShoppingFrequency: 'monthly',
      clothingItemsPerMonth: 0,
      electronicsPerYear: 0,
      prefersSustainableBrands: false,
    });

    const weekly = calculateShopping({
      onlineShoppingFrequency: 'weekly',
      clothingItemsPerMonth: 0,
      electronicsPerYear: 0,
      prefersSustainableBrands: false,
    });

    expect(weekly).toBeGreaterThan(monthly);
    // monthly=12*4.8=57.6, weekly=52*4.8=249.6
    expect(weekly).toBeCloseTo(249.6, 0);
  });

  it('never returns negative', () => {
    const result = calculateShopping({
      onlineShoppingFrequency: 'rarely',
      clothingItemsPerMonth: 0,
      electronicsPerYear: 0,
      prefersSustainableBrands: true,
    });

    expect(result).toBeGreaterThanOrEqual(0);
  });
});

// ===========================================================================
// calculateWaste
// ===========================================================================
describe('calculateWaste', () => {
  it('returns base waste with no recycling, no composting, neutral plastic', () => {
    const result = calculateWaste({
      recyclingFrequency: 'never',
      composting: false,
      singleUsePlasticFrequency: 'sometimes',
    });

    // 500 * (1-0) * 1.0 = 500
    expect(result).toBeCloseTo(500, 0);
  });

  it('applies recycling reduction — always recycling', () => {
    const result = calculateWaste({
      recyclingFrequency: 'always',
      composting: false,
      singleUsePlasticFrequency: 'sometimes',
    });

    // 500 * (1-0.45) * 1.0 = 275
    expect(result).toBeCloseTo(275, 0);
  });

  it('applies composting reduction (10%)', () => {
    const noCompost = calculateWaste({
      recyclingFrequency: 'never',
      composting: false,
      singleUsePlasticFrequency: 'sometimes',
    });

    const withCompost = calculateWaste({
      recyclingFrequency: 'never',
      composting: true,
      singleUsePlasticFrequency: 'sometimes',
    });

    expect(withCompost).toBeCloseTo(noCompost * 0.9, 0);
  });

  it('applies plastic multiplier — always using plastic', () => {
    const result = calculateWaste({
      recyclingFrequency: 'never',
      composting: false,
      singleUsePlasticFrequency: 'always',
    });

    // 500 * 1.0 * 1.30 = 650
    expect(result).toBeCloseTo(650, 0);
  });

  it('applies plastic multiplier — never using plastic', () => {
    const result = calculateWaste({
      recyclingFrequency: 'never',
      composting: false,
      singleUsePlasticFrequency: 'never',
    });

    // 500 * 1.0 * 0.85 = 425
    expect(result).toBeCloseTo(425, 0);
  });

  it('stacks all reductions and multipliers', () => {
    const result = calculateWaste({
      recyclingFrequency: 'always',
      composting: true,
      singleUsePlasticFrequency: 'never',
    });

    // 500 * (1-0.45) * (1-0.10) * 0.85 = 500 * 0.55 * 0.90 * 0.85 = 210.375
    expect(result).toBeCloseTo(210.375, 0);
  });

  it('handles "often" recycling', () => {
    const result = calculateWaste({
      recyclingFrequency: 'often',
      composting: false,
      singleUsePlasticFrequency: 'sometimes',
    });

    // 500 * (1-0.30) * 1.0 = 350
    expect(result).toBeCloseTo(350, 0);
  });

  it('never returns negative', () => {
    const result = calculateWaste({
      recyclingFrequency: 'always',
      composting: true,
      singleUsePlasticFrequency: 'never',
    });

    expect(result).toBeGreaterThanOrEqual(0);
  });
});

// ===========================================================================
// calculateWater
// ===========================================================================
describe('calculateWater', () => {
  it('calculates basic water emissions (no efficiency)', () => {
    const result = calculateWater({
      showerMinutesPerDay: 10,
      laundryLoadsPerWeek: 3,
      hasWaterEfficiency: false,
    });

    // Shower: 10 * 0.1 * 365 = 365
    // Laundry: 3 * 2.4 * 52 = 374.4
    // Total: 739.4
    expect(result).toBeCloseTo(739.4, 0);
  });

  it('applies water efficiency reduction (20%)', () => {
    const base = calculateWater({
      showerMinutesPerDay: 10,
      laundryLoadsPerWeek: 3,
      hasWaterEfficiency: false,
    });

    const efficient = calculateWater({
      showerMinutesPerDay: 10,
      laundryLoadsPerWeek: 3,
      hasWaterEfficiency: true,
    });

    expect(efficient).toBeCloseTo(base * 0.8, 0);
  });

  it('returns zero when shower and laundry are zero', () => {
    const result = calculateWater({
      showerMinutesPerDay: 0,
      laundryLoadsPerWeek: 0,
      hasWaterEfficiency: false,
    });

    expect(result).toBe(0);
  });

  it('handles high shower usage', () => {
    const result = calculateWater({
      showerMinutesPerDay: 30,
      laundryLoadsPerWeek: 0,
      hasWaterEfficiency: false,
    });

    // 30 * 0.1 * 365 = 1095
    expect(result).toBeCloseTo(1095, 0);
  });

  it('handles high laundry usage', () => {
    const result = calculateWater({
      showerMinutesPerDay: 0,
      laundryLoadsPerWeek: 14,
      hasWaterEfficiency: false,
    });

    // 14 * 2.4 * 52 = 1747.2
    expect(result).toBeCloseTo(1747.2, 0);
  });

  it('never returns negative', () => {
    const result = calculateWater({
      showerMinutesPerDay: 0,
      laundryLoadsPerWeek: 0,
      hasWaterEfficiency: true,
    });

    expect(result).toBeGreaterThanOrEqual(0);
  });
});

// ===========================================================================
// calculateTravel
// ===========================================================================
describe('calculateTravel', () => {
  it('calculates travel with all types of flights and hotel', () => {
    const result = calculateTravel({
      domesticFlightsPerYear: 4,
      internationalFlightsPerYear: 1,
      hotelNightsPerYear: 10,
    });

    // 4*255 + 1*1100 + 10*21 = 1020 + 1100 + 210 = 2330
    expect(result).toBeCloseTo(2330, 0);
  });

  it('returns zero when all travel inputs are zero', () => {
    const result = calculateTravel({
      domesticFlightsPerYear: 0,
      internationalFlightsPerYear: 0,
      hotelNightsPerYear: 0,
    });

    expect(result).toBe(0);
  });

  it('handles only domestic flights', () => {
    const result = calculateTravel({
      domesticFlightsPerYear: 6,
      internationalFlightsPerYear: 0,
      hotelNightsPerYear: 0,
    });

    // 6 * 255 = 1530
    expect(result).toBeCloseTo(1530, 0);
  });

  it('handles only international flights', () => {
    const result = calculateTravel({
      domesticFlightsPerYear: 0,
      internationalFlightsPerYear: 3,
      hotelNightsPerYear: 0,
    });

    // 3 * 1100 = 3300
    expect(result).toBeCloseTo(3300, 0);
  });

  it('handles only hotel nights', () => {
    const result = calculateTravel({
      domesticFlightsPerYear: 0,
      internationalFlightsPerYear: 0,
      hotelNightsPerYear: 30,
    });

    // 30 * 21 = 630
    expect(result).toBeCloseTo(630, 0);
  });

  it('handles high frequency traveller', () => {
    const result = calculateTravel({
      domesticFlightsPerYear: 20,
      internationalFlightsPerYear: 10,
      hotelNightsPerYear: 100,
    });

    // 20*255 + 10*1100 + 100*21 = 5100 + 11000 + 2100 = 18200
    expect(result).toBeCloseTo(18200, 0);
  });
});

// ===========================================================================
// generateCarbonReport
// ===========================================================================
describe('generateCarbonReport', () => {
  it('produces a report with all required fields', () => {
    const assessment = makeAssessment();
    const report = generateCarbonReport(assessment);

    expect(report).toBeDefined();
    expect(report.id).toBeDefined();
    expect(typeof report.id).toBe('string');
    expect(report.totalKgCO2e).toBeGreaterThan(0);
    expect(report.totalTonnesCO2e).toBeGreaterThan(0);
    expect(report.breakdown).toHaveLength(7);
    expect(report.benchmarks).toBeDefined();
    expect(report.createdAt).toBeDefined();
    expect(report.assessmentData).toEqual(assessment);
  });

  it('breakdown covers all 7 categories', () => {
    const report = generateCarbonReport(makeAssessment());
    const categories = report.breakdown.map((b) => b.category);

    expect(categories).toContain('transportation');
    expect(categories).toContain('food');
    expect(categories).toContain('energy');
    expect(categories).toContain('shopping');
    expect(categories).toContain('waste');
    expect(categories).toContain('travel');
    expect(categories).toContain('water');
  });

  it('breakdown percentages sum to approximately 100', () => {
    const report = generateCarbonReport(makeAssessment());
    const totalPercentage = report.breakdown.reduce((s, b) => s + b.percentage, 0);

    // Due to rounding, allow ±5%
    expect(totalPercentage).toBeGreaterThanOrEqual(95);
    expect(totalPercentage).toBeLessThanOrEqual(105);
  });

  it('breakdown is sorted by kgCO2e descending', () => {
    const report = generateCarbonReport(makeAssessment());

    for (let i = 1; i < report.breakdown.length; i++) {
      expect(report.breakdown[i - 1].kgCO2e).toBeGreaterThanOrEqual(
        report.breakdown[i].kgCO2e
      );
    }
  });

  it('totalTonnesCO2e equals totalKgCO2e / 1000 (rounded to 1 decimal)', () => {
    const report = generateCarbonReport(makeAssessment());
    const expected = parseFloat((report.totalKgCO2e / 1000).toFixed(1));

    expect(report.totalTonnesCO2e).toBeCloseTo(expected, 1);
  });

  it('totalKgCO2e equals sum of breakdown items', () => {
    const report = generateCarbonReport(makeAssessment());
    const sumBreakdown = report.breakdown.reduce((s, b) => s + b.kgCO2e, 0);

    // Both are rounded, so allow ±7 (rounding of 7 categories)
    expect(Math.abs(report.totalKgCO2e - sumBreakdown)).toBeLessThanOrEqual(7);
  });

  it('includes benchmark values from emission factors', () => {
    const report = generateCarbonReport(makeAssessment());

    expect(report.benchmarks.globalAverage).toBe(
      EMISSION_FACTORS.benchmarks.globalAverage * 1000
    );
    expect(report.benchmarks.nationalAverage).toBe(
      EMISSION_FACTORS.benchmarks.indiaAverage * 1000
    );
    expect(report.benchmarks.ecoTarget).toBe(
      EMISSION_FACTORS.benchmarks.ecoTarget * 1000
    );
  });

  it('breakdown items have label, icon, and color', () => {
    const report = generateCarbonReport(makeAssessment());

    for (const item of report.breakdown) {
      expect(item.label).toBeTruthy();
      expect(item.icon).toBeTruthy();
      expect(item.color).toBeTruthy();
    }
  });

  it('handles zero-emission scenario (bicycle, vegan, etc.)', () => {
    const assessment = makeAssessment({
      transportation: {
        commuteDistanceKm: 0,
        vehicleType: 'bicycle',
        publicTransportDays: 0,
        rideSharingFrequency: 'never',
      },
      electricity: {
        monthlyBillUSD: 0,
        applianceEfficiency: 'efficient',
        hasRenewableSource: true,
        householdSize: 1,
      },
      travel: {
        domesticFlightsPerYear: 0,
        internationalFlightsPerYear: 0,
        hotelNightsPerYear: 0,
      },
      water: {
        showerMinutesPerDay: 0,
        laundryLoadsPerWeek: 0,
        hasWaterEfficiency: true,
      },
    });

    const report = generateCarbonReport(assessment);

    // Transport, electricity, travel, water should be 0
    // Diet, shopping, waste will still have values
    expect(report.totalKgCO2e).toBeGreaterThan(0);
  });
});

// ===========================================================================
// treesEquivalent
// ===========================================================================
describe('treesEquivalent', () => {
  it('divides by 22 and rounds', () => {
    expect(treesEquivalent(220)).toBe(10);
    expect(treesEquivalent(22)).toBe(1);
    expect(treesEquivalent(0)).toBe(0);
  });

  it('rounds correctly for non-exact divisions', () => {
    expect(treesEquivalent(100)).toBe(Math.round(100 / 22)); // 5
    expect(treesEquivalent(50)).toBe(Math.round(50 / 22));   // 2
    expect(treesEquivalent(11)).toBe(Math.round(11 / 22));   // 1 (rounds to nearest)
  });

  it('handles large values', () => {
    expect(treesEquivalent(10000)).toBe(Math.round(10000 / 22)); // 455
  });

  it('handles very small values', () => {
    expect(treesEquivalent(1)).toBe(0);
    expect(treesEquivalent(10)).toBe(0);
    expect(treesEquivalent(11)).toBe(1);
  });
});

// ===========================================================================
// getComparisonText
// ===========================================================================
describe('getComparisonText', () => {
  it('returns Paris Agreement text when below 2.0 tonnes', () => {
    const text = getComparisonText(1.5);
    expect(text).toContain('Paris Agreement');
  });

  it('returns Paris Agreement text when exactly at 2.0 tonnes', () => {
    const text = getComparisonText(2.0);
    expect(text).toContain('Paris Agreement');
  });

  it('returns eco target text when between 2.0 and 2.5 tonnes', () => {
    const text = getComparisonText(2.3);
    expect(text).toContain('science-based target');
  });

  it('returns eco target text when exactly at 2.5 tonnes', () => {
    const text = getComparisonText(2.5);
    expect(text).toContain('science-based target');
  });

  it('returns below global average text when between 2.5 and 4.8', () => {
    const text = getComparisonText(3.5);
    expect(text).toContain('below the global average');
  });

  it('returns below global average text when exactly at 4.8', () => {
    const text = getComparisonText(4.8);
    expect(text).toContain('below the global average');
  });

  it('returns above global average text when above 4.8', () => {
    const text = getComparisonText(10.0);
    expect(text).toContain('above the global average');
  });

  it('returns above global average text for extreme values', () => {
    const text = getComparisonText(50.0);
    expect(text).toContain('above the global average');
  });

  it('handles zero tonnes', () => {
    const text = getComparisonText(0);
    expect(text).toContain('Paris Agreement');
  });
});
