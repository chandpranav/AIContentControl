import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

// We'll define inline <style> for keyframes or you can put them in an external CSS file
function SignUpPage() {
  const navigate = useNavigate();

  const [businessEmail, setBusinessEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Show/hide password
  const [showPassword, setShowPassword] = useState(false);

  // Controls the fade-in/slide-up animation
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    // Trigger the form animation once component mounts
    setAnimateIn(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      businessEmail,
      username,
      password,
    };
  
    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
  
      const result = await response.json();
      if (response.ok) {
        alert('✅ User successfully inserted into database!');
        console.log('Inserted user:', result.user);
        navigate('/dashboard'); // only navigate on success
      } else {
        alert('❌ Error inserting user!');
        console.error(result.error);
      }
    } catch (error) {
      alert('❌ Failed to connect to server.');
      console.error('Network or server error:', error);
    }
    
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
            // If animateIn is true, final styles; otherwise, initial hidden state
            transform: animateIn ? 'translateY(0)' : 'translateY(20px)',
            opacity: animateIn ? 1 : 0,
          }}
        >
          <h1 style={styles.heading}>Sign up for AI Control</h1>
          <p style={styles.subheading}>
            Create a free account or <a href="/signin" style={styles.link}>log in</a>
          </p>

          <form onSubmit={handleSubmit} style={styles.form}>
            {/* Business Email */}
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={businessEmail}
              onChange={(e) => setBusinessEmail(e.target.value)}
              style={styles.input}
              required
            />

            {/* Username */}
            <label style={styles.label}>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.input}
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
                required
              />
              <span
                style={styles.showHideBtn}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </span>
            </div>

            {/* Confirm Password + Show/Hide */}
            <label style={styles.label}>Confirm Password</label>
            <div style={styles.passwordContainer}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{ ...styles.input, marginBottom: 0 }}
                required
              />
              <span
                style={styles.showHideBtn}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </span>
            </div>

            {/* Submit Button */}
            <button type="submit" style={styles.button}>
              Sign Up
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
    // Animated gradient background
    background: 'linear-gradient(270deg, #9b5cff, #121212)',
    backgroundSize: '400% 400%',
    animation: 'bgMove 12s ease infinite', // matches the @keyframes "bgMove" above
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Helvetica, Arial, sans-serif',
  },
  formWrapper: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    width: '400px',
    padding: '2rem',
    transition: 'transform 0.5s ease, opacity 0.5s ease', // smooth transition
  },
  heading: {
    fontSize: '1.5rem',
    marginBottom: '0.5rem',
    color: '#241c15',
  },
  subheading: {
    fontSize: '0.9rem',
    color: '#444',
    marginBottom: '1.5rem',
  },
  link: {
    color: '#007c89',
    textDecoration: 'none',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontWeight: 500,
    marginBottom: '0.3rem',
    color: '#241c15',
  },
  input: {
    border: '1px solid #d2d2d2',
    borderRadius: '4px',
    padding: '0.75rem',
    marginBottom: '1rem',
    fontSize: '1rem',
  },
  backButtonContainer: {
    position: 'absolute',
    top: '20px',
    left: '20px',
  },
  backButton: {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '1rem',
    padding: '8px 12px',
    borderRadius: '4px',
    transition: 'opacity 0.2s ease',
    ':hover': {
      opacity: 0.8,
    },
  },
  passwordContainer: {
    position: 'relative',
    marginBottom: '1.5rem',
  },
  showHideBtn: {
    position: 'absolute',
    right: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#007c89',
    fontSize: '0.9rem',
    cursor: 'pointer',
  },
  button: {
    padding: '0.75rem',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#007c89',
    color: '#fff',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
  },
};

export default SignUpPage;
