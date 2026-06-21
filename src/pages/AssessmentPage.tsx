// ============================================================
// EcoPulse AI — Carbon Footprint Assessment Page
// Multi-step premium assessment form with 3D UI, glassmorphism,
// and micro-animations for an engaging survey experience.
// ============================================================

import React, { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  Slider,
  Switch,
  IconButton,
  useTheme,
  useMediaQuery,
  alpha,
  StepConnector,
  stepConnectorClasses,
  styled,
  LinearProgress,
} from '@mui/material';
import {
  ArrowBack,
  ArrowForward,
  Check,
  Add,
  Remove,
  DirectionsCar,
  DirectionsBike,
  DirectionsWalk,
  ElectricCar,
  TwoWheeler,
  NoCrash,
  EmojiNature,
  Celebration,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAssessmentStore } from '../stores/appStore';
import type {
  VehicleType,
  DietType,
  Frequency,
  ShoppingFrequency,
  TransportationData,
  DietData,
  ElectricityData,
  ShoppingData,
  WasteData,
  WaterData,
  TravelData,
  LifestyleData,
} from '../types';
import {
  staggerContainer,
  staggerItem,
  fadeInUp,
  tapScale,
} from '../theme/animations';
import { palette } from '../theme/theme';

// ============================================================
// Step metadata — emoji, title, description for each step
// ============================================================

interface StepMeta {
  emoji: string;
  title: string;
  description: string;
  color: string;
}

const STEP_META: StepMeta[] = [
  { emoji: '🚗', title: 'Transportation', description: 'How do you get around day-to-day?', color: '#48CAE4' },
  { emoji: '🥗', title: 'Diet & Food', description: "Let's talk about what's on your plate.", color: '#52B788' },
  { emoji: '⚡', title: 'Electricity', description: 'Your home energy usage matters.', color: '#F9A826' },
  { emoji: '🛍️', title: 'Shopping', description: 'Your consumer habits leave a trace.', color: '#E07A00' },
  { emoji: '♻️', title: 'Waste', description: 'How you handle waste makes a difference.', color: '#40916C' },
  { emoji: '💧', title: 'Water', description: 'Every drop counts for the planet.', color: '#0096C7' },
  { emoji: '✈️', title: 'Travel', description: 'Adventure is great — let\'s measure it.', color: '#FF6B6B' },
  { emoji: '🌱', title: 'Lifestyle', description: 'Your mindset shapes your footprint.', color: '#2D6A4F' },
];

const STEP_LABELS = STEP_META.map((s) => s.title);

// ============================================================
// Custom styled stepper connector with gradient line
// ============================================================

const GradientConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      background: `linear-gradient(90deg, ${palette.emerald}, ${palette.mintGreen})`,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      background: `linear-gradient(90deg, ${palette.emerald}, ${palette.mintGreen})`,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: alpha(theme.palette.text.secondary, 0.15),
    borderRadius: 2,
  },
}));

// Custom step icon with 3D feel
const StepIconRoot = styled('div')<{ ownerState: { active?: boolean; completed?: boolean } }>(
  ({ theme, ownerState }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 44,
    borderRadius: '50%',
    fontWeight: 700,
    fontSize: '0.85rem',
    transition: 'all 0.3s ease',
    ...(ownerState.completed
      ? {
          background: `linear-gradient(135deg, ${palette.emerald}, ${palette.mintGreen})`,
          color: '#fff',
          boxShadow: `0 4px 14px ${alpha(palette.emerald, 0.4)}`,
        }
      : ownerState.active
      ? {
          background: `linear-gradient(135deg, ${palette.emerald}, ${palette.leafGreen})`,
          color: '#fff',
          boxShadow: `0 4px 20px ${alpha(palette.emerald, 0.5)}`,
          transform: 'scale(1.1)',
        }
      : {
          background: alpha(theme.palette.text.secondary, 0.1),
          color: theme.palette.text.secondary,
        }),
  })
);

function CustomStepIcon(props: { active?: boolean; completed?: boolean; icon: React.ReactNode }) {
  const { active, completed, icon } = props;
  return (
    <StepIconRoot ownerState={{ active, completed }}>
      {completed ? <Check sx={{ fontSize: 20 }} /> : icon}
    </StepIconRoot>
  );
}

// ============================================================
// Reusable sub-components for form controls
// ============================================================

/** Gradient slider with custom thumb */
const GradientSlider = styled(Slider)(({ theme }) => ({
  color: palette.emerald,
  height: 8,
  '& .MuiSlider-track': {
    border: 'none',
    background: `linear-gradient(90deg, ${palette.emerald}, ${palette.mintGreen})`,
  },
  '& .MuiSlider-rail': {
    opacity: 0.2,
    backgroundColor: theme.palette.text.secondary,
  },
  '& .MuiSlider-thumb': {
    width: 24,
    height: 24,
    backgroundColor: '#fff',
    border: `3px solid ${palette.emerald}`,
    boxShadow: `0 2px 10px ${alpha(palette.emerald, 0.3)}`,
    '&:hover, &.Mui-focusVisible': {
      boxShadow: `0 0 0 8px ${alpha(palette.emerald, 0.16)}`,
    },
    '&.Mui-active': {
      boxShadow: `0 0 0 12px ${alpha(palette.emerald, 0.16)}`,
    },
  },
  '& .MuiSlider-valueLabel': {
    background: palette.emerald,
    borderRadius: 8,
    fontWeight: 600,
  },
}));

/** 3D Chip selector button */
interface ChipOption<T extends string> {
  value: T;
  label: string;
  emoji?: string;
}

function ChipSelector<T extends string>({
  options,
  value,
  onChange,
  id,
}: {
  options: ChipOption<T>[];
  value: T;
  onChange: (val: T) => void;
  id: string;
}) {
  const theme = useTheme();
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.2, justifyContent: 'center' }}>
      {options.map((opt) => {
        const selected = value === opt.value;
        return (
          <motion.button
            key={opt.value}
            id={`${id}-${opt.value}`}
            aria-pressed={selected}
            aria-label={opt.label}
            onClick={() => onChange(opt.value)}
            whileTap={{ scale: 0.93, y: 2 }}
            whileHover={{ scale: 1.05, y: -2 }}
            style={{
              cursor: 'pointer',
              border: selected
                ? `2px solid ${palette.emerald}`
                : `2px solid ${alpha(theme.palette.text.secondary, 0.15)}`,
              borderRadius: 14,
              padding: '10px 20px',
              fontFamily: 'inherit',
              fontSize: '0.9rem',
              fontWeight: selected ? 700 : 500,
              background: selected
                ? `linear-gradient(135deg, ${alpha(palette.emerald, 0.12)}, ${alpha(palette.mintGreen, 0.08)})`
                : theme.palette.mode === 'dark'
                ? alpha(theme.palette.background.paper, 0.5)
                : 'rgba(255,255,255,0.8)',
              color: selected ? palette.emerald : theme.palette.text.primary,
              boxShadow: selected
                ? `0 4px 16px ${alpha(palette.emerald, 0.25)}, inset 0 1px 0 ${alpha('#fff', 0.3)}`
                : `0 2px 8px ${alpha('#000', 0.06)}, inset 0 1px 0 ${alpha('#fff', 0.5)}`,
              backdropFilter: 'blur(6px)',
              transition: 'border-color 0.2s, background 0.2s, color 0.2s',
            }}
          >
            {opt.emoji && <span style={{ marginRight: 6 }}>{opt.emoji}</span>}
            {opt.label}
          </motion.button>
        );
      })}
    </Box>
  );
}

/** Counter input with + / - buttons */
function Counter({
  value,
  min,
  max,
  onChange,
  label,
  id,
  suffix,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (val: number) => void;
  label: string;
  id: string;
  suffix?: string;
}) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
      }}
    >
      <IconButton
        id={`${id}-dec`}
        aria-label={`Decrease ${label}`}
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
        sx={{
          width: 44,
          height: 44,
          background: alpha(theme.palette.text.secondary, 0.08),
          border: `1px solid ${alpha(theme.palette.text.secondary, 0.1)}`,
          '&:hover': { background: alpha(palette.emerald, 0.12) },
          transition: 'all 0.2s',
        }}
      >
        <Remove />
      </IconButton>

      <motion.div
        key={value}
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <Typography
          variant="h4"
          sx={{
            minWidth: 60,
            textAlign: 'center',
            fontWeight: 800,
            background: `linear-gradient(135deg, ${palette.emerald}, ${palette.mintGreen})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {value}{suffix && <Typography component="span" variant="body2" sx={{ fontWeight: 500, WebkitTextFillColor: theme.palette.text.secondary, ml: 0.5 }}>{suffix}</Typography>}
        </Typography>
      </motion.div>

      <IconButton
        id={`${id}-inc`}
        aria-label={`Increase ${label}`}
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
        sx={{
          width: 44,
          height: 44,
          background: alpha(theme.palette.text.secondary, 0.08),
          border: `1px solid ${alpha(theme.palette.text.secondary, 0.1)}`,
          '&:hover': { background: alpha(palette.emerald, 0.12) },
          transition: 'all 0.2s',
        }}
      >
        <Add />
      </IconButton>
    </Box>
  );
}

/** Toggle switch with label */
function ToggleRow({
  checked,
  onChange,
  label,
  id,
}: {
  checked: boolean;
  onChange: (val: boolean) => void;
  label: string;
  id: string;
}) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: alpha(theme.palette.text.secondary, 0.04),
        borderRadius: 3,
        px: 2.5,
        py: 1.5,
        border: `1px solid ${alpha(theme.palette.text.secondary, 0.08)}`,
      }}
    >
      <Typography variant="body1" sx={{ fontWeight: 500 }}>
        {label}
      </Typography>
      <Switch
        id={id}
        checked={checked}
        onChange={(_, v) => onChange(v)}
        sx={{
          '& .MuiSwitch-switchBase.Mui-checked': {
            color: palette.mintGreen,
          },
          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
            backgroundColor: palette.emerald,
          },
        }}
        slotProps={{ input: { 'aria-label': label } }}
      />
    </Box>
  );
}

/** Section sub-label for sliders */
function FieldLabel({ children, value }: { children: React.ReactNode; value?: string }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, mt: 2.5 }}>
      <Typography variant="body2" sx={{ fontWeight: 600 }}>
        {children}
      </Typography>
      {value && (
        <Typography
          variant="body2"
          sx={{
            fontWeight: 700,
            color: palette.emerald,
          }}
        >
          {value}
        </Typography>
      )}
    </Box>
  );
}

// ============================================================
// Vehicle type icon selector
// ============================================================

interface VehicleOption {
  value: VehicleType;
  label: string;
  icon: React.ReactNode;
  emoji: string;
}

const VEHICLE_OPTIONS: VehicleOption[] = [
  { value: 'car_petrol', label: 'Petrol Car', icon: <DirectionsCar />, emoji: '⛽' },
  { value: 'car_diesel', label: 'Diesel Car', icon: <DirectionsCar />, emoji: '🛢️' },
  { value: 'car_hybrid', label: 'Hybrid', icon: <NoCrash />, emoji: '🔋' },
  { value: 'car_ev', label: 'Electric', icon: <ElectricCar />, emoji: '⚡' },
  { value: 'motorcycle', label: 'Motorcycle', icon: <TwoWheeler />, emoji: '🏍️' },
  { value: 'bicycle', label: 'Bicycle', icon: <DirectionsBike />, emoji: '🚲' },
  { value: 'walk', label: 'Walking', icon: <DirectionsWalk />, emoji: '🚶' },
  { value: 'none', label: 'None', icon: <EmojiNature />, emoji: '🌿' },
];

function VehicleIconSelector({
  value,
  onChange,
}: {
  value: VehicleType;
  onChange: (v: VehicleType) => void;
}) {
  const theme = useTheme();
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, justifyContent: 'center' }}>
      {VEHICLE_OPTIONS.map((opt) => {
        const selected = value === opt.value;
        return (
          <motion.button
            key={opt.value}
            id={`vehicle-${opt.value}`}
            aria-pressed={selected}
            aria-label={opt.label}
            onClick={() => onChange(opt.value)}
            whileTap={{ scale: 0.9, rotateZ: -3 }}
            whileHover={{ scale: 1.08, y: -4 }}
            style={{
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              width: 80,
              padding: '14px 8px',
              borderRadius: 16,
              border: selected
                ? `2.5px solid ${palette.emerald}`
                : `1.5px solid ${alpha(theme.palette.text.secondary, 0.12)}`,
              background: selected
                ? `linear-gradient(145deg, ${alpha(palette.emerald, 0.12)}, ${alpha(palette.mintGreen, 0.06)})`
                : theme.palette.mode === 'dark'
                ? alpha(theme.palette.background.paper, 0.4)
                : 'rgba(255,255,255,0.85)',
              boxShadow: selected
                ? `0 6px 20px ${alpha(palette.emerald, 0.25)}`
                : `0 2px 8px ${alpha('#000', 0.05)}`,
              fontFamily: 'inherit',
              fontSize: '0.7rem',
              fontWeight: selected ? 700 : 500,
              color: selected ? palette.emerald : theme.palette.text.secondary,
              backdropFilter: 'blur(6px)',
              transition: 'border 0.2s, background 0.2s, color 0.2s, box-shadow 0.2s',
            }}
          >
            <span style={{ fontSize: '1.5rem' }}>{opt.emoji}</span>
            <span>{opt.label}</span>
          </motion.button>
        );
      })}
    </Box>
  );
}

// ============================================================
// Diet card selector
// ============================================================

interface DietOption {
  value: DietType;
  label: string;
  emoji: string;
  description: string;
  color: string;
}

const DIET_OPTIONS: DietOption[] = [
  { value: 'vegan', label: 'Vegan', emoji: '🌱', description: 'No animal products', color: '#40916C' },
  { value: 'vegetarian', label: 'Vegetarian', emoji: '🥚', description: 'No meat or fish', color: '#52B788' },
  { value: 'mixed', label: 'Mixed / Balanced', emoji: '🥗', description: 'A little bit of everything', color: '#F9A826' },
  { value: 'meat_heavy', label: 'Meat Heavy', emoji: '🥩', description: 'Meat at most meals', color: '#E63946' },
];

function DietCardSelector({
  value,
  onChange,
}: {
  value: DietType;
  onChange: (v: DietType) => void;
}) {
  const theme = useTheme();
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(4, 1fr)' }, gap: 1.5 }}>
      {DIET_OPTIONS.map((opt) => {
        const selected = value === opt.value;
        return (
          <motion.button
            key={opt.value}
            id={`diet-${opt.value}`}
            aria-pressed={selected}
            aria-label={opt.label}
            onClick={() => onChange(opt.value)}
            whileTap={{ scale: 0.93, y: 2 }}
            whileHover={{ scale: 1.04, y: -3 }}
            style={{
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
              padding: '20px 10px',
              borderRadius: 18,
              border: selected
                ? `2.5px solid ${opt.color}`
                : `1.5px solid ${alpha(theme.palette.text.secondary, 0.1)}`,
              background: selected
                ? `linear-gradient(145deg, ${alpha(opt.color, 0.12)}, ${alpha(opt.color, 0.04)})`
                : theme.palette.mode === 'dark'
                ? alpha(theme.palette.background.paper, 0.4)
                : 'rgba(255,255,255,0.85)',
              boxShadow: selected
                ? `0 6px 24px ${alpha(opt.color, 0.25)}`
                : `0 2px 8px ${alpha('#000', 0.05)}`,
              fontFamily: 'inherit',
              color: selected ? opt.color : theme.palette.text.primary,
              backdropFilter: 'blur(6px)',
              transition: 'all 0.2s',
            }}
          >
            <span style={{ fontSize: '2rem' }}>{opt.emoji}</span>
            <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{opt.label}</span>
            <span style={{ fontSize: '0.7rem', opacity: 0.7, fontWeight: 400 }}>{opt.description}</span>
          </motion.button>
        );
      })}
    </Box>
  );
}

// ============================================================
// Eco-consciousness star rating
// ============================================================

function StarRating({
  value,
  onChange,
  id,
}: {
  value: number;
  onChange: (v: number) => void;
  id: string;
}) {
  return (
    <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center' }}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= value;
        return (
          <motion.button
            key={star}
            id={`${id}-${star}`}
            aria-label={`${star} star${star > 1 ? 's' : ''}`}
            aria-pressed={filled}
            onClick={() => onChange(star)}
            whileTap={{ scale: 0.8, rotateZ: -15 }}
            whileHover={{ scale: 1.2, y: -4 }}
            style={{
              cursor: 'pointer',
              background: 'none',
              border: 'none',
              fontSize: '2.2rem',
              filter: filled ? 'none' : 'grayscale(1) opacity(0.35)',
              transition: 'filter 0.3s',
              padding: 0,
            }}
          >
            🌿
          </motion.button>
        );
      })}
    </Box>
  );
}

// ============================================================
// Three-option card selector
// ============================================================

interface ThreeOptionItem {
  value: string;
  label: string;
  emoji: string;
}

function ThreeOptionSelector({
  options,
  value,
  onChange,
  id,
}: {
  options: ThreeOptionItem[];
  value: string;
  onChange: (v: string) => void;
  id: string;
}) {
  const theme = useTheme();
  return (
    <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', flexWrap: 'wrap' }}>
      {options.map((opt) => {
        const selected = value === opt.value;
        return (
          <motion.button
            key={opt.value}
            id={`${id}-${opt.value}`}
            aria-pressed={selected}
            aria-label={opt.label}
            onClick={() => onChange(opt.value)}
            whileTap={{ scale: 0.92 }}
            whileHover={{ scale: 1.06, y: -3 }}
            style={{
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
              padding: '16px 24px',
              borderRadius: 16,
              border: selected ? `2.5px solid ${palette.emerald}` : `1.5px solid ${alpha(theme.palette.text.secondary, 0.12)}`,
              background: selected
                ? `linear-gradient(135deg, ${alpha(palette.emerald, 0.1)}, ${alpha(palette.mintGreen, 0.05)})`
                : theme.palette.mode === 'dark'
                ? alpha(theme.palette.background.paper, 0.4)
                : 'rgba(255,255,255,0.8)',
              fontFamily: 'inherit',
              fontWeight: selected ? 700 : 500,
              fontSize: '0.85rem',
              color: selected ? palette.emerald : theme.palette.text.primary,
              boxShadow: selected
                ? `0 4px 16px ${alpha(palette.emerald, 0.2)}`
                : `0 2px 6px ${alpha('#000', 0.04)}`,
              backdropFilter: 'blur(6px)',
              transition: 'all 0.2s',
            }}
          >
            <span style={{ fontSize: '1.5rem' }}>{opt.emoji}</span>
            <span>{opt.label}</span>
          </motion.button>
        );
      })}
    </Box>
  );
}

// ============================================================
// Frequency options used across multiple steps
// ============================================================

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

// ============================================================
// Individual step components
// ============================================================

/** Step 1 — Transportation */
const TransportationStep = React.memo(function TransportationStep() {
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

/** Step 2 — Diet */
const DietStep = React.memo(function DietStep() {
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

/** Step 3 — Electricity */
const ElectricityStep = React.memo(function ElectricityStep() {
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

/** Step 4 — Shopping */
const ShoppingStep = React.memo(function ShoppingStep() {
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

/** Step 5 — Waste */
const WasteStep = React.memo(function WasteStep() {
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

/** Step 6 — Water */
const WaterStep = React.memo(function WaterStep() {
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

/** Step 7 — Travel */
const TravelStep = React.memo(function TravelStep() {
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

/** Step 8 — Lifestyle */
const LifestyleStep = React.memo(function LifestyleStep() {
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

// ============================================================
// Celebration / Summary step (shown after step 8)
// ============================================================

function CelebrationSummary({ onComplete }: { onComplete: () => void }) {
  const theme = useTheme();
  const assessment = useAssessmentStore((s) => s.assessment);

  // Lightweight estimate for preview (actual report is generated by the engine)
  const estimatedTonnes = useMemo(() => {
    let total = 0;
    // Transportation rough estimate
    const fuelFactor = { car_petrol: 0.21, car_diesel: 0.19, car_hybrid: 0.12, car_ev: 0.05, motorcycle: 0.11, bicycle: 0, walk: 0, none: 0 };
    total += assessment.transportation.commuteDistanceKm * 365 * (fuelFactor[assessment.transportation.vehicleType] || 0.15);
    // Diet
    const dietFactor = { vegan: 1500, vegetarian: 1700, mixed: 2500, meat_heavy: 3300 };
    total += dietFactor[assessment.diet.dietType] || 2500;
    // Electricity
    total += (assessment.electricity.monthlyBillUSD / 100) * 4000;
    // Travel
    total += assessment.travel.domesticFlightsPerYear * 250 + assessment.travel.internationalFlightsPerYear * 1200;
    return (total / 1000).toFixed(1);
  }, [assessment]);

  // Confetti particles
  const particles = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 1.5,
        duration: 2 + Math.random() * 2,
        emoji: ['🌱', '🌿', '🍃', '💚', '✨', '🌍'][Math.floor(Math.random() * 6)],
        size: 14 + Math.random() * 14,
      })),
    []
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      style={{ textAlign: 'center', position: 'relative', overflow: 'hidden' }}
    >
      {/* Confetti particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: -40, x: `${p.x}%`, opacity: 0, scale: 0 }}
          animate={{
            y: ['-10%', '110%'],
            opacity: [0, 1, 1, 0],
            scale: [0, 1, 1, 0.5],
            rotate: [0, 360],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            repeatDelay: 1,
          }}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            fontSize: p.size,
            pointerEvents: 'none',
            zIndex: 0,
          }}
        >
          {p.emoji}
        </motion.div>
      ))}

      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          animate={{ rotate: [0, 10, -10, 10, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 1.5, delay: 0.3 }}
        >
          <Typography sx={{ fontSize: '4rem', mb: 1 }}>🎉</Typography>
        </motion.div>

        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
          Assessment Complete!
        </Typography>
        <Typography variant="body1" sx={{ color: theme.palette.text.secondary, mb: 4, maxWidth: 400, mx: 'auto' }}>
          Great job! We've gathered everything we need to calculate your carbon footprint.
        </Typography>

        {/* Estimated footprint preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <Box
            sx={{
              display: 'inline-flex',
              flexDirection: 'column',
              alignItems: 'center',
              px: 5,
              py: 3,
              borderRadius: 4,
              background: `linear-gradient(145deg, ${alpha(palette.emerald, 0.1)}, ${alpha(palette.mintGreen, 0.05)})`,
              border: `2px solid ${alpha(palette.emerald, 0.2)}`,
              boxShadow: `0 8px 32px ${alpha(palette.emerald, 0.15)}`,
              mb: 4,
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.text.secondary, mb: 0.5 }}>
              Estimated Annual Footprint
            </Typography>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.8 }}
            >
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 900,
                  background: `linear-gradient(135deg, ${palette.emerald}, ${palette.skyBlue})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                ~{estimatedTonnes}
              </Typography>
            </motion.div>
            <Typography variant="body2" sx={{ fontWeight: 500, color: theme.palette.text.secondary }}>
              tonnes CO₂e / year
            </Typography>
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                mt: 1.5,
                color: theme.palette.text.secondary,
                opacity: 0.7,
                fontStyle: 'italic',
                maxWidth: 320,
              }}
            >
              ℹ️ Estimates are based on EPA, IPCC AR6 &amp; DEFRA 2023 emission factors
              and are approximations for awareness purposes.
            </Typography>
          </Box>
        </motion.div>

        {/* Summary chips */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center', mb: 4 }}>
            {[
              { emoji: STEP_META[0].emoji, label: assessment.transportation.vehicleType.replace(/_/g, ' ') },
              { emoji: STEP_META[1].emoji, label: assessment.diet.dietType },
              { emoji: STEP_META[2].emoji, label: `$${assessment.electricity.monthlyBillUSD}/mo` },
              { emoji: STEP_META[6].emoji, label: `${assessment.travel.domesticFlightsPerYear + assessment.travel.internationalFlightsPerYear} flights/yr` },
            ].map((item, i) => (
              <motion.div key={i} variants={staggerItem}>
                <Box
                  sx={{
                    px: 2,
                    py: 0.8,
                    borderRadius: 3,
                    background: alpha(theme.palette.text.secondary, 0.06),
                    fontSize: '0.8rem',
                    fontWeight: 500,
                  }}
                >
                  {item.emoji} {item.label}
                </Box>
              </motion.div>
            ))}
          </Box>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <Button
            id="assessment-complete-btn"
            variant="contained"
            size="large"
            onClick={onComplete}
            startIcon={<Celebration />}
            sx={{
              px: 5,
              py: 1.6,
              fontSize: '1rem',
              fontWeight: 700,
              borderRadius: 3,
              background: `linear-gradient(135deg, ${palette.emerald}, ${palette.mintGreen})`,
              boxShadow: `0 8px 24px ${alpha(palette.emerald, 0.35)}`,
              '&:hover': {
                background: `linear-gradient(135deg, ${palette.forestGreen}, ${palette.emerald})`,
                boxShadow: `0 12px 32px ${alpha(palette.emerald, 0.4)}`,
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            See My Full Report
          </Button>
        </motion.div>
      </Box>
    </motion.div>
  );
}

// ============================================================
// Step direction variant for AnimatePresence
// ============================================================

const stepVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
    scale: 0.97,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 300, damping: 30 },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 80 : -80,
    opacity: 0,
    scale: 0.97,
    transition: { duration: 0.25 },
  }),
};

// ============================================================
// Main Assessment Page
// ============================================================

export default function AssessmentPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const currentStep = useAssessmentStore((s) => s.currentStep);
  const setStep = useAssessmentStore((s) => s.setStep);
  const completeAssessment = useAssessmentStore((s) => s.completeAssessment);

  // Track animation direction for slide
  const [direction, setDirection] = useState(0);

  // Total steps: 8 form steps + 1 summary
  const totalFormSteps = 8;
  const isOnSummary = currentStep >= totalFormSteps;
  const progress = ((currentStep) / totalFormSteps) * 100;

  // Navigation handlers
  const handleNext = useCallback(() => {
    setDirection(1);
    setStep(currentStep + 1);
  }, [currentStep, setStep]);

  const handleBack = useCallback(() => {
    setDirection(-1);
    setStep(currentStep - 1);
  }, [currentStep, setStep]);

  const handleComplete = useCallback(() => {
    completeAssessment();
    navigate('/dashboard');
  }, [completeAssessment, navigate]);

  // Render the current step's content
  const stepContent = useMemo(() => {
    switch (currentStep) {
      case 0: return <TransportationStep />;
      case 1: return <DietStep />;
      case 2: return <ElectricityStep />;
      case 3: return <ShoppingStep />;
      case 4: return <WasteStep />;
      case 5: return <WaterStep />;
      case 6: return <TravelStep />;
      case 7: return <LifestyleStep />;
      default: return <CelebrationSummary onComplete={handleComplete} />;
    }
  }, [currentStep, handleComplete]);

  const currentMeta = STEP_META[Math.min(currentStep, totalFormSteps - 1)];

  return (
    <Box
      sx={{
        minHeight: '100dvh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        // Gradient mesh background
        background: theme.palette.mode === 'dark'
          ? `radial-gradient(ellipse at 20% 0%, ${alpha(palette.emerald, 0.08)} 0%, transparent 50%),
             radial-gradient(ellipse at 80% 100%, ${alpha(palette.skyBlue, 0.06)} 0%, transparent 50%),
             ${theme.palette.background.default}`
          : `radial-gradient(ellipse at 20% 0%, ${alpha(palette.mintGreen, 0.15)} 0%, transparent 50%),
             radial-gradient(ellipse at 80% 100%, ${alpha(palette.skyBlue, 0.1)} 0%, transparent 50%),
             ${theme.palette.background.default}`,
        pb: 6,
        pt: { xs: 2, md: 4 },
        px: 2,
      }}
    >
      {/* Progress bar (mobile-friendly linear bar at the very top) */}
      <Box sx={{ width: '100%', maxWidth: 720, mb: { xs: 2, md: 3 } }}>
        <LinearProgress
          variant="determinate"
          value={progress}
          aria-label={`Assessment progress: step ${Math.min(currentStep + 1, totalFormSteps)} of ${totalFormSteps}`}
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
          sx={{
            height: 6,
            borderRadius: 3,
            backgroundColor: alpha(theme.palette.text.secondary, 0.1),
            '& .MuiLinearProgress-bar': {
              borderRadius: 3,
              background: `linear-gradient(90deg, ${palette.emerald}, ${palette.mintGreen}, ${palette.skyBlue})`,
              transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            },
          }}
        />
        <Typography
          variant="caption"
          sx={{ display: 'block', textAlign: 'right', mt: 0.5, color: theme.palette.text.secondary, fontWeight: 500 }}
        >
          {Math.min(currentStep + 1, totalFormSteps)} of {totalFormSteps}
        </Typography>
      </Box>

      {/* Stepper — shows step labels on tablet+ */}
      {!isMobile && (
        <Stepper
          activeStep={currentStep}
          alternativeLabel
          connector={<GradientConnector />}
          aria-label="Assessment progress"
          sx={{
            width: '100%',
            maxWidth: 820,
            mb: 4,
            '& .MuiStepLabel-label': {
              fontSize: isTablet ? '0.7rem' : '0.78rem',
              fontWeight: 500,
              mt: 1,
            },
            '& .MuiStepLabel-label.Mui-active': {
              fontWeight: 700,
              color: palette.emerald,
            },
            '& .MuiStepLabel-label.Mui-completed': {
              color: palette.emerald,
            },
          }}
        >
          {STEP_LABELS.map((label, idx) => (
            <Step key={label} completed={idx < currentStep}>
              <StepLabel
                slots={{
                  stepIcon: (props: { active?: boolean; completed?: boolean; icon: React.ReactNode }) => (
                    <CustomStepIcon {...props} icon={idx + 1} />
                  ),
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      )}

      {/* Main glassmorphism card container */}
      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        style={{
          width: '100%',
          maxWidth: 620,
          perspective: 1200,
        }}
      >
        <Box
          sx={{
            borderRadius: { xs: 4, md: 5 },
            p: { xs: 3, sm: 4, md: 5 },
            // Glassmorphism
            background: theme.palette.mode === 'dark'
              ? `linear-gradient(145deg, ${alpha('#1A2940', 0.85)}, ${alpha('#121E32', 0.7)})`
              : 'linear-gradient(145deg, rgba(255,255,255,0.85), rgba(250,253,246,0.7))',
            backdropFilter: 'blur(24px) saturate(180%)',
            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
            border: theme.palette.mode === 'dark'
              ? `1px solid ${alpha(palette.mintGreen, 0.12)}`
              : '1px solid rgba(255,255,255,0.5)',
            boxShadow: theme.palette.mode === 'dark'
              ? `0 20px 60px rgba(0,0,0,0.4), 0 1px 0 ${alpha(palette.mintGreen, 0.05)} inset`
              : '0 20px 60px rgba(27, 67, 50, 0.08), 0 4px 16px rgba(27, 67, 50, 0.04)',
            // 3D transform
            transform: 'translateZ(0)',
            transformStyle: 'preserve-3d',
            minHeight: { xs: 400, md: 440 },
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Step header with emoji and title */}
          {!isOnSummary && (
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <motion.div
                key={`emoji-${currentStep}`}
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              >
                <Typography
                  sx={{
                    fontSize: { xs: '3rem', md: '3.5rem' },
                    lineHeight: 1,
                    mb: 1,
                    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))',
                  }}
                >
                  {currentMeta.emoji}
                </Typography>
              </motion.div>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  background: `linear-gradient(135deg, ${currentMeta.color}, ${palette.emerald})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {currentMeta.title}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: theme.palette.text.secondary, mt: 0.5, fontWeight: 400 }}
              >
                {currentMeta.description}
              </Typography>
            </Box>
          )}

          {/* Animated step content */}
          <Box sx={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentStep}
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                {stepContent}
              </motion.div>
            </AnimatePresence>
          </Box>

          {/* Navigation buttons */}
          {!isOnSummary && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mt: 4,
                pt: 2,
                borderTop: `1px solid ${alpha(theme.palette.text.secondary, 0.08)}`,
              }}
            >
              <Button
                id="assessment-back-btn"
                disabled={currentStep === 0}
                onClick={handleBack}
                startIcon={<ArrowBack />}
                sx={{
                  color: theme.palette.text.secondary,
                  fontWeight: 600,
                  visibility: currentStep === 0 ? 'hidden' : 'visible',
                  '&:hover': { color: palette.emerald },
                }}
              >
                Back
              </Button>

              {/* Step dots (mobile) */}
              {isMobile && (
                <Box sx={{ display: 'flex', gap: 0.6 }}>
                  {STEP_META.map((_, i) => (
                    <Box
                      key={i}
                      sx={{
                        width: i === currentStep ? 18 : 6,
                        height: 6,
                        borderRadius: 3,
                        background:
                          i < currentStep
                            ? palette.emerald
                            : i === currentStep
                            ? `linear-gradient(90deg, ${palette.emerald}, ${palette.mintGreen})`
                            : alpha(theme.palette.text.secondary, 0.15),
                        transition: 'all 0.3s',
                      }}
                    />
                  ))}
                </Box>
              )}

              <Button
                id="assessment-next-btn"
                variant="contained"
                onClick={handleNext}
                endIcon={currentStep === totalFormSteps - 1 ? <Check /> : <ArrowForward />}
                sx={{
                  px: 3.5,
                  py: 1.2,
                  fontWeight: 700,
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${palette.emerald}, ${palette.mintGreen})`,
                  boxShadow: `0 4px 16px ${alpha(palette.emerald, 0.3)}`,
                  '&:hover': {
                    background: `linear-gradient(135deg, ${palette.forestGreen}, ${palette.emerald})`,
                    boxShadow: `0 6px 24px ${alpha(palette.emerald, 0.4)}`,
                    transform: 'translateY(-1px)',
                  },
                  transition: 'all 0.3s ease',
                }}
                {...tapScale}
              >
                {currentStep === totalFormSteps - 1 ? 'Finish' : 'Next'}
              </Button>
            </Box>
          )}
        </Box>
      </motion.div>
    </Box>
  );
}
