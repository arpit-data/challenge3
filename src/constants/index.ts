/**
 * @fileoverview Application-wide named constants.
 *
 * Centralizes magic numbers used across the codebase into well-documented,
 * semantically named constants. These values are sourced from various modules
 * including the carbon calculation engine, Zustand store, and Gemini AI service.
 *
 * @module constants
 */

// ─── Report History ──────────────────────────────────────────────────────────

/**
 * Maximum number of carbon footprint reports retained in history.
 * Corresponds to approximately one year of weekly assessments.
 *
 * @see appStore.ts — report history trimming
 */
export const MAX_REPORT_HISTORY = 52;

// ─── Goal Tracking ──────────────────────────────────────────────────────────

/**
 * Percentage points added to goal progress on each check-in.
 * A goal requires 20 check-ins (100 / 5) to complete.
 *
 * @see appStore.ts — goal check-in action
 */
export const PROGRESS_INCREMENT = 5;

// ─── Time Constants ──────────────────────────────────────────────────────────

/**
 * Standard working days per year used for commute emission calculations.
 * Based on 5-day work week minus typical holidays and vacation.
 *
 * @see carbonCalculator.ts — transportation emissions
 */
export const WORK_DAYS_PER_YEAR = 250;

/**
 * Days per calendar year. Used for annualizing daily metrics
 * such as water usage and energy consumption.
 */
export const DAYS_PER_YEAR = 365;

/**
 * Weeks per calendar year. Used for annualizing weekly metrics
 * and aligning with report history limits.
 */
export const WEEKS_PER_YEAR = 52;

// ─── Carbon Calculation ──────────────────────────────────────────────────────

/**
 * Average kilograms of CO₂ absorbed by a single mature tree per year.
 * Used to express carbon footprints as a "trees needed to offset" equivalency.
 *
 * Source: EPA estimates for medium-growth coniferous/deciduous trees.
 *
 * @see carbonCalculator.ts — treesEquivalent calculation
 */
export const KG_CO2_PER_TREE = 22;

// ─── Recommendations ────────────────────────────────────────────────────────

/**
 * Maximum number of personalized recommendations generated from
 * the curated recommendation pool after an assessment.
 *
 * @see appStore.ts — generateRecommendations action
 */
export const MAX_RECOMMENDATIONS = 8;

// ─── AI Service (Gemini) ────────────────────────────────────────────────────

/**
 * Number of suggested prompts shown to the user when they have
 * a carbon report available for context-aware suggestions.
 *
 * @see geminiService.ts — getSuggestedPrompts
 */
export const SUGGESTED_PROMPTS_WITH_REPORT = 6;

/**
 * Number of suggested prompts shown to the user when no carbon
 * report is available (generic sustainability prompts).
 *
 * @see geminiService.ts — getSuggestedPrompts
 */
export const SUGGESTED_PROMPTS_WITHOUT_REPORT = 4;

/**
 * Maximum word count requested in the Gemini system prompt
 * to keep AI Coach responses concise and actionable.
 *
 * @see geminiService.ts — system prompt construction
 */
export const MAX_RESPONSE_WORDS = 200;

/**
 * Default reduction target as a decimal fraction (15%).
 * Used as a fallback when the AI service cannot generate
 * a personalized reduction target.
 *
 * @see geminiService.ts — fallback reduction target
 */
export const DEFAULT_REDUCTION_TARGET = 0.15;

/**
 * Fallback absolute reduction amount in kilograms of CO₂ per year.
 * Used when the AI service cannot calculate a personalized
 * reduction amount from the user's report.
 *
 * @see geminiService.ts — fallback reduction amount
 */
export const FALLBACK_REDUCTION_KG = 500;
