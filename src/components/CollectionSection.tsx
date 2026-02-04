import { useEffect, useRef } from 'react';
import type { FC } from 'react';
import { useGSAP } from '../hooks/useGSAP';
import { useProducts } from '../contexts/ProductContext';
import ProductCard from './ProductCard';

const CollectionSection: FC = () => {
  const { gsap, isReady } = useGSAP();
  const { state: { products, isLoading, error } } = useProducts();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const cardRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (!isReady || !gsap) return;

    const tweens: any[] = [];

    // Title fade-in
    tweens.push(gsap.from(titleRef.current, {
      scrollTrigger: {
        trigger: titleRef.current,
        start: 'top 80%'
      },
      duration: 1,
      y: 50,
      opacity: 0,
      ease: 'power3.out'
    }));

    // Subtitle fade-in (slightly delayed after title)
    if (subtitleRef.current) {
      tweens.push(gsap.from(subtitleRef.current, {
        scrollTrigger: {
          trigger: subtitleRef.current,
          start: 'top 80%'
        },
        duration: 1,
        y: 30,
        opacity: 0,
        ease: 'power3.out',
        delay: 0.2
      }));
    }

    // Product cards staggered fade-in
    const cards = cardRefs.current.filter(Boolean);
    if (cards.length) {
      cards.forEach((card, i) => {
        tweens.push(gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: 'top 85%'
          },
          duration: 0.9,
          y: 40,
          opacity: 0,
          ease: 'power3.out',
          delay: i * 0.15
        }));
      });
    }

    return () => {
      tweens.forEach(t => {
        if (t.scrollTrigger) t.scrollTrigger.kill(true);
        t.kill();
      });
    };
  }, [isReady, gsap]);

  return (
    <section className="collection-section" id="collection">
      {/* Collection Header */}
      <div className="collection-header">
        <h2 ref={titleRef} className="collection-title">THE COLLECTION</h2>
        <p ref={subtitleRef} className="collection-subtitle">Three Chapters of Midnight</p>
      </div>

      {/* Products Showcase */}
      <div className="products-showcase">
        {isLoading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p className="loading-text">Loading our exquisite collection...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <p className="error-text">Unable to load products. Showing our signature collection.</p>
            <div className="product-grid">
              {products.map((product, index) => (
                <div key={product.id} ref={el => { if (el) cardRefs.current[index] = el; }}>
                  <ProductCard product={product} index={index} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="product-grid">
            {products.map((product, index) => (
              <div key={product.id} ref={el => { if (el) cardRefs.current[index] = el; }}>
                <ProductCard product={product} index={index} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CollectionSection;