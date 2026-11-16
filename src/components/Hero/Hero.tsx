import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Corners from '../Corners/Corners';
import DecodeText from './DecodeText';
import HeroCallouts, { type Callout } from './HeroCallouts';
import ScrambleText from './ScrambleText';
import { useIntroReached } from '../Intro/IntroPhaseContext';
import { useMailPicker } from '../MailPicker/MailPickerContext';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import avatar from '../../assets/images/pfp_faydonk.jpg';
import { SITE } from '../../data/site';
import './Hero.css';

const RecLabel = ({ decode, ticking }: { decode: boolean; ticking: boolean }) => { // decodes in with the HUD, then the seconds run
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!ticking) return;
    const interval = window.setInterval(() => setSeconds((s) => (s + 1) % 60), 1000);
    return () => window.clearInterval(interval);
  }, [ticking]);

  const text = `REC ● 00:${String(seconds).padStart(2, '0')} · CAM 01`;
  return (
    <span className="hero__label hero__label--left" aria-hidden="true">
      {ticking ? text : <DecodeText text={text} active={decode} />}
    </span>
  );
};

const Hero = () => {
  const { t } = useTranslation();
  const openMail = useMailPicker();
  const reached = useIntroReached(); // every step is reached when there's no intro
  const hud = reached('hud');
  const live = reached('live');
  const sideBySide = useMediaQuery('(min-width: 1180px)');
  const frameRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);

  const callouts = useMemo<Callout[]>(() => { // angles avoid the red arc, never exactly horizontal
    const split = (text: string) => {
      const [label, value] = text.split(' · ');
      return { label, value };
    };
    return [
      { key: 'id', label: 'ID', value: SITE.name, angle: -40 },
      { key: 'class', ...split(t('hero.callouts.class')), angle: 35 },
      { key: 'origin', ...split(t('hero.callouts.origin')), angle: 145 },
    ];
  }, [t]);

  const className = [
    'hero',
    'container',
    !live && 'hero--intro',
    reached('rings') && 'hero--rings',
    live && 'hero--live',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <section id="top" className={className} aria-labelledby="hero-title">
      <div ref={frameRef} className="hero__frame">
        <Corners />
        <RecLabel decode={hud} ticking={live} />
        <span className="hero__label hero__label--right" aria-hidden="true">
          <DecodeText text="H₃O+ · CH₃ · R¹=R²=CH₃" active={hud} delay={120} />
        </span>

        <svg className="hero__reticle" viewBox="0 0 30 30" aria-hidden="true">
          <circle className="hero__reticle-arc" cx="15" cy="15" r="11" />
          <path d="M15 1v7M15 22v7M1 15h7M22 15h7" />
          <circle className="hero__reticle-dot" cx="15" cy="15" r="1.6" />
        </svg>

        <div className="hero__intro">
          <p className="hero__status" aria-hidden="true">
            <DecodeText text={`● ${t('hero.locked')}`} active={hud} delay={240} />
          </p>
          <h1 id="hero-title" className="hero__title">
            {t('hero.greeting')}{' '}
            <ScrambleText className="hero__name" text={`${SITE.name}!`} active={reached('title')} />
          </h1>
          <p className="hero__description">{t('hero.description')}</p>
          <div className="hero__actions">
            <a className="btn" href="#projects">
              {t('hero.ctaProjects')}
            </a>
            <a className="btn btn--muted" href={`mailto:${SITE.email}`} onClick={openMail}>
              {t('hero.ctaContact')}
            </a>
          </div>
        </div>

        <div ref={visualRef} className="hero__visual" aria-hidden="true">
          <div className="hero__rings">
            <svg className="hero__ring hero__ring--dots" viewBox="0 0 460 460">
              <circle cx="230" cy="230" r="226" />
            </svg>
            <svg className="hero__ring hero__ring--ticks" viewBox="0 0 460 460">
              <circle cx="230" cy="230" r="206" />
            </svg>
            <svg className="hero__ring hero__ring--arcs" viewBox="0 0 460 460">
              <circle cx="230" cy="230" r="182" />
            </svg>
            <svg className="hero__ring hero__ring--accent" viewBox="0 0 460 460">
              <circle cx="230" cy="230" r="164" />
            </svg>
          </div>
          <div className="hero__avatar">
            <img src={avatar} alt="" width={256} height={256} />
          </div>
          <HeroCallouts
            callouts={callouts}
            visualRef={visualRef}
            frameRef={frameRef}
            sideBySide={sideBySide}
            decode={hud}
          />
        </div>

        <p className="hero__ids" aria-hidden="true">
          {callouts.map(({ key, label, value }) => (
            <span key={key}>
              <span className="hero__ids-key">{label} · </span>
              <span className="hero__ids-value">{value}</span>
            </span>
          ))}
        </p>
      </div>
    </section>
  );
};

export default Hero;
