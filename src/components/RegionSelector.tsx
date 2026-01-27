import { useState, useRef, useEffect, type FC } from 'react';
import { useRegion, MARKETS, type Region } from '../contexts/RegionContext';

const RegionSelector: FC = () => {
  const { region, marketConfig, setRegion } = useRegion();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

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
        <span className="region-flag">{marketConfig.flag}</span>
        <span className="region-selector-text">{marketConfig.name}</span>
        <span className={`region-selector-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <div className="region-selector-dropdown">
          {(Object.keys(MARKETS) as Region[]).map((regionKey) => {
            const market = MARKETS[regionKey];
            return (
              <button
                key={regionKey}
                className={`region-option ${region === regionKey ? 'active' : ''}`}
                onClick={() => handleRegionChange(regionKey)}
              >
                <span className="region-flag">{market.flag}</span>
                <span className="region-name">{market.name}</span>
                <span className="region-currency">({market.currency})</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RegionSelector;
