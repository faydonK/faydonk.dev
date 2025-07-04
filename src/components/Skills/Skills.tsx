import React from 'react';
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
    <section id="skills" className="skills">
      <div className="container">
        <h2 className="skills-title">What I Use</h2>
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
    </section>
  );
};

export default Skills;