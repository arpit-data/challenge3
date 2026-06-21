// ============================================================
// EcoPulse AI — Shared UI Constants
// Centralized color maps and category config used across pages
// ============================================================

/**
 * @fileoverview Shared UI constants extracted from multiple pages
 * to eliminate duplication. Contains color maps for difficulty
 * levels, impact levels, and category emoji mappings.
 *
 * @module constants/ui
 */

import type { Difficulty, Impact, CarbonCategory } from '../types';

// ---- Difficulty ----

/** Color codes for each difficulty level, used in chips, badges, and progress bars. */
export const DIFFICULTY_COLORS: Readonly<Record<Difficulty, string>> = {
  easy: '#52B788',
  moderate: '#F9A826',
  advanced: '#E63946',
} as const;

// ---- Impact ----

/** Color codes for impact magnitude labels. */
export const IMPACT_COLORS: Readonly<Record<Impact, string>> = {
  low: '#90A4AE',
  medium: '#48CAE4',
  high: '#2D6A4F',
} as const;

// ---- Categories ----

/** Emoji icons for each carbon category, used in challenge cards and tracker. */
export const CATEGORY_EMOJI: Readonly<Record<CarbonCategory, string>> = {
  transportation: '🚲',
  waste: '♻️',
  energy: '⚡',
  food: '🌱',
  shopping: '🛍️',
  water: '💧',
  travel: '✈️',
} as const;

/**
 * Convert a difficulty value to a user-friendly label.
 *
 * @param difficulty - The difficulty level to convert
 * @returns A human-readable label string
 */
export function getDifficultyLabel(difficulty: Difficulty): string {
  switch (difficulty) {
    case 'easy':
      return 'Low Effort';
    case 'moderate':
      return 'Moderate';
    case 'advanced':
      return 'Advanced';
  }
}
