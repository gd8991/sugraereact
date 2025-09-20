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

  useEffect(() => {
    if (!isReady || !gsap) return;

    gsap.to(itemRef.current, {
      scrollTrigger: {
        trigger: '.experience-grid',
        start: 'top 70%'
      },
      duration: 0.8,
      opacity: 1,
      y: 0,
      ease: 'power3.out',
      delay: index * 0.1
    });

  }, [isReady, gsap, index]);

  return (
    <div ref={itemRef} className="experience-item">
      <div className="experience-icon">{item.icon}</div>
      <div className="experience-label">{item.label}</div>
      <p className="experience-text">{item.text}</p>
    </div>
  );
};

export default ExperienceItem;