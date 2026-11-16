import { useTranslation } from 'react-i18next';
import Coin from '../Coin/Coin';
import Corners from '../Corners/Corners';
import SectionHeading from '../SectionHeading/SectionHeading';
import { useLanguage } from '../../hooks/useLanguage';
import { PROJECTS, type Project } from '../../data/projects';
import './Projects.css';

const pad = (n: number) => String(n).padStart(2, '0');

const FeaturedProject = ({ project }: { project: Project }) => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();

  return (
    <article className="featured">
      <Corners positions={['tl', 'br']} />
      {project.logo && (
        <div className="featured__visual" aria-hidden="true">
          <Coin image={project.logo} />
        </div>
      )}
      <div className="featured__body">
        <span className="featured__badge">{t('projects.featured', { index: pad(1) })}</span>
        <h3 className="featured__title">{project.name}</h3>
        <p className="featured__description">{project.description[currentLanguage]}</p>
        <a className="btn featured__link" href={project.url} target="_blank" rel="noopener noreferrer">
          {project.linkLabel}
        </a>
      </div>
    </article>
  );
};

const ProjectCard = ({ project, number }: { project: Project; number: number }) => {
  const { currentLanguage } = useLanguage();

  return (
    <a className="project-card" href={project.url} target="_blank" rel="noopener noreferrer">
      <Corners positions={['tl']} />
      <div className="project-card__top">
        {project.logo && (
          <div className="project-card__coin" aria-hidden="true">
            <Coin size="sm" image={project.logo} duration={`${5 + (number % 3) * 1.5}s`} />
          </div>
        )}
        <span className="project-card__number">{pad(number)}</span>
      </div>
      <h3 className="project-card__name">{project.name}</h3>
      <p className="project-card__summary">{(project.summary ?? project.description)[currentLanguage]}</p>
      <span className="project-card__link">{project.linkLabel}</span>
    </a>
  );
};

const Projects = () => {
  const { t } = useTranslation();
  const [featured, ...others] = PROJECTS;

  return (
    <section id="projects" className="projects container" aria-labelledby="projects-title">
      <div className="projects__head">
        <SectionHeading
          id="projects-title"
          kicker={t('projects.kicker', { count: PROJECTS.length })}
          title={t('projects.title')}
        />
        <span className="projects__layout">
          {t(others.length > 0 ? 'projects.layoutFeaturedGrid' : 'projects.layoutFeatured')}
        </span>
      </div>

      {featured && <FeaturedProject project={featured} />}

      {others.length > 0 && (
        <ul className="projects__grid">
          {others.map((project, i) => (
            <li key={project.id}>
              <ProjectCard project={project} number={i + 2} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default Projects;
