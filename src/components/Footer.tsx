import { useEffect, useRef } from 'react';
import type { FC } from 'react';
import logo from '../assets/AW_SD_Sugrae_Logo file-01.svg';
import { useGSAP } from '../hooks/useGSAP';

const Footer: FC = () => {
  const { gsap, isReady } = useGSAP();
  const footerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLUListElement>(null);
  const copyrightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isReady || !gsap || !footerRef.current) return;

    const tweens: any[] = [];

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: footerRef.current,
        start: 'top 90%',
      },
    });

    // Logo slides in from the left
    tl.from(logoRef.current, {
      duration: 0.9,
      opacity: 0,
      x: -40,
      ease: 'power3.out',
    })
    // Links stagger up from below
    .from(linksRef.current ? linksRef.current.querySelectorAll('li') : [], {
      duration: 0.7,
      opacity: 0,
      y: 20,
      stagger: 0.1,
      ease: 'power3.out',
    }, '-=0.5')
    // Copyright slides in from the right
    .from(copyrightRef.current, {
      duration: 0.7,
      opacity: 0,
      x: 40,
      ease: 'power3.out',
    }, '-=0.5');

    tweens.push(tl);

    return () => {
      tweens.forEach(t => {
        if (t.scrollTrigger) t.scrollTrigger.kill(true);
        t.kill();
      });
    };
  }, [isReady, gsap]);

  const footerLinks = [
    { href: '#', text: 'Privacy' },
    { href: '#', text: 'Terms' },
    { href: '#', text: 'Contact' },
    { href: '#', text: 'Instagram' },
  ];

  return (
    <footer ref={footerRef}>
      <div className="footer-content">
        <div ref={logoRef} className="footer-logo">
          <img src={logo} alt="Sugraé" className="footer-logo-image" />
        </div>

        <ul ref={linksRef} className="footer-links">
          {footerLinks.map((link) => (
            <li key={link.text}>
              <a href={link.href}>{link.text}</a>
            </li>
          ))}
        </ul>

        <div ref={copyrightRef} className="footer-copyright">© 2025 Sugraé.</div>
      </div>
    </footer>
  );
};

export default Footer;
