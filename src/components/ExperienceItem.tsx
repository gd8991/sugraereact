import { useEffect, useRef } from 'react';
import type { FC } from 'react';
import { useGSAP } from '../hooks/useGSAP';
import type { ExperienceItem as ExperienceItemType } from '../types';

interface ExperienceItemProps {
  item: ExperienceItemType;
  index: number;
}

const ExperienceItem: FC<ExperienceItemProps> = ({ item, index }) => {
  const { gsap, isReady } = useGSAP();
  const itemRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const isEven = index % 2 === 0;

  useEffect(() => {
    if (!isReady || !gsap) return;

    // Animate the entire item into view
    gsap.from(itemRef.current, {
      scrollTrigger: {
        trigger: itemRef.current,
        start: 'top 80%',
        end: 'bottom 20%'
      },
      duration: 1,
      opacity: 0,
      y: 60,
      ease: 'power3.out'
    });

    // Animate image with slide effect
    gsap.from(imageRef.current, {
      scrollTrigger: {
        trigger: itemRef.current,
        start: 'top 75%'
      },
      duration: 1.2,
      x: isEven ? -80 : 80,
      opacity: 0,
      ease: 'power3.out',
      delay: 0.2
    });

    // Animate content with opposite slide effect
    gsap.from(contentRef.current, {
      scrollTrigger: {
        trigger: itemRef.current,
        start: 'top 75%'
      },
      duration: 1.2,
      x: isEven ? 80 : -80,
      opacity: 0,
      ease: 'power3.out',
      delay: 0.4
    });

  }, [isReady, gsap, index, isEven]);

  return (
    <div ref={itemRef} className={`experience-item-detailed ${isEven ? 'image-left' : 'image-right'}`}>
      <div ref={imageRef} className="experience-image">
        <img src={item.image} alt={item.label} />
        <div className="experience-icon-overlay">{item.icon}</div>
      </div>
      <div ref={contentRef} className="experience-content">
        <h3 className="experience-label">{item.label}</h3>
        <p className="experience-text">{item.text}</p>
      </div>
    </div>
  );
};

export default ExperienceItem;