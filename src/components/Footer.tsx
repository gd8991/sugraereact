import { useEffect, useRef } from 'react';
import type { FC } from 'react';
import logo from '../assets/AW_SD_Sugrae_Logo file-01.svg';
import { useGSAP } from '../hooks/useGSAP';

const Footer: FC = () => {
  const { gsap, isReady } = useGSAP();
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isReady || !gsap || !footerRef.current) return;

    gsap.from(footerRef.current, {
      scrollTrigger: {
        trigger: footerRef.current,
        start: 'top 90%'
      },
      duration: 1,
      y: 30,
      opacity: 0,
      ease: 'power3.out'
    });
  }, [isReady, gsap]);

  const footerLinks = [
    { href: '#', text: 'Privacy' },
    { href: '#', text: 'Terms' },
    { href: '#', text: 'Contact' },
    { href: '#', text: 'Instagram' }
  ];

  return (
    <footer ref={footerRef}>
      <div className="footer-content">
        <div className="footer-logo">
          <img src={logo} alt="Sugraé" className="footer-logo-image" />
        </div>
        
        <ul className="footer-links">
          {footerLinks.map((link) => (
            <li key={link.text}>
              <a href={link.href}>{link.text}</a>
            </li>
          ))}
        </ul>
        
        <div className="footer-copyright">© 2025 Sugraé.</div>
      </div>
    </footer>
  );
};

export default Footer;