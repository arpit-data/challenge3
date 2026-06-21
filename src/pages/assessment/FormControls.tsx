/**
 * @fileoverview EcoPulse AI — Assessment Form Controls.
 * Reusable input components for the multi-step assessment form:
 * ChipSelector, Counter, ToggleRow, FieldLabel,
 * VehicleIconSelector, DietCardSelector, StarRating, ThreeOptionSelector.
 */

import React from 'react';
import {
  Box,
  Typography,
  Switch,
  IconButton,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Add,
  Remove,
  DirectionsCar,
  DirectionsBike,
  DirectionsWalk,
  ElectricCar,
  TwoWheeler,
  NoCrash,
  EmojiNature,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import type { VehicleType, DietType } from '../../types';
import { palette } from '../../theme/theme';
import type { ChipOption, ThreeOptionItem } from './formStyles';

export type { ChipOption, ThreeOptionItem };
export { GradientSlider } from './formStyles';


/** 3D chip selector button group. */
export function ChipSelector<T extends string>({
  options,
  value,
  onChange,
  id,
}: {
  options: ChipOption<T>[];
  value: T;
  onChange: (val: T) => void;
  id: string;
}): React.JSX.Element {
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

// ---- Counter ----

/** Counter input with + / − buttons. */
export function Counter({
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
}): React.JSX.Element {
  const theme = useTheme();
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
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

// ---- ToggleRow ----

/** Toggle switch with label. */
export function ToggleRow({
  checked,
  onChange,
  label,
  id,
}: {
  checked: boolean;
  onChange: (val: boolean) => void;
  label: string;
  id: string;
}): React.JSX.Element {
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

// ---- FieldLabel ----

/** Section sub-label for sliders. */
export function FieldLabel({ children, value }: { children: React.ReactNode; value?: string }): React.JSX.Element {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, mt: 2.5 }}>
      <Typography variant="body2" sx={{ fontWeight: 600 }}>
        {children}
      </Typography>
      {value && (
        <Typography variant="body2" sx={{ fontWeight: 700, color: palette.emerald }}>
          {value}
        </Typography>
      )}
    </Box>
  );
}

// ---- VehicleIconSelector ----

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

/** Vehicle type icon selector grid. */
export function VehicleIconSelector({
  value,
  onChange,
}: {
  value: VehicleType;
  onChange: (v: VehicleType) => void;
}): React.JSX.Element {
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

// ---- DietCardSelector ----

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

/** Diet type card selector grid. */
export function DietCardSelector({
  value,
  onChange,
}: {
  value: DietType;
  onChange: (v: DietType) => void;
}): React.JSX.Element {
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

// ---- StarRating ----

/** Eco-consciousness star rating with leaf emoji. */
export function StarRating({
  value,
  onChange,
  id,
}: {
  value: number;
  onChange: (v: number) => void;
  id: string;
}): React.JSX.Element {
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

// ---- ThreeOptionSelector ----

/** Three-option card selector. */
export function ThreeOptionSelector({
  options,
  value,
  onChange,
  id,
}: {
  options: ThreeOptionItem[];
  value: string;
  onChange: (v: string) => void;
  id: string;
}): React.JSX.Element {
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
