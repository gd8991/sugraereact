import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useProducts } from '../contexts/ProductContext';
import CartSidebar from '../components/CartSidebar';
import GuestCheckout from '../components/GuestCheckout';
import CustomCursor from '../components/CustomCursor';
import type { Product } from '../types';

const ProductDetailsPage = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { addItem, openCart } = useCart();
  const { products } = useProducts();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (products.length > 0 && productId) {
      const foundProduct = products.find(p => p.id === productId);
      if (foundProduct) {
        setProduct(foundProduct);
      } else {
        // Product not found, redirect to home
        navigate('/');
      }
    }
  }, [products, productId, navigate]);

  const handleAddToCart = () => {
    if (product) {
      addItem(product);
      openCart();
    }
  };

  if (!product) {
    return (
      <div className="product-details-page loading">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading product...</p>
      </div>
    );
  }

  return (
    <>
      <CustomCursor />
      <div className="product-details-page">
        {/* Header */}
        <header className="product-details-header">
          <button onClick={() => navigate('/')} className="back-button">
            <span>←</span> Back to Collection
          </button>
        </header>

        {/* Main Content */}
        <div className="product-details-container">
          {/* Left Side - Product Image */}
          <div className="product-details-left">
            <div className="product-details-image">
              <div className="product-details-number">{product.number}</div>
              <div className="product-details-bottle">{product.bottleText}</div>
            </div>
          </div>

          {/* Right Side - Product Info */}
          <div className="product-details-right">
            <div className="product-details-info">
              <div className="product-category">
                <span className="section-label">Luxury Fragrance</span>
              </div>

              <h1 className="product-details-name">{product.name}</h1>

              <div className="product-details-divider"></div>

              <div className="product-details-description">
                <h3 className="description-title">The Story</h3>
                <p className="description-content">{product.description}</p>
              </div>

              <div className="product-details-footer">
                <div className="product-details-price">
                  <span className="price-label">Price</span>
                  <span className="price-value">${product.price}</span>
                </div>

                <div className="product-details-actions">
                  <button
                    onClick={handleAddToCart}
                    className="btn-luxe btn-luxe-primary"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CartSidebar />
      <GuestCheckout />
    </>
  );
};

export default ProductDetailsPage;
