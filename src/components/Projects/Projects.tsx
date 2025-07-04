import React from 'react';
import { ExternalLink } from 'lucide-react';
import './Projects.css';

import aircodesLogo from '../../assets/images/IMG-20250704-WA0004.png';

const Projects: React.FC = () => {
  const projects = [
    {
      name: 'AirCodes',
      description: 'AirCodes is an open-source, community-focused platform designed for everyone. It encourages active participation and responsiveness through a unique coin system. Members can earn coins to unlock exclusive rewards in the community-run shop, fostering collaboration and motivation.',
      logo: aircodesLogo,
      link: {
        url: 'https://www.aircodes.net/',
        display: 'aircodes.net'
      }
    }
  ];

  return (
    <section id="projects" className="projects">
      <div className="container">
        <h2 className="projects-title">Projects</h2>
        <div className="projects-grid">
          {projects.map((project, index) => (
            <div key={index} className="project-card">
              <div className="project-header">
                <img
                  src={project.logo}
                  alt={`${project.name} logo`}
                  className="project-logo"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <h3 className="project-name">{project.name}</h3>
              </div>
              <div className="project-content">
                <p className="project-description">{project.description}</p>
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;