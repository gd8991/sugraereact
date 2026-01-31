import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useProducts } from '../contexts/ProductContext';
import { useGSAP } from '../hooks/useGSAP';
import CartSidebar from '../components/CartSidebar';
import GuestCheckout from '../components/GuestCheckout';
import CustomCursor from '../components/CustomCursor';
import Price from '../components/Price';
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
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState('maroon');
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Mock product images - in real app, these would come from product data
  const productImages = [
    '/src/assets/image1.webp',
    '/src/assets/image1.webp', // Placeholder - would be different images
    '/src/assets/image1.webp',
    '/src/assets/image1.webp',
    '/src/assets/image1.webp',
  ];

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
          {/* Breadcrumb */}
          <div className="product-breadcrumb">
            <button onClick={() => navigate('/')} className="breadcrumb-link">
              Home
            </button>
            <span className="breadcrumb-separator">/</span>
            <button onClick={() => navigate('/#collection')} className="breadcrumb-link">
              Collection
            </button>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">{product.name}</span>
          </div>

          {/* Left Side - Product Image Gallery */}
          <div className="product-details-left" ref={imageRef}>
            <div className="product-gallery">
              {/* Thumbnail Strip */}
              <div className="gallery-thumbnails">
                {productImages.map((image, index) => (
                  <div
                    key={index}
                    className={`gallery-thumbnail ${selectedImageIndex === index ? 'active' : ''}`}
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <img src={image} alt={`${product.name} view ${index + 1}`} />
                  </div>
                ))}
              </div>

              {/* Main Image */}
              <div className="gallery-main-image">
                <img
                  src={productImages[selectedImageIndex]}
                  alt={product.name}
                  className="main-product-image"
                />
              </div>
            </div>
          </div>

          {/* Right Side - Product Info */}
          <div className="product-details-right" ref={contentRef}>
            <div className="product-details-info">
              <div className="product-category">
                <span className="section-label">Luxury Fragrance</span>
              </div>

              <div className="product-title-section">
                <h1 className="product-details-name">{product.name}</h1>
                <span className="product-size-info">50ml / 1.7 fl oz</span>
              </div>

              
              <div className="product-details-divider"></div>

              <div className="product-details-description">
                <h3 className="description-title">The Story</h3>
                <p className="description-content">
                  {isDescriptionExpanded
                    ? product.description
                    : `${product.description.substring(0, 120)}...`}
                  {product.description.length > 120 && (
                    <button
                      className="view-more-btn"
                      onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                    >
                      {isDescriptionExpanded ? ' View less' : ' View more'}
                    </button>
                  )}
                </p>
              </div>

              <div className="product-details-footer">
                <div className="product-details-price">
                  <span className="price-label">Price</span>
                  <span className="price-value"><Price product={product} /></span>
                </div>

                {/* Color Selector */}
                <div className="product-color-section">
                  <span className="color-label">Packaging Color</span>
                  <div className="color-options">
                    <button
                      className={`color-option ${selectedColor === 'maroon' ? 'active' : ''}`}
                      onClick={() => setSelectedColor('maroon')}
                      aria-label="Select Maroon"
                      style={{ backgroundColor: '#800020' }}
                    />
                    <button
                      className={`color-option ${selectedColor === 'gray' ? 'active' : ''}`}
                      onClick={() => setSelectedColor('gray')}
                      aria-label="Select Gray"
                      style={{ backgroundColor: '#808080' }}
                    />
                  </div>
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

        {/* Notes Section - Full Width Below Product Details */}
        <div className="product-notes-section">
          <h2 className="notes-title">Notes</h2>
          <div className="notes-content">
            <div className="note-item">
              <h3 className="note-name">Bergamot</h3>
              <p className="note-description">
                A bright citrus essence that sparkles with Mediterranean sunshine. Its fresh, uplifting character brings an immediate sense of joy and clarity, like the first rays of morning light dancing on dewdrops.
              </p>
            </div>
            <div className="note-item">
              <h3 className="note-name">Lavender</h3>
              <p className="note-description">
                The heart of tranquility, lavender unfolds with soothing herbal warmth. Its calming presence evokes fields of purple blooms swaying in a gentle breeze, bringing peace and timeless elegance to the composition.
              </p>
            </div>
            <div className="note-item">
              <h3 className="note-name">Vanilla</h3>
              <p className="note-description">
                Rich, creamy, and enveloping. Vanilla provides a soft, comforting embrace that lingers on the skin. Its sweet warmth adds depth and sensuality, creating a lasting impression of pure indulgence.
              </p>
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
