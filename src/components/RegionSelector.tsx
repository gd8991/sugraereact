import { useState, useRef, useEffect, type FC } from 'react';
import { useRegion, type Region } from '../contexts/RegionContext';

const REGIONS: Region[] = ['India', 'UAE', 'Global'];

const RegionSelector: FC = () => {
  const { region, setRegion } = useRegion();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRegionChange = (newRegion: Region) => {
    setRegion(newRegion);
    setIsOpen(false);
  };

  return (
    <div className="region-selector" ref={dropdownRef}>
      <button
        className="region-selector-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select region"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        <span className="region-selector-text">{region}</span>
        <svg
          className={`region-selector-arrow ${isOpen ? 'open' : ''}`}
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div className="region-selector-dropdown">
          {REGIONS.map((r) => (
            <button
              key={r}
              className={`region-option ${r === region ? 'active' : ''}`}
              onClick={() => handleRegionChange(r)}
            >
              {r}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default RegionSelector;
