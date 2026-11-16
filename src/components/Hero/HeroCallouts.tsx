import { useEffect, useState, type RefObject } from 'react';
import DecodeText from './DecodeText';

export interface Callout {
  key: string;
  label: string;
  value: string;
  angle: number; // degrees, 0 = right, clockwise
}

const BOX = 460; // rings artwork box (px); the radii below use the same units
const PHOTO_RADIUS = 150;
const OUTER_RADIUS = 226;

const ELBOW = 24; // B sits this far beyond the outer ring
const OFFSET_WIDE = 56; // horizontal run B → D…
const OFFSET_NARROW = 32; // …shortened when there is not enough room
const TEXT_GAP = 8;
const TICK = 6;
const CHAR_WIDTH = 11 * 0.72; // JetBrains Mono 11px + 0.08em tracking, per character (measured)
const COLUMN_GAP = 56; // gap between the intro column and the visual (see Hero.css)
const SAFETY = 12;

const layout = (size: number, offset: number, callouts: Callout[]) =>
  callouts.map((callout) => {
    const theta = (callout.angle * Math.PI) / 180;
    const cos = Math.cos(theta);
    const sin = Math.sin(theta);
    const centre = size / 2;
    const photo = (size * PHOTO_RADIUS) / BOX;
    const elbow = (size * OUTER_RADIUS) / BOX + ELBOW;
    const dir = cos >= 0 ? 1 : -1;

    const a = { x: centre + photo * cos, y: centre + photo * sin };
    const b = { x: centre + elbow * cos, y: centre + elbow * sin };
    const d = { x: b.x + dir * offset, y: b.y };
    const textX = d.x + dir * TEXT_GAP;
    const textWidth = `${callout.label} · ${callout.value}`.length * CHAR_WIDTH;
    const reach = dir > 0 ? textX + textWidth - size : textWidth - textX;

    return { ...callout, a, b, d, textX, dir, reach };
  });

interface HeroCalloutsProps {
  callouts: Callout[];
  visualRef: RefObject<HTMLDivElement>;
  frameRef: RefObject<HTMLDivElement>;
  sideBySide: boolean;
  decode: boolean;
}

const HeroCallouts = ({ callouts, visualRef, frameRef, sideBySide, decode }: HeroCalloutsProps) => {
  const [geometry, setGeometry] = useState<{ size: number; offset: number } | null>(null);

  useEffect(() => {
    const visual = visualRef.current;
    const frame = frameRef.current;
    if (!visual || !frame) return;

    const update = () => {
      const size = visual.clientWidth;
      const style = getComputedStyle(frame);
      const padLeft = parseFloat(style.paddingLeft);
      const padRight = parseFloat(style.paddingRight);
      let offset = OFFSET_NARROW;
      let marginLeft = 0;
      let marginRight = 0;

      if (sideBySide) {
        const rows = layout(size, offset, callouts);
        const right = Math.max(0, ...rows.filter((r) => r.dir > 0).map((r) => r.reach));
        const left = Math.max(0, ...rows.filter((r) => r.dir < 0).map((r) => r.reach));
        marginRight = Math.max(0, right - (padRight - SAFETY));
        marginLeft = Math.max(0, left - COLUMN_GAP + TEXT_GAP);
      } else {
        const side = (frame.clientWidth - padLeft - padRight - size) / 2;
        const fits = layout(size, OFFSET_WIDE, callouts).every(
          (r) => r.reach <= side + (r.dir > 0 ? padRight : padLeft) - SAFETY
        );
        offset = fits ? OFFSET_WIDE : OFFSET_NARROW;
      }

      visual.style.setProperty('--callout-left', `${marginLeft}px`);
      visual.style.setProperty('--callout-right', `${marginRight}px`);
      setGeometry((current) =>
        current?.size === size && current.offset === offset ? current : { size, offset }
      );
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(frame);
    observer.observe(visual);
    return () => observer.disconnect();
  }, [callouts, visualRef, frameRef, sideBySide]);

  if (!geometry) return null;
  const { size, offset } = geometry;

  return (
    <svg className="hero__callouts" width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      {layout(size, offset, callouts).map(({ key, label, value, a, b, d, textX, dir }, i) => (
        <g key={key}>
          <path
            className="hero__callout-line"
            d={`M${a.x} ${a.y} L${b.x} ${b.y} L${d.x} ${d.y} M${d.x} ${d.y - TICK / 2} L${d.x} ${d.y + TICK / 2}`}
            pathLength={1}
          />
          <circle className="hero__callout-dot" cx={a.x} cy={a.y} r={3} />
          <text
            className="hero__callout-text"
            x={textX}
            y={d.y}
            textAnchor={dir > 0 ? 'start' : 'end'}
            dominantBaseline="central"
          >
            <tspan className="hero__callout-key">
              <DecodeText text={`${label} · `} active={decode} delay={810 + i * 150} svg />
            </tspan>
            <tspan className="hero__callout-value">
              <DecodeText text={value} active={decode} delay={810 + i * 150} svg />
            </tspan>
          </text>
        </g>
      ))}
    </svg>
  );
};

export default HeroCallouts;
