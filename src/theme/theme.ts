// ============================================================
// EcoPulse AI — Theme System
// Material Design 3 inspired, nature-palette, 3D-ready theme
// ============================================================

import { createTheme, alpha } from '@mui/material/styles';

/**
 * Nature-inspired color palette serving as the design-token foundation.
 *
 * All theme colors are derived from these tokens. Update values here to
 * propagate changes across both light and dark themes.
 */
const palette = {
  forestGreen: '#1B4332',
  emerald: '#2D6A4F',
  leafGreen: '#40916C',
  mintGreen: '#52B788',
  paleGreen: '#74C69D',
  lightMint: '#95D5B2',
  foam: '#B7E4C7',
  skyBlue: '#48CAE4',
  oceanBlue: '#0096C7',
  earthBrown: '#8B6914',
  warmBeige: '#F5F0E8',
  softWhite: '#FAFDF6',
  darkBg: '#0A1628',
  darkSurface: '#121E32',
  darkCard: '#1A2940',
};

/**
 * Light MUI theme built on the nature-inspired {@link palette}.
 *
 * Includes customized typography (Inter font family), rounded shapes,
 * gradient buttons, hover-lift card effects, and styled scrollbars.
 */
export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: palette.emerald,
      light: palette.mintGreen,
      dark: palette.forestGreen,
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: palette.skyBlue,
      light: '#90E0EF',
      dark: palette.oceanBlue,
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F0F7F4',
      paper: '#FFFFFF',
    },
    success: {
      main: '#40916C',
      light: '#74C69D',
      dark: '#1B4332',
    },
    warning: {
      main: '#F9A826',
      light: '#FFD166',
      dark: '#E07A00',
    },
    error: {
      main: '#E63946',
      light: '#FF6B6B',
      dark: '#C1121F',
    },
    info: {
      main: palette.skyBlue,
    },
    text: {
      primary: '#1A2332',
      secondary: '#546E7A',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      letterSpacing: '-0.02em',
      lineHeight: 1.1,
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    subtitle1: {
      fontWeight: 500,
      letterSpacing: '0.01em',
    },
    button: {
      textTransform: 'none' as const,
      fontWeight: 600,
      letterSpacing: '0.02em',
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '@import': "url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap')",
        body: {
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': { width: '6px' },
          '&::-webkit-scrollbar-track': { background: 'transparent' },
          '&::-webkit-scrollbar-thumb': {
            background: alpha(palette.emerald, 0.3),
            borderRadius: '3px',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          border: '1px solid rgba(45, 106, 79, 0.08)',
          boxShadow: '0 4px 24px rgba(27, 67, 50, 0.06), 0 1px 4px rgba(27, 67, 50, 0.04)',
          transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px) scale(1.01)',
            boxShadow: '0 12px 40px rgba(27, 67, 50, 0.12), 0 4px 12px rgba(27, 67, 50, 0.08)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 24px',
          fontSize: '0.938rem',
          fontWeight: 600,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 16px rgba(45, 106, 79, 0.24)',
          },
        },
        contained: {
          background: `linear-gradient(135deg, ${palette.emerald} 0%, ${palette.leafGreen} 100%)`,
          '&:hover': {
            background: `linear-gradient(135deg, ${palette.leafGreen} 0%, ${palette.emerald} 100%)`,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          fontWeight: 500,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          height: 8,
          backgroundColor: alpha(palette.emerald, 0.12),
        },
        bar: {
          borderRadius: 8,
          background: `linear-gradient(90deg, ${palette.emerald}, ${palette.mintGreen})`,
        },
      },
    },
  },
});

/**
 * Dark MUI theme extending {@link lightTheme} with adjusted palette,
 * glassmorphism card backgrounds, and glowing mint-green accents.
 */
export const darkTheme = createTheme({
  ...lightTheme,
  palette: {
    mode: 'dark',
    primary: {
      main: palette.mintGreen,
      light: palette.paleGreen,
      dark: palette.emerald,
      contrastText: '#0A1628',
    },
    secondary: {
      main: palette.skyBlue,
      light: '#90E0EF',
      dark: palette.oceanBlue,
    },
    background: {
      default: palette.darkBg,
      paper: palette.darkSurface,
    },
    success: { main: '#52B788' },
    warning: { main: '#FFD166' },
    error: { main: '#FF6B6B' },
    text: {
      primary: '#E8F5E9',
      secondary: '#90A4AE',
    },
  },
  components: {
    ...lightTheme.components,
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          background: `linear-gradient(145deg, ${alpha(palette.darkCard, 0.8)}, ${alpha(palette.darkSurface, 0.6)})`,
          backdropFilter: 'blur(20px)',
          border: `1px solid ${alpha(palette.mintGreen, 0.1)}`,
          boxShadow: `0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 ${alpha(palette.mintGreen, 0.05)}`,
          transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px) scale(1.01)',
            boxShadow: `0 16px 48px rgba(0, 0, 0, 0.4), inset 0 1px 0 ${alpha(palette.mintGreen, 0.1)}`,
            borderColor: alpha(palette.mintGreen, 0.2),
          },
        },
      },
    },
  },
});

/**
 * Glassmorphism CSS property sets for light and dark modes.
 *
 * Apply as inline styles or spread into `sx` props to achieve
 * a frosted-glass effect with blur and saturation.
 */
export const glass = {
  light: {
    background: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
  },
  dark: {
    background: 'rgba(18, 30, 50, 0.7)',
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    border: `1px solid ${alpha(palette.mintGreen, 0.1)}`,
  },
};

/**
 * Reusable CSS gradient strings for hero sections, cards, accents,
 * success states, and warm highlights.
 */
export const gradients = {
  hero: `linear-gradient(135deg, ${palette.forestGreen} 0%, ${palette.emerald} 40%, ${palette.leafGreen} 100%)`,
  card: `linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(245,240,232,0.5) 100%)`,
  accent: `linear-gradient(135deg, ${palette.skyBlue} 0%, ${palette.oceanBlue} 100%)`,
  success: `linear-gradient(135deg, ${palette.mintGreen} 0%, ${palette.leafGreen} 100%)`,
  warm: `linear-gradient(135deg, #F9A826 0%, #FF6B6B 100%)`,
};

export { palette };
