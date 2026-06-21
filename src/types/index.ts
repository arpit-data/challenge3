// ============================================================
// EcoPulse AI — Core Type Definitions
// Centralized types for the entire application
// ============================================================

/**
 * @fileoverview All shared TypeScript types, interfaces, and union types
 * used across EcoPulse AI modules including assessment, reporting,
 * goals, challenges, achievements, chat, and user profile.
 *
 * @module types
 */

// ---- Assessment Types ----

/** Vehicle type used for daily commute. */
export type VehicleType = 'car_petrol' | 'car_diesel' | 'car_hybrid' | 'car_ev' | 'motorcycle' | 'bicycle' | 'walk' | 'none';

/** Dietary lifestyle classification. */
export type DietType = 'vegan' | 'vegetarian' | 'mixed' | 'meat_heavy';

/** General frequency scale used across multiple assessment categories. */
export type Frequency = 'never' | 'rarely' | 'sometimes' | 'often' | 'always';

/** Online shopping frequency scale. */
export type ShoppingFrequency = 'rarely' | 'monthly' | 'weekly' | 'daily';

/** Transportation section of the carbon footprint assessment. */
export interface TransportationData {
  /** One-way commute distance in kilometers. */
  commuteDistanceKm: number;
  /** Primary vehicle type used for commuting. */
  vehicleType: VehicleType;
  /** Number of days per week using public transport. */
  publicTransportDays: number;
  /** Frequency of ride-sharing with others. */
  rideSharingFrequency: Frequency;
}

/** Diet and food section of the carbon footprint assessment. */
export interface DietData {
  /** Primary dietary classification. */
  dietType: DietType;
  /** Percentage of food sourced locally (0-100). */
  localFoodPercentage: number;
  /** Frequency of food waste generated. */
  foodWasteLevel: Frequency;
}

/** Home electricity and energy section of the assessment. */
export interface ElectricityData {
  /** Average monthly electricity bill in US dollars. */
  monthlyBillUSD: number;
  /** Number of people in the household for per-capita calculation. */
  householdSize: number;
  /** Whether the household uses a renewable energy source. */
  hasRenewableSource: boolean;
  /** Age and efficiency rating of household appliances. */
  applianceEfficiency: 'old' | 'mixed' | 'efficient';
}

/** Consumer shopping habits section of the assessment. */
export interface ShoppingData {
  /** Frequency of online shopping orders. */
  onlineShoppingFrequency: ShoppingFrequency;
  /** Average number of clothing items purchased per month. */
  clothingItemsPerMonth: number;
  /** Number of electronics devices purchased per year. */
  electronicsPerYear: number;
  /** Whether the user prefers sustainable/ethical brands. */
  prefersSustainableBrands: boolean;
}

/** Waste management habits section of the assessment. */
export interface WasteData {
  /** Frequency of recycling household waste. */
  recyclingFrequency: Frequency;
  /** Whether the user actively composts organic waste. */
  composting: boolean;
  /** Frequency of single-use plastic consumption. */
  singleUsePlasticFrequency: Frequency;
}

/** Water usage section of the assessment. */
export interface WaterData {
  /** Average daily shower duration in minutes. */
  showerMinutesPerDay: number;
  /** Number of laundry loads washed per week. */
  laundryLoadsPerWeek: number;
  /** Whether water-efficient fixtures/appliances are installed. */
  hasWaterEfficiency: boolean;
}

/** Air travel and hotel accommodation section of the assessment. */
export interface TravelData {
  /** Number of domestic round-trip flights per year. */
  domesticFlightsPerYear: number;
  /** Number of international round-trip flights per year. */
  internationalFlightsPerYear: number;
  /** Number of hotel nights per year. */
  hotelNightsPerYear: number;
}

/** General lifestyle and attitude section of the assessment. */
export interface LifestyleData {
  /** Self-rated eco-consciousness on a 1-5 scale. */
  ecoConsciousnessLevel: number;
  /** Sensitivity to cost when making sustainable choices. */
  budgetSensitivity: 'low' | 'medium' | 'high';
  /** Willingness to adopt lifestyle changes for sustainability. */
  willingnessToChange: 'low' | 'medium' | 'high';
}

/** Complete carbon footprint assessment form data across all sections. */
export interface AssessmentData {
  /** Transportation and commuting data. */
  transportation: TransportationData;
  /** Diet and food consumption data. */
  diet: DietData;
  /** Home electricity and energy data. */
  electricity: ElectricityData;
  /** Consumer shopping habits data. */
  shopping: ShoppingData;
  /** Waste management data. */
  waste: WasteData;
  /** Water usage data. */
  water: WaterData;
  /** Air travel and accommodation data. */
  travel: TravelData;
  /** Lifestyle and attitude data. */
  lifestyle: LifestyleData;
  /** ISO timestamp when the assessment was completed. */
  completedAt?: string;
}

// ---- Carbon Report Types ----

/** Breakdown of emissions for a single carbon category. */
export interface CategoryBreakdown {
  /** The carbon category identifier. */
  category: CarbonCategory;
  /** Annual emissions in kilograms of CO₂ equivalent. */
  kgCO2e: number;
  /** Percentage of total emissions attributed to this category. */
  percentage: number;
  /** Human-readable category label. */
  label: string;
  /** Emoji icon representing the category. */
  icon: string;
  /** Hex color code for chart/UI display. */
  color: string;
}

/** Identifiers for the seven tracked carbon emission categories. */
export type CarbonCategory = 'transportation' | 'food' | 'energy' | 'shopping' | 'waste' | 'travel' | 'water';

/** Complete carbon footprint report generated from assessment data. */
export interface CarbonReport {
  /** Unique report identifier (UUID). */
  id: string;
  /** Total annual emissions in kilograms of CO₂ equivalent. */
  totalKgCO2e: number;
  /** Total annual emissions in tonnes of CO₂ equivalent. */
  totalTonnesCO2e: number;
  /** Per-category breakdown of emissions, sorted by contribution. */
  breakdown: CategoryBreakdown[];
  /** Reference benchmarks for comparison. */
  benchmarks: {
    /** Global average annual emissions (kg CO₂e). */
    globalAverage: number;
    /** National average annual emissions (kg CO₂e). */
    nationalAverage: number;
    /** Science-based 2030 target (kg CO₂e). */
    ecoTarget: number;
  };
  /** ISO timestamp when the report was generated. */
  createdAt: string;
  /** The assessment data used to generate this report. */
  assessmentData: AssessmentData;
}

// ---- Recommendation Types ----

/** Difficulty level for recommendations and challenges. */
export type Difficulty = 'easy' | 'moderate' | 'advanced';

/** Impact magnitude of a sustainability action. */
export type Impact = 'low' | 'medium' | 'high';

/** Cost classification for a recommendation. */
export type Cost = 'free' | 'low' | 'medium';

/** A personalized sustainability recommendation for the user. */
export interface Recommendation {
  /** Unique recommendation identifier (UUID). */
  id: string;
  /** Short title of the recommendation. */
  title: string;
  /** Detailed description of the action to take. */
  description: string;
  /** Carbon category this recommendation targets. */
  category: CarbonCategory;
  /** Difficulty level of implementation. */
  difficulty: Difficulty;
  /** Expected impact magnitude. */
  impact: Impact;
  /** Estimated cost to implement. */
  cost: Cost;
  /** Estimated annual CO₂ reduction in kilograms. */
  estimatedReductionKg: number;
  /** Whether the user has completed this recommendation. */
  completed: boolean;
  /** ISO timestamp when the recommendation was completed. */
  completedAt?: string;
}

// ---- Goal Types ----

/** A sustainability goal the user is tracking with daily check-ins. */
export interface Goal {
  /** Unique goal identifier (UUID). */
  id: string;
  /** Short title of the goal. */
  title: string;
  /** Detailed description of the goal. */
  description: string;
  /** Carbon category this goal targets. */
  category: CarbonCategory;
  /** Target frequency description (e.g., "3x/week"). */
  targetFrequency: string;
  /** ISO timestamp when the goal was created. */
  startDate: string;
  /** Current consecutive day streak. */
  streak: number;
  /** All-time best consecutive day streak. */
  bestStreak: number;
  /** Completion progress percentage (0-100). */
  progress: number;
  /** Current status of the goal. */
  status: 'active' | 'completed' | 'paused';
  /** History of daily check-ins for this goal. */
  checkins: GoalCheckin[];
}

/** A single daily check-in record for a goal. */
export interface GoalCheckin {
  /** ISO timestamp of the check-in. */
  date: string;
  /** Whether the goal was met on this day. */
  completed: boolean;
  /** Optional notes from the user about this check-in. */
  notes?: string;
}

// ---- Challenge Types ----

/** A multi-day sustainability challenge with daily tasks. */
export interface Challenge {
  /** Unique challenge identifier. */
  id: string;
  /** Short title of the challenge. */
  title: string;
  /** Detailed description of the challenge. */
  description: string;
  /** Carbon category this challenge targets. */
  category: CarbonCategory;
  /** Duration of the challenge in days. */
  durationDays: number;
  /** Daily tasks to complete during the challenge. */
  tasks: ChallengeTask[];
  /** Emoji badge earned upon completion. */
  badgeReward: string;
  /** Estimated total CO₂ savings in kilograms. */
  co2SavingsKg: number;
  /** Difficulty level of the challenge. */
  difficulty: Difficulty;
}

/** A single daily task within a challenge. */
export interface ChallengeTask {
  /** Day number this task corresponds to (1-indexed). */
  day: number;
  /** Description of the task to complete. */
  description: string;
  /** Whether this task has been completed. */
  completed: boolean;
}

/** User's progress through an active challenge. */
export interface ChallengeProgress {
  /** Identifier of the challenge being tracked. */
  challengeId: string;
  /** ISO timestamp when the challenge was started. */
  startDate: string;
  /** Array of completed day numbers. */
  completedDays: number[];
  /** Current status of the challenge. */
  status: 'active' | 'completed' | 'abandoned';
  /** ISO timestamp when the challenge was completed. */
  completedAt?: string;
}

// ---- Achievement Types ----

/** Known achievement category identifiers. */
export type AchievementCategory =
  | 'milestone'
  | 'knowledge'
  | 'action'
  | 'goals'
  | 'streak'
  | 'impact'
  | 'transportation'
  | 'food'
  | 'challenge'
  | 'master';

/** An unlockable achievement badge earned through sustainability actions. */
export interface Achievement {
  /** Unique achievement identifier. */
  id: string;
  /** Short title of the achievement. */
  title: string;
  /** Description of what the achievement represents. */
  description: string;
  /** Emoji icon for the achievement. */
  icon: string;
  /** Category grouping for the achievement. */
  category: AchievementCategory;
  /** ISO timestamp when the achievement was unlocked. */
  unlockedAt?: string;
  /** Human-readable criteria for unlocking. */
  criteria: string;
  /** Rarity tier of the achievement. */
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
}

// ---- Chat Types ----

/** A single message in the AI Coach conversation. */
export interface ChatMessage {
  /** Unique message identifier (UUID). */
  id: string;
  /** Sender role: user or AI assistant. */
  role: 'user' | 'assistant';
  /** Message text content. */
  content: string;
  /** ISO timestamp when the message was sent. */
  timestamp: string;
}

// ---- User Types ----

/** User profile and application preferences. */
export interface UserProfile {
  /** Unique user identifier (UUID). */
  id: string;
  /** Display name shown in the UI. */
  displayName: string;
  /** Optional email address. */
  email?: string;
  /** Optional avatar image URL. */
  avatarUrl?: string;
  /** ISO timestamp when the account was created. */
  createdAt: string;
  /** Whether the user has completed the carbon assessment. */
  assessmentCompleted: boolean;
  /** User application preferences. */
  preferences: {
    /** UI theme preference. */
    theme: 'light' | 'dark' | 'system';
    /** Measurement units preference. */
    units: 'metric' | 'imperial';
    /** Whether push notifications are enabled. */
    notifications: boolean;
  };
}

// ---- Community Types ----

/** A single entry in the community leaderboard. */
export interface LeaderboardEntry {
  /** Rank position (1-indexed). */
  rank: number;
  /** Display name of the user or team. */
  name: string;
  /** Emoji avatar. */
  avatar: string;
  /** Current streak in days. */
  streak: number;
  /** Total CO₂ saved in kilograms. */
  totalCO2SavedKg: number;
}

// ---- Weekly Summary ----

/** Weekly sustainability progress summary. */
export interface WeeklySummary {
  /** ISO date string for the start of the week. */
  weekStart: string;
  /** ISO date string for the end of the week. */
  weekEnd: string;
  /** Composite sustainability score for the week. */
  carbonScore: number;
  /** Number of goals completed during the week. */
  goalsCompleted: number;
  /** Number of recommendations completed during the week. */
  recommendationsCompleted: number;
  /** Week-over-week trend direction. */
  trend: 'improving' | 'stable' | 'declining';
  /** Optional AI-generated insight for the week. */
  aiInsight?: string;
}
