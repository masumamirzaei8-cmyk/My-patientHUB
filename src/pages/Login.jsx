import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validateEmail, validatePassword } from '../utils/validation';
import { Eye, EyeOff } from 'lucide-react';
import '../styles/auth.css';

const Login = () => {
  const navigate = useNavigate();
  const { login, register, isAuthenticated } = useAuth();
  
  // Form mode: 'signin' or 'signup' or 'forgot'
  const [mode, setMode] = useState('signin');
  
  // Sign In state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  // Sign Up state
  const [signUpData, setSignUpData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Forgot Password state
  const [forgotEmail, setForgotEmail] = useState('');
  
  // Common state
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Clear errors when switching modes
  useEffect(() => {
    setErrors({});
    setSuccess('');
  }, [mode]);

  // Handle Sign In
  const handleSignIn = (e) => {
    e.preventDefault();
    const newErrors = {};
    
    const emailResult = validateEmail(email);
    if (!emailResult.valid) newErrors.email = emailResult.message;
    
    const passResult = validatePassword(password);
    if (!passResult.valid) newErrors.password = passResult.message;
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    setTimeout(() => {
      const result = login(email, password);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setErrors({ general: result.message });
      }
      setLoading(false);
    }, 500);
  };

  // Handle Sign Up
  const handleSignUp = (e) => {
    e.preventDefault();
    const newErrors = {};
    
    if (!signUpData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    const emailResult = validateEmail(signUpData.email);
    if (!emailResult.valid) newErrors.email = emailResult.message;
    
    const passResult = validatePassword(signUpData.password);
    if (!passResult.valid) newErrors.password = passResult.message;
    
    if (signUpData.password !== signUpData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    setTimeout(() => {
      const result = register(signUpData.fullName, signUpData.email, signUpData.password);
      if (result.success) {
        setSuccess('Account created successfully! Please sign in.');
        setTimeout(() => {
          setMode('signin');
          setEmail(signUpData.email);
          setSignUpData({ fullName: '', email: '', password: '', confirmPassword: '' });
        }, 1500);
      } else {
        setErrors({ general: result.message });
      }
      setLoading(false);
    }, 500);
  };

  // Handle Forgot Password
  const handleForgotPassword = (e) => {
    e.preventDefault();
    const emailResult = validateEmail(forgotEmail);
    if (!emailResult.valid) {
      setErrors({ forgotEmail: emailResult.message });
      return;
    }
    
    setLoading(true);
    setTimeout(() => {
      setSuccess('If an account exists with this email, you will receive password reset instructions. (Demo - no actual email sent)');
      setForgotEmail('');
      setLoading(false);
      setTimeout(() => setMode('signin'), 3000);
    }, 500);
  };

  // Handle Social Login
  const handleSocialLogin = (provider) => {
    alert(`${provider} login is not configured in this demo application. Please use email and password to sign in.`);
  };

  // Update sign up field
  const updateSignUpField = (field, value) => {
    setSignUpData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="auth-page">
      {/* Colorful Banner */}
      <div className="auth-banner">
        <div className="auth-banner-shape shape-1"></div>
        <div className="auth-banner-shape shape-2"></div>
        <div className="auth-banner-shape shape-3"></div>
        <div className="auth-banner-content">
          <h1 className="auth-banner-title">Welcome to MyPatientHUB!</h1>
          <p className="auth-banner-subtitle">We provide smart healthcare services in your hands</p>
        </div>
      </div>

      {/* Auth Card */}
      <div className="auth-card-container">
        <div className="auth-card">
          {/* Sign In Form */}
          {mode === 'signin' && (
            <>
              <div className="auth-card-header">
                <h2 className="auth-card-title">Sign in to MyPatientHUB</h2>
              </div>

              {errors.general && (
                <div className="auth-error-message">
                  {errors.general}
                </div>
              )}

              {success && (
                <div className="auth-success-message">
                  {success}
                </div>
              )}

              {/* Social Login Buttons */}
              <div className="auth-social-buttons">
                <button
                  type="button"
                  onClick={() => handleSocialLogin('Facebook')}
                  className="auth-social-btn facebook-btn"
                >
                  <svg className="auth-social-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span>Facebook</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSocialLogin('Google')}
                  className="auth-social-btn google-btn"
                >
                  <svg className="auth-social-icon" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>Google</span>
                </button>
              </div>

              {/* Sign In Form */}
              <form onSubmit={handleSignIn} className="auth-form">
                <div className="auth-form-group">
                  <label className="auth-label">Email Address</label>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors({ ...errors, email: '' });
                    }}
                    placeholder="yourname@gmail.com"
                    className={`auth-input ${errors.email ? 'auth-input-error' : ''}`}
                  />
                  {errors.email && <p className="auth-field-error">{errors.email}</p>}
                </div>

                <div className="auth-form-group">
                  <label className="auth-label">Password</label>
                  <div className="auth-input-wrapper">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) setErrors({ ...errors, password: '' });
                      }}
                      placeholder="Please enter your password"
                      className={`auth-input ${errors.password ? 'auth-input-error' : ''}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="auth-password-toggle"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && <p className="auth-field-error">{errors.password}</p>}
                </div>

                <div className="auth-form-options">
                  <label className="auth-checkbox-wrapper">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="auth-checkbox"
                    />
                    <span className="auth-checkbox-label">Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="auth-link"
                  >
                    Forgot password?
                  </button>
                </div>

                <button type="submit" disabled={loading} className="auth-btn auth-btn-primary">
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>

              {/* Divider */}
              <div className="auth-divider">
                <span>or</span>
              </div>

              {/* Sign Up Button */}
              <button
                type="button"
                onClick={() => setMode('signup')}
                className="auth-btn auth-btn-secondary"
              >
                Sign Up
              </button>
            </>
          )}

          {/* Sign Up Form */}
          {mode === 'signup' && (
            <>
              <div className="auth-card-header">
                <h2 className="auth-card-title">Create Your Account</h2>
              </div>

              {errors.general && (
                <div className="auth-error-message">
                  {errors.general}
                </div>
              )}

              {success && (
                <div className="auth-success-message">
                  {success}
                </div>
              )}

              <form onSubmit={handleSignUp} className="auth-form">
                <div className="auth-form-group">
                  <label className="auth-label">Full Name</label>
                  <input
                    type="text"
                    value={signUpData.fullName}
                    onChange={(e) => updateSignUpField('fullName', e.target.value)}
                    placeholder="Enter your full name"
                    className={`auth-input ${errors.fullName ? 'auth-input-error' : ''}`}
                  />
                  {errors.fullName && <p className="auth-field-error">{errors.fullName}</p>}
                </div>

                <div className="auth-form-group">
                  <label className="auth-label">Email Address</label>
                  <input
                    type="text"
                    value={signUpData.email}
                    onChange={(e) => updateSignUpField('email', e.target.value)}
                    placeholder="yourname@gmail.com"
                    className={`auth-input ${errors.email ? 'auth-input-error' : ''}`}
                  />
                  {errors.email && <p className="auth-field-error">{errors.email}</p>}
                </div>

                <div className="auth-form-group">
                  <label className="auth-label">Password</label>
                  <div className="auth-input-wrapper">
                    <input
                      type={showSignUpPassword ? 'text' : 'password'}
                      value={signUpData.password}
                      onChange={(e) => updateSignUpField('password', e.target.value)}
                      placeholder="Create a password (4 characters)"
                      className={`auth-input ${errors.password ? 'auth-input-error' : ''}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                      className="auth-password-toggle"
                    >
                      {showSignUpPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && <p className="auth-field-error">{errors.password}</p>}
                </div>

                <div className="auth-form-group">
                  <label className="auth-label">Confirm Password</label>
                  <div className="auth-input-wrapper">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={signUpData.confirmPassword}
                      onChange={(e) => updateSignUpField('confirmPassword', e.target.value)}
                      placeholder="Confirm your password"
                      className={`auth-input ${errors.confirmPassword ? 'auth-input-error' : ''}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="auth-password-toggle"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="auth-field-error">{errors.confirmPassword}</p>}
                </div>

                <button type="submit" disabled={loading} className="auth-btn auth-btn-primary">
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>

              <div className="auth-switch-mode">
                <span>Already have an account? </span>
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className="auth-link"
                >
                  Sign In
                </button>
              </div>
            </>
          )}

          {/* Forgot Password Form */}
          {mode === 'forgot' && (
            <>
              <div className="auth-card-header">
                <h2 className="auth-card-title">Forgot Password?</h2>
                <p className="auth-card-subtitle">Enter your email to receive password reset instructions</p>
              </div>

              {errors.general && (
                <div className="auth-error-message">
                  {errors.general}
                </div>
              )}

              {success && (
                <div className="auth-success-message">
                  {success}
                </div>
              )}

              <form onSubmit={handleForgotPassword} className="auth-form">
                <div className="auth-form-group">
                  <label className="auth-label">Email Address</label>
                  <input
                    type="text"
                    value={forgotEmail}
                    onChange={(e) => {
                      setForgotEmail(e.target.value);
                      if (errors.forgotEmail) setErrors({ ...errors, forgotEmail: '' });
                    }}
                    placeholder="yourname@gmail.com"
                    className={`auth-input ${errors.forgotEmail ? 'auth-input-error' : ''}`}
                  />
                  {errors.forgotEmail && <p className="auth-field-error">{errors.forgotEmail}</p>}
                </div>

                <button type="submit" disabled={loading} className="auth-btn auth-btn-primary">
                  {loading ? 'Sending...' : 'Send Reset Instructions'}
                </button>
              </form>

              <div className="auth-switch-mode">
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className="auth-link"
                >
                  ← Back to Sign In
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="auth-footer">
        <div className="auth-footer-links">
          <a href="#" className="auth-footer-link">Google Play Store APP</a>
          <a href="#" className="auth-footer-link">App Store APP</a>
          <a href="#" className="auth-footer-link">About MyPatientHUB</a>
          <a href="#" className="auth-footer-link">About Us</a>
          <a href="#" className="auth-footer-link">Our Blog</a>
        </div>
      </footer>
    </div>
  );
};

export default Login;
