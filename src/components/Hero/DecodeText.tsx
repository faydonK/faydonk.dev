import { useEffect, useState } from 'react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

const GLYPHS = '#%&@$*+=<>/\\01XYZ';
const STEP_MS = 35;

interface DecodeTextProps {
  text: string;
  active: boolean; // decoding starts when true; invisible (room kept) until then
  delay?: number; // ms
  duration?: number; // ms
  svg?: boolean; // inside an SVG <text>: the placeholder is a <tspan>
}

const DecodeText = ({ text, active, delay = 0, duration = 500, svg = false }: DecodeTextProps) => {
  const reducedMotion = usePrefersReducedMotion();
  const [display, setDisplay] = useState<string | null>(null);

  useEffect(() => {
    if (!active || reducedMotion) return;
    const chars = Array.from(text);
    let interval = 0;

    const timeout = window.setTimeout(() => {
      const start = performance.now();
      interval = window.setInterval(() => {
        const progress = Math.min(1, (performance.now() - start) / duration);
        const revealed = Math.floor(chars.length * progress);
        setDisplay(
          chars
            .map((char, i) =>
              i < revealed || char === ' ' ? char : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
            )
            .join('')
        );
        if (progress >= 1) window.clearInterval(interval);
      }, STEP_MS);
    }, delay);

    return () => {
      window.clearTimeout(timeout);
      window.clearInterval(interval);
    };
  }, [active, reducedMotion, text, delay, duration]);

  if (active && reducedMotion) return <>{text}</>;
  if (!active || display === null) {
    return svg ? <tspan visibility="hidden">{text}</tspan> : <span style={{ visibility: 'hidden' }}>{text}</span>;
  }
  return <>{display}</>;
};

export default DecodeText;
