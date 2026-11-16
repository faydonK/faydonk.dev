import { useEffect, useState } from 'react';

export const useTypewriter = (
  texts: readonly string[],
  typeSpeed = 550, // ms per typed character
  deleteSpeed = 220, // ms per deleted character
  pause = 3000 // ms with the whole text shown
) => {
  const [index, setIndex] = useState(0);
  const [length, setLength] = useState(0);
  const [deleting, setDeleting] = useState(false);

  const current = texts[index % texts.length] ?? '';

  useEffect(() => {
    let delay = deleting ? deleteSpeed : typeSpeed;
    let step: () => void;

    if (!deleting && length === current.length) {
      delay = pause;
      step = () => setDeleting(true);
    } else if (deleting && length === 0) {
      step = () => {
        setDeleting(false);
        setIndex((i) => (i + 1) % texts.length);
      };
    } else {
      step = () => setLength((l) => l + (deleting ? -1 : 1));
    }

    const timeout = window.setTimeout(step, delay);
    return () => window.clearTimeout(timeout);
  }, [current, length, deleting, texts.length, typeSpeed, deleteSpeed, pause]);

  return current.slice(0, length);
};
