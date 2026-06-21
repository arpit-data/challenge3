/**
 * @fileoverview EcoPulse AI — Assessment Constants.
 * Step metadata, styled stepper connector, and animation variants
 * shared across the assessment page sub-components.
 */

import {
  StepConnector,
  stepConnectorClasses,
  styled,
  alpha,
} from '@mui/material';
import { palette } from '../../theme/theme';

// ---- Step metadata ----

/** Shape of a single assessment step's metadata. */
export interface StepMeta {
  emoji: string;
  title: string;
  description: string;
  color: string;
}

/** Metadata for all 8 assessment steps. */
export const STEP_META: StepMeta[] = [
  { emoji: '🚗', title: 'Transportation', description: 'How do you get around day-to-day?', color: '#48CAE4' },
  { emoji: '🥗', title: 'Diet & Food', description: "Let's talk about what's on your plate.", color: '#52B788' },
  { emoji: '⚡', title: 'Electricity', description: 'Your home energy usage matters.', color: '#F9A826' },
  { emoji: '🛍️', title: 'Shopping', description: 'Your consumer habits leave a trace.', color: '#E07A00' },
  { emoji: '♻️', title: 'Waste', description: 'How you handle waste makes a difference.', color: '#40916C' },
  { emoji: '💧', title: 'Water', description: 'Every drop counts for the planet.', color: '#0096C7' },
  { emoji: '✈️', title: 'Travel', description: 'Adventure is great — let\'s measure it.', color: '#FF6B6B' },
  { emoji: '🌱', title: 'Lifestyle', description: 'Your mindset shapes your footprint.', color: '#2D6A4F' },
];

/** Step labels derived from step metadata. */
export const STEP_LABELS = STEP_META.map((s) => s.title);

/** Total number of form steps (excluding celebration). */
export const TOTAL_FORM_STEPS = 8;

// ---- Styled stepper connector ----

/** Custom stepper connector with gradient line. */
export const GradientConnector = styled(StepConnector)(({ theme }) => ({
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

// ---- Styled step icon root ----

/** Styled root for the custom step icon with 3D feel. */
export const StepIconRoot = styled('div')<{ ownerState: { active?: boolean; completed?: boolean } }>(
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

// ---- Step animation variants ----

/** Framer Motion variants for step slide transitions. */
export const stepVariants = {
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
