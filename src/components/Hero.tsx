import { useEffect, useLayoutEffect, useRef } from 'react';
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
  const contentRef = useRef<HTMLDivElement>(null);

  // Kill ScrollTriggers synchronously before React removes DOM nodes
  useLayoutEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.ScrollTrigger) {
        window.ScrollTrigger.getAll().forEach((st: any) => st.kill(true));
      }
    };
  }, []);

  useEffect(() => {
    if (!isReady || !gsap) return;

    const g = window.gsap;
    if (!g) return;

    const tweens: any[] = [];

    const timeline = g.timeline({ delay: 0.5 });

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
    g.set(scrollIndicatorRef.current, { opacity: 0 });
    g.to(scrollIndicatorRef.current, {
      opacity: 1,
      y: -10,
      delay: 3,
      duration: 1,
      ease: 'power3.out'
    });

    // Background parallax — moves at normal speed (slides up fully)
    const bgParallax = g.to(videoRef.current, {
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      },
      y: 100,
      ease: 'none'
    });
    tweens.push(bgParallax);

    // Content parallax — moves at 1/3 the scroll speed.
    // When the hero section scrolls 100vh out of view, content only travels
    // ~33% of that distance, so it "lingers" and the next section slides over it.
    const heroHeight = heroRef.current?.offsetHeight || window.innerHeight;
    const contentParallax = g.to(contentRef.current, {
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
      y: heroHeight / 10,  // moves only 1/10 as far as the scroll distance
      ease: 'none'
    });
    tweens.push(contentParallax);

    return () => {
      tweens.forEach(t => {
        if (t?.scrollTrigger) t.scrollTrigger.kill(true);
        t?.kill();
      });
      timeline.kill();
    };
  }, [isReady, gsap]);

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
  };

  return (
    <section ref={heroRef} className="hero" id="home">
      {/* Video Background */}
      <div ref={videoRef} className="hero-video">
        <div
          className="video-element"
          style={{
            background: '#f0ebe3',
            height: '100%'
          }}
        />
      </div>

      <div className="floating-particles" id="particles">
        <FloatingParticles />
      </div>

      {/* Hero Content */}
      <div ref={contentRef} className="hero-content">
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

    </section>
  );
};

export default Hero;