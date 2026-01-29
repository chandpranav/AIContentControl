import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/common/Toast';

function SignInPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signin, isAuthenticated } = useAuth();
  const toast = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  useEffect(() => setAnimateIn(true), []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signin(email, password);
      toast.success('Signed in successfully!');
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Sign in error:', error);
      toast.error(error.error?.message || 'Sign-in failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes bgMove {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      <div style={styles.container}>
        <div style={styles.backButtonContainer}>
          <Link to="/" style={styles.backButton}>← Back to Home</Link>
        </div>

        <div
          style={{
            ...styles.formWrapper,
            transform: animateIn ? 'translateY(0)' : 'translateY(20px)',
            opacity: animateIn ? 1 : 0,
          }}
        >
          <h1 style={styles.heading}>Sign in to AI Control</h1>

          <p style={styles.subheading}>
            Don't have an account? <Link to="/signup" style={styles.link}>Sign up</Link>
          </p>

          <form onSubmit={handleSubmit} style={styles.form}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              style={styles.input}
            />

            <label style={styles.label}>Password</label>
            <div style={styles.passwordContainer}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                style={{ ...styles.input, marginBottom: 0 }}
              />
              <span
                style={styles.showHideBtn}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </span>
            </div>

            <button
              type="submit"
              style={{
                ...styles.button,
                opacity: isLoading ? 0.7 : 1,
                cursor: isLoading ? 'not-allowed' : 'pointer',
              }}
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg,#0f0c29,#302b63,#24243e)',
    backgroundSize: '400% 400%',
    animation: 'bgMove 12s ease infinite',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Helvetica,Arial,sans-serif',
    position: 'relative',
    padding: '2rem',
  },
  backButtonContainer: {
    position: 'absolute',
    top: '2rem',
    left: '2rem',
  },
  backButton: {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '.9rem',
    opacity: .85,
  },
  formWrapper: {
    width: 400,
    backgroundColor: 'rgba(255,255,255,.95)',
    borderRadius: 12,
    padding: '2.5rem',
    boxShadow: '0 8px 32px rgba(0,0,0,.15)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,.2)',
    transition: 'transform .5s ease,opacity .5s ease',
  },
  heading: { fontSize: '1.8rem', marginBottom: '0.5rem', color: '#241c15' },
  subheading: { fontSize: '.9rem', color: '#555', marginBottom: '1.5rem' },
  link: { color: '#9b5cff', textDecoration: 'none' },
  form: { display: 'flex', flexDirection: 'column' },
  label: { marginBottom: '.4rem', fontSize: '.95rem', color: '#241c15' },
  input: {
    border: '1px solid #d2d2d2',
    borderRadius: 6,
    padding: '.85rem',
    fontSize: '1rem',
    marginBottom: '1.2rem',
  },
  passwordContainer: { position: 'relative', marginBottom: '1.2rem' },
  showHideBtn: {
    position: 'absolute',
    right: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '.9rem',
    color: '#9b5cff',
    cursor: 'pointer',
  },
  button: {
    padding: '.9rem',
    fontSize: '1rem',
    fontWeight: 600,
    color: '#fff',
    backgroundColor: '#9b5cff',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
    transition: 'transform .15s ease',
  },
};

export default SignInPage;
