import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import Loader from '../Loader/Loader';
import { markIntroPlayed } from './introGate';
import type { IntroPhase } from './IntroPhaseContext';
import { prefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { lockScroll, unlockScroll } from '../../utils/scrollLock';
import './Intro.css';

const CORNERS = ['tl', 'tr', 'bl', 'br'] as const;

const loadGsap = () => import('gsap').then((module) => module.gsap); // own chunk, fetched while the loader runs

interface IntroProps {
  pageRef: RefObject<HTMLDivElement>; // kept inert while the intro covers it
  onPhase: (phase: IntroPhase) => void; // moves the hero to its next step
  onDone: () => void; // page revealed, scrolling back
}

const Intro = ({ pageRef, onPhase, onDone }: IntroProps) => {
  const [reducedMotion] = useState(prefersReducedMotion); // read once: the plan can't change halfway
  const [handover, setHandover] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);
  const bracketRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const startHandover = useCallback(() => setHandover(true), []);

  useEffect(() => {
    markIntroPlayed();
    void loadGsap(); // warm the chunk up before the hand-over
    const page = pageRef.current;
    if (reducedMotion || !page) return;

    lockScroll(); // already locked at boot; again for StrictMode's dev remount
    page.inert = true;
    return () => {
      page.inert = false;
      unlockScroll();
    };
  }, [pageRef, reducedMotion]);

  useEffect(() => {
    if (!handover) return;
    const page = pageRef.current;
    const loader = loaderRef.current?.querySelector<HTMLElement>('.loader');
    if (!page || !loader) return;

    const finish = () => {
      page.inert = false;
      unlockScroll();
      history.scrollRestoration = 'auto';
      onDone();
    };

    let cancelled = false;
    let ctx: { revert: () => void } | undefined;

    const play = (gsap: Awaited<ReturnType<typeof loadGsap>>) => {
      if (cancelled) return;
      ctx = gsap.context(() => {
        const frame = page.querySelector<HTMLElement>('.hero__frame');
        const sources = CORNERS.map((c) => loader.querySelector<HTMLElement>(`.loader__brackets .corner--${c}`));
        const targets = CORNERS.map((c) => frame?.querySelector<HTMLElement>(`:scope > .corner--${c}`));
        const brackets = bracketRefs.current;

        const canOpen =
          frame && sources.every(Boolean) && targets.every(Boolean) && brackets.every(Boolean);
        if (reducedMotion || !canOpen) {
          gsap.to(loader, { autoAlpha: 0, duration: 0.6, ease: 'power1.out', onComplete: finish });
          return;
        }

        const from = sources.map((el) => el!.getBoundingClientRect());
        const to = targets.map((el) => el!.getBoundingClientRect());
        brackets.forEach((el, i) =>
          gsap.set(el, {
            left: from[i].left,
            top: from[i].top,
            width: from[i].width,
            height: from[i].height,
            autoAlpha: 1,
          })
        );
        gsap.set(loader.querySelector('.loader__brackets'), { autoAlpha: 0 });

        const tl = gsap.timeline({ onComplete: finish });

        tl.to(
          loader.querySelectorAll(
            '.loader__chrome, .loader__ring, .loader__sweep, .loader__avatar, .loader__sketch'
          ),
          { autoAlpha: 0, duration: 0.3, ease: 'power1.out' },
          0
        )
          .set(loader, { backgroundColor: 'transparent' }, 0.3)
          .call(onPhase, ['reveal'], 0.3);

        brackets.forEach((el, i) =>
          tl.to(
            el,
            {
              left: to[i].left,
              top: to[i].top,
              width: to[i].width,
              height: to[i].height,
              '--w': '2px',
              duration: 0.6,
              ease: 'power3.inOut',
            },
            0.3
          )
        );

        tl
          .fromTo(frame, { clipPath: 'inset(50% 50% 50% 50%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.3, ease: 'power2.out' }, 0.6) // frame opens from the centre
          .fromTo('.backdrop', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, ease: 'none' }, 0.6)
          .call(onPhase, ['hud'], 0.9)
          .fromTo('.header', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, ease: 'none' }, 0.9)
          .fromTo('.hero__callout-dot', { scale: 0 }, { scale: 1, duration: 0.2, ease: 'back.out(3)', stagger: 0.15 }, 1.26) // callouts 0.15s apart
          .fromTo('.hero__callout-line', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.4, ease: 'power2.out', stagger: 0.15 }, 1.34)
          .call(onPhase, ['rings'], 1.0)
          .fromTo('.hero__rings', { scale: 0.8, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.6, ease: 'power3.out' }, 1.0)
          .fromTo('.hero__avatar', { clipPath: 'circle(0% at 50% 50%)' }, { clipPath: 'circle(50% at 50% 50%)', duration: 0.7, ease: 'power2.inOut' }, 0.95) // photo opens from its centre…
          .fromTo(
            '.hero__avatar img',
            { scale: 1.3, filter: 'grayscale(1) contrast(1.15) brightness(0.4) blur(8px)' }, // …out of a blur, zooming out
            { scale: 1, filter: 'grayscale(1) contrast(1.15) brightness(1) blur(0px)', duration: 0.85, ease: 'power3.out' },
            0.95
          )
          .call(onPhase, ['title'], 1.2)
          .fromTo('.hero__title', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25, ease: 'none' }, 1.2)
          .fromTo(['.hero__description', '.hero__actions'], { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out', stagger: 0.1 }, 1.25)
          .set({}, {}, 1.8); // 1.8s: done, finish() gives scrolling back
      });
    };

    loadGsap().then(play, () => { // chunk failed: still reveal the page
      if (!cancelled) finish();
    });

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [handover, pageRef, reducedMotion, onPhase, onDone]);

  return (
    <>
      <div ref={loaderRef}>
        <Loader onComplete={startHandover} />
      </div>
      {!reducedMotion &&
        CORNERS.map((corner, i) => (
          <span
            key={corner}
            ref={(element) => {
              bracketRefs.current[i] = element;
            }}
            className={`intro__bracket intro__bracket--${corner}`}
            aria-hidden="true"
          />
        ))}
    </>
  );
};

export default Intro;
