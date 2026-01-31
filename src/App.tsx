import { useState, useEffect } from 'react';
import CustomCursor from './components/CustomCursor';
import Loader from './components/Loader';
import Header from './components/Header';
import Hero from './components/Hero';
import FounderSection from './components/FounderSection';
import CollectionSection from './components/CollectionSection';
import ExperienceSection from './components/ExperienceSection';
import Footer from './components/Footer';
import CartSidebar from './components/CartSidebar';
import GuestCheckout from './components/GuestCheckout';
import AuthModal from './components/AuthModal';
import { useGSAP } from './hooks/useGSAP';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const { gsap, isReady } = useGSAP();

  const handleLoadComplete = () => {
    setIsLoading(false);
  };

  // GSAP Smooth Scroll
  useEffect(() => {
    if (!isReady || !gsap || isLoading) return;

    let scrollSmoother: any;

    const initSmoothScroll = async () => {
      try {
        const { default: ScrollSmoother } = await import('gsap/ScrollSmoother');
        const { default: ScrollTrigger } = await import('gsap/ScrollTrigger');

        gsap.registerPlugin(ScrollSmoother, ScrollTrigger);

        scrollSmoother = ScrollSmoother.create({
          smooth: 1.2,
          effects: true,
          smoothTouch: 0.1,
        });
      } catch (error) {
        console.error('Error initializing smooth scroll:', error);
      }
    };

    initSmoothScroll();

    return () => {
      if (scrollSmoother) {
        scrollSmoother.kill();
      }
    };
  }, [gsap, isReady, isLoading]);

  return (
    <div id="smooth-wrapper">
      <div id="smooth-content">
        <CustomCursor />

        {isLoading && <Loader onLoadComplete={handleLoadComplete} />}

        <Header />
        <Hero />
        <CollectionSection />
        <FounderSection />
        <ExperienceSection />
        <Footer />

        <CartSidebar />
        <GuestCheckout />
        <AuthModal />
      </div>
    </div>
  );
}

export default App;
