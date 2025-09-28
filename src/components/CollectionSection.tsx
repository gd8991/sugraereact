import { useEffect, useRef } from 'react';
import type { FC } from 'react';
import { useGSAP } from '../hooks/useGSAP';
import { useProducts } from '../contexts/ProductContext';
import ProductCard from './ProductCard';

const CollectionSection: FC = () => {
  const { gsap, isReady } = useGSAP();
  const { state: { products, isLoading, error, isShopifyData } } = useProducts();
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
    <section className="collection-section" id="collection">
      {/* Collection Header */}
      <div className="collection-header">
        <h2 ref={titleRef} className="collection-title">THE COLLECTION</h2>
        <p className="collection-subtitle">Three Chapters of Midnight</p>
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
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </div>
        ) : (
          <div className="product-grid">
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CollectionSection;