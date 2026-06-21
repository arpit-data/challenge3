// ============================================================
// EcoPulse AI — Carbon Calculator Engine
// Pure functions for calculating carbon footprint by category
// ============================================================

import type {
  AssessmentData,
  CarbonReport,
  CategoryBreakdown,
  CarbonCategory,
} from '../types';
import { EMISSION_FACTORS } from './emissionFactors';

const DAYS_PER_YEAR = 365;
const WEEKS_PER_YEAR = 52;

/**
 * Category metadata for display purposes
 */
const CATEGORY_META: Record<CarbonCategory, { label: string; icon: string; color: string }> = {
  transportation: { label: 'Transportation', icon: '🚗', color: '#FF6B6B' },
  food:           { label: 'Food & Diet',    icon: '🥗', color: '#51CF66' },
  energy:         { label: 'Home Energy',    icon: '⚡', color: '#FFD43B' },
  shopping:       { label: 'Shopping',       icon: '🛍️', color: '#CC5DE8' },
  waste:          { label: 'Waste',          icon: '♻️', color: '#FF922B' },
  travel:         { label: 'Travel',         icon: '✈️', color: '#339AF0' },
  water:          { label: 'Water',          icon: '💧', color: '#22B8CF' },
};

/**
 * Calculate transportation emissions (kg CO₂e/year)
 */
export function calculateTransportation(data: AssessmentData['transportation']): number {
  const factors = EMISSION_FACTORS.transport;

  // Personal vehicle commute
  const workDaysPerYear = 250;

  // Public transport days offset (replaces vehicle commute for those days)
  const ptDays = data.publicTransportDays * WEEKS_PER_YEAR;
  const ptEmissions = data.commuteDistanceKm * 2 *
    factors.publicTransport * ptDays;

  // Adjust vehicle days (subtract public transport days)
  const vehicleDays = Math.max(0, workDaysPerYear - ptDays);
  const adjustedVehicle = data.commuteDistanceKm * 2 *
    (factors[data.vehicleType] ?? 0) * vehicleDays;

  // Rideshare offset
  const rideShareMultiplier = {
    never: 1.0, rarely: 0.97, sometimes: 0.93, often: 0.85, always: 0.75,
  };

  return (adjustedVehicle + ptEmissions) * (rideShareMultiplier[data.rideSharingFrequency] ?? 1);
}

/**
 * Calculate food/diet emissions (kg CO₂e/year)
 */
export function calculateDiet(data: AssessmentData['diet']): number {
  const factors = EMISSION_FACTORS.diet;

  let base = factors[data.dietType] ?? factors.mixed;

  // Apply food waste multiplier
  base *= factors.foodWasteMultiplier[data.foodWasteLevel] ?? 1;

  // Apply local food reduction
  const localReduction = (data.localFoodPercentage / 10) * factors.localFoodReduction;
  base *= (1 - localReduction);

  return Math.max(0, base);
}

/**
 * Calculate electricity/energy emissions (kg CO₂e/year)
 */
export function calculateElectricity(data: AssessmentData['electricity']): number {
  const factors = EMISSION_FACTORS.electricity;

  let annual = data.monthlyBillUSD * 12 * factors.perDollar;

  // Efficiency multiplier
  annual *= factors.efficiencyMultiplier[data.applianceEfficiency] ?? 1;

  // Renewable source reduction
  if (data.hasRenewableSource) {
    annual *= (1 - factors.renewableReduction);
  }

  // Per-capita (divide by household size)
  if (factors.householdDivisor && data.householdSize > 0) {
    annual /= data.householdSize;
  }

  return Math.max(0, annual);
}

/**
 * Calculate shopping emissions (kg CO₂e/year)
 */
export function calculateShopping(data: AssessmentData['shopping']): number {
  const factors = EMISSION_FACTORS.shopping;

  // Online shopping
  const ordersPerYear = factors.frequencyMultiplier[data.onlineShoppingFrequency] ?? 12;
  const onlineEmissions = ordersPerYear * factors.onlineOrder;

  // Clothing
  const clothingEmissions = data.clothingItemsPerMonth * 12 * factors.clothingItem;

  // Electronics
  const electronicsEmissions = data.electronicsPerYear * factors.electronicsItem;

  let total = onlineEmissions + clothingEmissions + electronicsEmissions;

  // Sustainable brand reduction
  if (data.prefersSustainableBrands) {
    total *= (1 - factors.sustainableBrandReduction);
  }

  return Math.max(0, total);
}

/**
 * Calculate waste emissions (kg CO₂e/year)
 */
export function calculateWaste(data: AssessmentData['waste']): number {
  const factors = EMISSION_FACTORS.waste;

  let total = factors.baseWaste;

  // Recycling reduction
  total *= (1 - (factors.recyclingReduction[data.recyclingFrequency] ?? 0));

  // Composting reduction
  if (data.composting) {
    total *= (1 - factors.compostingReduction);
  }

  // Plastic usage multiplier
  total *= factors.plasticMultiplier[data.singleUsePlasticFrequency] ?? 1;

  return Math.max(0, total);
}

/**
 * Calculate water emissions (kg CO₂e/year)
 */
export function calculateWater(data: AssessmentData['water']): number {
  const factors = EMISSION_FACTORS.water;

  const showerEmissions = data.showerMinutesPerDay * factors.perShowerMinute * DAYS_PER_YEAR;
  const laundryEmissions = data.laundryLoadsPerWeek * factors.perLaundryLoad * WEEKS_PER_YEAR;

  let total = showerEmissions + laundryEmissions;

  if (data.hasWaterEfficiency) {
    total *= (1 - factors.waterEfficiencyReduction);
  }

  return Math.max(0, total);
}

/**
 * Calculate travel/flight emissions (kg CO₂e/year)
 */
export function calculateTravel(data: AssessmentData['travel']): number {
  const factors = EMISSION_FACTORS.travel;

  return (
    data.domesticFlightsPerYear * factors.domesticFlight +
    data.internationalFlightsPerYear * factors.internationalFlight +
    data.hotelNightsPerYear * factors.hotelNight
  );
}

/**
 * Generate a complete carbon report from assessment data
 */
export function generateCarbonReport(assessment: AssessmentData): CarbonReport {
  const calculations: Record<CarbonCategory, number> = {
    transportation: calculateTransportation(assessment.transportation),
    food: calculateDiet(assessment.diet),
    energy: calculateElectricity(assessment.electricity),
    shopping: calculateShopping(assessment.shopping),
    waste: calculateWaste(assessment.waste),
    travel: calculateTravel(assessment.travel),
    water: calculateWater(assessment.water),
  };

  const totalKg = Object.values(calculations).reduce((sum, val) => sum + val, 0);

  const breakdown: CategoryBreakdown[] = Object.entries(calculations).map(
    ([cat, kgCO2e]) => ({
      category: cat as CarbonCategory,
      kgCO2e: Math.round(kgCO2e),
      percentage: totalKg > 0 ? Math.round((kgCO2e / totalKg) * 100) : 0,
      ...CATEGORY_META[cat as CarbonCategory],
    })
  );

  // Sort by contribution (highest first)
  breakdown.sort((a, b) => b.kgCO2e - a.kgCO2e);

  return {
    id: crypto.randomUUID(),
    totalKgCO2e: Math.round(totalKg),
    totalTonnesCO2e: parseFloat((totalKg / 1000).toFixed(1)),
    breakdown,
    benchmarks: {
      globalAverage: EMISSION_FACTORS.benchmarks.globalAverage * 1000,
      nationalAverage: EMISSION_FACTORS.benchmarks.indiaAverage * 1000,
      ecoTarget: EMISSION_FACTORS.benchmarks.ecoTarget * 1000,
    },
    createdAt: new Date().toISOString(),
    assessmentData: assessment,
  };
}

/**
 * Get the equivalent number of trees needed to offset the footprint
 * Average tree absorbs ~22 kg CO₂ per year
 */
export function treesEquivalent(kgCO2e: number): number {
  return Math.round(kgCO2e / 22);
}

/**
 * Get comparison text for the user's footprint
 */
export function getComparisonText(tonnesCO2e: number): string {
  const benchmarks = EMISSION_FACTORS.benchmarks;
  
  if (tonnesCO2e <= benchmarks.parisAgreementTarget) {
    return "Excellent! You're within the Paris Agreement target.";
  }
  if (tonnesCO2e <= benchmarks.ecoTarget) {
    return "Great! You're below the science-based target for 2030.";
  }
  if (tonnesCO2e <= benchmarks.globalAverage) {
    return "Good — you're below the global average. Keep improving!";
  }
  return "Your footprint is above the global average. Let's find ways to reduce it together!";
}
