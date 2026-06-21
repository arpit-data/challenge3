// ============================================================
// EcoPulse AI — Built-in Recommendations Database
// ============================================================

import type { Recommendation } from '../types';

type RecTemplate = Omit<Recommendation, 'id' | 'completed' | 'completedAt'>;

export const BUILT_IN_RECOMMENDATIONS: RecTemplate[] = [
  // Transportation
  {
    title: 'Carpool Twice Weekly',
    description: 'Share your commute with a colleague or neighbor twice a week to cut transport emissions.',
    category: 'transportation',
    difficulty: 'easy',
    impact: 'medium',
    cost: 'free',
    estimatedReductionKg: 180,
  },
  {
    title: 'Switch to Public Transit',
    description: 'Replace 3 car commute days per week with bus or metro. Significant emission savings.',
    category: 'transportation',
    difficulty: 'moderate',
    impact: 'high',
    cost: 'low',
    estimatedReductionKg: 420,
  },
  {
    title: 'Bike to Work',
    description: 'Cycle for short commutes under 10km. Zero emissions and great exercise!',
    category: 'transportation',
    difficulty: 'moderate',
    impact: 'high',
    cost: 'low',
    estimatedReductionKg: 500,
  },
  {
    title: 'Maintain Tire Pressure',
    description: 'Properly inflated tires improve fuel efficiency by up to 3%. Quick and free!',
    category: 'transportation',
    difficulty: 'easy',
    impact: 'low',
    cost: 'free',
    estimatedReductionKg: 60,
  },

  // Food
  {
    title: 'Meatless Mondays',
    description: 'Skip meat one day per week. Even one day makes a measurable difference.',
    category: 'food',
    difficulty: 'easy',
    impact: 'medium',
    cost: 'free',
    estimatedReductionKg: 150,
  },
  {
    title: 'Two Plant-Based Meals Weekly',
    description: 'Replace two meat-based meals with plant-based alternatives each week.',
    category: 'food',
    difficulty: 'easy',
    impact: 'medium',
    cost: 'free',
    estimatedReductionKg: 200,
  },
  {
    title: 'Reduce Food Waste',
    description: 'Plan meals, use leftovers, and compost scraps to reduce food waste by 50%.',
    category: 'food',
    difficulty: 'moderate',
    impact: 'medium',
    cost: 'free',
    estimatedReductionKg: 170,
  },
  {
    title: 'Buy Local & Seasonal',
    description: 'Choose locally grown, seasonal produce to reduce transportation emissions.',
    category: 'food',
    difficulty: 'easy',
    impact: 'low',
    cost: 'low',
    estimatedReductionKg: 80,
  },

  // Energy
  {
    title: 'Switch to LED Bulbs',
    description: 'Replace all incandescent bulbs with LEDs. Uses 75% less energy, lasts 25x longer.',
    category: 'energy',
    difficulty: 'easy',
    impact: 'medium',
    cost: 'low',
    estimatedReductionKg: 120,
  },
  {
    title: 'Unplug Standby Devices',
    description: 'Eliminate phantom energy drain by unplugging devices or using smart power strips.',
    category: 'energy',
    difficulty: 'easy',
    impact: 'low',
    cost: 'free',
    estimatedReductionKg: 90,
  },
  {
    title: 'Optimize Thermostat',
    description: 'Adjust heating/cooling by 2°C. Small change, big impact on energy bills.',
    category: 'energy',
    difficulty: 'easy',
    impact: 'medium',
    cost: 'free',
    estimatedReductionKg: 200,
  },

  // Shopping
  {
    title: 'Bundle Online Orders',
    description: 'Consolidate purchases into fewer deliveries to reduce packaging and transport.',
    category: 'shopping',
    difficulty: 'easy',
    impact: 'low',
    cost: 'free',
    estimatedReductionKg: 50,
  },
  {
    title: 'Buy Secondhand Clothing',
    description: 'Choose pre-owned clothing instead of new. Reduces fast fashion impact significantly.',
    category: 'shopping',
    difficulty: 'easy',
    impact: 'medium',
    cost: 'free',
    estimatedReductionKg: 140,
  },
  {
    title: 'Extend Device Lifespan',
    description: 'Keep electronics for 1+ extra year before replacing. Massive manufacturing savings.',
    category: 'shopping',
    difficulty: 'easy',
    impact: 'high',
    cost: 'free',
    estimatedReductionKg: 300,
  },

  // Waste
  {
    title: 'Start Composting',
    description: 'Compost food scraps and yard waste. Reduces methane from landfills.',
    category: 'waste',
    difficulty: 'moderate',
    impact: 'medium',
    cost: 'low',
    estimatedReductionKg: 100,
  },
  {
    title: 'Recycle Consistently',
    description: 'Set up proper recycling at home and follow local recycling guidelines.',
    category: 'waste',
    difficulty: 'easy',
    impact: 'medium',
    cost: 'free',
    estimatedReductionKg: 130,
  },
  {
    title: 'Eliminate Single-Use Plastics',
    description: 'Use reusable bags, bottles, and containers. Small swap, huge environmental win.',
    category: 'waste',
    difficulty: 'easy',
    impact: 'medium',
    cost: 'low',
    estimatedReductionKg: 80,
  },

  // Travel
  {
    title: 'Take One Fewer Flight',
    description: 'Replace one domestic flight per year with train or video call.',
    category: 'travel',
    difficulty: 'moderate',
    impact: 'high',
    cost: 'free',
    estimatedReductionKg: 255,
  },
  {
    title: 'Choose Direct Flights',
    description: 'When flying, choose direct routes. Layovers add 30-40% more emissions.',
    category: 'travel',
    difficulty: 'easy',
    impact: 'medium',
    cost: 'low',
    estimatedReductionKg: 100,
  },

  // Water
  {
    title: 'Shorter Showers',
    description: 'Reduce shower time by 2 minutes. Saves water, energy, and money.',
    category: 'water',
    difficulty: 'easy',
    impact: 'low',
    cost: 'free',
    estimatedReductionKg: 30,
  },
  {
    title: 'Cold Water Laundry',
    description: 'Wash clothes in cold water. Saves 90% of energy used for laundry.',
    category: 'water',
    difficulty: 'easy',
    impact: 'low',
    cost: 'free',
    estimatedReductionKg: 45,
  },
];
