import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useProducts } from '../contexts/ProductContext';
import { useGSAP } from '../hooks/useGSAP';
import CartSidebar from '../components/CartSidebar';
import GuestCheckout from '../components/GuestCheckout';
import CustomCursor from '../components/CustomCursor';
import { EXPERIENCE_ITEMS } from '../utils/constants';
import type { Product } from '../types';

const ProductDetailsPage = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { addItem, openCart } = useCart();
  const { state: { products } } = useProducts();
  const { gsap, isReady } = useGSAP();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeAccordion, setActiveAccordion] = useState<number | null>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

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

  // Animate on mount
  useEffect(() => {
    if (!isReady || !gsap || !product) return;

    const timeline = gsap.timeline();

    timeline
      .from(imageRef.current, {
        duration: 1,
        x: -100,
        opacity: 0,
        ease: 'power3.out'
      })
      .from(contentRef.current, {
        duration: 1,
        x: 100,
        opacity: 0,
        ease: 'power3.out'
      }, '-=0.7');

  }, [isReady, gsap, product]);

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addItem(product);
      }
      openCart();
    }
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  const toggleAccordion = (index: number) => {
    setActiveAccordion(activeAccordion === index ? null : index);
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
      <div className="product-details-page" ref={pageRef}>
        {/* Header */}
        <header className="product-details-header">
          <button onClick={() => navigate('/')} className="back-button">
            <span>←</span> Back to Collection
          </button>
        </header>

        {/* Main Content */}
        <div className="product-details-container">
          {/* Left Side - Product Image */}
          <div className="product-details-left" ref={imageRef}>
            <div className="product-details-image">
              <div className="product-details-number">{product.number}</div>
              <div className="product-details-bottle">{product.bottleText}</div>
            </div>

            {/* Product Features */}
            <div className="product-features">
              <div className="feature-item">
                <div className="feature-icon">✦</div>
                <div className="feature-text">
                  <h4>Premium Quality</h4>
                  <p>Crafted with the finest ingredients</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">♦</div>
                <div className="feature-text">
                  <h4>Long-lasting</h4>
                  <p>Signature scent that endures</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">✧</div>
                <div className="feature-text">
                  <h4>Limited Edition</h4>
                  <p>Exclusive collection pieces</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Product Info */}
          <div className="product-details-right" ref={contentRef}>
            <div className="product-details-info">
              <div className="product-category">
                <span className="section-label">Luxury Fragrance</span>
              </div>

              <h1 className="product-details-name">{product.name}</h1>

              {product.notes && (
                <p className="product-details-notes">{product.notes}</p>
              )}

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

                {/* Quantity Selector */}
                <div className="product-quantity-section">
                  <span className="quantity-label">Quantity</span>
                  <div className="quantity-controls">
                    <button
                      className="quantity-btn"
                      onClick={decrementQuantity}
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="quantity-display">{quantity}</span>
                    <button
                      className="quantity-btn"
                      onClick={incrementQuantity}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="product-details-actions">
                  <button
                    onClick={handleAddToCart}
                    className="btn-luxe btn-luxe-primary"
                  >
                    Add {quantity > 1 ? `${quantity} ` : ''}to Cart
                  </button>
                  <button
                    onClick={() => navigate('/')}
                    className="btn-luxe btn-luxe-outline"
                  >
                    Continue Shopping
                  </button>
                </div>

                {/* Additional Info */}
                <div className="product-additional-info">
                  <div className="info-item">
                    <strong>Size:</strong> 50ml / 1.7 fl oz
                  </div>
                  <div className="info-item">
                    <strong>Type:</strong> Solid Perfume
                  </div>
                  <div className="info-item">
                    <strong>Collection:</strong> Midnight Series
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* The Sugraé Promise Section */}
        <div className="product-promise-section">
          <div className="promise-container">
            {/* Left Side - Accordions */}
            <div className="promise-left">
              <h2 className="promise-title">The Sugraé Promise</h2>
              <div className="promise-accordions">
                {EXPERIENCE_ITEMS.map((item, index) => (
                  <div
                    key={index}
                    className={`promise-accordion ${activeAccordion === index ? 'active' : ''}`}
                  >
                    <button
                      className="accordion-header"
                      onClick={() => toggleAccordion(index)}
                    >
                      <span className="accordion-label">{item.label}</span>
                      <span className="accordion-arrow">{activeAccordion === index ? '−' : '+'}</span>
                    </button>
                    <div className={`accordion-content ${activeAccordion === index ? 'open' : ''}`}>
                      <p>{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side - Visual/Image */}
            <div className="promise-right">
              <div className="promise-visual">
                <img
                  src="/src/assets/image1.webp"
                  alt="Sugraé Promise"
                  className="promise-image"
                />
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
