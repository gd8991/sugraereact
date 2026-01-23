import { useEffect, useRef } from 'react';
import type { FC } from 'react';
import { useGSAP } from '../hooks/useGSAP';
import { EXPERIENCE_ITEMS } from '../utils/constants';

const ExperienceSection: FC = () => {
  const { gsap, isReady } = useGSAP();
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (!isReady || !gsap) return;

    const cards = cardRefs.current.filter(Boolean);
    if (!cards.length) return;

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

    // Animate each card on scroll
    cards.forEach((card, index) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        duration: 1,
        y: 60,
        opacity: 0,
        ease: 'power3.out',
        delay: index * 0.1
      });
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

        <div style={{ maxWidth: '800px', margin: '4rem auto 0', textAlign: 'center', padding: '0 2rem' }}>
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