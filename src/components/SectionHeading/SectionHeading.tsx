import './SectionHeading.css';

interface SectionHeadingProps {
  kicker: string;
  title: string;
  id: string; // for the section's aria-labelledby
  as?: 'h1' | 'h2';
  align?: 'start' | 'center';
}

const SectionHeading = ({ kicker, title, id, as: Heading = 'h2', align = 'start' }: SectionHeadingProps) => (
  <div className={`section-heading section-heading--${align}`}>
    <p className="section-heading__kicker">{kicker}</p>
    <Heading id={id} className="section-heading__title">
      {title}
    </Heading>
  </div>
);

export default SectionHeading;
