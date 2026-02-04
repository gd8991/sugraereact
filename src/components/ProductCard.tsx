import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import Price from './Price';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  index: number;
}

const ProductCard: FC<ProductCardProps> = ({ product }) => {
  const { addItem, openCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = () => {
    addItem(product);
    openCart();
  };

  const handleViewDetails = () => {
    // Kill all ScrollTrigger instances synchronously BEFORE navigating.
    // Pinned sections have their DOM nodes moved into GSAP wrappers; if we don't
    // unpin them first, React's commit phase will throw "removeChild" errors
    // because the nodes are no longer children of their original parents.
    if (window.ScrollTrigger) {
      window.ScrollTrigger.getAll().forEach((st: any) => st.kill(true));
    }
    navigate(`/product/${product.id}`);
  };

  // Truncate description for card display
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  return (
    <>
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

            <div className="product-description-container">
              <p className="product-description">{truncateText(product.description, 80)}</p>
            </div>
            <div className="product-price"><Price product={product} /></div>
            <div className="product-actions">
              <button
                onClick={handleViewDetails}
                className="product-cta product-cta-reserve"
              >
                View Details
              </button>
              <button
                onClick={handleAddToCart}
                className="product-cta product-cta-cart"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
    </>
  );
};

export default ProductCard;