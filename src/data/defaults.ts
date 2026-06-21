// ============================================================
// EcoPulse AI — Default Data Values
// ============================================================

import type { AssessmentData } from '../types';

export function getDefaultAssessment(): AssessmentData {
  return {
    transportation: {
      commuteDistanceKm: 10,
      vehicleType: 'car_petrol',
      publicTransportDays: 0,
      rideSharingFrequency: 'never',
    },
    diet: {
      dietType: 'mixed',
      localFoodPercentage: 20,
      foodWasteLevel: 'sometimes',
    },
    electricity: {
      monthlyBillUSD: 80,
      householdSize: 3,
      hasRenewableSource: false,
      applianceEfficiency: 'mixed',
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
      singleUsePlasticFrequency: 'often',
    },
    water: {
      showerMinutesPerDay: 8,
      laundryLoadsPerWeek: 3,
      hasWaterEfficiency: false,
    },
    travel: {
      domesticFlightsPerYear: 2,
      internationalFlightsPerYear: 0,
      hotelNightsPerYear: 5,
    },
    lifestyle: {
      ecoConsciousnessLevel: 3,
      budgetSensitivity: 'medium',
      willingnessToChange: 'medium',
    },
  };
}

// Sample community leaderboard data
export const SAMPLE_LEADERBOARD = [
  { rank: 1, name: 'Priya Sharma', avatar: '🌿', streak: 42, totalCO2SavedKg: 340 },
  { rank: 2, name: 'Green Warriors', avatar: '🌍', streak: 28, totalCO2SavedKg: 315 },
  { rank: 3, name: 'Arjun Patel', avatar: '🌱', streak: 35, totalCO2SavedKg: 290 },
  { rank: 4, name: 'EcoMinds Club', avatar: '♻️', streak: 21, totalCO2SavedKg: 265 },
  { rank: 5, name: 'Sneha Reddy', avatar: '🍃', streak: 19, totalCO2SavedKg: 240 },
  { rank: 6, name: 'Rohan Gupta', avatar: '🌳', streak: 15, totalCO2SavedKg: 210 },
  { rank: 7, name: 'Maya Singh', avatar: '💚', streak: 12, totalCO2SavedKg: 185 },
  { rank: 8, name: 'Planet Savers', avatar: '🌏', streak: 10, totalCO2SavedKg: 160 },
];
