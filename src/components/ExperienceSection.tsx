import { useEffect, useRef } from 'react';
import type { FC } from 'react';
import { useGSAP } from '../hooks/useGSAP';
import { EXPERIENCE_ITEMS } from '../utils/constants';
import ExperienceItem from './ExperienceItem';

const ExperienceSection: FC = () => {
  const { gsap, isReady } = useGSAP();
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!isReady || !gsap) return;

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

  }, [isReady, gsap]);

  return (
    <section className="experience-section" id="experience">
      <div className="experience-container">
        <h2 ref={titleRef} className="experience-title">THE Sugraé PROMISE</h2>
        
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--gold)', marginBottom: '3rem', fontStyle: 'italic' }}>
          Luxury redefined for life's most precious moments
        </p>
        
        <div className="experience-grid">
          {EXPERIENCE_ITEMS.map((item, index) => (
            <ExperienceItem key={item.label} item={item} index={index} />
          ))}
        </div>
        
        <div style={{ maxWidth: '800px', margin: '4rem auto 0', textAlign: 'center' }}>
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