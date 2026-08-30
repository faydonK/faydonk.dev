import GlassCube from '../three/GlassCube';
import './Lab.css';

const Lab = () => {
  return (
    <div className="lab-page">
      <div className="lab-cube-stage">
        <GlassCube text={'Explore\nNew\nIdeas'} rotationSpeed={0.25} disableOnMobile />
      </div>

      <div className="lab-buttons">
        <button className="glass-button">Liquid Glass</button>
        <button className="glass-button">Test</button>
      </div>
    </div>
  );
};

export default Lab;
