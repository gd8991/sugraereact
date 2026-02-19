import { useEffect, useLayoutEffect, useRef, useState } from 'react';
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

  // Kill ALL ScrollTriggers synchronously before React removes DOM nodes.
  // useLayoutEffect cleanup fires before DOM mutations, preventing the
  // "removeChild" error caused by GSAP pin wrappers moving elements.
  // This uses window.ScrollTrigger (CDN instance) which is the same instance
  // used by this component's animation (via window.gsap).
  useLayoutEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.ScrollTrigger) {
        window.ScrollTrigger.getAll().forEach((st: any) => st.kill(true));
      }
    };
  }, []);

  useEffect(() => {
    if (!isReady || !gsap || !sectionRef.current) return;

    const g = window.gsap;
    const ST = window.ScrollTrigger;
    if (!g || !ST) return;

    // Track state in a mutable ref-like object so cleanup always sees latest values
    const state: { tl: any; cancelled: boolean } = {
      tl: null,
      cancelled: false,
    };

    // Simple character split using vanilla DOM (no SplitText plugin needed)
    const splitChars = (el: HTMLElement | null): HTMLSpanElement[] => {
      if (!el) return [];
      const text = el.textContent || '';
      el.innerHTML = '';
      return text.split('').map(char => {
        const span = document.createElement('span');
        span.className = 'char';
        span.style.display = 'inline-block';
        span.textContent = char === ' ' ? '\u00A0' : char;
        el.appendChild(span);
        return span;
      });
    };

    const enterChars = splitChars(enterRef.current);
    const submitChars = splitChars(submitRef.current);

    if (state.cancelled) return;

    // Set initial states
    g.set(enterChars, { opacity: 0, x: 20 });
    g.set(submitChars, { opacity: 0, x: -20 });
    g.set(emailInputRef.current, { opacity: 0, scaleX: 0, transformOrigin: 'center center' });

    // Create a timeline for the entire animation sequence using CDN ScrollTrigger
    state.tl = g.timeline({
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

    state.tl
      .to({}, { duration: 0.3 })
      .to(stayRef.current, { x: -200, opacity: 0, duration: 1 }, 0.3)
      .to(updatedRef.current, { x: 200, opacity: 0, duration: 1 }, 0.3)
      .to(formRef.current, {
        scaleX: 1,
        opacity: 1,
        duration: 1,
        onStart: () => {
          if (formRef.current) formRef.current.style.pointerEvents = 'auto';
        }
      }, 0.3)
      .to(enterChars, { opacity: 1, x: 0, stagger: 0.05, duration: 0.3 }, 0.6)
      .to(submitChars, { opacity: 1, x: 0, stagger: 0.05, duration: 0.3 }, 0.8)
      .to(emailInputRef.current, {
        opacity: 1,
        scaleX: 1,
        duration: 0.4,
        onComplete: () => { if (emailInputRef.current) emailInputRef.current.focus(); }
      }, 1.0)
      .to(enterRef.current, { x: -100, duration: 0.8 }, 1.2)
      .to(submitRef.current, { x: 100, duration: 0.8 }, 1.2);

    return () => {
      state.cancelled = true;
      // Revert char splits by restoring original text
      if (enterRef.current) enterRef.current.textContent = 'ENTER';
      if (submitRef.current) submitRef.current.textContent = 'SUBMIT';
      if (state.tl) {
        if (state.tl.scrollTrigger) state.tl.scrollTrigger.kill(true);
        state.tl.kill();
      }
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
