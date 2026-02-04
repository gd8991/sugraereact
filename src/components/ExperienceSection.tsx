import { useEffect, useRef } from 'react';
import type { FC } from 'react';
import { useGSAP } from '../hooks/useGSAP';
import { EXPERIENCE_ITEMS } from '../utils/constants';

const ExperienceSection: FC = () => {
  const { gsap, isReady } = useGSAP();
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardRefs = useRef<HTMLDivElement[]>([]);
  const quoteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isReady || !gsap) return;

    const cards = cardRefs.current.filter(Boolean);
    if (!cards.length) return;

    // Check if mobile device
    const isMobile = window.innerWidth <= 768;

    // Title animation
    gsap.from(titleRef.current, {
      scrollTrigger: {
        trigger: titleRef.current,
        start: 'top 80%'
      },
      duration: 1,
      y: 50,
      opacity: 0,
      ease: 'power3.out'
    });

    // Quote fade-in (runs on both mobile and desktop)
    if (quoteRef.current) {
      gsap.from(quoteRef.current, {
        scrollTrigger: {
          trigger: quoteRef.current,
          start: 'top 85%'
        },
        duration: 1,
        y: 30,
        opacity: 0,
        ease: 'power3.out'
      });
    }

    // On mobile, use simple scroll animations
    if (isMobile) {
      cards.forEach((card) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none none'
          },
          duration: 1,
          y: 60,
          opacity: 0,
          ease: 'power3.out'
        });
      });
      return;
    }

    // Desktop: Pin the section and transition between cards
    // Set initial states - hide all cards except first
    gsap.set(cards, { opacity: 0, scale: 0.9 });
    if (cards[0]) {
      gsap.set(cards[0], { opacity: 1, scale: 1 });
    }

    // Create pinned scroll timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: `+=${cards.length * 100}%`,
        scrub: 1,
        pin: true,
        anticipatePin: 1
      }
    });

    // Animate through each card
    cards.forEach((card, index) => {
      if (index === 0) return; // First card is already visible

      const prevIndex = index - 1;
      const timePosition = index * 1.5;

      // Fade out previous card
      tl.to(cards[prevIndex], {
        opacity: 0,
        scale: 0.9,
        duration: 0.5,
        ease: 'power2.inOut'
      }, timePosition)
      // Fade in current card
      .to(card, {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: 'power2.inOut'
      }, timePosition + 0.3);
    });


  }, [isReady, gsap]);

  return (
    <section ref={sectionRef} className="experience-section" id="experience">
      <div className="experience-container">
        <div className="experience-header">
          <h2 ref={titleRef} className="experience-title">THE Sugraé PROMISE</h2>
        </div>

        <div className="experience-cards">
          {EXPERIENCE_ITEMS.map((item, index) => (
            <div
              key={item.label}
              ref={el => {
                if (el) cardRefs.current[index] = el;
              }}
              className={`experience-card ${index % 2 === 0 ? 'text-left' : 'text-right'}`}
              style={{ backgroundImage: `url(${item.image})` }}
            >
              <div className="experience-overlay"></div>
              <div className="experience-card-content">
                <h3 className="experience-label">{item.label}</h3>
                <p className="experience-text">{item.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div ref={quoteRef} style={{ maxWidth: '800px', margin: '4rem auto 0', textAlign: 'center', padding: '0 2rem' }}>
          <p style={{ fontSize: '1.125rem', lineHeight: 1.8, color: 'var(--light-gray)', fontFamily: 'var(--font-serif)' }}>
            "Every Sugraé perfume is a testament to the belief that motherhood doesn't mean
            sacrificing elegance. It means redefining it."
          </p>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;