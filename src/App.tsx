import { useState, useEffect, useLayoutEffect } from 'react';
import Loader from './components/Loader';
import Header from './components/Header';
import Hero from './components/Hero';
import FounderSection from './components/FounderSection';
import CollectionSection from './components/CollectionSection';
import ExperienceSection from './components/ExperienceSection';
import NewsletterSection from './components/NewsletterSection';
import Footer from './components/Footer';
import CartSidebar from './components/CartSidebar';
import GuestCheckout from './components/GuestCheckout';
import AuthModal from './components/AuthModal';
function App() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadComplete = () => {
    setIsLoading(false);
  };

  // Kill all ScrollTrigger instances synchronously before React removes DOM nodes.
  // useLayoutEffect cleanup runs before DOM mutations, preventing "removeChild" errors
  // caused by GSAP pin wrappers moving elements out of their original parents.
  useLayoutEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.ScrollTrigger) {
        window.ScrollTrigger.getAll().forEach((st: any) => st.kill(true));
      }
    };
  }, []);

  return (
    <>
      {isLoading && <Loader onLoadComplete={handleLoadComplete} />}

      <Header />
      <Hero />
      <CollectionSection />
      <FounderSection />
      <ExperienceSection />
      <NewsletterSection />
      <Footer />

      <CartSidebar />
      <GuestCheckout />
      <AuthModal />
    </>
  );
}

export default App;
