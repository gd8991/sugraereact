import { useState } from 'react';
import { CartProvider } from './contexts/CartContext';
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

function App() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadComplete = () => {
    setIsLoading(false);
  };


  return (
    <CartProvider>
      <div className="App">
        <CustomCursor />

        {isLoading && <Loader onLoadComplete={handleLoadComplete} />}

        <Header />
        <Hero />
        <FounderSection />
        <CollectionSection />
        <ExperienceSection />
        <Footer />

        <CartSidebar />
        <GuestCheckout />
      </div>
    </CartProvider>
  );
}

export default App;
