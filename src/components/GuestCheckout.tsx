import { useState, useEffect, useRef } from 'react';
import type { FC } from 'react';
import { useCart } from '../contexts/CartContext';
import { useGSAP } from '../hooks/useGSAP';
import type { CustomerInfo } from '../types';

const GuestCheckout: FC = () => {
  const { state, closeCheckout, clearCart, getCartTotal, getCartItemCount } = useCart();
  const { gsap, isReady } = useGSAP();
  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  useEffect(() => {
    if (!isReady || !gsap) return;

    if (state.isCheckoutOpen) {
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
  }, [state.isCheckoutOpen, gsap, isReady]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate order processing
    setTimeout(() => {
      setIsSubmitting(false);
      setOrderComplete(true);

      // Clear cart after successful order
      setTimeout(() => {
        clearCart();
        setOrderComplete(false);
        closeCheckout();
        setCustomerInfo({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          address: '',
          city: '',
          state: '',
          zipCode: '',
          country: 'United States',
        });
      }, 3000);
    }, 2000);
  };

  if (orderComplete) {
    return (
      <>
        <div ref={overlayRef} className="checkout-overlay" />
        <div ref={modalRef} className="checkout-modal">
          <div className="order-success">
            <div className="success-icon">✨</div>
            <h2 className="success-title">Order Complete!</h2>
            <p className="success-message">
              Thank you for your order. You'll receive a confirmation email shortly.
            </p>
            <div className="success-details">
              <p>Order Total: <span className="success-amount">${getCartTotal()}</span></p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div
        ref={overlayRef}
        className="checkout-overlay"
        onClick={closeCheckout}
      />

      <div ref={modalRef} className="checkout-modal">
        <div className="checkout-header">
          <h2 className="checkout-title">Guest Checkout</h2>
          <button onClick={closeCheckout} className="checkout-close">×</button>
        </div>

        <div className="checkout-content">
          <div className="checkout-summary">
            <h3 className="summary-title">Order Summary</h3>
            <div className="summary-items">
              {state.items.map((item) => (
                <div key={item.product.id} className="summary-item">
                  <span className="summary-item-name">
                    {item.product.name} × {item.quantity}
                  </span>
                  <span className="summary-item-price">
                    ${item.product.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>
            <div className="summary-total">
              <span>Total ({getCartItemCount()} items)</span>
              <span>${getCartTotal()}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="checkout-form">
            <div className="form-section">
              <h3 className="form-section-title">Contact Information</h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName" className="form-label">First Name *</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={customerInfo.firstName}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName" className="form-label">Last Name *</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={customerInfo.lastName}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={customerInfo.email}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone" className="form-label">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={customerInfo.phone}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-section">
              <h3 className="form-section-title">Shipping Address</h3>
              <div className="form-group">
                <label htmlFor="address" className="form-label">Address *</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={customerInfo.address}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city" className="form-label">City *</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={customerInfo.city}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="state" className="form-label">State *</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={customerInfo.state}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="zipCode" className="form-label">ZIP Code *</label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={customerInfo.zipCode}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="country" className="form-label">Country *</label>
                <select
                  id="country"
                  name="country"
                  value={customerInfo.country}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                >
                  <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Australia">Australia</option>
                </select>
              </div>
            </div>

            <div className="checkout-footer">
              <button
                type="submit"
                disabled={isSubmitting}
                className="submit-order-btn"
              >
                {isSubmitting ? 'Processing...' : `Complete Order - $${getCartTotal()}`}
              </button>
              <p className="checkout-note">
                * This is a demo checkout. No payment will be processed.
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default GuestCheckout;