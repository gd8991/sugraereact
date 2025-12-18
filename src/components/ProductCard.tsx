import { useState } from 'react';
import type { FC } from 'react';
import { useCart } from '../contexts/CartContext';
import type { Product } from '../types';
import ProductModal from './ProductModal';

interface ProductCardProps {
  product: Product;
  index: number;
}

const ProductCard: FC<ProductCardProps> = ({ product }) => {
  const { addItem, openCart } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddToCart = () => {
    addItem(product);
    openCart();
  };

  const openModal = () => {
    console.log('Opening modal for product:', product.name);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openProductPage = () => {
    const basePath = import.meta.env.VITE_BASE_PATH || '/';
    const productUrl = `${basePath}${basePath.endsWith('/') ? '' : '/'}product/${product.id}`;
    window.open(productUrl, '_blank');
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
              {product.description.length > 80 && (
                <button
                  onClick={openModal}
                  className="read-more-btn"
                  style={{ backgroundColor: isModalOpen ? 'red' : 'transparent' }}
                >
                  {isModalOpen ? 'Modal Open' : 'Read More'}
                </button>
              )}
            </div>
            <div className="product-price">${product.price}</div>
            <div className="product-actions">
              <button
                onClick={openProductPage}
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

        <ProductModal
          product={product}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
    </>
  );
};

export default ProductCard;