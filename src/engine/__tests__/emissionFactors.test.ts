// ============================================================
// EcoPulse AI — Emission Factors Tests
// Validate structure, keys, and numeric values
// ============================================================

import { describe, it, expect } from 'vitest';
import { EMISSION_FACTORS } from '../emissionFactors';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Recursively collect all numeric values from a nested object.
 * Returns an array of { path, value } pairs for every number found.
 */
function collectNumericValues(
  obj: Record<string, unknown>,
  prefix = ''
): { path: string; value: number }[] {
  const results: { path: string; value: number }[] = [];

  for (const [key, val] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof val === 'number') {
      results.push({ path, value: val });
    } else if (typeof val === 'object' && val !== null && typeof val !== 'boolean') {
      results.push(...collectNumericValues(val as Record<string, unknown>, path));
    }
  }

  return results;
}

// ===========================================================================
// Top-level structure
// ===========================================================================
describe('EMISSION_FACTORS — structure', () => {
  const expectedTopLevelKeys = [
    'transport',
    'diet',
    'electricity',
    'shopping',
    'waste',
    'water',
    'travel',
    'benchmarks',
  ];

  it('has all expected top-level keys', () => {
    for (const key of expectedTopLevelKeys) {
      expect(EMISSION_FACTORS).toHaveProperty(key);
    }
  });

  it('has no unexpected top-level keys', () => {
    const actualKeys = Object.keys(EMISSION_FACTORS);
    for (const key of actualKeys) {
      expect(expectedTopLevelKeys).toContain(key);
    }
  });
});

// ===========================================================================
// No negative emission factors
// ===========================================================================
describe('EMISSION_FACTORS — no negative values', () => {
  const allValues = collectNumericValues(EMISSION_FACTORS as unknown as Record<string, unknown>);

  it('has numeric values to validate', () => {
    expect(allValues.length).toBeGreaterThan(0);
  });

  for (const { path, value } of allValues) {
    it(`${path} (${value}) is non-negative`, () => {
      expect(value).toBeGreaterThanOrEqual(0);
    });
  }
});

// ===========================================================================
// Transport section
// ===========================================================================
describe('EMISSION_FACTORS.transport', () => {
  const transport = EMISSION_FACTORS.transport;

  it('has all vehicle type keys', () => {
    const expectedKeys = [
      'car_petrol', 'car_diesel', 'car_hybrid', 'car_ev',
      'motorcycle', 'bicycle', 'walk', 'none',
      'publicTransport', 'rideshare',
    ];
    for (const key of expectedKeys) {
      expect(transport).toHaveProperty(key);
    }
  });

  it('bicycle, walk, and none have zero emissions', () => {
    expect(transport.bicycle).toBe(0);
    expect(transport.walk).toBe(0);
    expect(transport.none).toBe(0);
  });

  it('car_ev < car_hybrid < car_diesel < car_petrol', () => {
    expect(transport.car_ev).toBeLessThan(transport.car_hybrid);
    expect(transport.car_hybrid).toBeLessThan(transport.car_diesel);
    // Diesel can be less than petrol per DEFRA data
    expect(transport.car_diesel).toBeLessThan(transport.car_petrol);
  });

  it('publicTransport is less than car_petrol', () => {
    expect(transport.publicTransport).toBeLessThan(transport.car_petrol);
  });
});

// ===========================================================================
// Diet section
// ===========================================================================
describe('EMISSION_FACTORS.diet', () => {
  const diet = EMISSION_FACTORS.diet;

  it('has all diet type keys', () => {
    expect(diet).toHaveProperty('vegan');
    expect(diet).toHaveProperty('vegetarian');
    expect(diet).toHaveProperty('mixed');
    expect(diet).toHaveProperty('meat_heavy');
  });

  it('vegan < vegetarian < mixed < meat_heavy', () => {
    expect(diet.vegan).toBeLessThan(diet.vegetarian);
    expect(diet.vegetarian).toBeLessThan(diet.mixed);
    expect(diet.mixed).toBeLessThan(diet.meat_heavy);
  });

  it('has all foodWasteMultiplier frequency keys', () => {
    const fwm = diet.foodWasteMultiplier;
    expect(fwm).toHaveProperty('never');
    expect(fwm).toHaveProperty('rarely');
    expect(fwm).toHaveProperty('sometimes');
    expect(fwm).toHaveProperty('often');
    expect(fwm).toHaveProperty('always');
  });

  it('foodWasteMultiplier.never is 1.0 (baseline)', () => {
    expect(diet.foodWasteMultiplier.never).toBe(1.0);
  });

  it('foodWasteMultipliers increase with frequency', () => {
    const fwm = diet.foodWasteMultiplier;
    expect(fwm.rarely).toBeGreaterThan(fwm.never);
    expect(fwm.sometimes).toBeGreaterThan(fwm.rarely);
    expect(fwm.often).toBeGreaterThan(fwm.sometimes);
    expect(fwm.always).toBeGreaterThan(fwm.often);
  });

  it('localFoodReduction is a positive fraction', () => {
    expect(diet.localFoodReduction).toBeGreaterThan(0);
    expect(diet.localFoodReduction).toBeLessThan(1);
  });
});

// ===========================================================================
// Electricity section
// ===========================================================================
describe('EMISSION_FACTORS.electricity', () => {
  const elec = EMISSION_FACTORS.electricity;

  it('perDollar is a positive number', () => {
    expect(elec.perDollar).toBeGreaterThan(0);
  });

  it('renewableReduction is between 0 and 1', () => {
    expect(elec.renewableReduction).toBeGreaterThan(0);
    expect(elec.renewableReduction).toBeLessThanOrEqual(1);
  });

  it('has all efficiency multiplier keys', () => {
    expect(elec.efficiencyMultiplier).toHaveProperty('old');
    expect(elec.efficiencyMultiplier).toHaveProperty('mixed');
    expect(elec.efficiencyMultiplier).toHaveProperty('efficient');
  });

  it('efficient < mixed < old multipliers', () => {
    expect(elec.efficiencyMultiplier.efficient).toBeLessThan(elec.efficiencyMultiplier.mixed);
    expect(elec.efficiencyMultiplier.mixed).toBeLessThan(elec.efficiencyMultiplier.old);
  });
});

// ===========================================================================
// Shopping section
// ===========================================================================
describe('EMISSION_FACTORS.shopping', () => {
  const shop = EMISSION_FACTORS.shopping;

  it('has all frequency multiplier keys', () => {
    expect(shop.frequencyMultiplier).toHaveProperty('rarely');
    expect(shop.frequencyMultiplier).toHaveProperty('monthly');
    expect(shop.frequencyMultiplier).toHaveProperty('weekly');
    expect(shop.frequencyMultiplier).toHaveProperty('daily');
  });

  it('frequencyMultiplier values increase with frequency', () => {
    const fm = shop.frequencyMultiplier;
    expect(fm.rarely).toBeLessThan(fm.monthly);
    expect(fm.monthly).toBeLessThan(fm.weekly);
    expect(fm.weekly).toBeLessThan(fm.daily);
  });

  it('sustainableBrandReduction is between 0 and 1', () => {
    expect(shop.sustainableBrandReduction).toBeGreaterThan(0);
    expect(shop.sustainableBrandReduction).toBeLessThan(1);
  });
});

// ===========================================================================
// Waste section
// ===========================================================================
describe('EMISSION_FACTORS.waste', () => {
  const waste = EMISSION_FACTORS.waste;

  it('has all recycling reduction frequency keys', () => {
    const rr = waste.recyclingReduction;
    expect(rr).toHaveProperty('never');
    expect(rr).toHaveProperty('rarely');
    expect(rr).toHaveProperty('sometimes');
    expect(rr).toHaveProperty('often');
    expect(rr).toHaveProperty('always');
  });

  it('has all plastic multiplier frequency keys', () => {
    const pm = waste.plasticMultiplier;
    expect(pm).toHaveProperty('never');
    expect(pm).toHaveProperty('rarely');
    expect(pm).toHaveProperty('sometimes');
    expect(pm).toHaveProperty('often');
    expect(pm).toHaveProperty('always');
  });

  it('recycling reductions increase with frequency', () => {
    const rr = waste.recyclingReduction;
    expect(rr.never).toBeLessThanOrEqual(rr.rarely);
    expect(rr.rarely).toBeLessThanOrEqual(rr.sometimes);
    expect(rr.sometimes).toBeLessThanOrEqual(rr.often);
    expect(rr.often).toBeLessThanOrEqual(rr.always);
  });

  it('plastic multipliers increase with frequency', () => {
    const pm = waste.plasticMultiplier;
    expect(pm.never).toBeLessThan(pm.rarely);
    expect(pm.rarely).toBeLessThan(pm.sometimes);
    expect(pm.sometimes).toBeLessThan(pm.often);
    expect(pm.often).toBeLessThan(pm.always);
  });
});

// ===========================================================================
// Water section
// ===========================================================================
describe('EMISSION_FACTORS.water', () => {
  it('perShowerMinute is positive', () => {
    expect(EMISSION_FACTORS.water.perShowerMinute).toBeGreaterThan(0);
  });

  it('perLaundryLoad is positive', () => {
    expect(EMISSION_FACTORS.water.perLaundryLoad).toBeGreaterThan(0);
  });

  it('waterEfficiencyReduction is between 0 and 1', () => {
    expect(EMISSION_FACTORS.water.waterEfficiencyReduction).toBeGreaterThan(0);
    expect(EMISSION_FACTORS.water.waterEfficiencyReduction).toBeLessThan(1);
  });
});

// ===========================================================================
// Travel section
// ===========================================================================
describe('EMISSION_FACTORS.travel', () => {
  it('domesticFlight is positive', () => {
    expect(EMISSION_FACTORS.travel.domesticFlight).toBeGreaterThan(0);
  });

  it('internationalFlight is greater than domesticFlight', () => {
    expect(EMISSION_FACTORS.travel.internationalFlight).toBeGreaterThan(
      EMISSION_FACTORS.travel.domesticFlight
    );
  });

  it('hotelNight is positive', () => {
    expect(EMISSION_FACTORS.travel.hotelNight).toBeGreaterThan(0);
  });
});

// ===========================================================================
// Benchmarks section
// ===========================================================================
describe('EMISSION_FACTORS.benchmarks', () => {
  const benchmarks = EMISSION_FACTORS.benchmarks;

  it('has all expected benchmark keys', () => {
    expect(benchmarks).toHaveProperty('globalAverage');
    expect(benchmarks).toHaveProperty('usAverage');
    expect(benchmarks).toHaveProperty('euAverage');
    expect(benchmarks).toHaveProperty('indiaAverage');
    expect(benchmarks).toHaveProperty('ecoTarget');
    expect(benchmarks).toHaveProperty('parisAgreementTarget');
  });

  it('parisAgreementTarget < ecoTarget < globalAverage < usAverage', () => {
    expect(benchmarks.parisAgreementTarget).toBeLessThan(benchmarks.ecoTarget);
    expect(benchmarks.ecoTarget).toBeLessThan(benchmarks.globalAverage);
    expect(benchmarks.globalAverage).toBeLessThan(benchmarks.usAverage);
  });

  it('indiaAverage is less than globalAverage', () => {
    expect(benchmarks.indiaAverage).toBeLessThan(benchmarks.globalAverage);
  });
});
