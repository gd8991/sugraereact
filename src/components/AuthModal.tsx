import { useState, useRef, useEffect } from 'react';
import type { FC } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useGSAP } from '../hooks/useGSAP';

type AuthMode = 'login' | 'signup';

const AuthModal: FC = () => {
  const { state, login, signup, closeAuthModal } = useAuth();
  const { gsap, isReady } = useGSAP();
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isReady || !gsap) return;

    if (state.isAuthModalOpen) {
      document.body.style.overflow = 'hidden';

      gsap.to(overlayRef.current, {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
      });

      gsap.fromTo(
        modalRef.current,
        {
          x: '100%',
        },
        {
          x: '0%',
          duration: 0.4,
          ease: 'power3.out',
        }
      );
    } else {
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
      });

      gsap.to(modalRef.current, {
        x: '100%',
        duration: 0.4,
        ease: 'power3.in',
        onComplete: () => {
          document.body.style.overflow = 'unset';
          // Reset form when closed
          setEmail('');
          setPassword('');
          setFirstName('');
          setLastName('');
          setRememberMe(false);
          setError('');
          setMode('login');
          setIsSubmitting(false); // Reset submitting state
        },
      });
    }
  }, [state.isAuthModalOpen, isReady, gsap]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        await login(email, password, rememberMe);
      } else {
        if (!firstName) {
          setError('First name is required');
          setIsSubmitting(false);
          return;
        }
        await signup(email, password, firstName, lastName);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsSubmitting(false);
    }
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setError('');
  };

  if (!state.isAuthModalOpen) return null;

  return (
    <>
      <div ref={overlayRef} className="auth-overlay" onClick={closeAuthModal}></div>
      <div ref={modalRef} className="auth-modal">
        <div className="auth-modal-header">
          <h2 className="auth-modal-title">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <button onClick={closeAuthModal} className="auth-close-btn" aria-label="Close">
            ✕
          </button>
        </div>

        <div className="auth-modal-content">
          <form onSubmit={handleSubmit} className="auth-form">
            {mode === 'signup' && (
              <div className="auth-form-row">
                <div className="auth-form-group">
                  <label htmlFor="firstName" className="auth-label">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="auth-input"
                    required={mode === 'signup'}
                  />
                </div>
                <div className="auth-form-group">
                  <label htmlFor="lastName" className="auth-label">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="auth-input"
                  />
                </div>
              </div>
            )}

            <div className="auth-form-group">
              <label htmlFor="email" className="auth-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="auth-input"
                required
                autoComplete="email"
              />
            </div>

            <div className="auth-form-group">
              <label htmlFor="password" className="auth-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth-input"
                required
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                minLength={6}
              />
            </div>

            {mode === 'login' && (
              <div className="auth-form-group auth-checkbox-group">
                <label className="auth-checkbox-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="auth-checkbox"
                  />
                  <span>Remember me</span>
                </label>
              </div>
            )}

            {error && <div className="auth-error">{error}</div>}

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={isSubmitting || state.isLoading}
            >
              {isSubmitting || state.isLoading
                ? 'Please wait...'
                : mode === 'login'
                ? 'Sign In'
                : 'Create Account'}
            </button>
          </form>

          <div className="auth-divider">
            <span>or</span>
          </div>

          <button onClick={switchMode} className="auth-switch-btn">
            {mode === 'login'
              ? "Don't have an account? Sign up"
              : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </>
  );
};

export default AuthModal;
