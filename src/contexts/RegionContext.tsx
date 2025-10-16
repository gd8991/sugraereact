import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type Region = 'India' | 'UAE' | 'Global';

interface RegionContextType {
  region: Region;
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

    // Return mapped region or default to Global
    return countryToRegion[countryCode] || 'Global';
  } catch (error) {
    console.error('Failed to detect location:', error);
    return 'Global'; // Default fallback
  }
};

export const RegionProvider = ({ children }: { children: ReactNode }) => {
  const [region, setRegion] = useState<Region>('Global');

  useEffect(() => {
    const initializeRegion = async () => {
      // Check if user has previously selected a region
      const savedRegion = localStorage.getItem('selectedRegion') as Region | null;

      if (savedRegion) {
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

  return (
    <RegionContext.Provider value={{ region, setRegion: handleSetRegion }}>
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
