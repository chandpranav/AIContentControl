import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function SignInPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  // Show/hide password
  const [showPassword, setShowPassword] = useState(false);
  
  // Controls the fade-in/slide-up animation
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    // Trigger the form animation once component mounts
    setAnimateIn(true);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!termsAccepted) {
      alert('Please accept the terms and conditions to continue.');
      return;
    }
    
    // After successful login:
    navigate('/dashboard');
  };

  return (
    <>
      {/* Keyframes for the animated gradient */}
      <style>
        {`
          @keyframes bgMove {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          
          @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(155, 92, 255, 0.4); }
            70% { box-shadow: 0 0 0 10px rgba(155, 92, 255, 0); }
            100% { box-shadow: 0 0 0 0 rgba(155, 92, 255, 0); }
          }
        `}
      </style>

      <div style={styles.container}>
        <div style={styles.backButtonContainer}>
          <Link to="/" style={styles.backButton}>
            ← Back to Home
          </Link>
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
            {/* Email */}
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              placeholder="Enter your email"
              required
            />

            {/* Password + Show/Hide */}
            <label style={styles.label}>Password</label>
            <div style={styles.passwordContainer}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ ...styles.input, marginBottom: 0 }}
                placeholder="Enter your password"
                required
              />
              <span
                style={styles.showHideBtn}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </span>
            </div>
            
            {/* Remember Me & Forgot Password */}
            <div style={styles.optionsRow}>
              <div style={styles.checkboxContainer}>
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  style={styles.checkbox}
                />
                <label htmlFor="rememberMe" style={styles.checkboxLabel}>
                  Remember me
                </label>
              </div>
              <a href="#" style={styles.forgotPassword}>Forgot password?</a>
            </div>
            
            {/* Terms and Conditions */}
            <div style={styles.termsContainer}>
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={() => setTermsAccepted(!termsAccepted)}
                style={styles.checkbox}
                required
              />
              <label htmlFor="terms" style={styles.termsLabel}>
                I agree to the <a href="#" style={styles.termsLink}>Terms of Service</a> and <a href="#" style={styles.termsLink}>Privacy Policy</a>
              </label>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              style={termsAccepted ? styles.button : {...styles.button, ...styles.buttonDisabled}}
              disabled={!termsAccepted}
            >
              Sign In
            </button>

          </form>
        </div>
        
        {/* Navigation Buttons */}
        <div style={styles.navigationContainer}>
          <Link to="/signup" style={styles.navButton}>
            Need an account? Sign Up
          </Link>
          <Link to="/dashboard" style={styles.navButton}>
            Go to Dashboard
          </Link>
        </div>
      </div>
    </>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
    backgroundSize: '400% 400%',
    animation: 'bgMove 12s ease infinite',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Helvetica, Arial, sans-serif',
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
    display: 'flex',
    alignItems: 'center',
    fontSize: '0.9rem',
    opacity: 0.8,
    transition: 'opacity 0.2s ease',
    '&:hover': {
      opacity: 1,
    },
  },
  formWrapper: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '12px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
    width: '400px',
    padding: '2.5rem',
    transition: 'transform 0.5s ease, opacity 0.5s ease',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  },
  heading: {
    fontSize: '1.8rem',
    marginBottom: '0.5rem',
    color: '#241c15',
    fontWeight: '600',
  },
  subheading: {
    fontSize: '0.95rem',
    color: '#555',
    marginBottom: '1.8rem',
  },
  link: {
    color: '#9b5cff',
    textDecoration: 'none',
    fontWeight: '500',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontWeight: 500,
    marginBottom: '0.4rem',
    color: '#241c15',
    fontSize: '0.95rem',
  },
  input: {
    border: '1px solid #d2d2d2',
    borderRadius: '6px',
    padding: '0.85rem',
    marginBottom: '1.2rem',
    fontSize: '1rem',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    '&:focus': {
      borderColor: '#9b5cff',
      boxShadow: '0 0 0 3px rgba(155, 92, 255, 0.2)',
      outline: 'none',
    },
  },
  passwordContainer: {
    position: 'relative',
    marginBottom: '1.2rem',
  },
  showHideBtn: {
    position: 'absolute',
    right: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#9b5cff',
    fontSize: '0.9rem',
    cursor: 'pointer',
    userSelect: 'none',
  },
  optionsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  checkboxContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  checkbox: {
    marginRight: '0.5rem',
    accentColor: '#9b5cff',
  },
  checkboxLabel: {
    fontSize: '0.9rem',
    color: '#555',
  },
  forgotPassword: {
    fontSize: '0.9rem',
    color: '#9b5cff',
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  termsContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: '1.5rem',
  },
  termsLabel: {
    fontSize: '0.85rem',
    color: '#555',
    lineHeight: '1.4',
  },
  termsLink: {
    color: '#9b5cff',
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  button: {
    padding: '0.9rem',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: '#9b5cff',
    color: '#fff',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: '#8a4ae0',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(155, 92, 255, 0.3)',
    },
    '&:active': {
      transform: 'translateY(0)',
    },
  },
  buttonDisabled: {
    backgroundColor: '#c4c4c4',
    cursor: 'not-allowed',
    '&:hover': {
      backgroundColor: '#c4c4c4',
      transform: 'none',
      boxShadow: 'none',
    },
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    margin: '1.5rem 0',
    '&::before, &::after': {
      content: '""',
      flex: 1,
      borderBottom: '1px solid #e0e0e0',
    },
  },
  dividerText: {
    padding: '0 1rem',
    color: '#777',
    fontSize: '0.9rem',
  },
  socialButton: {
    padding: '0.9rem',
    border: '1px solid #d2d2d2',
    borderRadius: '6px',
    backgroundColor: '#fff',
    color: '#333',
    fontSize: '1rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: '#f8f8f8',
      borderColor: '#bbb',
    },
  },
  navigationContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    marginTop: '2rem',
  },
  navButton: {
    padding: '0.7rem 1.2rem',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    color: '#fff',
    borderRadius: '6px',
    textDecoration: 'none',
    fontSize: '0.9rem',
    transition: 'all 0.2s ease',
    backdropFilter: 'blur(5px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.25)',
      transform: 'translateY(-2px)',
    },
  },
};

export default SignInPage;
