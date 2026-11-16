import { lazy, Suspense, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import SectionHeading from '../SectionHeading/SectionHeading';
import CssSkills from './CssSkills';
import { useInView } from '../../hooks/useInView';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { supportsWebGL } from '../../utils/webgl';
import { SITE } from '../../data/site';
import { TECHNOLOGIES, TOOLS, type Skill } from '../../data/skills';
import './Skills.css';

const loadScene = () => import('./SkillsScene'); // own chunk (three + R3F + Rapier), large screens only
const SkillsScene = lazy(loadScene);

const saveData = () => // Android "Data Saver"…: CSS version
  (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;

const TABS = ['tech', 'tools'] as const;
type Tab = (typeof TABS)[number];

const ITEMS: Record<Tab, Skill[]> = { tech: TECHNOLOGIES, tools: TOOLS };
const OTHER: Record<Tab, Tab> = { tech: 'tools', tools: 'tech' };

const DIRECTION: Record<Tab, 1 | -1> = { tech: 1, tools: -1 }; // tech from the left, tools from the right

const Skills = () => {
  const { t } = useTranslation();
  const [tab, setTab] = useState<Tab>('tech');
  const reducedMotion = usePrefersReducedMotion();
  const compact = useMediaQuery('(max-width: 720px)');
  const use3D = !reducedMotion && !compact && !saveData() && supportsWebGL();
  const section = useInView<HTMLElement>('200px'); // mounts the scene near the viewport, pauses it off screen
  const approach = useInView<HTMLDivElement>('1400px'); // starts downloading the 3D chunk
  const reveal = useInView<HTMLDivElement>('0px 0px -30% 0px'); // first logos come in when 30% on screen
  const tabRefs = useRef<Partial<Record<Tab, HTMLButtonElement | null>>>({});

  useEffect(() => {
    if (use3D && approach.seen) void loadScene();
  }, [use3D, approach.seen]);

  const [shown, setShown] = useState<Tab>(tab); // CSS version: logos swapped once swept out of sight
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (use3D || tab === shown) return;
    const ring = ringRef.current;
    if (!ring || reducedMotion) {
      setShown(tab);
      return;
    }
    const out = ring.animate(
      [
        { transform: 'none', opacity: 1 },
        { transform: `translateX(${DIRECTION[tab] * 110}%)`, opacity: 0 },
      ],
      { duration: 450, easing: 'cubic-bezier(.6, 0, .9, .5)', fill: 'forwards' }
    );
    out.finished.then(
      () => setShown(tab),
      () => undefined // cancelled by another switch
    );
    return () => out.cancel();
  }, [tab, shown, use3D, reducedMotion]);

  useEffect(() => {
    if (use3D || reducedMotion || !reveal.seen) return;
    ringRef.current?.animate(
      [
        { transform: `translateX(${-DIRECTION[shown] * 110}%)`, opacity: 0 },
        { transform: 'none', opacity: 1 },
      ],
      { duration: 650, easing: 'cubic-bezier(.2, .8, .2, 1)' }
    );
  }, [shown, reveal.seen, use3D, reducedMotion]);

  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const index = TABS.indexOf(tab);
    const targets: Partial<Record<string, Tab>> = {
      ArrowRight: TABS[(index + 1) % TABS.length],
      ArrowLeft: TABS[(index - 1 + TABS.length) % TABS.length],
      Home: TABS[0],
      End: TABS[TABS.length - 1],
    };
    const target = targets[event.key];

    if (!target) return;
    event.preventDefault();
    setTab(target);
    tabRefs.current[target]?.focus();
  };

  const items = ITEMS[tab];
  const from = DIRECTION[tab] === 1 ? 'left' : 'right';

  return (
    <section ref={section.ref} id="skills" className="skills" aria-labelledby="skills-title">
      <div className="skills__inner">
        <div className="skills__head container">
          <SectionHeading id="skills-title" kicker={t('skills.kicker')} title={t('skills.title')} />

          <div className="skills__tabs" role="tablist" aria-label={t('skills.tablist')}>
            {TABS.map((id) => (
              <button
                key={id}
                ref={(element) => {
                  tabRefs.current[id] = element;
                }}
                id={`skills-tab-${id}`}
                type="button"
                role="tab"
                className="skills__tab"
                aria-selected={tab === id}
                aria-controls="skills-panel"
                tabIndex={tab === id ? 0 : -1}
                onClick={() => setTab(id)}
                onKeyDown={onTabKeyDown}
              >
                {t(`skills.tabs.${id}`)}
              </button>
            ))}
          </div>
        </div>

        <div ref={approach.ref} className="skills__stage" aria-hidden="true">
          <div ref={reveal.ref} className="skills__core">
            <div className="skills__orbit">
              <span className="skills__orbit-ring" />
              <span className="skills__orbit-ring skills__orbit-ring--outer" />
            </div>
          </div>
          <span className="skills__core-label">{SITE.name}</span>

          {use3D && section.seen && (
            <div className="skills__scene">
              <Suspense fallback={null}>
                <SkillsScene
                  skills={items}
                  upcoming={ITEMS[OTHER[tab]]}
                  tab={tab}
                  direction={DIRECTION[tab]}
                  active={reveal.seen}
                  running={section.inView}
                />
              </Suspense>
            </div>
          )}

          {!use3D && reveal.seen && (
            <>
              <div className="skills__cloud">
                <CssSkills skills={ITEMS[shown]} ringRef={ringRef} />
              </div>
              <span key={tab} className={`skills__wipe skills__wipe--from-${from}`} />
            </>
          )}
        </div>

        <div id="skills-panel" className="container" role="tabpanel" aria-labelledby={`skills-tab-${tab}`}>
          <ul className="skills__chips">
            {items.map((skill) => (
              <li key={skill.name} className="skills__chip">
                {skill.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Skills;
