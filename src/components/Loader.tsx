import { useEffect, useState } from 'react';
import type { FC } from 'react';

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
        <div className="loader-logo">Sugraé</div>
      </div>
    </div>
  );
};

export default Loader;