import { useEffect, useState } from 'react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

const GLYPHS = '#%&@$*+=<>/\\01XYZ';
const FRAME_MS = 55;
const CYCLE_FRAMES = 140; // the text re-scrambles every ~7.7s
const REVEAL_START = 6; // frames before the first letter locks in
const REVEAL_STEP = 4; // frames between two letters locking in

const scrambleAt = (text: string, frame: number) =>
  Array.from(text, (char, i) =>
    frame > REVEAL_START + i * REVEAL_STEP ? char : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
  ).join('');

interface ScrambleTextProps {
  text: string;
  className?: string;
  active?: boolean; // false: glyphs frozen on their first frame
}

const ScrambleText = ({ text, className, active = true }: ScrambleTextProps) => {
  const reducedMotion = usePrefersReducedMotion();
  const [display, setDisplay] = useState(() => scrambleAt(text, 0));

  useEffect(() => {
    if (reducedMotion || !active) return;

    const settledAt = REVEAL_START + (text.length - 1) * REVEAL_STEP + 1;
    let frame = 0;
    const interval = window.setInterval(() => {
      frame = (frame + 1) % CYCLE_FRAMES;
      if (frame <= settledAt) setDisplay(scrambleAt(text, frame));
    }, FRAME_MS);

    return () => window.clearInterval(interval);
  }, [text, reducedMotion, active]);

  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{reducedMotion ? text : display}</span>
    </span>
  );
};

export default ScrambleText;
