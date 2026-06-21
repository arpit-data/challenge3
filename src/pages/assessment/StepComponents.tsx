/**
 * @fileoverview EcoPulse AI — Assessment Step Components.
 * Individual memoized step components for each assessment category:
 * Transportation, Diet, Electricity, Shopping, Waste, Water, Travel, Lifestyle.
 */

import React, { useCallback } from 'react';
import { Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { useAssessmentStore } from '../../stores/appStore';
import { staggerContainer, staggerItem } from '../../theme/animations';
import type {
  TransportationData,
  DietData,
  ElectricityData,
  ShoppingData,
  WasteData,
  WaterData,
  TravelData,
  LifestyleData,
  Frequency,
  ShoppingFrequency,
} from '../../types';
import {
  GradientSlider,
  ChipSelector,
  Counter,
  ToggleRow,
  FieldLabel,
  VehicleIconSelector,
  DietCardSelector,
  StarRating,
  ThreeOptionSelector,
} from './FormControls';
import type { ChipOption } from './FormControls';

// ---- Frequency option data ----

const FREQUENCY_OPTIONS: ChipOption<Frequency>[] = [
  { value: 'never', label: 'Never', emoji: '🚫' },
  { value: 'rarely', label: 'Rarely', emoji: '🤏' },
  { value: 'sometimes', label: 'Sometimes', emoji: '🔄' },
  { value: 'often', label: 'Often', emoji: '📦' },
  { value: 'always', label: 'Always', emoji: '✅' },
];

const SHOPPING_FREQ_OPTIONS: ChipOption<ShoppingFrequency>[] = [
  { value: 'rarely', label: 'Rarely', emoji: '🤏' },
  { value: 'monthly', label: 'Monthly', emoji: '📅' },
  { value: 'weekly', label: 'Weekly', emoji: '📆' },
  { value: 'daily', label: 'Daily', emoji: '🔥' },
];

// ---- Step 1 — Transportation ----

/** Step 1 — Transportation assessment form. */
export const TransportationStep = React.memo(function TransportationStep(): React.JSX.Element {
  const assessment = useAssessmentStore((s) => s.assessment);
  const updateSection = useAssessmentStore((s) => s.updateSection);
  const data = assessment.transportation;

  const handleUpdate = useCallback(
    (partial: Partial<TransportationData>) => updateSection('transportation', partial),
    [updateSection]
  );

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate">
      <motion.div variants={staggerItem}>
        <FieldLabel value={`${data.commuteDistanceKm} km`}>Daily commute distance</FieldLabel>
        <GradientSlider
          id="transport-commute-slider"
          aria-label="Commute distance in kilometres"
          value={data.commuteDistanceKm}
          min={0}
          max={100}
          valueLabelDisplay="auto"
          valueLabelFormat={(v) => `${v} km`}
          onChange={(_, v) => handleUpdate({ commuteDistanceKm: v as number })}
        />
      </motion.div>

      <motion.div variants={staggerItem}>
        <FieldLabel>Primary vehicle type</FieldLabel>
        <VehicleIconSelector
          value={data.vehicleType}
          onChange={(v) => handleUpdate({ vehicleType: v })}
        />
      </motion.div>

      <motion.div variants={staggerItem}>
        <FieldLabel value={`${data.publicTransportDays} days/week`}>
          Public transport usage
        </FieldLabel>
        <GradientSlider
          id="transport-public-slider"
          aria-label="Public transport days per week"
          value={data.publicTransportDays}
          min={0}
          max={7}
          step={1}
          marks
          valueLabelDisplay="auto"
          valueLabelFormat={(v) => `${v} days`}
          onChange={(_, v) => handleUpdate({ publicTransportDays: v as number })}
        />
      </motion.div>

      <motion.div variants={staggerItem}>
        <FieldLabel>Ride-sharing frequency</FieldLabel>
        <ChipSelector
          id="transport-rideshare"
          options={FREQUENCY_OPTIONS}
          value={data.rideSharingFrequency}
          onChange={(v) => handleUpdate({ rideSharingFrequency: v })}
        />
      </motion.div>
    </motion.div>
  );
});

// ---- Step 2 — Diet ----

/** Step 2 — Diet & food assessment form. */
export const DietStep = React.memo(function DietStep(): React.JSX.Element {
  const assessment = useAssessmentStore((s) => s.assessment);
  const updateSection = useAssessmentStore((s) => s.updateSection);
  const data = assessment.diet;

  const handleUpdate = useCallback(
    (partial: Partial<DietData>) => updateSection('diet', partial),
    [updateSection]
  );

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate">
      <motion.div variants={staggerItem}>
        <FieldLabel>What best describes your diet?</FieldLabel>
        <DietCardSelector value={data.dietType} onChange={(v) => handleUpdate({ dietType: v })} />
      </motion.div>

      <motion.div variants={staggerItem}>
        <FieldLabel value={`${data.localFoodPercentage}%`}>Locally sourced food</FieldLabel>
        <GradientSlider
          id="diet-local-slider"
          aria-label="Percentage of locally sourced food"
          value={data.localFoodPercentage}
          min={0}
          max={100}
          valueLabelDisplay="auto"
          valueLabelFormat={(v) => `${v}%`}
          onChange={(_, v) => handleUpdate({ localFoodPercentage: v as number })}
        />
      </motion.div>

      <motion.div variants={staggerItem}>
        <FieldLabel>Food waste level</FieldLabel>
        <ChipSelector
          id="diet-waste"
          options={FREQUENCY_OPTIONS}
          value={data.foodWasteLevel}
          onChange={(v) => handleUpdate({ foodWasteLevel: v })}
        />
      </motion.div>
    </motion.div>
  );
});

// ---- Step 3 — Electricity ----

/** Step 3 — Electricity & energy assessment form. */
export const ElectricityStep = React.memo(function ElectricityStep(): React.JSX.Element {
  const assessment = useAssessmentStore((s) => s.assessment);
  const updateSection = useAssessmentStore((s) => s.updateSection);
  const data = assessment.electricity;

  const handleUpdate = useCallback(
    (partial: Partial<ElectricityData>) => updateSection('electricity', partial),
    [updateSection]
  );

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate">
      <motion.div variants={staggerItem}>
        <FieldLabel value={`$${data.monthlyBillUSD}`}>Monthly electricity bill</FieldLabel>
        <GradientSlider
          id="electricity-bill-slider"
          aria-label="Monthly electricity bill in USD"
          value={data.monthlyBillUSD}
          min={0}
          max={500}
          step={5}
          valueLabelDisplay="auto"
          valueLabelFormat={(v) => `$${v}`}
          onChange={(_, v) => handleUpdate({ monthlyBillUSD: v as number })}
        />
      </motion.div>

      <motion.div variants={staggerItem}>
        <FieldLabel>Household size</FieldLabel>
        <Counter
          id="electricity-household"
          label="household size"
          value={data.householdSize}
          min={1}
          max={8}
          onChange={(v) => handleUpdate({ householdSize: v })}
          suffix="people"
        />
      </motion.div>

      <motion.div variants={staggerItem}>
        <ToggleRow
          id="electricity-renewable"
          label="🌞 Do you use renewable energy?"
          checked={data.hasRenewableSource}
          onChange={(v) => handleUpdate({ hasRenewableSource: v })}
        />
      </motion.div>

      <motion.div variants={staggerItem}>
        <FieldLabel>Appliance efficiency</FieldLabel>
        <ThreeOptionSelector
          id="electricity-appliance"
          value={data.applianceEfficiency}
          onChange={(v) => handleUpdate({ applianceEfficiency: v as ElectricityData['applianceEfficiency'] })}
          options={[
            { value: 'old', label: 'Older / Inefficient', emoji: '🔌' },
            { value: 'mixed', label: 'Mixed Age', emoji: '🏠' },
            { value: 'efficient', label: 'Energy Star', emoji: '⭐' },
          ]}
        />
      </motion.div>
    </motion.div>
  );
});

// ---- Step 4 — Shopping ----

/** Step 4 — Shopping & consumption assessment form. */
export const ShoppingStep = React.memo(function ShoppingStep(): React.JSX.Element {
  const assessment = useAssessmentStore((s) => s.assessment);
  const updateSection = useAssessmentStore((s) => s.updateSection);
  const data = assessment.shopping;

  const handleUpdate = useCallback(
    (partial: Partial<ShoppingData>) => updateSection('shopping', partial),
    [updateSection]
  );

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate">
      <motion.div variants={staggerItem}>
        <FieldLabel>Online shopping frequency</FieldLabel>
        <ChipSelector
          id="shopping-online"
          options={SHOPPING_FREQ_OPTIONS}
          value={data.onlineShoppingFrequency}
          onChange={(v) => handleUpdate({ onlineShoppingFrequency: v })}
        />
      </motion.div>

      <motion.div variants={staggerItem}>
        <FieldLabel>Clothing items purchased per month</FieldLabel>
        <Counter
          id="shopping-clothing"
          label="clothing items per month"
          value={data.clothingItemsPerMonth}
          min={0}
          max={20}
          onChange={(v) => handleUpdate({ clothingItemsPerMonth: v })}
        />
      </motion.div>

      <motion.div variants={staggerItem}>
        <FieldLabel>Electronics purchased per year</FieldLabel>
        <Counter
          id="shopping-electronics"
          label="electronics per year"
          value={data.electronicsPerYear}
          min={0}
          max={10}
          onChange={(v) => handleUpdate({ electronicsPerYear: v })}
        />
      </motion.div>

      <motion.div variants={staggerItem}>
        <ToggleRow
          id="shopping-sustainable"
          label="🌿 Prefer sustainable / ethical brands?"
          checked={data.prefersSustainableBrands}
          onChange={(v) => handleUpdate({ prefersSustainableBrands: v })}
        />
      </motion.div>
    </motion.div>
  );
});

// ---- Step 5 — Waste ----

/** Step 5 — Waste management assessment form. */
export const WasteStep = React.memo(function WasteStep(): React.JSX.Element {
  const assessment = useAssessmentStore((s) => s.assessment);
  const updateSection = useAssessmentStore((s) => s.updateSection);
  const data = assessment.waste;

  const handleUpdate = useCallback(
    (partial: Partial<WasteData>) => updateSection('waste', partial),
    [updateSection]
  );

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate">
      <motion.div variants={staggerItem}>
        <FieldLabel>Recycling frequency</FieldLabel>
        <ChipSelector
          id="waste-recycle"
          options={FREQUENCY_OPTIONS}
          value={data.recyclingFrequency}
          onChange={(v) => handleUpdate({ recyclingFrequency: v })}
        />
      </motion.div>

      <motion.div variants={staggerItem}>
        <ToggleRow
          id="waste-compost"
          label="🪱 Do you compost?"
          checked={data.composting}
          onChange={(v) => handleUpdate({ composting: v })}
        />
      </motion.div>

      <motion.div variants={staggerItem}>
        <FieldLabel>Single-use plastic usage</FieldLabel>
        <ChipSelector
          id="waste-plastic"
          options={FREQUENCY_OPTIONS}
          value={data.singleUsePlasticFrequency}
          onChange={(v) => handleUpdate({ singleUsePlasticFrequency: v })}
        />
      </motion.div>
    </motion.div>
  );
});

// ---- Step 6 — Water ----

/** Step 6 — Water usage assessment form. */
export const WaterStep = React.memo(function WaterStep(): React.JSX.Element {
  const assessment = useAssessmentStore((s) => s.assessment);
  const updateSection = useAssessmentStore((s) => s.updateSection);
  const data = assessment.water;

  const handleUpdate = useCallback(
    (partial: Partial<WaterData>) => updateSection('water', partial),
    [updateSection]
  );

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate">
      <motion.div variants={staggerItem}>
        <FieldLabel value={`${data.showerMinutesPerDay} min`}>Average shower time per day</FieldLabel>
        <GradientSlider
          id="water-shower-slider"
          aria-label="Shower minutes per day"
          value={data.showerMinutesPerDay}
          min={1}
          max={30}
          valueLabelDisplay="auto"
          valueLabelFormat={(v) => `${v} min`}
          onChange={(_, v) => handleUpdate({ showerMinutesPerDay: v as number })}
        />
      </motion.div>

      <motion.div variants={staggerItem}>
        <FieldLabel>Laundry loads per week</FieldLabel>
        <Counter
          id="water-laundry"
          label="laundry loads per week"
          value={data.laundryLoadsPerWeek}
          min={0}
          max={14}
          onChange={(v) => handleUpdate({ laundryLoadsPerWeek: v })}
        />
      </motion.div>

      <motion.div variants={staggerItem}>
        <ToggleRow
          id="water-efficiency"
          label="🚿 Water-efficient fixtures installed?"
          checked={data.hasWaterEfficiency}
          onChange={(v) => handleUpdate({ hasWaterEfficiency: v })}
        />
      </motion.div>
    </motion.div>
  );
});

// ---- Step 7 — Travel ----

/** Step 7 — Travel & flights assessment form. */
export const TravelStep = React.memo(function TravelStep(): React.JSX.Element {
  const assessment = useAssessmentStore((s) => s.assessment);
  const updateSection = useAssessmentStore((s) => s.updateSection);
  const data = assessment.travel;

  const handleUpdate = useCallback(
    (partial: Partial<TravelData>) => updateSection('travel', partial),
    [updateSection]
  );

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate">
      <motion.div variants={staggerItem}>
        <FieldLabel>Domestic flights per year ✈️</FieldLabel>
        <Counter
          id="travel-domestic"
          label="domestic flights per year"
          value={data.domesticFlightsPerYear}
          min={0}
          max={20}
          onChange={(v) => handleUpdate({ domesticFlightsPerYear: v })}
        />
      </motion.div>

      <motion.div variants={staggerItem}>
        <FieldLabel>International flights per year 🌍</FieldLabel>
        <Counter
          id="travel-international"
          label="international flights per year"
          value={data.internationalFlightsPerYear}
          min={0}
          max={10}
          onChange={(v) => handleUpdate({ internationalFlightsPerYear: v })}
        />
      </motion.div>

      <motion.div variants={staggerItem}>
        <FieldLabel>Hotel nights per year 🏨</FieldLabel>
        <Counter
          id="travel-hotels"
          label="hotel nights per year"
          value={data.hotelNightsPerYear}
          min={0}
          max={50}
          onChange={(v) => handleUpdate({ hotelNightsPerYear: v })}
        />
      </motion.div>
    </motion.div>
  );
});

// ---- Step 8 — Lifestyle ----

/** Step 8 — Lifestyle & mindset assessment form. */
export const LifestyleStep = React.memo(function LifestyleStep(): React.JSX.Element {
  const assessment = useAssessmentStore((s) => s.assessment);
  const updateSection = useAssessmentStore((s) => s.updateSection);
  const data = assessment.lifestyle;

  const handleUpdate = useCallback(
    (partial: Partial<LifestyleData>) => updateSection('lifestyle', partial),
    [updateSection]
  );

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate">
      <motion.div variants={staggerItem}>
        <FieldLabel>Eco-consciousness level</FieldLabel>
        <Typography variant="body2" sx={{ textAlign: 'center', mb: 2, opacity: 0.6 }}>
          How eco-aware do you consider yourself?
        </Typography>
        <StarRating
          id="lifestyle-eco"
          value={data.ecoConsciousnessLevel}
          onChange={(v) => handleUpdate({ ecoConsciousnessLevel: v })}
        />
      </motion.div>

      <motion.div variants={staggerItem}>
        <FieldLabel>Budget sensitivity</FieldLabel>
        <ThreeOptionSelector
          id="lifestyle-budget"
          value={data.budgetSensitivity}
          onChange={(v) => handleUpdate({ budgetSensitivity: v as LifestyleData['budgetSensitivity'] })}
          options={[
            { value: 'low', label: 'Budget Friendly', emoji: '💰' },
            { value: 'medium', label: 'Balanced', emoji: '⚖️' },
            { value: 'high', label: 'Willing to Invest', emoji: '💎' },
          ]}
        />
      </motion.div>

      <motion.div variants={staggerItem}>
        <FieldLabel>Willingness to change</FieldLabel>
        <ThreeOptionSelector
          id="lifestyle-change"
          value={data.willingnessToChange}
          onChange={(v) => handleUpdate({ willingnessToChange: v as LifestyleData['willingnessToChange'] })}
          options={[
            { value: 'low', label: 'Small Steps', emoji: '🐢' },
            { value: 'medium', label: 'Moderate Effort', emoji: '🚶' },
            { value: 'high', label: 'All In!', emoji: '🚀' },
          ]}
        />
      </motion.div>
    </motion.div>
  );
});
