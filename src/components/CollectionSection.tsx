import { useEffect, useRef } from 'react';
import type { FC } from 'react';
import { useGSAP } from '../hooks/useGSAP';
import { PRODUCTS } from '../utils/constants';
import ProductCard from './ProductCard';

const CollectionSection: FC = () => {
  const { gsap, isReady } = useGSAP();
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
        <div className="product-grid">
          {PRODUCTS.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CollectionSection;