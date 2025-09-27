import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { FC } from 'react';
import { useGSAP } from '../hooks/useGSAP';
import { useCart } from '../contexts/CartContext';
import type { Product } from '../types';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductModal: FC<ProductModalProps> = ({ product, isOpen, onClose }) => {
  const { gsap, isReady } = useGSAP();
  const { addItem, openCart } = useCart();
  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Debug logging
  console.log('ProductModal render:', { product: product?.name, isOpen, isReady });

  useEffect(() => {
    if (!isReady || !gsap) return;

    if (isOpen && product) {
      document.body.style.overflow = 'hidden';

      gsap.to(overlayRef.current, {
        opacity: 1,
        visibility: 'visible',
        duration: 0.3,
        ease: 'power2.out'
      });

      gsap.to(modalRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        ease: 'power3.out'
      });
    } else {
      document.body.style.overflow = 'unset';

      gsap.to(overlayRef.current, {
        opacity: 0,
        visibility: 'hidden',
        duration: 0.3,
        ease: 'power2.out'
      });

      gsap.to(modalRef.current, {
        opacity: 0,
        scale: 0.9,
        duration: 0.4,
        ease: 'power3.out'
      });
    }
  }, [isOpen, product, gsap, isReady]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleAddToCart = () => {
    if (product) {
      addItem(product);
      onClose();
      openCart();
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  if (!product) return null;

  return createPortal(
    <>
      <div
        ref={overlayRef}
        className="product-modal-overlay"
        onClick={handleOverlayClick}
      />

      <div ref={modalRef} className="product-modal">
        <div className="modal-header">
          <div className="modal-header-line"></div>
          <button onClick={onClose} className="modal-close">
            <span></span>
            <span></span>
          </button>
        </div>

        <div className="modal-content">
          <div className="modal-left">
            <div className="modal-product-image">
              <div className="modal-product-number">{product.number}</div>
              <div className="modal-product-bottle">{product.bottleText}</div>
              <div className="modal-image-glow"></div>
            </div>
          </div>

          <div className="modal-right">
            <div className="modal-product-info">
              <div className="modal-product-header">
                <h2 className="modal-product-name">{product.name}</h2>
                <div className="modal-product-divider"></div>
                <p className="modal-product-notes">{product.notes}</p>
              </div>

              <div className="modal-product-description">
                <h4 className="description-title">The Story</h4>
                <div className="description-content">
                  <p>{product.description}</p>
                </div>
              </div>

              <div className="modal-product-footer">
                <div className="modal-product-price">
                  <span className="price-label">Price</span>
                  <span className="price-value">${product.price}</span>
                </div>

                <div className="modal-product-actions">
                  <button
                    onClick={handleAddToCart}
                    className="modal-btn modal-btn-primary"
                  >
                    <span>Add to Cart</span>
                  </button>
                  <a href="#" className="modal-btn modal-btn-secondary">
                    <span>Reserve Now</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
};

export default ProductModal;