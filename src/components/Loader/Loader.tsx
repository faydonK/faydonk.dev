import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Corners from '../Corners/Corners';
import avatar from '../../assets/images/pfp_faydonk.jpg';
import TRACE_PATHS from '../../assets/trace-paths.json'; // character-only strokes, from scripts/trace-avatar
import './Loader.css';

const TICK_MS = 60;
const STEPS = [2, 1, 3, 1, 2]; // progress added per tick, picked by progress % 5
const HOLD_MS = 1100; // "TARGET LOCKED" stays on screen before the window opens

const FORMULAS = [ // [text, x, y, font size] on a 1440×900 frame
  ['H₃O+', 120, 180, 28],
  ['CH₃', 260, 560, 18],
  ['H-C-CH', 1080, 160, 22],
  ['R¹=R²=CH₃', 1180, 620, 30],
  ['ΣF=ma', 160, 700, 14],
  ['C₆H₆', 1000, 760, 16],
  ['NaCl', 300, 320, 14],
  ['e=πf', 1220, 380, 18],
  ['COCH', 90, 460, 20],
  ['CHO', 1040, 480, 14],
] as const;

const BARS = Array.from({ length: 12 }, (_, i) => i);

interface LoaderProps {
  onComplete: () => void; // target locked and shown for HOLD_MS
}

const Loader = ({ onComplete }: LoaderProps) => {
  const { t } = useTranslation();
  const [progress, setProgress] = useState(0);
  const locked = progress >= 100;

  useEffect(() => {
    if (locked) return;
    const interval = window.setInterval(() => {
      setProgress((p) => Math.min(100, p + STEPS[p % STEPS.length]));
    }, TICK_MS);
    return () => window.clearInterval(interval);
  }, [locked]);

  useEffect(() => {
    if (!locked) return;
    const timeout = window.setTimeout(onComplete, HOLD_MS);
    return () => window.clearTimeout(timeout);
  }, [locked, onComplete]);

  const pct = String(progress).padStart(3, '0');
  const drawn = TRACE_PATHS.slice(0, Math.round((TRACE_PATHS.length * progress) / 100));
  const avatarOpacity = locked ? 1 : Math.max(0, (progress - 75) / 25) * 0.5;

  return (
    <div
      className={`loader${locked ? ' loader--locked' : ''}`}
      role="progressbar"
      aria-label={t('loader.label')}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progress}
    >
      <div className="loader__chrome loader__grid" />
      <div className="loader__chrome loader__axis loader__axis--h" />
      <div className="loader__chrome loader__axis loader__axis--v" />

      {FORMULAS.map(([text, x, y, size], i) => (
        <span
          key={text}
          className="loader__chrome loader__formula"
          style={{
            left: `${(x / 1440) * 100}%`,
            top: `${(y / 900) * 100}%`,
            fontSize: `max(10px, ${(size / 9).toFixed(2)}vmin)`,
            animationDelay: `${(i * 0.37).toFixed(2)}s`,
          }}
        >
          {text}
        </span>
      ))}

      <div className="loader__reticle">
        <svg className="loader__ring loader__ring--outer" viewBox="0 0 500 500">
          <circle className="loader__circle-dots" cx="250" cy="250" r="244" />
          <circle className="loader__circle-arcs" cx="250" cy="250" r="232" />
        </svg>
        <svg className="loader__ring loader__ring--middle" viewBox="0 0 500 500">
          <circle className="loader__circle-ticks" cx="250" cy="250" r="196" />
        </svg>
        <svg className="loader__ring loader__ring--inner" viewBox="0 0 500 500">
          <circle className="loader__circle-accent" cx="250" cy="250" r="160" />
        </svg>
        <div className="loader__sweep" />
        <div className="loader__brackets">
          <Corners />
        </div>
        <div
          className="loader__avatar"
          style={{ borderColor: `rgba(242, 242, 242, ${Math.min(1, progress / 100)})` }}
        >
          <img src={avatar} alt="" style={{ opacity: avatarOpacity }} />
        </div>
        <svg className="loader__sketch" viewBox="0 0 1000 1000">
          {drawn.map((d, i) => (
            <path key={i} d={d} pathLength={1} />
          ))}
        </svg>
      </div>

      <div className="loader__chrome loader__meta loader__meta--tl">
        <span className="loader__brand">faydonk.dev</span>
        <span>{t('loader.sector')}</span>
        <span>{t('loader.signal')} ████████░░</span>
      </div>

      <div className="loader__chrome loader__bars">
        {BARS.map((i) => (
          <span
            key={i}
            className="loader__bar"
            style={{ animationDelay: `${(i * 0.11).toFixed(2)}s` }}
          />
        ))}
      </div>

      <div className="loader__chrome loader__readout">
        <span className="loader__pct">{pct}</span>
        <span className="loader__status">{locked ? t('loader.locked') : t('loader.acquiring')}</span>
      </div>

      <div className="loader__chrome loader__meta loader__meta--bl">
        X 0720.00
        <br />Y 0450.00
        <br />Z ±0.000
      </div>
      <div className="loader__chrome loader__meta loader__meta--br">
        AZ {(progress * 3.6).toFixed(1)}°
        <br />
        RNG 0.{pct} km
        <br />
        {t('loader.mode')}
      </div>
    </div>
  );
};

export default Loader;
