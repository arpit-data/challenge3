// ============================================================
// EcoPulse AI — Framer Motion Animation Variants
// Consistent, accessible, performant animations
// ============================================================

import type { Variants, Transition } from 'framer-motion';

// Respect user's motion preferences
const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const duration = prefersReducedMotion ? 0 : undefined;

// Spring transitions
export const springTransition: Transition = {
  type: 'spring',
  stiffness: 260,
  damping: 20,
  duration,
};

export const smoothTransition: Transition = {
  type: 'tween',
  ease: [0.4, 0, 0.2, 1],
  duration: duration ?? 0.4,
};

// Page transitions
export const pageVariants: Variants = {
  initial: { opacity: 0, y: 20, scale: 0.98 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: duration ?? 0.5, ease: [0.4, 0, 0.2, 1] },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.98,
    transition: { duration: duration ?? 0.3 },
  },
};

// Card entrance
export const cardVariants: Variants = {
  initial: { opacity: 0, y: 30, rotateX: -5 },
  animate: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 20,
      duration,
    },
  },
};

// Stagger children
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: prefersReducedMotion ? 0 : 0.1,
      delayChildren: prefersReducedMotion ? 0 : 0.1,
    },
  },
};

export const staggerItem: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: duration ?? 0.4, ease: [0.4, 0, 0.2, 1] },
  },
};

// Floating animation (for decorative elements)
export const floatVariants: Variants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: duration ?? 3,
      repeat: Infinity,
      repeatType: 'reverse',
      ease: 'easeInOut',
    },
  },
};

// Scale on tap
export const tapScale = prefersReducedMotion ? {} : {
  whileTap: { scale: 0.96 },
  whileHover: { scale: 1.02 },
};

// Fade in from direction
export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 40 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: duration ?? 0.6, ease: [0.4, 0, 0.2, 1] },
  },
};

export const fadeInLeft: Variants = {
  initial: { opacity: 0, x: -40 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: duration ?? 0.6, ease: [0.4, 0, 0.2, 1] },
  },
};

export const fadeInRight: Variants = {
  initial: { opacity: 0, x: 40 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: duration ?? 0.6, ease: [0.4, 0, 0.2, 1] },
  },
};

// Counter animation helper
export const counterVariants: Variants = {
  initial: { opacity: 0, scale: 0.5 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 15,
      duration,
    },
  },
};

// 3D card tilt (for interactive cards)
export const tilt3DVariants: Variants = {
  initial: {
    rotateX: 0,
    rotateY: 0,
    transformPerspective: 1000,
  },
  hover: {
    rotateX: -2,
    rotateY: 2,
    transformPerspective: 1000,
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
    transition: { duration: duration ?? 0.3 },
  },
};

// Progress ring animation
export const progressRingVariants: Variants = {
  initial: { pathLength: 0 },
  animate: (progress: number) => ({
    pathLength: progress,
    transition: {
      duration: duration ?? 1.5,
      ease: [0.4, 0, 0.2, 1],
    },
  }),
};

// Badge unlock
export const badgeUnlockVariants: Variants = {
  initial: { scale: 0, rotate: -180 },
  animate: {
    scale: 1,
    rotate: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 15,
      duration,
    },
  },
};

// Notification slide in
export const slideInRight: Variants = {
  initial: { x: 100, opacity: 0 },
  animate: {
    x: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 300, damping: 25, duration },
  },
  exit: {
    x: 100,
    opacity: 0,
    transition: { duration: duration ?? 0.2 },
  },
};
