import { useEffect, useRef } from 'react';
import type { FC } from 'react';
import { useCart } from '../contexts/CartContext';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  index: number;
}

const ProductCard: FC<ProductCardProps> = ({ product, index }) => {
  const { addItem, openCart } = useCart();

  const handleAddToCart = () => {
    addItem(product);
    openCart();
  };

  return (
    <div className="product-card">
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
          <div className="product-price">${product.price}</div>
          <div className="product-actions">
            <a href="#" className="product-cta product-cta-reserve">Reserve Now</a>
            <button
              onClick={handleAddToCart}
              className="product-cta product-cta-cart"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
  );
};

export default ProductCard;