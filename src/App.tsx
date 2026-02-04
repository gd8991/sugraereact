import { useState, useEffect } from 'react';
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

  // Kill all ScrollTrigger instances when App unmounts (e.g. navigating to a product page).
  // Pinned sections move their DOM nodes into GSAP-owned wrappers; if those pins aren't
  // killed before React removes the elements, React throws "removeChild" errors.
  useEffect(() => {
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
