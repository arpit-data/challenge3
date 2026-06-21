/**
 * @fileoverview EcoPulse AI — Dashboard Helper Components.
 * React components used by the Dashboard page:
 * AnimatedCounter, WelcomeState, PieTooltipContent.
 */

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  useTheme,
  alpha,
} from '@mui/material';
import { PlayArrowRounded as PlayIcon } from '@mui/icons-material';
import { motion, useMotionValue, animate } from 'framer-motion';
import { pageVariants } from '../../theme/animations';

// ---- AnimatedCounter ----

/** Props for the AnimatedCounter component. */
interface AnimatedCounterProps {
  /** Target numeric value to animate to. */
  value: number;
  /** Number of decimal places. @defaultValue 1 */
  decimals?: number;
  /** Animation duration in seconds. @defaultValue 2 */
  duration?: number;
  /** Suffix appended after the number. */
  suffix?: string;
}

/** Animated numeric counter with spring easing. */
export const AnimatedCounter: React.FC<AnimatedCounterProps> = React.memo(
  ({ value, decimals = 1, duration = 2, suffix = '' }) => {
    const motionVal = useMotionValue(0);
    const [display, setDisplay] = useState('0');

    useEffect(() => {
      const controls = animate(motionVal, value, {
        duration,
        ease: [0.4, 0, 0.2, 1],
        onUpdate: (v) => setDisplay(v.toFixed(decimals)),
      });
      return controls.stop;
    }, [value, decimals, duration, motionVal]);

    return (
      <span>
        {display}
        {suffix}
      </span>
    );
  }
);
AnimatedCounter.displayName = 'AnimatedCounter';

// ---- Welcome State ----

/** Welcome state component shown when no assessment report is available. */
export const WelcomeState: React.FC = React.memo(() => {
  const theme = useTheme();
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <Box
        sx={{
          minHeight: '70vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          px: 3,
        }}
      >
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Box sx={{ fontSize: '5rem', mb: 2 }}>🌍</Box>
        </motion.div>

        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2,
          }}
        >
          Welcome to EcoPulse AI
        </Typography>

        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ maxWidth: 480, mb: 4, lineHeight: 1.6 }}
        >
          Take your first carbon footprint assessment to unlock your personalized dashboard,
          insights, and recommendations.
        </Typography>

        <Button
          id="btn-start-assessment"
          variant="contained"
          size="large"
          startIcon={<PlayIcon />}
          href="/assessment"
          sx={{
            px: 5,
            py: 1.8,
            fontSize: '1.1rem',
            borderRadius: 3,
            background: `linear-gradient(135deg, #2D6A4F 0%, #40916C 100%)`,
            boxShadow: `0 8px 32px ${alpha('#2D6A4F', 0.35)}`,
            '&:hover': {
              boxShadow: `0 12px 40px ${alpha('#2D6A4F', 0.5)}`,
              transform: 'translateY(-2px)',
            },
          }}
        >
          Start Assessment
        </Button>
      </Box>
    </motion.div>
  );
});
WelcomeState.displayName = 'WelcomeState';

// ---- Custom Pie Chart Tooltip ----

/** Payload shape for the pie chart tooltip. */
interface PiePayload {
  payload: {
    label: string;
    icon: string;
    kgCO2e: number;
    percentage: number;
  };
}

/** Custom tooltip for the carbon breakdown pie chart. */
export const PieTooltipContent: React.FC<{ active?: boolean; payload?: PiePayload[] }> = ({
  active,
  payload,
}) => {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  return (
    <Box
      sx={{
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(12px)',
        borderRadius: 2,
        p: 1.5,
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        border: '1px solid rgba(0,0,0,0.06)',
      }}
    >
      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
        {data.icon} {data.label}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {data.kgCO2e.toLocaleString()} kg CO₂e ({data.percentage}%)
      </Typography>
    </Box>
  );
};
