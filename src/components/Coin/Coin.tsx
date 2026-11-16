import './Coin.css';

interface CoinProps {
  image: string;
  size?: 'lg' | 'sm';
  duration?: string; // e.g. "6.5s" (default 5s)
}

const EDGE_LAYERS = { // stacked discs between the faces fake the thickness
  lg: [-9, -7, -5, -3, -1, 1, 3, 5, 7, 9],
  sm: [-3],
};

const Coin = ({ image, size = 'lg', duration }: CoinProps) => { // needs an ancestor with perspective
  const face = <img className="coin__image" src={image} alt="" draggable={false} />;

  return (
    <div className={`coin coin--${size}`} style={duration ? { animationDuration: duration } : undefined}>
      {EDGE_LAYERS[size].map((z) => (
        <span key={z} className="coin__edge" style={{ transform: `translateZ(${z}px)` }} />
      ))}
      <span className="coin__face coin__face--front">{face}</span>
      <span className="coin__face coin__face--back">{face}</span>
    </div>
  );
};

export default Coin;
