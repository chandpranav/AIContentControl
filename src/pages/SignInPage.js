// src/pages/SignInPage.js
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function SignInPage() {
  const navigate = useNavigate();

  // ─── state ──────────────────────────────────────────────────────────────
  const [email,        setEmail]        = useState('');
  const [password,     setPassword]     = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [animateIn,    setAnimateIn]    = useState(false);

  // banner: { text, type: 'error' | 'success' }
  const [banner,       setBanner]       = useState(null);

  useEffect(() => setAnimateIn(true), []);

  // ─── submit ─────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setBanner(null);

    try {
      const res  = await fetch('http://localhost:5000/api/auth/signin', {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.ok) {
        setBanner({ text: 'Signed in successfully!', type: 'success' });
        localStorage.setItem('user', JSON.stringify(data.user));
        setTimeout(() => navigate('/dashboard'), 800);
      } else {
        setBanner({ text: data.error || 'Sign-in failed', type: 'error' });
      }
    } catch (err) {
      console.error(err);
      setBanner({ text: 'Unable to reach server', type: 'error' });
    }
  };

  return (
    <>
      {/* keyframes */}
      <style>{`
        @keyframes bgMove {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes pulse {
          0%   { box-shadow: 0 0 0 0 rgba(155,92,255,.4); }
          70%  { box-shadow: 0 0 0 10px rgba(155,92,255,0); }
          100% { box-shadow: 0 0 0 0 rgba(155,92,255,0); }
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
            opacity  : animateIn ? 1 : 0,
          }}
        >
          <h1 style={styles.heading}>Sign in to AI Control</h1>

          {/* banner */}
          {banner && (
            <div
              style={{
                ...styles.banner,
                backgroundColor:
                  banner.type === 'error' ? '#ffeded' : '#e6fff2',
                color:
                  banner.type === 'error' ? '#d30000' : '#079455',
              }}
            >
              {banner.text}
            </div>
          )}

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

            <button type="submit" style={styles.button}>
              Sign In
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

/* ─── styles ───────────────────────────────────────────────────────────────*/
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
  heading: { fontSize: '1.8rem', marginBottom: '1.5rem', color: '#241c15' },
  banner: {
    padding: '.75rem 1rem',
    borderRadius: 6,
    fontSize: '.9rem',
    fontWeight: 500,
    marginBottom: '1.25rem',
  },
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
