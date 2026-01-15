import './techIssues.scss';
import techGif from '../../assets/techGif.gif';

const TechIssues = () => {
  return (
    <div className="tech-issues-container"> 
      <img src={techGif} alt="" width={200} />
      <h1>Texnik ishlar olib borilyapti</h1>
      <h3>Tez orada yakunlanadi.</h3>
    </div>
  );
};

export default TechIssues;