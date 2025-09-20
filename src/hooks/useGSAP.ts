import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    gsap: any;
    ScrollTrigger: any;
  }
}

export const useGSAP = () => {
  const isInitialized = useRef(false);

  useEffect(() => {
    const initGSAP = () => {
      if (typeof window !== 'undefined' && window.gsap && window.ScrollTrigger && !isInitialized.current) {
        window.gsap.registerPlugin(window.ScrollTrigger);
        isInitialized.current = true;
      }
    };

    // Check if GSAP is already loaded
    if (window.gsap && window.ScrollTrigger) {
      initGSAP();
    } else {
      // Wait for GSAP to load
      const checkGSAP = setInterval(() => {
        if (window.gsap && window.ScrollTrigger) {
          initGSAP();
          clearInterval(checkGSAP);
        }
      }, 100);

      return () => clearInterval(checkGSAP);
    }
  }, []);

  return { gsap: window.gsap, ScrollTrigger: window.ScrollTrigger, isReady: isInitialized.current };
};