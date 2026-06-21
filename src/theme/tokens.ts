/**
 * @fileoverview EcoPulse AI — Design Tokens.
 * Centralized design tokens for colors, spacing, radii, shadows, and
 * glassmorphism styles. All magic values used across the UI should be
 * defined here for consistency and maintainability.
 *
 * @module theme/tokens
 */

// ---- Color Palette ----

/** Dark-mode background gradient start. */
export const DARK_BG_START = '#1A2940';

/** Dark-mode background gradient end. */
export const DARK_BG_END = '#121E32';

/** Light-mode background gradient start. */
export const LIGHT_BG_START = '#FFFFFF';

/** Light-mode background gradient end. */
export const LIGHT_BG_END = '#F0F7F4';

/** Primary accent green used across the app. */
export const ACCENT_GREEN = '#52B788';

/** Category-specific colors used throughout charts and cards. */
export const CATEGORY_COLORS: Record<string, string> = {
  transportation: '#48CAE4',
  food: '#52B788',
  energy: '#F9A826',
  waste: '#74C69D',
  water: '#0096C7',
  shopping: '#FF6B6B',
  travel: '#90E0EF',
} as const;

// ---- Opacity values ----

/** Standard opacity levels for alpha compositing. */
export const OPACITY = {
  glassStart: 0.85,
  glassEnd: 0.65,
  lightGlassStart: 0.9,
  lightGlassEnd: 0.7,
  borderDark: 0.15,
  borderLight: 0.1,
  insetGlow: 0.06,
} as const;

// ---- Border Radii ----

/** Standard border radius tokens. */
export const RADIUS = {
  xs: '8px',
  sm: '10px',
  md: '12px',
  lg: '14px',
  xl: '20px',
  xxl: '24px',
  pill: '9999px',
} as const;

// ---- Spacing ----

/** Common spacing multipliers (in MUI's 8px grid). */
export const SPACING = {
  cardPadding: 2.5,
  sectionPadding: 3,
  sectionGap: 2,
  pageMaxWidth: 900,
  narrowMaxWidth: 700,
  wideMaxWidth: 1100,
} as const;

// ---- Shadows ----

/** Glassmorphism shadow presets. */
export const SHADOWS = {
  dark: '0 8px 32px rgba(0,0,0,0.35)',
  light: '0 8px 32px rgba(27,67,50,0.08), 0 2px 8px rgba(27,67,50,0.04)',
  darkHover: '0 20px 48px rgba(0,0,0,0.5)',
  lightHover: '0 20px 48px rgba(27,67,50,0.14), 0 8px 16px rgba(27,67,50,0.08)',
} as const;

// ---- Blur ----

/** Backdrop blur value for glassmorphism. */
export const BLUR = '24px';

// ---- Transitions ----

/** Standard CSS transition for glass elements. */
export const GLASS_TRANSITION = 'all 0.35s cubic-bezier(0.4,0,0.2,1)';

// ---- Font Weights ----

/** Named font weights for consistent typography. */
export const FONT_WEIGHT = {
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
} as const;
