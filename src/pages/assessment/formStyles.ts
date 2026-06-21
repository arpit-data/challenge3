/**
 * @fileoverview EcoPulse AI — Assessment Form Styles & Types.
 * Styled components and TypeScript interfaces used by assessment form controls.
 */

import { Slider, styled, alpha } from '@mui/material';
import { palette } from '../../theme/theme';

/** Gradient slider with custom thumb. */
export const GradientSlider = styled(Slider)(({ theme }) => ({
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

/** Option shape for ChipSelector. */
export interface ChipOption<T extends string> {
  value: T;
  label: string;
  emoji?: string;
}

/** Option shape for ThreeOptionSelector. */
export interface ThreeOptionItem {
  value: string;
  label: string;
  emoji: string;
}
