import { useEffect, useRef } from 'react';
import type { FC } from 'react';
import { useGSAP } from '../hooks/useGSAP';
import { EXPERIENCE_ITEMS } from '../utils/constants';

const ExperienceSection: FC = () => {
  const { gsap, isReady } = useGSAP();
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const itemRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (!isReady || !gsap) return;

    const items = itemRefs.current.filter(Boolean);
    if (!items.length) return;

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

    // Set initial states - hide all items except first
    gsap.set(items, { opacity: 0, y: 0 });
    if (items[0]) {
      gsap.set(items[0], { opacity: 1, y: 0 });
    }

    // Only create pinned scroll if we have items
    if (items.length > 1) {
      // Create timeline for section transitions
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: `+=${items.length * 50}%`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          refreshPriority: -1
        }
      });

      // Animate through each section
      items.forEach((item, index) => {
        if (index === 0) return; // First item is already visible

        const prevIndex = index - 1;
        const timePosition = index * 1;

        tl.to(items[prevIndex], {
          opacity: 0,
          y: -50,
          duration: 0.3,
          ease: 'power2.inOut'
        }, timePosition)
        .to(item, {
          opacity: 1,
          y: 0,
          duration: 0.3,
          ease: 'power2.inOut'
        }, timePosition + 0.3);
      });
    }

  }, [isReady, gsap]);

  return (
    <section ref={sectionRef} className="experience-section experience-pinned" id="experience">
      <div ref={containerRef} className="experience-container">
        <div className="experience-header">
          <h2 ref={titleRef} className="experience-title">THE Sugraé PROMISE</h2>
        </div>

        <div className="experience-pinned-content">
          {EXPERIENCE_ITEMS.map((item, index) => (
            <div
              key={item.label}
              ref={el => {
                if (el) itemRefs.current[index] = el;
              }}
              className={`experience-item-pinned ${index % 2 === 0 ? 'image-left' : 'image-right'}`}
            >
              <div className="experience-image">
                <img src={item.image} alt={item.label} />
                <div className="experience-icon-overlay">{item.icon}</div>
              </div>
              <div className="experience-content">
                <h3 className="experience-label">{item.label}</h3>
                <p className="experience-text">{item.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ maxWidth: '800px', margin: '4rem auto -4rem', textAlign: 'center' }}>
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