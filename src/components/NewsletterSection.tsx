import { useEffect, useRef, useState } from 'react';
import type { FC } from 'react';
import { useGSAP } from '../hooks/useGSAP';
import { shopifyAPI } from '../services/shopify';

const NewsletterSection: FC = () => {
  const { gsap, isReady } = useGSAP();
  const sectionRef = useRef<HTMLDivElement>(null);
  const stayRef = useRef<HTMLSpanElement>(null);
  const updatedRef = useRef<HTMLSpanElement>(null);
  const enterRef = useRef<HTMLSpanElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!isReady || !gsap || !sectionRef.current) return;

    // Use a mutable container so the cleanup closure always sees the latest values,
    // even after the async initAnimation has resolved.
    const refs: { tl: any; enterSplit: any; submitSplit: any; cancelled: boolean } = {
      tl: null,
      enterSplit: null,
      submitSplit: null,
      cancelled: false,
    };

    const initAnimation = async () => {
      try {
        const { default: SplitText } = await import('gsap/SplitText');
        const { default: ScrollTrigger } = await import('gsap/ScrollTrigger');

        gsap.registerPlugin(SplitText, ScrollTrigger);

        // If cleanup already ran while we were awaiting the dynamic imports, bail out
        if (refs.cancelled) return;

        // Split "ENTER" and "SUBMIT" into characters
        refs.enterSplit = new SplitText(enterRef.current, {
          type: 'chars',
          charsClass: 'char',
        });

        refs.submitSplit = new SplitText(submitRef.current, {
          type: 'chars',
          charsClass: 'char',
        });

        // Create a timeline for the entire animation sequence
        refs.tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: '+=200%',
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            markers: false,
          },
        });

        // Set initial states
        gsap.set(refs.enterSplit.chars, { opacity: 0, x: 20 });
        gsap.set(refs.submitSplit.chars, { opacity: 0, x: -20 });
        gsap.set(emailInputRef.current, {
          opacity: 0,
          scaleX: 0,
          transformOrigin: 'center center'
        });

        // Animation sequence - add a pause at the beginning
        refs.tl
          .to({}, { duration: 0.3 })

          // Phase 1: Move STAY to left and UPDATED to right, fade them out, expand form
          .to(stayRef.current, {
            x: -200,
            opacity: 0,
            duration: 1,
          }, 0.3)
          .to(updatedRef.current, {
            x: 200,
            opacity: 0,
            duration: 1,
          }, 0.3)
          .to(formRef.current, {
            scaleX: 1,
            opacity: 1,
            duration: 1,
            onStart: () => {
              if (formRef.current) {
                formRef.current.style.pointerEvents = 'auto';
              }
            }
          }, 0.3)

          // Phase 2: Reveal ENTER characters one by one (from left)
          .to(refs.enterSplit.chars, {
            opacity: 1,
            x: 0,
            stagger: 0.05,
            duration: 0.3,
          }, 0.6)

          // Phase 3: Reveal SUBMIT characters one by one (from right)
          .to(refs.submitSplit.chars, {
            opacity: 1,
            x: 0,
            stagger: 0.05,
            duration: 0.3,
          }, 0.8)

          // Phase 4: Grow email input from center
          .to(emailInputRef.current, {
            opacity: 1,
            scaleX: 1,
            duration: 0.4,
            onComplete: () => {
              if (emailInputRef.current) {
                emailInputRef.current.focus();
              }
            }
          }, 1.0)

          // Phase 5: Move ENTER left and SUBMIT right (keep them visible)
          .to(enterRef.current, {
            x: -100,
            duration: 0.8,
          }, 1.2)
          .to(submitRef.current, {
            x: 100,
            duration: 0.8,
          }, 1.2);
      } catch (error) {
        console.error('Error initializing newsletter animation:', error);
      }
    };

    initAnimation();

    return () => {
      refs.cancelled = true;
      if (refs.tl) {
        // Kill the pinned ScrollTrigger first to restore DOM before React unmounts
        if (refs.tl.scrollTrigger) refs.tl.scrollTrigger.kill(true);
        refs.tl.kill();
      }
      if (refs.enterSplit) refs.enterSplit.revert();
      if (refs.submitSplit) refs.submitSplit.revert();
    };
  }, [gsap, isReady]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      // Subscribe to newsletter via Shopify
      const result = await shopifyAPI.subscribeToNewsletter(email);

      if (result.success) {
        setMessage('Thank you for subscribing!');
        setEmail('');
      }
    } catch (error: any) {
      console.error('Newsletter subscription error:', error);
      setMessage(error.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section ref={sectionRef} className="newsletter-section">
      <div className="newsletter-container">
        {/* Static heading */}
        <h3 className="newsletter-heading">Subscribe to newsletters</h3>

        {/* Single row containing both title words and form elements */}
        <div className="newsletter-content-row">
          <span ref={stayRef} className="newsletter-word">STAY</span>

          <form ref={formRef} onSubmit={handleSubmit} className="newsletter-form-inline">
            <span ref={enterRef} className="newsletter-label">ENTER</span>
            <input
              ref={emailInputRef}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="YOUR EMAIL"
              className="newsletter-input-inline"
              required
              disabled={isSubmitting}
            />
            <button
              ref={submitRef}
              type="submit"
              className="newsletter-submit-text"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'SUBMITTING' : 'SUBMIT'}
            </button>
          </form>

          <span ref={updatedRef} className="newsletter-word">UPDATED</span>
        </div>

        {message && (
          <p className={`newsletter-message ${message.includes('Thank') ? 'success' : 'error'}`}>
            {message}
          </p>
        )}
      </div>
    </section>
  );
};

export default NewsletterSection;
