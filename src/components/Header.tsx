import { useEffect, useState } from 'react';
import type { FC } from 'react';
import { NAVIGATION_LINKS } from '../utils/constants';

const Header: FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

          <a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('#vip'); }} className="nav-cta">
            Join VIP
          </a>

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
          <a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('#vip'); }} className="mobile-menu-cta">
            Join VIP
          </a>
        </div>
      </div>
    </>
  );
};

export default Header;