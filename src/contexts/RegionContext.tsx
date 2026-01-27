import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type Region = 'India' | 'UAE';

export interface MarketConfig {
  region: Region;
  name: string;
  currency: string;
  currencySymbol: string;
  flag: string;
  countryCode: string;
}

export const MARKETS: Record<Region, MarketConfig> = {
  India: {
    region: 'India',
    name: 'India',
    currency: 'INR',
    currencySymbol: '₹',
    flag: '🇮🇳',
    countryCode: 'IN'
  },
  UAE: {
    region: 'UAE',
    name: 'UAE',
    currency: 'AED',
    currencySymbol: 'AED',
    flag: '🇦🇪',
    countryCode: 'AE'
  }
};

interface RegionContextType {
  region: Region;
  marketConfig: MarketConfig;
  setRegion: (region: Region) => void;
}

const RegionContext = createContext<RegionContextType | undefined>(undefined);

// Map country codes to regions
const countryToRegion: Record<string, Region> = {
  IN: 'India',
  AE: 'UAE',
};

// Function to detect user's country
const detectUserCountry = async (): Promise<Region> => {
  try {
    // Using ipapi.co free geolocation API
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    const countryCode = data.country_code;

    // Return mapped region or default to India
    return countryToRegion[countryCode] || 'India';
  } catch (error) {
    console.error('Failed to detect location:', error);
    return 'India'; // Default fallback
  }
};

export const RegionProvider = ({ children }: { children: ReactNode }) => {
  const [region, setRegion] = useState<Region>('India');

  useEffect(() => {
    const initializeRegion = async () => {
      // Check if user has previously selected a region
      const savedRegion = localStorage.getItem('selectedRegion') as Region | null;

      if (savedRegion && (savedRegion === 'India' || savedRegion === 'UAE')) {
        setRegion(savedRegion);
      } else {
        // Auto-detect region based on location
        const detectedRegion = await detectUserCountry();
        setRegion(detectedRegion);
      }
    };

    initializeRegion();
  }, []);

  const handleSetRegion = (newRegion: Region) => {
    setRegion(newRegion);
    // Save user's manual selection to localStorage
    localStorage.setItem('selectedRegion', newRegion);
  };

  const marketConfig = MARKETS[region];

  return (
    <RegionContext.Provider value={{ region, marketConfig, setRegion: handleSetRegion }}>
      {children}
    </RegionContext.Provider>
  );
};

export const useRegion = () => {
  const context = useContext(RegionContext);
  if (!context) {
    throw new Error('useRegion must be used within RegionProvider');
  }
  return context;
};
