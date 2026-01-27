import { useEffect, useRef } from 'react';
import type { FC } from 'react';
import { useCart } from '../contexts/CartContext';
import { useGSAP } from '../hooks/useGSAP';
import { useRegion } from '../contexts/RegionContext';
import { formatPrice } from '../utils/pricing';
import Price from './Price';
import cartIcon from '../assets/cart.png';

const CartSidebar: FC = () => {
  const {
    state,
    removeItem,
    updateQuantity,
    updateColor,
    closeCart,
    openCheckout,
    getCartTotal,
    getCartItemCount
  } = useCart();

  const { marketConfig } = useRegion();
  const { gsap, isReady } = useGSAP();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isReady || !gsap) return;

    if (state.isOpen) {
      gsap.to(overlayRef.current, {
        opacity: 1,
        visibility: 'visible',
        duration: 0.3,
        ease: 'power2.out'
      });
      gsap.to(sidebarRef.current, {
        x: 0,
        duration: 0.4,
        ease: 'power3.out'
      });
    } else {
      gsap.to(overlayRef.current, {
        opacity: 0,
        visibility: 'hidden',
        duration: 0.3,
        ease: 'power2.out'
      });
      gsap.to(sidebarRef.current, {
        x: '100%',
        duration: 0.4,
        ease: 'power3.out'
      });
    }
  }, [state.isOpen, gsap, isReady]);

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    openCheckout();
  };

  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="cart-overlay"
        onClick={closeCart}
      />

      {/* Sidebar */}
      <div ref={sidebarRef} className="cart-sidebar">
        <div className="cart-header">
          <h2 className="cart-title">Shopping Cart</h2>
          <button onClick={closeCart} className="cart-close">×</button>
        </div>

        <div className="cart-content">
          {state.items.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty-icon">
                <img src={cartIcon} alt="Empty Cart" width="48" height="48" />
              </div>
              <p className="cart-empty-text">Your cart is empty</p>
              <p className="cart-empty-subtext">Add some fragrances to get started</p>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {state.items.map((item, index) => (
                  <div key={`${item.product.id}-${index}`} className="cart-item">
                    <div className="cart-item-image">
                      <div className="cart-item-bottle">{item.product.bottleText}</div>
                    </div>
                    <div className="cart-item-details">
                      <h3 className="cart-item-name">{item.product.name}</h3>
                      <p className="cart-item-notes">{item.product.notes}</p>

                      {/* Color Selector */}
                      <div className="cart-item-color">
                        <span className="cart-color-label">Color:</span>
                        <div className="cart-color-options">
                          <button
                            className={`cart-color-option ${item.color === 'maroon' ? 'active' : ''}`}
                            onClick={() => updateColor(item.product.id, 'maroon')}
                            aria-label="Select Maroon"
                            style={{ backgroundColor: '#800020' }}
                          />
                          <button
                            className={`cart-color-option ${item.color === 'gray' ? 'active' : ''}`}
                            onClick={() => updateColor(item.product.id, 'gray')}
                            aria-label="Select Gray"
                            style={{ backgroundColor: '#808080' }}
                          />
                        </div>
                      </div>

                      <div className="cart-item-price"><Price product={item.product} /></div>
                    </div>
                    <div className="cart-item-controls">
                      <div className="quantity-controls">
                        <button
                          onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                          className="quantity-btn"
                        >
                          −
                        </button>
                        <span className="quantity-display">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                          className="quantity-btn"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="remove-btn"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-footer">
                <div className="cart-summary">
                  <div className="cart-summary-row">
                    <span>Items ({getCartItemCount()})</span>
                    <span>{formatPrice(getCartTotal(), marketConfig.currencySymbol)}</span>
                  </div>
                  <div className="cart-summary-row cart-summary-total">
                    <span>Total</span>
                    <span>{formatPrice(getCartTotal(), marketConfig.currencySymbol)}</span>
                  </div>
                </div>
                <button onClick={handleCheckout} className="checkout-btn">
                  Proceed to Checkout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSidebar;