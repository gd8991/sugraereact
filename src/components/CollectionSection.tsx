import { useEffect, useRef, useState, useCallback } from 'react';
import type { FC } from 'react';
import { useGSAP } from '../hooks/useGSAP';
import { useProducts } from '../contexts/ProductContext';
import ProductCard from './ProductCard';

const CollectionSection: FC = () => {
  const { gsap, isReady } = useGSAP();
  const { state: { products, isLoading, error } } = useProducts();
  const [currentIndex, setCurrentIndex] = useState(0);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  const goToPrev = useCallback(() => {
    setCurrentIndex(i => (i - 1 + products.length) % products.length);
  }, [products.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex(i => (i + 1) % products.length);
  }, [products.length]);

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

    // Carousel fade-in
    if (carouselRef.current) {
      tweens.push(gsap.from(carouselRef.current, {
        scrollTrigger: {
          trigger: carouselRef.current,
          start: 'top 85%'
        },
        duration: 1,
        y: 40,
        opacity: 0,
        ease: 'power3.out',
        delay: 0.4
      }));
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
          </div>
        ) : (
          <>
            <div className="carousel-wrapper" ref={carouselRef}>
              <button
                className="carousel-btn carousel-btn-prev"
                onClick={goToPrev}
                aria-label="Previous product"
              >
                &#8249;
              </button>

              <div className="carousel-viewport">
                <div
                  className="carousel-track"
                  style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                  {products.map((product, index) => (
                    <div key={product.id} className="carousel-slide">
                      <ProductCard product={product} index={index} />
                    </div>
                  ))}
                </div>
              </div>

              <button
                className="carousel-btn carousel-btn-next"
                onClick={goToNext}
                aria-label="Next product"
              >
                &#8250;
              </button>
            </div>

            {products.length > 1 && (
              <div className="carousel-dots">
                {products.map((_, index) => (
                  <button
                    key={index}
                    className={`carousel-dot${index === currentIndex ? ' active' : ''}`}
                    onClick={() => setCurrentIndex(index)}
                    aria-label={`Go to product ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default CollectionSection;