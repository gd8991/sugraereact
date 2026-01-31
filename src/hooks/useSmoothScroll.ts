import { useEffect } from 'react';
import { useGSAP } from './useGSAP';

export const useSmoothScroll = () => {
  const { gsap, isReady } = useGSAP();

  useEffect(() => {
    if (!isReady || !gsap) return;

    // Import ScrollSmoother plugin
    const initScrollSmoother = async () => {
      const { ScrollSmoother } = await import('gsap/ScrollSmoother');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');

      gsap.registerPlugin(ScrollSmoother, ScrollTrigger);

      // Create smooth scroller
      const smoother = ScrollSmoother.create({
        smooth: 1.5, // Smooth scroll duration (higher = smoother but slower)
        effects: true, // Enable parallax effects
        smoothTouch: 0.1, // Smooth scrolling on mobile
      });

      return smoother;
    };

    const smoother = initScrollSmoother();

    return () => {
      smoother.then((s) => s?.kill());
    };
  }, [gsap, isReady]);
};
