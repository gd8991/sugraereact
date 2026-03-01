import { useEffect, useRef, Fragment } from 'react';
import type { FC } from 'react';
import { useGSAP } from '../hooks/useGSAP';
import { FOUNDER_STORY } from '../utils/constants';

const FounderSection: FC = () => {
  const { gsap, isReady } = useGSAP();
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const paragraphRefs = useRef<HTMLParagraphElement[]>([]);
  const signatureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isReady || !gsap) return;

    const tweens: any[] = [];

    // 1. Video: slide in from left (matches CSS initial state: opacity 0, translateX(-50px))
    const videoEnter = gsap.to(videoRef.current, {
      scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
      duration: 1.1,
      opacity: 1,
      x: 0,
      ease: 'power3.out',
    });
    tweens.push(videoEnter);

    // 2. Video parallax — moves upward as the section scrolls past, adding depth
    const videoParallax = gsap.to(videoRef.current, {
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5,
      },
      y: -70,
      ease: 'none',
    });
    tweens.push(videoParallax);

    // 3. Content: staggered reveals — label → title → paragraphs → signature
    const contentTl = gsap.timeline({
      scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' },
    });

    contentTl
      .from(labelRef.current, {
        duration: 0.7,
        opacity: 0,
        x: 30,
        ease: 'power3.out',
      })
      .from(titleRef.current, {
        duration: 1.1,
        opacity: 0,
        y: 50,
        ease: 'power4.out',
      }, '-=0.4')
      .from(paragraphRefs.current.filter(Boolean), {
        duration: 0.9,
        opacity: 0,
        y: 25,
        stagger: 0.2,
        ease: 'power3.out',
      }, '-=0.6')
      .from(signatureRef.current, {
        duration: 0.8,
        opacity: 0,
        y: 20,
        ease: 'power3.out',
      }, '-=0.3');

    tweens.push(contentTl);

    return () => {
      tweens.forEach(t => {
        if (t.scrollTrigger) t.scrollTrigger.kill(true);
        t.kill();
      });
    };
  }, [isReady, gsap]);

  return (
    <section ref={sectionRef} className="founder-section" id="founder">
      <div className="founder-container">
        {/* Video Section */}
        <div ref={videoRef} className="founder-video">
          <div className="video-overlay">
            <div className="play-button">▶</div>
          </div>
        </div>

        {/* Content Section — individual elements animated by JS */}
        <div className="founder-content">
          <div ref={labelRef} className="section-label">{FOUNDER_STORY.subtitle}</div>

          <h2 ref={titleRef} className="founder-title">
            {FOUNDER_STORY.title.split('\n').map((line, index) => (
              <Fragment key={index}>
                {line}
                {index < FOUNDER_STORY.title.split('\n').length - 1 && <br />}
              </Fragment>
            ))}
          </h2>

          <div>
            {FOUNDER_STORY.paragraphs.map((paragraph, index) => (
              <p
                key={index}
                ref={el => { if (el) paragraphRefs.current[index] = el; }}
                className="founder-story"
                dangerouslySetInnerHTML={{
                  __html: paragraph.replace(/Sugraé/g, '<strong>Sugraé</strong>'),
                }}
              />
            ))}
          </div>

          <div ref={signatureRef} className="founder-signature">{FOUNDER_STORY.signature}</div>
        </div>
      </div>
    </section>
  );
};

export default FounderSection;
