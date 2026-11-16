import './Backdrop.css';

const Backdrop = () => (
  <div className="backdrop" aria-hidden="true">
    <div className="backdrop__dots" />
    <div className="backdrop__lines" />
    <div className="backdrop__scan" />
  </div>
);

export default Backdrop;
