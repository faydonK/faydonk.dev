import { useMediaQuery } from './useMediaQuery';

const QUERY = '(prefers-reduced-motion: reduce)';

export const prefersReducedMotion = (): boolean => // one-off read, outside React (boot, GSAP setup)
  typeof window !== 'undefined' && window.matchMedia(QUERY).matches;

export const usePrefersReducedMotion = (): boolean => useMediaQuery(QUERY);
