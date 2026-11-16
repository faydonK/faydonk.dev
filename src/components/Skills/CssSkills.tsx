import type { CSSProperties, RefObject } from 'react';
import type { Skill } from '../../data/skills';

interface CssSkillsProps {
  skills: Skill[];
  ringRef: RefObject<HTMLDivElement>; // animated by Skills on a tab switch
}

const CssSkills = ({ skills, ringRef }: CssSkillsProps) => (
  <div className="css-skills">
    <div className="css-globe" aria-hidden="true">
      <div className="css-globe__sphere">
        <span className="css-globe__ring" />
        <span className="css-globe__ring css-globe__ring--60" />
        <span className="css-globe__ring css-globe__ring--120" />
        <span className="css-globe__ring css-globe__ring--equator" />
      </div>
    </div>

    <div ref={ringRef} className="css-skills__ring">
      {skills.map((skill, i) => {
        const angle = (i / skills.length) * Math.PI * 2 - Math.PI / 2;
        const style = {
          left: `calc(50% + ${Math.cos(angle).toFixed(3)} * var(--orbit-x))`,
          top: `calc(50% + ${Math.sin(angle).toFixed(3)} * var(--orbit-y))`,
          '--i': i,
        } as CSSProperties;

        return (
          <div key={skill.name} className="css-logo" style={style} data-name={skill.name}>
            <div className="css-logo__float">
              <div className="css-logo__spin">
                <img src={skill.logo} alt="" draggable={false} />
                <img src={skill.logo} alt="" draggable={false} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

export default CssSkills;
