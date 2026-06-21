// ============================================================
// EcoPulse AI — Shared GlassCard Component
// Reusable 3D glassmorphism card wrapper with hover effects
// ============================================================

/**
 * @fileoverview A shared glassmorphism-styled card component used
 * across multiple pages (Dashboard, Community, etc.) for consistent
 * card styling with backdrop blur, 3D hover transforms, and
 * dark/light mode support.
 *
 * @module components/GlassCard
 */

import React from 'react';
import { motion } from 'framer-motion';
import Card from '@mui/material/Card';
import { alpha, useTheme } from '@mui/material/styles';
import { staggerItem } from '../theme/animations';

/** Props accepted by the {@link GlassCard} component. */
interface GlassCardProps {
  /** Card content. */
  children: React.ReactNode;
  /** Additional MUI sx overrides. */
  sx?: object;
  /** HTML id attribute for testing / anchoring. */
  id?: string;
  /** Optional click handler — adds pointer cursor when provided. */
  onClick?: () => void;
}

/**
 * A reusable glassmorphism-styled card with 3D hover transforms.
 *
 * Renders a MUI `Card` wrapped in a Framer Motion `staggerItem`
 * animation container. Supports both dark and light themes with
 * distinct gradient backgrounds and box shadows.
 *
 * @example
 * ```tsx
 * <GlassCard id="stats-card" sx={{ p: 3 }}>
 *   <Typography>Hello</Typography>
 * </GlassCard>
 * ```
 */
const GlassCard: React.FC<GlassCardProps> = React.memo(({ children, sx, id, onClick }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <motion.div variants={staggerItem}>
      <Card
        id={id}
        onClick={onClick}
        sx={{
          position: 'relative',
          overflow: 'hidden',
          background: isDark
            ? `linear-gradient(145deg, ${alpha('#1A2940', 0.85)}, ${alpha('#121E32', 0.65)})`
            : `linear-gradient(145deg, rgba(255,255,255,0.92), rgba(245,250,247,0.65))`,
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          border: `1px solid ${isDark ? alpha('#52B788', 0.12) : alpha('#2D6A4F', 0.08)}`,
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          cursor: onClick ? 'pointer' : 'default',
          perspective: '1000px',
          transformStyle: 'preserve-3d',
          '&:hover': {
            transform: 'translateY(-6px) translateZ(10px) scale(1.015)',
            boxShadow: isDark
              ? `0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px ${alpha('#52B788', 0.15)}, inset 0 1px 0 ${alpha('#52B788', 0.1)}`
              : `0 20px 60px rgba(27,67,50,0.12), 0 8px 24px rgba(27,67,50,0.08), inset 0 1px 0 rgba(255,255,255,0.5)`,
          },
          ...sx,
        }}
      >
        {children}
      </Card>
    </motion.div>
  );
});
GlassCard.displayName = 'GlassCard';

export default GlassCard;
