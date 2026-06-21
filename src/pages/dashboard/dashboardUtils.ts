/**
 * @fileoverview EcoPulse AI — Dashboard Utility Functions.
 * Pure helper functions for eco-level classification and trend data generation.
 */

// ---- Eco Level Helper ----

/** Shape returned by getEcoLevel. */
export interface EcoLevel {
  name: string;
  emoji: string;
  color: string;
}

/** Determine eco-level label from annual CO₂e in tonnes. */
export function getEcoLevel(tonnesCO2e: number): EcoLevel {
  if (tonnesCO2e <= 2) return { name: 'Eco Champion', emoji: '🌳', color: '#2D6A4F' };
  if (tonnesCO2e <= 4) return { name: 'Young Oak', emoji: '🌿', color: '#40916C' };
  if (tonnesCO2e <= 6) return { name: 'Growing Tree', emoji: '🌱', color: '#52B788' };
  if (tonnesCO2e <= 8) return { name: 'Seedling', emoji: '☘️', color: '#74C69D' };
  return { name: 'Sapling', emoji: '🌾', color: '#95D5B2' };
}

// ---- Monthly trend data ----

/** Shape of a single monthly data point. */
export interface MonthlyDataPoint {
  month: string;
  value: number;
}

/** Generate sample monthly trend data from total annual kg. */
export function generateMonthlyTrend(totalKg: number): MonthlyDataPoint[] {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const now = new Date();
  const currentMonth = now.getMonth();
  const monthlyAvg = totalKg / 12;

  return months.slice(0, currentMonth + 1).map((month, i) => ({
    month,
    value: Math.round(monthlyAvg * (1.15 - i * 0.025) + (Math.random() - 0.5) * monthlyAvg * 0.15),
  }));
}
