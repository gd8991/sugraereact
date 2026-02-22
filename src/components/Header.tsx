import { useEffect, useState } from 'react';
import type { FC } from 'react';
import { NAVIGATION_LINKS } from '../utils/constants';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import RegionSelector from './RegionSelector';
import cartIcon from '../assets/cart.png';
import logo from '../assets/AW_SD_Sugrae_Logo file-01.svg';

const Header: FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { toggleCart, getCartItemCount } = useCart();
  const { state: authState, openAuthModal, logout } = useAuth();

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
    if (target && window.lenis) {
      // Use Lenis for smooth scroll
      window.lenis.scrollTo(target, {
        offset: 0,
        duration: 1.5,
      });
    } else if (target) {
      // Fallback to native scroll
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
            <img src={logo} alt="Sugraé" className="logo-image" />
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
            <RegionSelector />

            {/* User Account */}
            <div className="user-account-wrapper">
              {authState.isAuthenticated ? (
                <>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="user-toggle"
                    aria-label="User menu"
                  >
                    <svg className="user-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </button>
                  {isUserMenuOpen && (
                    <div className="user-dropdown">
                      <div className="user-dropdown-header">
                        <p className="user-dropdown-name">{authState.user?.displayName}</p>
                        <p className="user-dropdown-email">{authState.user?.email}</p>
                      </div>
                      <div className="user-dropdown-divider"></div>
                      <button onClick={logout} className="user-dropdown-item">
                        Sign Out
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <button onClick={openAuthModal} className="user-toggle" aria-label="Sign in">
                  <svg className="user-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </button>
              )}
            </div>

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
            <RegionSelector />
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