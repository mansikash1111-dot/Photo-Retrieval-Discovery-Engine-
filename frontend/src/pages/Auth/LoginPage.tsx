import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  SearchCode, 
  Mail, 
  Lock, 
  User as UserIcon, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signup, isAuthenticated } = useAuth();

  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Redirect if already logged in
  const from = (location.state as any)?.from?.pathname || '/mvp/retrieval';

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const validateForm = (): boolean => {
    setErrorMessage(null);
    setSuccessMessage(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorMessage('Please enter your email address.');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setErrorMessage('Please enter a valid email address (e.g. user@googlephotos.com).');
      return false;
    }

    if (!password) {
      setErrorMessage('Please enter your password.');
      return false;
    }

    if (isSignUp) {
      if (password.length < 6) {
        setErrorMessage('Password must be at least 6 characters long.');
        return false;
      }
      if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
        setErrorMessage('Password must contain at least one letter and one number.');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      if (isSignUp) {
        await signup({
          email: email.trim(),
          password,
          full_name: fullName.trim() || undefined
        });
        setSuccessMessage('Account created successfully! Redirecting...');
      } else {
        await login({
          email: email.trim(),
          password
        });
        setSuccessMessage('Login successful! Welcome back.');
      }

      setTimeout(() => {
        navigate(from, { replace: true });
      }, 500);
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      await login({
        email: 'demo@googlephotos.com',
        password: 'Password123'
      });
      setSuccessMessage('Demo user logged in successfully! Redirecting...');
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Could not log in with demo credentials. Please try signing up.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(ellipse at top, #1E293B 0%, #0F172A 50%, #0B0F19 100%)',
      fontFamily: 'var(--font-sans)',
      padding: '1.5rem'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '460px',
        background: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '1.25rem',
        padding: '2.5rem 2rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 35px rgba(56, 189, 248, 0.15)',
        color: '#F8FAFC'
      }}>
        {/* Header Logo */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '3.25rem',
            height: '3.25rem',
            borderRadius: '1rem',
            background: 'linear-gradient(135deg, #0EA5E9 0%, #2563EB 100%)',
            boxShadow: '0 10px 20px -5px rgba(14, 165, 233, 0.4)',
            marginBottom: '0.75rem'
          }}>
            <SearchCode size={28} style={{ color: '#FFFFFF' }} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'var(--font-heading)', color: '#FFFFFF', margin: 0 }}>
            Google Photos Discovery
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#94A3B8', marginTop: '0.35rem' }}>
            PM Case Study & AI Smart Photo Retrieval Engine
          </p>
        </div>

        {/* Auth Mode Toggle Tabs */}
        <div style={{
          display: 'flex',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '0.75rem',
          padding: '0.25rem',
          marginBottom: '1.5rem',
          border: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          <button
            type="button"
            onClick={() => { setIsSignUp(false); setErrorMessage(null); setSuccessMessage(null); }}
            style={{
              flex: 1,
              padding: '0.6rem 1rem',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              background: !isSignUp ? 'var(--accent-blue, #2563EB)' : 'transparent',
              color: !isSignUp ? '#FFFFFF' : '#94A3B8'
            }}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => { setIsSignUp(true); setErrorMessage(null); setSuccessMessage(null); }}
            style={{
              flex: 1,
              padding: '0.6rem 1rem',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              background: isSignUp ? 'var(--accent-blue, #2563EB)' : 'transparent',
              color: isSignUp ? '#FFFFFF' : '#94A3B8'
            }}
          >
            Sign Up
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem',
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '0.65rem',
            padding: '0.75rem 1rem',
            marginBottom: '1.25rem',
            color: '#FCA5A5',
            fontSize: '0.85rem'
          }}>
            <AlertCircle size={18} style={{ color: '#EF4444', flexShrink: 0, marginTop: '2px' }} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMessage && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            background: 'rgba(34, 197, 94, 0.12)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            borderRadius: '0.65rem',
            padding: '0.75rem 1rem',
            marginBottom: '1.25rem',
            color: '#86EFAC',
            fontSize: '0.85rem'
          }}>
            <CheckCircle2 size={18} style={{ color: '#22C55E', flexShrink: 0 }} />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {isSignUp && (
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.35rem' }}>
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <UserIcon size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
                <input
                  type="text"
                  placeholder="e.g. Alex Rivera"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.7rem 0.85rem 0.7rem 2.5rem',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '0.6rem',
                    color: '#FFFFFF',
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>
          )}

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.35rem' }}>
              Email Address <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.7rem 0.85rem 0.7rem 2.5rem',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '0.6rem',
                  color: '#FFFFFF',
                  fontSize: '0.9rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.35rem' }}>
              Password <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder={isSignUp ? 'Min 6 chars, 1 letter, 1 number' : 'Enter your password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.7rem 2.5rem 0.7rem 2.5rem',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '0.6rem',
                  color: '#FFFFFF',
                  fontSize: '0.9rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.85rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#64748B',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '0.8rem',
              borderRadius: '0.65rem',
              border: 'none',
              background: 'linear-gradient(135deg, #0EA5E9 0%, #2563EB 100%)',
              color: '#FFFFFF',
              fontWeight: 600,
              fontSize: '0.95rem',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 14px rgba(14, 165, 233, 0.3)',
              opacity: isSubmitting ? 0.7 : 1,
              transition: 'all 0.2s ease'
            }}
          >
            <span>{isSubmitting ? 'Processing...' : isSignUp ? 'Create Account' : 'Log In'}</span>
            {!isSubmitting && <ArrowRight size={18} />}
          </button>
        </form>

        {/* Divider & Quick Demo Access */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          margin: '1.5rem 0 1rem 0'
        }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.1)' }} />
          <span style={{ fontSize: '0.75rem', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            OR QUICK TEST
          </span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.1)' }} />
        </div>

        <button
          type="button"
          onClick={handleDemoLogin}
          disabled={isSubmitting}
          style={{
            width: '100%',
            padding: '0.7rem',
            borderRadius: '0.65rem',
            border: '1px dashed rgba(56, 189, 248, 0.4)',
            background: 'rgba(56, 189, 248, 0.08)',
            color: '#38BDF8',
            fontWeight: 600,
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s ease'
          }}
        >
          <Sparkles size={16} />
          <span>One-Click Demo Login (demo@googlephotos.com)</span>
        </button>

        <div style={{
          marginTop: '1.5rem',
          textAlign: 'center',
          fontSize: '0.75rem',
          color: '#64748B',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.35rem'
        }}>
          <ShieldCheck size={14} style={{ color: '#22C55E' }} />
          <span>Secure PBKDF2 Session Hashing & Local Session Storage</span>
        </div>
      </div>
    </div>
  );
};
