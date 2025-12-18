import { useEffect, useRef } from 'react';
import type { FC } from 'react';
import { useGSAP } from '../hooks/useGSAP';
import FloatingParticles from './FloatingParticles';
import logo from '../assets/AW_SD_Sugrae_Logo file-01.svg';

const Hero: FC = () => {
  const { gsap, isReady } = useGSAP();
  const heroRef = useRef<HTMLElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const ctaGroupRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isReady || !gsap) return;

    const timeline = gsap.timeline({ delay: 0.5 });

    // Hero content animations
    timeline
      .to(subtitleRef.current, {
        duration: 1,
        opacity: 1,
        y: 0,
        ease: 'power3.out'
      })
      .to(titleRef.current, {
        duration: 1.5,
        opacity: 1,
        y: 0,
        ease: 'power4.out'
      }, '-=0.5')
      .to(taglineRef.current, {
        duration: 1,
        opacity: 1,
        y: 0,
        ease: 'power3.out'
      }, '-=0.8')
      .to(ctaGroupRef.current, {
        duration: 1,
        opacity: 1,
        y: 0,
        ease: 'power3.out'
      }, '-=0.6');

    // Scroll indicator animation
    gsap.set(scrollIndicatorRef.current, { opacity: 0 });
    gsap.to(scrollIndicatorRef.current, {
      opacity: 1,
      y: -10,
      delay: 3,
      duration: 1,
      ease: 'power3.out'
    });

    // Parallax effect for hero video
    gsap.to(videoRef.current, {
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      },
      y: 100,
      ease: 'none'
    });

  }, [isReady, gsap]);

  const scrollToSection = (href: string) => {
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <section ref={heroRef} className="hero" id="home">
      {/* Video Background */}
      <div ref={videoRef} className="hero-video">
        <div
          className="video-element"
          style={{
            background: '#FFFFFF',
            height: '100%'
          }}
        />
      </div>

      <div className="floating-particles" id="particles">
        <FloatingParticles />
      </div>

      {/* Hero Content */}
      <div className="hero-content">
        <div ref={subtitleRef} className="hero-subtitle">
          Born from a Mother's Love • 2025
        </div>

        <h1 ref={titleRef} className="hero-title">
          <img src={logo} alt="Sugraé" className="hero-logo" />
        </h1>

        <p ref={taglineRef} className="hero-tagline">
          Where Love Meets Luxury
        </p>

        <div ref={ctaGroupRef} className="hero-cta-group">
          <a href="#collection" onClick={(e) => { e.preventDefault(); scrollToSection('#collection'); }} className="btn-luxe btn-luxe-primary">
            Discover Collection
          </a>
          <a href="#founder" onClick={(e) => { e.preventDefault(); scrollToSection('#founder'); }} className="btn-luxe btn-luxe-outline">
            Our Story
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div ref={scrollIndicatorRef} className="scroll-indicator">
        <div className="scroll-text">Scroll</div>
        <div className="scroll-line"></div>
      </div>
    </section>
  );
};

export default Hero;