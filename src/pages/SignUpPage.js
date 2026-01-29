import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/common/Toast';

function SignUpPage() {
  const navigate = useNavigate();
  const { signup, isAuthenticated } = useAuth();
  const toast = useToast();

  const [businessEmail, setBusinessEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Password validation regex
  const strongPw = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => setAnimateIn(true), []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!strongPw.test(password)) {
      toast.error('Password must be at least 8 characters with uppercase, lowercase, number, and special character.');
      return;
    }

    if (password !== confirmPwd) {
      toast.error('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      await signup(businessEmail, username, password);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Signup error:', error);
      toast.error(error.error?.message || 'Signup failed');
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
        input:focus, button:focus {
          outline: 2px solid #007c89;
          outline-offset: 2px;
        }
      `}</style>

      <div style={st.container}>
        <Link to="/" style={st.backBtn}>← Home</Link>

        <div
          style={{
            ...st.card,
            transform: animateIn ? 'translateY(0)' : 'translateY(24px)',
            opacity: animateIn ? 1 : 0,
          }}
        >
          <h1 style={st.h1}>Sign Up for AI Control</h1>
          <p style={st.sub}>
            Create a free account or{' '}
            <Link to="/signin" style={st.link}>log in</Link>
          </p>

          <form onSubmit={handleSubmit} style={st.form}>
            <label style={st.label}>Email</label>
            <input
              type="email"
              value={businessEmail}
              onChange={(e) => setBusinessEmail(e.target.value)}
              style={st.input}
              required
            />

            <label style={st.label}>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={st.input}
              required
            />

            <label style={st.label}>Password</label>
            <div style={st.passWrap}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                placeholder="********"
                onChange={(e) => setPassword(e.target.value)}
                style={st.input}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={st.toggle}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>

            <label style={st.label}>Confirm Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPwd}
              placeholder="********"
              onChange={(e) => setConfirmPwd(e.target.value)}
              style={st.input}
              required
            />

            <button
              type="submit"
              style={{
                ...st.btn,
                opacity: isLoading ? 0.7 : 1,
                cursor: isLoading ? 'not-allowed' : 'pointer',
              }}
              disabled={isLoading}
            >
              {isLoading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

const st = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '1rem',
    fontFamily: 'Helvetica, Arial, sans-serif',
    background: 'linear-gradient(270deg,#9b5cff,#121212)',
    backgroundSize: '400% 400%',
    animation: 'bgMove 12s ease infinite',
  },
  backBtn: {
    position: 'absolute',
    top: 20,
    left: 20,
    color: '#fff',
    textDecoration: 'none',
    padding: '6px 10px',
    borderRadius: 4,
    fontSize: '.9rem',
    transition: 'opacity .2s',
  },
  card: {
    width: '100%',
    maxWidth: 420,
    background: '#fff',
    borderRadius: 10,
    boxShadow: '0 4px 24px rgba(0,0,0,.12)',
    padding: '2rem',
    transition: 'all .5s ease',
  },
  h1: { fontSize: '1.6rem', marginBottom: '.4rem', color: '#241c15' },
  sub: { fontSize: '.9rem', color: '#555', marginBottom: '1.4rem' },
  link: { color: '#007c89', textDecoration: 'none' },
  form: { display: 'flex', flexDirection: 'column' },
  label: { marginBottom: '.3rem', fontWeight: 600, fontSize: '.9rem', color: '#241c15' },
  input: {
    border: '1px solid #d4d4d4',
    borderRadius: 6,
    padding: '.8rem',
    fontSize: '1rem',
    marginBottom: '1.2rem',
    width: '100%',
  },
  passWrap: { position: 'relative', marginBottom: '1.2rem' },
  toggle: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    color: '#007c89',
    cursor: 'pointer',
    fontSize: '.85rem',
  },
  btn: {
    background: '#007c89',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    padding: '.9rem',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'transform .15s',
  },
};

export default SignUpPage;
