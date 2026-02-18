import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function LandingPage() {
  // State to handle hover effects
  const [hoveredButton, setHoveredButton] = useState(null);
  
  // State for background animation
  const [scrollPosition, setScrollPosition] = useState(0);
  // State for features section
  const [activeFeature, setActiveFeature] = useState(0);

  // Handle scroll for parallax effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Auto-rotate through features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, []);

  // Features data
  const features = [
    {
      title: "Personalized Recommendations",
      description: "Get AI-powered suggestions tailored to your specific interests and goals."
    },
    {
      title: "Smart Feed Curation",
      description: "Gradually transform your social media experience with strategic engagement patterns."
    },
    {
      title: "Cross-Platform Support",
      description: "Works with Instagram, Facebook, YouTube, and more platforms seamlessly."
    }
  ];

  // Platforms supported
  const platforms = ['Instagram', 'Facebook', 'YouTube'];

  return (
    <div style={styles.container}>
      {/* Animated background elements */}
      <div style={styles.backgroundGradient} />
      <div 
        className="moving-gradient" 
        style={{
          ...styles.movingGradient,
          transform: `translateY(${scrollPosition * 0.2}px)`,
        }} 
      />
      
      {/* Top Navigation */}
      <nav style={styles.navbar}>
        <div style={styles.navLinks}>
          <a href="#features" style={styles.navItem}>Features</a>
          <a href="#platforms" style={styles.navItem}>Platforms</a>
          <a href="#how-it-works" style={styles.navItem}>How It Works</a>
        </div>

        <div style={styles.navActions}>
          <Link 
            to="/signin" 
            style={styles.navLink}
            onMouseEnter={() => setHoveredButton('signin')}
            onMouseLeave={() => setHoveredButton(null)}
          >
            Sign in 
            <span style={{
              ...styles.navArrow,
              transform: hoveredButton === 'signin' ? 'translateX(3px)' : 'translateX(0)',
            }}>→</span>
          </Link>
          <Link 
            to="/signup" 
            style={{...styles.navLink, ...styles.signUpButton}}
            onMouseEnter={() => setHoveredButton('signup')}
            onMouseLeave={() => setHoveredButton(null)}
          >
            Sign up 
            <span style={{
              ...styles.navArrow,
              transform: hoveredButton === 'signup' ? 'translateX(3px)' : 'translateX(0)',
            }}>→</span>
          </Link>
        </div>
      </nav>

      {/* Hero Content */}
      <div style={styles.heroSection}>
        <div style={styles.heroContent}>
          <h1 style={styles.title}>Transform Your <span style={styles.highlight}>Social Media</span> Experience</h1>
          <p style={styles.subtitle}>
            Get AI-powered recommendations to curate your perfect social media experience. 
            Select your platform, describe your current and desired content, 
            and let AI guide your transformation.
          </p>

          {/* Primary CTA Buttons */}
          <div style={styles.buttonRow}>
            <Link 
              to="/signup" 
              style={styles.primaryButton}
              onMouseEnter={() => setHoveredButton('primary')}
              onMouseLeave={() => setHoveredButton(null)}
            >
              Get Started 
              <span style={{
                ...styles.buttonArrow,
                transform: hoveredButton === 'primary' ? 'translateX(5px)' : 'translateX(0)',
              }}>→</span>
            </Link>
            <Link 
              to="https://youtu.be/dOPXb4FNGmo" 
              style={styles.secondaryButton}
              onMouseEnter={() => setHoveredButton('secondary')}
              onMouseLeave={() => setHoveredButton(null)}
            >
              Watch Demo
              <span style={{
                ...styles.buttonArrow,
                transform: hoveredButton === 'secondary' ? 'translateX(5px)' : 'translateX(0)',
              }}>→</span>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div id="features" style={styles.featuresSection}>
        <h2 style={styles.sectionTitle}>Key Features</h2>
        <div style={styles.featuresContainer}>
          {features.map((feature, index) => (
            <div 
              key={index} 
              style={{
                ...styles.featureCard,
                opacity: activeFeature === index ? 1 : 0.7,
                transform: activeFeature === index ? 'scale(1.05)' : 'scale(1)',
                boxShadow: activeFeature === index ? 
                  '0 10px 30px rgba(0, 0, 0, 0.15), 0 0 20px rgba(155, 92, 255, 0.2)' : 
                  '0 5px 15px rgba(0, 0, 0, 0.1), 0 0 10px rgba(155, 92, 255, 0.1)'
              }}
              onClick={() => setActiveFeature(index)}
            >
              <div style={styles.featureIcon}>
                {index === 0 && '✨'}
                {index === 1 && '🔄'}
                {index === 2 && '🌐'}
              </div>
              <h3 style={styles.featureTitle}>{feature.title}</h3>
              <p style={styles.featureDescription}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Platforms Section */}
      <div id="platforms" style={styles.platformsSection}>
        <h2 style={styles.sectionTitle}>Supported Platforms</h2>
        <div style={styles.platformsGrid}>
          {platforms.map((platform, index) => (
            <div key={index} style={styles.platformCard}>
              <div style={styles.platformIcon}>{platform.charAt(0)}</div>
              <span style={styles.platformName}>{platform}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* How It Works Section */}
      <div id="how-it-works" style={styles.howItWorksSection}>
        <h2 style={styles.sectionTitle}>How It Works</h2>
        <div style={styles.stepsContainer}>
          <div style={styles.step}>
            <div style={styles.stepNumber}>1</div>
            <h3 style={styles.stepTitle}>Select Your Platform</h3>
            <p style={styles.stepDescription}>Choose the social media platform you want to transform.</p>
          </div>
          <div style={styles.stepDivider}></div>
          <div style={styles.step}>
            <div style={styles.stepNumber}>2</div>
            <h3 style={styles.stepTitle}>Describe Your Content</h3>
            <p style={styles.stepDescription}>Tell us what you currently see and what you'd prefer to see.</p>
          </div>
          <div style={styles.stepDivider}></div>
          <div style={styles.step}>
            <div style={styles.stepNumber}>3</div>
            <h3 style={styles.stepTitle}>Get AI Recommendations</h3>
            <p style={styles.stepDescription}>Receive personalized strategies to reshape your feed.</p>
          </div>
        </div>
        <div style={styles.ctaContainer}>
          <Link to="/signup" style={styles.ctaButton}>
            Start Your Transformation
            <span style={styles.buttonArrow}>→</span>
          </Link>
        </div>
      </div>
      
    </div>
  );
}

// Enhanced styles
const styles = {
  container: {
    minHeight: '100vh',
    height: 'auto',
    position: 'relative',
    color: '#ffffff',
    fontFamily: "'Poppins', sans-serif",
    overflow: 'hidden',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
    zIndex: -3,
  },
  movingGradient: {
    position: 'absolute',
    top: '-50%',
    left: '-20%',
    width: '140%',
    height: '200%',
    background: 'radial-gradient(ellipse at center, rgba(155, 92, 255, 0.4) 0%, rgba(155, 92, 255, 0) 70%)',
    zIndex: -1,
    transition: 'transform 0.3s ease-out',
  },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem 2.5rem',
    position: 'relative',
    zIndex: 1,
  },
  navLinks: {
    display: 'flex',
    gap: '2rem',
  },
  navItem: {
    color: '#fff',
    textDecoration: 'none',
    fontWeight: '500',
    position: 'relative',
    paddingBottom: '5px',
    transition: 'all 0.2s ease',
  },
  navActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  navLink: {
    textDecoration: 'none',
    color: '#fff',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    padding: '0.6rem 1.2rem',
    borderRadius: '6px',
    fontWeight: '500',
    letterSpacing: '0.5px',
    display: 'flex',
    alignItems: 'center',
    transition: 'all 0.2s ease',
  },
  signUpButton: {
    backgroundColor: 'rgba(155, 92, 255, 0.2)',
    border: '1px solid rgba(155, 92, 255, 0.4)',
    boxShadow: '0 2px 10px rgba(155, 92, 255, 0.2)',
  },
  navArrow: {
    marginLeft: '5px',
    fontWeight: 'bold',
    transition: 'transform 0.2s ease',
  },
  heroSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '4rem 2.5rem',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  heroContent: {
    maxWidth: '600px',
    padding: '2rem',
    backdropFilter: 'blur(10px)',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '16px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2), 0 0 20px rgba(155, 92, 255, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    position: 'relative',
    zIndex: 1,
  },
  title: {
    fontSize: '3.2rem',
    fontWeight: '700',
    marginBottom: '1rem',
    lineHeight: '1.2',
  },
  highlight: {
    background: 'linear-gradient(to right, #ffffff, #9b5cff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textShadow: '0 2px 10px rgba(155, 92, 255, 0.3)',
  },
  subtitle: {
    fontSize: '1.2rem',
    lineHeight: '1.8',
    marginBottom: '2.5rem',
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '300',
    letterSpacing: '0.3px',
  },
  buttonRow: {
    display: 'flex',
    gap: '1.5rem',
  },
  primaryButton: {
    textDecoration: 'none',
    color: '#121212',
    backgroundColor: '#ffffff',
    padding: '0.9rem 2rem',
    borderRadius: '8px',
    fontWeight: '600',
    letterSpacing: '0.5px',
    display: 'flex',
    alignItems: 'center',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2), 0 0 20px rgba(155, 92, 255, 0.3)',
    transition: 'all 0.3s ease',
    border: '1px solid rgba(255, 255, 255, 0.8)',
    position: 'relative',
    overflow: 'hidden',
  },
  secondaryButton: {
    textDecoration: 'none',
    color: '#ffffff',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: '0.9rem 2rem',
    borderRadius: '8px',
    fontWeight: '600',
    letterSpacing: '0.5px',
    display: 'flex',
    alignItems: 'center',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(8px)',
  },
  buttonArrow: {
    marginLeft: '8px',
    fontWeight: 'bold',
    transition: 'transform 0.2s ease',
  },
  featuresSection: {
    padding: '5rem 2.5rem',
    backgroundColor: 'rgba(20, 20, 30, 0.7)',
    backdropFilter: 'blur(10px)',
    position: 'relative',
    zIndex: 1,
  },
  sectionTitle: {
    fontSize: '2.5rem',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: '3rem',
    color: '#fff',
    position: 'relative',
  },
  featuresContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  featureCard: {
    backgroundColor: 'rgba(40, 40, 60, 0.8)',
    borderRadius: '12px',
    padding: '2rem',
    flex: '1',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  },
  featureIcon: {
    fontSize: '2.5rem',
    marginBottom: '1rem',
  },
  featureTitle: {
    fontSize: '1.3rem',
    fontWeight: '600',
    marginBottom: '1rem',
    color: '#fff',
  },
  featureDescription: {
    fontSize: '1rem',
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: '1.6',
  },
  platformsSection: {
    padding: '5rem 2.5rem',
    position: 'relative',
    zIndex: 1,
  },
  platformsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  platformCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'rgba(40, 40, 60, 0.8)',
    borderRadius: '12px',
    padding: '2rem',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    transition: 'all 0.3s ease',
  },
  platformIcon: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: 'rgba(155, 92, 255, 0.2)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '1.8rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
  },
  platformName: {
    fontSize: '1.2rem',
    fontWeight: '500',
    color: '#fff',
  },
  howItWorksSection: {
    padding: '5rem 2.5rem',
    backgroundColor: 'rgba(20, 20, 30, 0.7)',
    backdropFilter: 'blur(10px)',
    position: 'relative',
    zIndex: 1,
  },
  stepsContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: '1200px',
    margin: '0 auto 3rem auto',
  },
  step: {
    flex: '1',
    textAlign: 'center',
    padding: '2rem',
  },
  stepNumber: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: 'rgba(155, 92, 255, 0.8)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '0 auto 1.5rem auto',
    fontWeight: 'bold',
  },
  stepTitle: {
    fontSize: '1.3rem',
    fontWeight: '600',
    marginBottom: '1rem',
    color: '#fff',
  },
  stepDescription: {
    fontSize: '1rem',
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: '1.6',
  },
  stepDivider: {
    width: '80px',
    height: '2px',
    backgroundImage: 'linear-gradient(to right, rgba(155, 92, 255, 0.1), rgba(155, 92, 255, 0.8), rgba(155, 92, 255, 0.1))',
    position: 'relative',
  },
  ctaContainer: {
    textAlign: 'center',
    marginTop: '3rem',
  },
  ctaButton: {
    textDecoration: 'none',
    color: '#fff',
    backgroundColor: 'rgba(155, 92, 255, 0.8)',
    padding: '1rem 2.5rem',
    borderRadius: '8px',
    fontWeight: '600',
    letterSpacing: '0.5px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2), 0 0 20px rgba(155, 92, 255, 0.3)',
    transition: 'all 0.3s ease',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(8px)',
    cursor: 'pointer',
  },
};

export default LandingPage;
