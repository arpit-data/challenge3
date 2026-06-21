// ============================================================
// EcoPulse AI — Carbon Calculator Engine
// Configurable emission factors with documented sources
// ============================================================

/**
 * Emission factors are expressed in kg CO₂e per unit.
 * Sources: EPA, IPCC AR6, DEFRA 2023, IEA
 * These are configurable — update factors as better data becomes available.
 */
export const EMISSION_FACTORS = {
  // Transportation (kg CO₂e per km)
  transport: {
    car_petrol: 0.192,    // EPA: avg passenger vehicle
    car_diesel: 0.171,    // DEFRA 2023
    car_hybrid: 0.106,    // ~45% reduction vs petrol
    car_ev: 0.053,        // Grid-dependent, using world avg
    motorcycle: 0.103,    // DEFRA 2023
    bicycle: 0.0,
    walk: 0.0,
    none: 0.0,
    publicTransport: 0.089, // Average bus/metro per passenger-km
    rideshare: 0.096,     // Car split between 2 passengers
  },

  // Diet (kg CO₂e per year by diet type)
  diet: {
    vegan: 1500,
    vegetarian: 1700,
    mixed: 2500,
    meat_heavy: 3300,
    foodWasteMultiplier: {
      never: 1.0,
      rarely: 1.05,
      sometimes: 1.12,
      often: 1.22,
      always: 1.35,
    },
    localFoodReduction: 0.05, // 5% reduction per 10% local food
  },

  // Electricity (kg CO₂e per USD spent on electricity)
  electricity: {
    perDollar: 5.0,       // Approximate: varies by region & grid mix
    renewableReduction: 0.80, // 80% reduction with renewable source
    efficiencyMultiplier: {
      old: 1.3,
      mixed: 1.0,
      efficient: 0.75,
    },
    householdDivisor: true, // Divide by household size for per-capita
  },

  // Shopping (kg CO₂e per item/activity)
  shopping: {
    onlineOrder: 4.8,     // Packaging + delivery per order
    clothingItem: 23.0,   // Average garment lifecycle
    electronicsItem: 300,  // Average electronics device
    sustainableBrandReduction: 0.15, // 15% reduction
    frequencyMultiplier: {
      rarely: 6,      // orders per year
      monthly: 12,
      weekly: 52,
      daily: 250,
    },
  },

  // Waste (kg CO₂e per year)
  waste: {
    baseWaste: 500,       // Average annual waste emissions
    recyclingReduction: {
      never: 0,
      rarely: 0.05,
      sometimes: 0.15,
      often: 0.30,
      always: 0.45,
    },
    compostingReduction: 0.10,
    plasticMultiplier: {
      never: 0.85,
      rarely: 0.92,
      sometimes: 1.0,
      often: 1.15,
      always: 1.30,
    },
  },

  // Water (kg CO₂e per year)
  water: {
    perShowerMinute: 0.1,  // Per day, annualized
    perLaundryLoad: 2.4,   // Per load
    waterEfficiencyReduction: 0.20,
  },

  // Travel / Flights (kg CO₂e per flight)
  travel: {
    domesticFlight: 255,   // Average domestic round-trip
    internationalFlight: 1100, // Average international round-trip
    hotelNight: 21,        // Per night hotel stay
  },

  // Benchmarks (tonnes CO₂e per year)
  benchmarks: {
    globalAverage: 4.8,
    usAverage: 14.7,
    euAverage: 6.5,
    indiaAverage: 1.9,
    ecoTarget: 2.5,       // Science-based target for 2030
    parisAgreementTarget: 2.0,
  },
} as const;

export type EmissionFactors = typeof EMISSION_FACTORS;
