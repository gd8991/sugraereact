import { useEffect, useState } from 'react';
import type { FC } from 'react';
import { NAVIGATION_LINKS } from '../utils/constants';
import { useCart } from '../contexts/CartContext';
import cartIcon from '../assets/cart.png';

const Header: FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { toggleCart, getCartItemCount } = useCart();

  const cartCount = getCartItemCount();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className={isScrolled ? 'scrolled' : ''}>
        <nav>
          <button onClick={() => scrollToSection('#home')} className="logo">
            Sugraé
          </button>

          {/* Desktop Navigation */}
          <ul className="nav-links">
            {NAVIGATION_LINKS.map((link) => (
              <li key={link.href}>
                <a href="#" onClick={(e) => { e.preventDefault(); scrollToSection(link.href); }}>
                  {link.text}
                </a>
              </li>
            ))}
          </ul>

          <div className="nav-actions">
            <button onClick={toggleCart} className="cart-toggle">
              <img src={cartIcon} alt="Cart" className="cart-icon" width="24" height="24" />
              {cartCount > 0 && (
                <span className="cart-badge">{cartCount}</span>
              )}
            </button>           
          </div>

          {/* Mobile Menu Toggle */}
          <div
            className={`menu-toggle ${isMobileMenuOpen ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-menu-content">
          <ul className="mobile-menu-links">
            {NAVIGATION_LINKS.map((link) => (
              <li key={link.href}>
                <a href="#" onClick={(e) => { e.preventDefault(); scrollToSection(link.href); }}>
                  {link.text}
                </a>
              </li>
            ))}
          </ul>
          <div className="mobile-menu-actions">
            <button onClick={toggleCart} className="mobile-cart-toggle">
              <img src={cartIcon} alt="Cart" className="cart-icon" width="24" height="24" />
              {cartCount > 0 && (
                <span className="cart-badge">{cartCount}</span>
              )}
              <span>Cart</span>
            </button>           
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;