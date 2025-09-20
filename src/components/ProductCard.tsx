import { useEffect, useRef } from 'react';
import type { FC } from 'react';
import { useGSAP } from '../hooks/useGSAP';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  index: number;
}

const ProductCard: FC<ProductCardProps> = ({ product, index }) => {
  const { gsap, isReady } = useGSAP();
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isReady || !gsap) return;

    gsap.to(cardRef.current, {
      scrollTrigger: {
        trigger: cardRef.current,
        start: 'top 80%'
      },
      duration: 1,
      opacity: 1,
      y: 0,
      ease: 'power3.out',
      delay: index * 0.2
    });

  }, [isReady, gsap, index]);

  return (
    <div ref={cardRef} className="product-card">
      {/* Product Image Section */}
      <div className="product-image">
        {/* Product Number */}
        <div className="product-number">{product.number}</div>
        
        {/* Product Bottle */}
        <div className="product-bottle">{product.bottleText}</div>
      </div>
      
      {/* Product Info */}
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-notes">{product.notes}</p>
        <p className="product-description">{product.description}</p>
        <a href="#" className="product-cta">Reserve Now</a>
      </div>
    </div>
  );
};

export default ProductCard;