import { useEffect, useState } from 'react';
import type { FC } from 'react';
import logo from '../assets/AW_SD_Sugrae_Logo file-01.svg';

interface LoaderProps {
  onLoadComplete: () => void;
}

const Loader: FC<LoaderProps> = ({ onLoadComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onLoadComplete();
      }, 1000); // Wait for fade out animation
    }, 2500);

    return () => clearTimeout(timer);
  }, [onLoadComplete]);

  return (
    <div className={`loader ${isVisible ? '' : 'hidden'}`}>
      <div className="loader-content">
        <div className="loader-logo">
          <img src={logo} alt="Sugraé" className="loader-logo-image" />
        </div>
      </div>
    </div>
  );
};

export default Loader;