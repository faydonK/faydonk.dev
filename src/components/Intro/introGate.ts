import { prefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { lockScroll } from '../../utils/scrollLock';

const STORAGE_KEY = 'faydonk:intro-played';
const HOME_PATH = /^\/(?:(?:en|fr)\/?)?$/;

const alreadyPlayed = (): boolean => {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false; // storage blocked: just play it
  }
};

let pending = HOME_PATH.test(window.location.pathname) && !alreadyPlayed(); // once per session, only when arriving on the home page

if (pending) {
  history.scrollRestoration = 'manual';
  window.scrollTo(0, 0); // the intro always starts at the top
  if (!prefersReducedMotion()) lockScroll(); // frozen from the first frame (reduced motion: plain fade, no lock)
}

export const isIntroPending = (): boolean => pending;

export const markIntroPlayed = (): void => {
  pending = false;
  try {
    sessionStorage.setItem(STORAGE_KEY, '1');
  } catch {} // storage blocked: the module flag still prevents a replay in this tab
};
