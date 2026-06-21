/**
 * @fileoverview EcoPulse AI — Achievements System.
 * Pre-defined achievements and unlock logic for eco-friendly milestones.
 */

import type { Achievement, CarbonReport, Goal, Recommendation } from '../types';
import {
  WEEK_WARRIOR_STREAK,
  MONTH_MASTER_STREAK,
  CARBON_REDUCER_THRESHOLD,
  HALF_TON_HERO_THRESHOLD,
  CATEGORY_RECS_THRESHOLD,
  CHAMPION_RECS_THRESHOLD,
  CHAMPION_GOALS_THRESHOLD,
} from '../constants';

/**
 * Pre-defined achievements that users can unlock through eco-friendly actions.
 *
 * Achievements are organized across tiers (bronze → silver → gold → platinum)
 * and cover milestones, streaks, impact savings, and category-specific actions.
 *
 * @readonly
 */
export const BUILT_IN_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'eco_beginner',
    title: 'Eco Beginner',
    description: 'Complete your first carbon footprint assessment.',
    icon: '🌱',
    category: 'milestone',
    criteria: 'Complete assessment',
    tier: 'bronze',
  },
  {
    id: 'carbon_aware',
    title: 'Carbon Aware',
    description: 'Learn your annual carbon footprint breakdown.',
    icon: '📊',
    category: 'knowledge',
    criteria: 'View dashboard',
    tier: 'bronze',
  },
  {
    id: 'first_action',
    title: 'First Action',
    description: 'Complete your first eco-friendly recommendation.',
    icon: '✅',
    category: 'action',
    criteria: 'Complete 1 recommendation',
    tier: 'bronze',
  },
  {
    id: 'goal_setter',
    title: 'Goal Setter',
    description: 'Set your first sustainability goal.',
    icon: '🎯',
    category: 'goals',
    criteria: 'Create 1 goal',
    tier: 'bronze',
  },
  {
    id: 'week_warrior',
    title: 'Week Warrior',
    description: 'Maintain a 7-day streak on any goal.',
    icon: '🔥',
    category: 'streak',
    criteria: '7-day streak',
    tier: 'silver',
  },
  {
    id: 'carbon_reducer',
    title: 'Carbon Reducer',
    description: 'Save 100 kg of CO₂ through completed recommendations.',
    icon: '📉',
    category: 'impact',
    criteria: 'Save 100 kg CO₂',
    tier: 'silver',
  },
  {
    id: 'conscious_commuter',
    title: 'Conscious Commuter',
    description: 'Complete 3 transportation-related recommendations.',
    icon: '🚲',
    category: 'transportation',
    criteria: '3 transport recommendations',
    tier: 'silver',
  },
  {
    id: 'green_eater',
    title: 'Green Eater',
    description: 'Complete 3 food-related recommendations.',
    icon: '🥗',
    category: 'food',
    criteria: '3 food recommendations',
    tier: 'silver',
  },
  {
    id: 'challenge_champion',
    title: 'Challenge Champion',
    description: 'Complete your first full challenge.',
    icon: '🏆',
    category: 'challenge',
    criteria: 'Complete 1 challenge',
    tier: 'silver',
  },
  {
    id: 'month_master',
    title: 'Month Master',
    description: 'Maintain a 30-day streak on any goal.',
    icon: '⭐',
    category: 'streak',
    criteria: '30-day streak',
    tier: 'gold',
  },
  {
    id: 'half_ton_hero',
    title: 'Half-Ton Hero',
    description: 'Save 500 kg of CO₂ through actions and recommendations.',
    icon: '🌍',
    category: 'impact',
    criteria: 'Save 500 kg CO₂',
    tier: 'gold',
  },
  {
    id: 'sustainability_champion',
    title: 'Sustainability Champion',
    description: 'Complete 15 recommendations and maintain 3 active goals.',
    icon: '👑',
    category: 'master',
    criteria: '15 recs + 3 goals',
    tier: 'platinum',
  },
];

/**
 * Evaluates all built-in achievements against the user's current progress
 * and returns any that should be newly unlocked.
 *
 * @param report - The user's most recent carbon footprint report, or null if none exists.
 * @param goals - All user-defined sustainability goals.
 * @param recommendations - All recommendations (both completed and pending).
 * @param alreadyUnlocked - IDs of achievements the user has already earned.
 * @returns An array of newly unlocked {@link Achievement} objects with `unlockedAt` timestamps.
 */
export function checkAchievements(
  report: CarbonReport | null,
  goals: Goal[],
  recommendations: Recommendation[],
  alreadyUnlocked: string[]
): Achievement[] {
  const newlyUnlocked: Achievement[] = [];
  const now = new Date().toISOString();

  const completedRecs = recommendations.filter((r) => r.completed);
  const totalSaved = completedRecs.reduce((s, r) => s + r.estimatedReductionKg, 0);
  const maxStreak = Math.max(0, ...goals.map((g) => g.bestStreak));
  const transportRecs = completedRecs.filter((r) => r.category === 'transportation').length;
  const foodRecs = completedRecs.filter((r) => r.category === 'food').length;

  const checks: Record<string, boolean> = {
    eco_beginner: report !== null,
    carbon_aware: report !== null,
    first_action: completedRecs.length >= 1,
    goal_setter: goals.length >= 1,
    week_warrior: maxStreak >= WEEK_WARRIOR_STREAK,
    carbon_reducer: totalSaved >= CARBON_REDUCER_THRESHOLD,
    conscious_commuter: transportRecs >= CATEGORY_RECS_THRESHOLD,
    green_eater: foodRecs >= CATEGORY_RECS_THRESHOLD,
    challenge_champion: false, // Checked separately in challenge store
    month_master: maxStreak >= MONTH_MASTER_STREAK,
    half_ton_hero: totalSaved >= HALF_TON_HERO_THRESHOLD,
    sustainability_champion: completedRecs.length >= CHAMPION_RECS_THRESHOLD && goals.filter((g) => g.status === 'active').length >= CHAMPION_GOALS_THRESHOLD,
  };

  for (const achievement of BUILT_IN_ACHIEVEMENTS) {
    if (!alreadyUnlocked.includes(achievement.id) && checks[achievement.id]) {
      newlyUnlocked.push({ ...achievement, unlockedAt: now });
    }
  }

  return newlyUnlocked;
}
