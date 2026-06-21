// ============================================================
// EcoPulse AI — Challenges Database
// ============================================================

import type { Challenge } from '../types';

/**
 * Pre-built weekly challenges that guide users through focused sustainability actions.
 *
 * Each challenge spans a fixed number of days and includes daily tasks, an estimated
 * CO₂ savings value (in kg), a difficulty rating, and a badge emoji awarded on completion.
 * Challenges cover transportation, waste, energy, food, shopping, and water categories.
 *
 * @readonly
 */
export const BUILT_IN_CHALLENGES: Challenge[] = [
  {
    id: 'green_commute_7',
    title: '7-Day Green Commute',
    description: 'Use eco-friendly transportation for 7 consecutive days. Walk, bike, or take public transit.',
    category: 'transportation',
    durationDays: 7,
    co2SavingsKg: 15,
    difficulty: 'moderate',
    badgeReward: '🚲',
    tasks: [
      { day: 1, description: 'Walk or bike for any trip under 2 km', completed: false },
      { day: 2, description: 'Take public transit to work/school', completed: false },
      { day: 3, description: 'Carpool with a friend or colleague', completed: false },
      { day: 4, description: 'Walk or bike for any trip under 2 km', completed: false },
      { day: 5, description: 'Take public transit to work/school', completed: false },
      { day: 6, description: 'Explore your neighborhood on foot', completed: false },
      { day: 7, description: 'Complete a full car-free day', completed: false },
    ],
  },
  {
    id: 'zero_waste_week',
    title: 'Zero-Waste Week',
    description: 'Minimize waste production for a full week. Focus on reducing, reusing, and recycling.',
    category: 'waste',
    durationDays: 7,
    co2SavingsKg: 8,
    difficulty: 'moderate',
    badgeReward: '♻️',
    tasks: [
      { day: 1, description: 'Audit your trash — identify top waste items', completed: false },
      { day: 2, description: 'Use only reusable bags and bottles', completed: false },
      { day: 3, description: 'Refuse single-use plastics all day', completed: false },
      { day: 4, description: 'Repair or repurpose one item', completed: false },
      { day: 5, description: 'Cook with zero food waste', completed: false },
      { day: 6, description: 'Donate items you no longer need', completed: false },
      { day: 7, description: 'Reflect: compare your waste to Day 1', completed: false },
    ],
  },
  {
    id: 'energy_saver',
    title: 'Energy Saver Challenge',
    description: 'Reduce your home energy consumption through simple daily actions.',
    category: 'energy',
    durationDays: 7,
    co2SavingsKg: 12,
    difficulty: 'easy',
    badgeReward: '⚡',
    tasks: [
      { day: 1, description: 'Unplug all devices not in use', completed: false },
      { day: 2, description: 'Use natural light instead of electric lights', completed: false },
      { day: 3, description: 'Air-dry one load of laundry', completed: false },
      { day: 4, description: 'Adjust thermostat by 2°C', completed: false },
      { day: 5, description: 'Take a shorter shower (under 5 minutes)', completed: false },
      { day: 6, description: 'Run full loads only (dishwasher/laundry)', completed: false },
      { day: 7, description: 'Check and compare your energy usage', completed: false },
    ],
  },
  {
    id: 'plant_powered',
    title: 'Plant-Powered Week',
    description: 'Explore plant-based eating for 7 days. Discover delicious sustainable meals.',
    category: 'food',
    durationDays: 7,
    co2SavingsKg: 10,
    difficulty: 'moderate',
    badgeReward: '🌱',
    tasks: [
      { day: 1, description: 'Have a fully plant-based breakfast', completed: false },
      { day: 2, description: 'Try a new vegetarian recipe for dinner', completed: false },
      { day: 3, description: 'Replace dairy milk with plant-based alternative', completed: false },
      { day: 4, description: 'Pack a vegan lunch', completed: false },
      { day: 5, description: 'Cook a fully plant-based dinner', completed: false },
      { day: 6, description: 'Visit a farmers market for local produce', completed: false },
      { day: 7, description: 'Share a plant-based meal with friends/family', completed: false },
    ],
  },
  {
    id: 'mindful_shopper',
    title: 'Mindful Shopping Week',
    description: 'Practice conscious consumption. Think twice before every purchase.',
    category: 'shopping',
    durationDays: 7,
    co2SavingsKg: 6,
    difficulty: 'easy',
    badgeReward: '🛍️',
    tasks: [
      { day: 1, description: 'Make a list before shopping — buy only listed items', completed: false },
      { day: 2, description: 'Choose a secondhand item instead of new', completed: false },
      { day: 3, description: 'Avoid all online shopping today', completed: false },
      { day: 4, description: 'Research the sustainability of one brand you use', completed: false },
      { day: 5, description: 'Repair something instead of replacing it', completed: false },
      { day: 6, description: 'Share or swap items with a friend', completed: false },
      { day: 7, description: 'Reflect on your shopping habits', completed: false },
    ],
  },
  {
    id: 'water_warrior',
    title: 'Water Warrior Week',
    description: 'Conserve water through mindful daily habits. Every drop counts!',
    category: 'water',
    durationDays: 7,
    co2SavingsKg: 4,
    difficulty: 'easy',
    badgeReward: '💧',
    tasks: [
      { day: 1, description: 'Time your shower — aim for under 5 minutes', completed: false },
      { day: 2, description: 'Fix any leaking faucets or toilets', completed: false },
      { day: 3, description: 'Use cold water for laundry', completed: false },
      { day: 4, description: 'Turn off tap while brushing teeth', completed: false },
      { day: 5, description: 'Collect and reuse cooking water for plants', completed: false },
      { day: 6, description: 'Run dishwasher only when completely full', completed: false },
      { day: 7, description: 'Calculate how much water you saved', completed: false },
    ],
  },
];
