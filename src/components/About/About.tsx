import { useTranslation } from 'react-i18next';
import SectionHeading from '../SectionHeading/SectionHeading';
import './About.css';

const TIMELINE = [ // texts in the locales: about.timeline.<id>.{tag,text}
  { id: 'age16', highlight: false },
  { id: 'error', highlight: true },
  { id: 'reboot', highlight: false },
  { id: 'fuel', highlight: false },
  { id: 'now', highlight: true },
] as const;

const About = () => {
  const { t } = useTranslation();

  return (
    <section id="about" className="about" aria-labelledby="about-title">
      <SectionHeading id="about-title" align="center" kicker={t('about.kicker')} title={t('about.title')} />

      <ol className="timeline">
        {TIMELINE.map(({ id, highlight }, index) => {
          const side = index % 2 === 0 ? 'left' : 'right';
          const isLast = index === TIMELINE.length - 1;

          return (
            <li key={id} className={`timeline__item timeline__item--${side}`}>
              <span
                className={`timeline__marker${isLast ? ' timeline__marker--current' : ''}`}
                aria-hidden="true"
              />
              <div className="timeline__card">
                <span className={`timeline__tag${highlight ? ' timeline__tag--highlight' : ''}`}>
                  {t(`about.timeline.${id}.tag`)}
                </span>
                <p className="timeline__text">{t(`about.timeline.${id}.text`)}</p>
              </div>
            </li>
          );
        })}
      </ol>

      <p className="about__ps">{t('about.ps')}</p>
    </section>
  );
};

export default About;
