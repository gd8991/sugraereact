import { useEffect, useRef, Fragment } from 'react';
import type { FC } from 'react';
import { useGSAP } from '../hooks/useGSAP';
import { FOUNDER_STORY } from '../utils/constants';

const FounderSection: FC = () => {
  const { gsap, isReady } = useGSAP();
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isReady || !gsap) return;

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 70%'
      }
    });

    timeline
      .to(videoRef.current, {
        duration: 1,
        opacity: 1,
        x: 0,
        ease: 'power3.out'
      })
      .to(contentRef.current, {
        duration: 1,
        opacity: 1,
        x: 0,
        ease: 'power3.out'
      }, '-=0.5');

    return () => {
      if (timeline.scrollTrigger) timeline.scrollTrigger.kill(true);
      timeline.kill();
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

        {/* Content Section */}
        <div ref={contentRef} className="founder-content">
          <div className="section-label">{FOUNDER_STORY.subtitle}</div>
          
          <h2 className="founder-title">
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
                className="founder-story"
                dangerouslySetInnerHTML={{ 
                  __html: paragraph.replace(/Sugraé/g, '<strong>Sugraé</strong>') 
                }}
              />
            ))}
          </div>
          
          <div className="founder-signature">{FOUNDER_STORY.signature}</div>
        </div>
      </div>
    </section>
  );
};

export default FounderSection;