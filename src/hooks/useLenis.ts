import { useEffect } from 'react';
import Lenis from 'lenis';

// Global Lenis instance for accessing across components
declare global {
  interface Window {
    lenis?: Lenis;
  }
}

export const useLenis = () => {
  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    // Store Lenis instance globally for access in components
    window.lenis = lenis;

    // Integrate with GSAP ScrollTrigger
    if (window.gsap && window.ScrollTrigger) {
      lenis.on('scroll', () => {
        window.ScrollTrigger.update();
      });

      window.gsap.ticker.add((time: number) => {
        lenis.raf(time * 1000);
      });

      window.gsap.ticker.lagSmoothing(0);
    } else {
      // Fallback: use requestAnimationFrame if GSAP not loaded
      function raf(time: number) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }

    return () => {
      lenis.destroy();
      window.lenis = undefined;
    };
  }, []);
};
