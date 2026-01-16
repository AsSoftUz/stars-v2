import { useEffect } from 'react';
import './loader.scss';
import loaderGif from '../../assets/loaderGif.gif';

const Loader = ({ onFinished }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onFinished) onFinished();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onFinished]);

  return (
    <div className="home-loading">
      <img src={`${loaderGif}?t=${new Date().getTime()}`} alt="Loading..." />
    </div>
  );
};

export default Loader;