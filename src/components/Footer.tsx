import type { FC } from 'react';
import logo from '../assets/AW_SD_Sugrae_Logo file-01.svg';

const Footer: FC = () => {
  const footerLinks = [
    { href: '#', text: 'Privacy' },
    { href: '#', text: 'Terms' },
    { href: '#', text: 'Contact' },
    { href: '#', text: 'Instagram' }
  ];

  return (
    <footer>
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