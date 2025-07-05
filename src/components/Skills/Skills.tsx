import React, { useEffect, useRef, useState } from 'react';
import {
  NodeJSIcon,
  ReactIcon,
  ViteIcon,
  ExpressIcon,
  SQLiteIcon,
  JavaScriptIcon,
  TypeScriptIcon,
  RubyIcon,
  DiscordIcon,
  GitIcon,
  DockerIcon,
  PostmanIcon,
  InsomniaIcon,
  UbuntuIcon,
  VSCodeIcon
} from '../../assets/icons';
import './Skills.css';

const Skills: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const skillsRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (skillsRef.current) {
      observer.observe(skillsRef.current);
    }

    return () => {
      if (skillsRef.current) {
        observer.unobserve(skillsRef.current);
      }
    };
  }, []);

  const technologies = [
    { name: 'JavaScript', Icon: JavaScriptIcon, title: 'JavaScript' },
    { name: 'TypeScript', Icon: TypeScriptIcon, title: 'TypeScript' },
    { name: 'Ruby', Icon: RubyIcon, title: 'Ruby' },
    { name: 'Vite', Icon: ViteIcon, title: 'Vite' },
    { name: 'React', Icon: ReactIcon, title: 'React' },
    { name: 'Express', Icon: ExpressIcon, title: 'Express' },
    { name: 'Node.js', Icon: NodeJSIcon, title: 'Node.js' },
    { name: 'SQLite', Icon: SQLiteIcon, title: 'SQLite' },
    { name: 'Discord.js', Icon: DiscordIcon, title: 'Discord.js' }
  ];

  const tools = [
    { name: 'VS Code', Icon: VSCodeIcon, title: 'VS Code' },
    { name: 'Git', Icon: GitIcon, title: 'Git' },
    { name: 'Docker', Icon: DockerIcon, title: 'Docker' },
    { name: 'Ubuntu', Icon: UbuntuIcon, title: 'Ubuntu' },
    { name: 'Postman', Icon: PostmanIcon, title: 'Postman' },
    { name: 'Insomnia', Icon: InsomniaIcon, title: 'Insomnia' },
  ];

  return (
    <section id="skills" className="skills" ref={skillsRef}>
      <div className="container">
        <div className={`skills-content ${isVisible ? 'fade-in-up' : ''}`}>
          <h2 className="skills-title">What I Use</h2>
          <p className="skills-intro">
            Passionné par le développement web, j'ai acquis une solide expérience avec diverses technologies modernes. 
            De la création d'interfaces utilisateur interactives aux API robustes, j'aime explorer et maîtriser 
            les outils qui permettent de créer des applications performantes et innovantes.
          </p>
          
          <div className="skills-section">
            <h3 className="section-title">Technologies:</h3>
            <div className="skills-grid">
              {technologies.map((tech, index) => (
                <div key={index} className="skill-item" title={tech.title}>
                  <div className="skill-icon">
                    <tech.Icon size={50} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="skills-section">
            <h3 className="section-title">Tools:</h3>
            <div className="skills-grid">
              {tools.map((tool, index) => (
                <div key={index} className="skill-item" title={tool.title}>
                  <div className="skill-icon">
                    <tool.Icon size={50} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;