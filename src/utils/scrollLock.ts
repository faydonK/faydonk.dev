const SCROLL_KEYS = new Set([' ', 'PageUp', 'PageDown', 'Home', 'End', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']);

const preventDefault = (event: Event) => event.preventDefault();

const preventScrollKeys = (event: KeyboardEvent) => {
  if (SCROLL_KEYS.has(event.key)) event.preventDefault();
};

let locked = false;

export const lockScroll = (): void => { // wheel, touch, keys; window.scrollTo() still works
  if (locked) return;
  locked = true;
  document.documentElement.style.overflow = 'hidden';
  document.body.style.touchAction = 'none';
  window.addEventListener('wheel', preventDefault, { passive: false });
  window.addEventListener('touchmove', preventDefault, { passive: false });
  window.addEventListener('keydown', preventScrollKeys);
};

export const unlockScroll = (): void => {
  if (!locked) return;
  locked = false;
  document.documentElement.style.removeProperty('overflow');
  document.body.style.removeProperty('touch-action');
  window.removeEventListener('wheel', preventDefault);
  window.removeEventListener('touchmove', preventDefault);
  window.removeEventListener('keydown', preventScrollKeys);
};
