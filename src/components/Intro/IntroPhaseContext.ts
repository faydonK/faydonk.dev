import { createContext, useCallback, useContext } from 'react';

export const INTRO_PHASES = ['pending', 'reveal', 'hud', 'rings', 'title', 'live'] as const; // 'live' = intro over, or no intro this visit
export type IntroPhase = (typeof INTRO_PHASES)[number];

export const IntroPhaseContext = createContext<IntroPhase>('live');

export const useIntroReached = () => { // reached('hud'): always true without intro
  const phase = useContext(IntroPhaseContext);
  return useCallback(
    (step: IntroPhase) => INTRO_PHASES.indexOf(phase) >= INTRO_PHASES.indexOf(step),
    [phase]
  );
};
