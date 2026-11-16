import './Corners.css';

export type CornerPosition = 'tl' | 'tr' | 'bl' | 'br';

interface CornersProps {
  positions?: CornerPosition[];
}

const Corners = ({ positions = ['tl', 'tr', 'bl', 'br'] }: CornersProps) => ( // parent must be positioned; tuned with --corner-size/-weight/-color/-offset
  <>
    {positions.map((position) => (
      <span key={position} className={`corner corner--${position}`} aria-hidden="true" />
    ))}
  </>
);

export default Corners;
