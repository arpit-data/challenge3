// ============================================================
// EcoPulse AI — Core Type Definitions
// Centralized types for the entire application
// ============================================================

// ---- Assessment Types ----

export type VehicleType = 'car_petrol' | 'car_diesel' | 'car_hybrid' | 'car_ev' | 'motorcycle' | 'bicycle' | 'walk' | 'none';
export type DietType = 'vegan' | 'vegetarian' | 'mixed' | 'meat_heavy';
export type Frequency = 'never' | 'rarely' | 'sometimes' | 'often' | 'always';
export type ShoppingFrequency = 'rarely' | 'monthly' | 'weekly' | 'daily';

export interface TransportationData {
  commuteDistanceKm: number;
  vehicleType: VehicleType;
  publicTransportDays: number; // days per week
  rideSharingFrequency: Frequency;
}

export interface DietData {
  dietType: DietType;
  localFoodPercentage: number; // 0-100
  foodWasteLevel: Frequency;
}

export interface ElectricityData {
  monthlyBillUSD: number;
  householdSize: number;
  hasRenewableSource: boolean;
  applianceEfficiency: 'old' | 'mixed' | 'efficient';
}

export interface ShoppingData {
  onlineShoppingFrequency: ShoppingFrequency;
  clothingItemsPerMonth: number;
  electronicsPerYear: number;
  prefersSustainableBrands: boolean;
}

export interface WasteData {
  recyclingFrequency: Frequency;
  composting: boolean;
  singleUsePlasticFrequency: Frequency;
}

export interface WaterData {
  showerMinutesPerDay: number;
  laundryLoadsPerWeek: number;
  hasWaterEfficiency: boolean;
}

export interface TravelData {
  domesticFlightsPerYear: number;
  internationalFlightsPerYear: number;
  hotelNightsPerYear: number;
}

export interface LifestyleData {
  ecoConsciousnessLevel: number; // 1-5
  budgetSensitivity: 'low' | 'medium' | 'high';
  willingnessToChange: 'low' | 'medium' | 'high';
}

export interface AssessmentData {
  transportation: TransportationData;
  diet: DietData;
  electricity: ElectricityData;
  shopping: ShoppingData;
  waste: WasteData;
  water: WaterData;
  travel: TravelData;
  lifestyle: LifestyleData;
  completedAt?: string;
}

// ---- Carbon Report Types ----

export interface CategoryBreakdown {
  category: CarbonCategory;
  kgCO2e: number;
  percentage: number;
  label: string;
  icon: string;
  color: string;
}

export type CarbonCategory = 'transportation' | 'food' | 'energy' | 'shopping' | 'waste' | 'travel' | 'water';

export interface CarbonReport {
  id: string;
  totalKgCO2e: number;
  totalTonnesCO2e: number;
  breakdown: CategoryBreakdown[];
  benchmarks: {
    globalAverage: number;
    nationalAverage: number;
    ecoTarget: number;
  };
  createdAt: string;
  assessmentData: AssessmentData;
}

// ---- Recommendation Types ----

export type Difficulty = 'easy' | 'moderate' | 'advanced';
export type Impact = 'low' | 'medium' | 'high';
export type Cost = 'free' | 'low' | 'medium';

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: CarbonCategory;
  difficulty: Difficulty;
  impact: Impact;
  cost: Cost;
  estimatedReductionKg: number;
  completed: boolean;
  completedAt?: string;
}

// ---- Goal Types ----

export interface Goal {
  id: string;
  title: string;
  description: string;
  category: CarbonCategory;
  targetFrequency: string;
  startDate: string;
  streak: number;
  bestStreak: number;
  progress: number; // 0-100
  status: 'active' | 'completed' | 'paused';
  checkins: GoalCheckin[];
}

export interface GoalCheckin {
  date: string;
  completed: boolean;
  notes?: string;
}

// ---- Challenge Types ----

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: CarbonCategory;
  durationDays: number;
  tasks: ChallengeTask[];
  badgeReward: string;
  co2SavingsKg: number;
  difficulty: Difficulty;
}

export interface ChallengeTask {
  day: number;
  description: string;
  completed: boolean;
}

export interface ChallengeProgress {
  challengeId: string;
  startDate: string;
  completedDays: number[];
  status: 'active' | 'completed' | 'abandoned';
  completedAt?: string;
}

// ---- Achievement Types ----

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  unlockedAt?: string;
  criteria: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
}

// ---- Chat Types ----

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

// ---- User Types ----

export interface UserProfile {
  id: string;
  displayName: string;
  email?: string;
  avatarUrl?: string;
  createdAt: string;
  assessmentCompleted: boolean;
  preferences: {
    theme: 'light' | 'dark' | 'system';
    units: 'metric' | 'imperial';
    notifications: boolean;
  };
}

// ---- Community Types ----

export interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  streak: number;
  totalCO2SavedKg: number;
}

// ---- Weekly Summary ----

export interface WeeklySummary {
  weekStart: string;
  weekEnd: string;
  carbonScore: number;
  goalsCompleted: number;
  recommendationsCompleted: number;
  trend: 'improving' | 'stable' | 'declining';
  aiInsight?: string;
}
