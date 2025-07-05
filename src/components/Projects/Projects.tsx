import React, { useEffect, useRef, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import AirCodesIcon from '../../assets/images/Icon-AirCodes.png';
import './Projects.css';

const Projects: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const projectsRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (projectsRef.current) {
      observer.observe(projectsRef.current);
    }

    return () => {
      if (projectsRef.current) {
        observer.unobserve(projectsRef.current);
      }
    };
  }, []);

  return (
    <section id="projects" className="projects" ref={projectsRef}>
      <div className="container">
        <div className={`projects-content ${isVisible ? 'fade-in-up' : ''}`}>
          <h2 className="projects-title">My Projects</h2>
          <div className="projects-grid">
            {projects.map((project, index) => (
              <div key={index} className="project-card">
                <div className="project-header">
                  {project.logo && (
                    <img
                      src={project.logo}
                      alt={`${project.name} logo`}
                      className="project-logo"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  )}
                  <h3 className="project-name">{project.name}</h3>
                </div>
                <div className="project-content">
                  <p className="project-description">{project.description}</p>
                  {project.link?.url && project.link?.display && (
                    <div className="project-links">
                      <a
                        href={project.link.url}
                        className="project-link"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="link-icon" />
                        {project.link.display}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const projects = [
  {
    name: 'AirCodes',
    description: 'AirCodes is an open-source, community-focused platform designed for everyone. It encourages active participation and responsiveness through a unique coin system. Members can earn coins to unlock exclusive rewards in the community-run shop, fostering collaboration and motivation.',
    logo: AirCodesIcon,
    link: {
      url: 'https://www.aircodes.net/',
      display: 'aircodes.net'
    }
  }
];

export default Projects;