/**
 * @fileoverview Shared glassmorphism styling hooks.
 * Provides reusable glass-effect style objects for cards and sections
 * across the application, supporting both dark and light themes.
 *
 * @module hooks/useGlassStyle
 */

import { useMemo } from 'react';
import { alpha, useTheme } from '@mui/material/styles';
import type { SxProps, Theme } from '@mui/material/styles';

/**
 * Returns a memoized glassmorphism style object for card/section backgrounds.
 *
 * The style includes gradient backgrounds, backdrop blur, themed borders,
 * and subtle box shadows that adapt to the current palette mode.
 *
 * @param extraSx - Additional sx properties to merge (e.g., `{ mb: 3 }`)
 * @returns A memoized sx-compatible style object
 */
export function useGlassStyle(extraSx?: SxProps<Theme>): Record<string, unknown> {
  const theme = useTheme();
  return useMemo(() => ({
    background: theme.palette.mode === 'dark'
      ? `linear-gradient(145deg, ${alpha('#1A2940', 0.85)}, ${alpha('#121E32', 0.65)})`
      : `linear-gradient(145deg, ${alpha('#FFFFFF', 0.9)}, ${alpha('#F0F7F4', 0.7)})`,
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    border: `1px solid ${alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.15 : 0.1)}`,
    borderRadius: '20px',
    boxShadow: theme.palette.mode === 'dark'
      ? `0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 ${alpha('#52B788', 0.06)}`
      : '0 8px 32px rgba(27,67,50,0.08), 0 2px 8px rgba(27,67,50,0.04)',
    transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
    ...(extraSx as Record<string, unknown>),
  }), [theme, extraSx]);
}
