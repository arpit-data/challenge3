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

/** Spring-based transition with moderate stiffness and damping for natural motion. */
export const springTransition: Transition = {
  type: 'spring',
  stiffness: 260,
  damping: 20,
  duration,
};

/** Smooth tween transition using a Material Design standard easing curve. */
export const smoothTransition: Transition = {
  type: 'tween',
  ease: [0.4, 0, 0.2, 1],
  duration: duration ?? 0.4,
};

/** Page-level enter/exit animation variants with fade, slide, and subtle scale. */
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

/** Card entrance animation with upward slide, fade, and slight 3D tilt. */
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

/** Container variant that staggers the entrance of its children sequentially. */
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: prefersReducedMotion ? 0 : 0.1,
      delayChildren: prefersReducedMotion ? 0 : 0.1,
    },
  },
};

/** Individual stagger-child variant with fade-up entrance. Used with {@link staggerContainer}. */
export const staggerItem: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: duration ?? 0.4, ease: [0.4, 0, 0.2, 1] },
  },
};

/** Infinite floating animation for decorative elements (gentle vertical bob). */
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

/** Interactive scale feedback on tap (0.96×) and hover (1.02×). Empty when reduced motion is preferred. */
export const tapScale = prefersReducedMotion ? {} : {
  whileTap: { scale: 0.96 },
  whileHover: { scale: 1.02 },
};

/** Fade-in from below with a 40px offset. General-purpose entrance animation. */
export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 40 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: duration ?? 0.6, ease: [0.4, 0, 0.2, 1] },
  },
};

/** Fade-in from the left with a 40px offset. */
export const fadeInLeft: Variants = {
  initial: { opacity: 0, x: -40 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: duration ?? 0.6, ease: [0.4, 0, 0.2, 1] },
  },
};

/** Fade-in from the right with a 40px offset. */
export const fadeInRight: Variants = {
  initial: { opacity: 0, x: 40 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: duration ?? 0.6, ease: [0.4, 0, 0.2, 1] },
  },
};

/** Counter/number animation with spring scale-up from 0.5× to 1×. */
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

/** 3D card tilt effect on hover with perspective and enhanced shadow. */
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

/** SVG progress ring animation that draws from 0 to a custom progress value. */
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

/** Badge unlock celebration animation with spring scale-up and 180° rotation. */
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

/** Notification slide-in from the right with spring entrance and smooth exit. */
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
