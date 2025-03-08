import React, { useState, useEffect } from 'react';

function Dashboard() {
  // Main state
  const [activeTab, setActiveTab] = useState('search');
  const [platform, setPlatform] = useState('');
  const [userInterest, setUserInterest] = useState('');
  const [targetInterest, setTargetInterest] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // History state
  const [searchHistory, setSearchHistory] = useState([]);
  
  // Account state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState({ text: '', type: '' });

  // Load search history from localStorage on initial render
  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    setSearchHistory(history);
  }, []);

  const getStrategy = async () => {
    // Basic validation
    if (!platform) {
      alert('Please select a platform!');
      return;
    }
    if (!userInterest || !targetInterest) {
      alert('Please enter both your current and desired interests!');
      return;
    }

    // Show loading state
    setIsLoading(true);
    setResponse('');

    try {
      const res = await fetch('http://localhost:5000/get-strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform, userInterest, targetInterest }),
      });
      const data = await res.json();
      
      if (data.strategy) {
        setResponse(data.strategy);
        
        // Save to history
        const newHistoryItem = {
          id: Date.now(),
          date: new Date().toLocaleString(),
          platform,
          userInterest,
          targetInterest,
          response: data.strategy
        };
        
        const updatedHistory = [newHistoryItem, ...searchHistory].slice(0, 10); // Keep only 10 most recent
        setSearchHistory(updatedHistory);
        localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
      } else {
        setResponse('Error: Could not get strategy from server.');
      }
    } catch (error) {
      console.error(error);
      setResponse('Error fetching strategy.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleHistoryItemClick = (item) => {
    setPlatform(item.platform);
    setUserInterest(item.userInterest);
    setTargetInterest(item.targetInterest);
    setResponse(item.response);
    setActiveTab('search');
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordMessage({ text: 'All fields are required', type: 'error' });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ text: 'New passwords do not match', type: 'error' });
      return;
    }
    
    // Here you would typically make an API call to change the password
    // For demo purposes, we'll just show a success message
    setPasswordMessage({ text: 'Password updated successfully', type: 'success' });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    
    // Reset message after 3 seconds
    setTimeout(() => {
      setPasswordMessage({ text: '', type: '' });
    }, 3000);
  };

  const clearForm = () => {
    setPlatform('');
    setUserInterest('');
    setTargetInterest('');
    setResponse('');
  };

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <div style={styles.logo}>AI Content Control</div>
        <div 
          style={activeTab === 'search' ? {...styles.navItem, ...styles.activeNavItem} : styles.navItem}
          onClick={() => setActiveTab('search')}
        >
          <i className="fas fa-search" style={styles.icon}></i>
          Search
        </div>
        <div 
          style={activeTab === 'history' ? {...styles.navItem, ...styles.activeNavItem} : styles.navItem}
          onClick={() => setActiveTab('history')}
        >
          <i className="fas fa-history" style={styles.icon}></i>
          History
        </div>
        <div 
          style={activeTab === 'account' ? {...styles.navItem, ...styles.activeNavItem} : styles.navItem}
          onClick={() => setActiveTab('account')}
        >
          <i className="fas fa-user-cog" style={styles.icon}></i>
          Account
        </div>
      </div>

      <div style={styles.content}>
        <header style={styles.header}>
          <h1 style={styles.heading}>
            {activeTab === 'search' && 'Customize Your Feed'}
            {activeTab === 'history' && 'Search History'}
            {activeTab === 'account' && 'Account Settings'}
          </h1>
          <div style={styles.userSection}>
            <span style={styles.userGreeting}>Hello, User!</span>
            <button style={styles.logoutButton}>Logout</button>
          </div>
        </header>

        {/* SEARCH TAB */}
        {activeTab === 'search' && (
          <div style={styles.tabContent}>
            <div style={styles.formAndResultContainer}>
              <div style={styles.formSection}>
                <p style={styles.formDescription}>
                  Describe your current and desired social media interests to get AI-powered recommendations
                </p>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>Platform</label>
                  <div style={styles.platformButtons}>
                    <button 
                      style={platform === 'Instagram' ? {...styles.platformButton, ...styles.platformButtonActive} : styles.platformButton}
                      onClick={() => setPlatform('Instagram')}
                    >
                      Instagram
                    </button>
                    <button 
                      style={platform === 'Facebook' ? {...styles.platformButton, ...styles.platformButtonActive} : styles.platformButton}
                      onClick={() => setPlatform('Facebook')}
                    >
                      Facebook
                    </button>
                    <button 
                      style={platform === 'YouTube' ? {...styles.platformButton, ...styles.platformButtonActive} : styles.platformButton}
                      onClick={() => setPlatform('YouTube')}
                    >
                      YouTube
                    </button>
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Current Feed Content</label>
                  <input
                    type="text"
                    placeholder="e.g. gaming highlights"
                    value={userInterest}
                    onChange={(e) => setUserInterest(e.target.value)}
                    style={styles.input}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Desired Feed Content</label>
                  <input
                    type="text"
                    placeholder="e.g. fitness motivation"
                    value={targetInterest}
                    onChange={(e) => setTargetInterest(e.target.value)}
                    style={styles.input}
                  />
                </div>

                <div style={styles.buttonGroup}>
                  <button onClick={getStrategy} style={styles.button} disabled={isLoading}>
                    {isLoading ? 'Generating...' : 'Get Recommendations'}
                  </button>
                  <button onClick={clearForm} style={styles.clearButton}>
                    Clear
                  </button>
                </div>
              </div>

              {/* RESPONSE SECTION */}
              {(response || isLoading) && (
                <div style={styles.responseContainer}>
                  <h3 style={styles.responseTitle}>AI Recommendations</h3>
                  {isLoading ? (
                    <div style={styles.loadingIndicator}>Generating your personalized strategy...</div>
                  ) : (
                    <div style={styles.responseContent}>
                      {response.split('\n\n').map((paragraph, index) => (
                        <p key={index} style={styles.responseParagraph}>{paragraph}</p>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* HISTORY TAB */}
        {activeTab === 'history' && (
          <div style={styles.tabContent}>
            <div style={styles.historyContainer}>
              {searchHistory.length === 0 ? (
                <div style={styles.emptyState}>
                  <p>You haven't made any searches yet.</p>
                  <button 
                    onClick={() => setActiveTab('search')} 
                    style={styles.emptyStateButton}
                  >
                    Make your first search
                  </button>
                </div>
              ) : (
                searchHistory.map((item) => (
                  <div key={item.id} style={styles.historyItem} onClick={() => handleHistoryItemClick(item)}>
                    <div style={styles.historyItemHeader}>
                      <div style={styles.historyPlatformBadge}>{item.platform}</div>
                      <div style={styles.historyDate}>{item.date}</div>
                    </div>
                    <div style={styles.historyInterests}>
                      <div style={styles.historyInterest}>
                        <span style={styles.historyInterestLabel}>From:</span> {item.userInterest}
                      </div>
                      <div style={styles.historyInterest}>
                        <span style={styles.historyInterestLabel}>To:</span> {item.targetInterest}
                      </div>
                    </div>
                    <div style={styles.historyItemFooter}>
                      <button style={styles.historyItemButton}>
                        View Results
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ACCOUNT TAB */}
        {activeTab === 'account' && (
          <div style={styles.tabContent}>
            <div style={styles.accountContainer}>
              <div style={styles.accountSection}>
                <h3 style={styles.accountSectionTitle}>Change Password</h3>
                
                {passwordMessage.text && (
                  <div style={{
                    ...styles.passwordMessage,
                    backgroundColor: passwordMessage.type === 'success' ? '#e6f7e6' : '#fce9e9',
                    color: passwordMessage.type === 'success' ? '#2e7d32' : '#d32f2f'
                  }}>
                    {passwordMessage.text}
                  </div>
                )}
                
                <form onSubmit={handlePasswordChange} style={styles.passwordForm}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Current Password</label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      style={styles.input}
                    />
                  </div>
                  
                  <div style={styles.formGroup}>
                    <label style={styles.label}>New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      style={styles.input}
                    />
                  </div>
                  
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      style={styles.input}
                    />
                  </div>
                  
                  <button type="submit" style={styles.button}>
                    Update Password
                  </button>
                </form>
              </div>
              
              <div style={styles.accountSection}>
                <h3 style={styles.accountSectionTitle}>User Preferences</h3>
                <p style={styles.comingSoonText}>Additional account settings coming soon.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Styles
const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: "'Poppins', sans-serif",
    backgroundColor: '#f8f9fc',
    color: '#333',
  },
  sidebar: {
    width: '240px',
    backgroundColor: '#fff',
    boxShadow: '0 0 15px rgba(0,0,0,0.05)',
    padding: '1.5rem 0',
    position: 'sticky',
    top: 0,
    height: '100vh',
    display: 'flex',
    flexDirection: 'column'
  },
  logo: {
    fontSize: '1.2rem',
    fontWeight: '600',
    color: '#6c63ff',
    padding: '0 1.5rem 1.5rem',
    borderBottom: '1px solid #f0f0f0',
    marginBottom: '1.5rem'
  },
  navItem: {
    padding: '0.8rem 1.5rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    transition: 'background-color 0.2s',
    fontSize: '0.95rem',
    marginBottom: '0.5rem',
    borderRadius: '0 5px 5px 0',
    color: '#555'
  },
  activeNavItem: {
    backgroundColor: '#f0f0ff',
    color: '#6c63ff',
    fontWeight: '500',
    borderLeft: '3px solid #6c63ff'
  },
  icon: {
    marginRight: '0.75rem',
    width: '20px'
  },
  content: {
    flex: 1,
    padding: '0 2rem 2rem',
    overflow: 'auto'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem 0',
    borderBottom: '1px solid #f0f0f0',
    marginBottom: '1.5rem'
  },
  heading: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#333',
    margin: 0
  },
  userSection: {
    display: 'flex',
    alignItems: 'center'
  },
  userGreeting: {
    marginRight: '1rem',
    fontSize: '0.9rem'
  },
  logoutButton: {
    padding: '0.4rem 0.8rem',
    background: 'transparent',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '0.85rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    color: '#555'
  },
  tabContent: {
    animation: 'fadeIn 0.3s ease-in',
  },
  formAndResultContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  formSection: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '1.5rem',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    flex: 1
  },
  formDescription: {
    fontSize: '0.9rem',
    marginBottom: '1.5rem',
    color: '#666'
  },
  formGroup: {
    marginBottom: '1rem'
  },
  platformButtons: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.75rem'
  },
  platformButton: {
    padding: '0.6rem 1rem',
    borderRadius: '5px',
    border: '1px solid #ddd',
    backgroundColor: '#fff',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '500',
    transition: 'all 0.2s',
    flex: '0 0 calc(25% - 0.75rem)'
  },
  platformButtonActive: {
    backgroundColor: '#6c63ff',
    color: '#fff',
    border: '1px solid #6c63ff',
    boxShadow: '0 2px 5px rgba(108, 99, 255, 0.2)'
  },
  label: {
    display: 'block',
    marginBottom: '0.4rem',
    fontWeight: '500',
    color: '#444',
    fontSize: '0.9rem'
  },
  input: {
    width: '100%',
    padding: '0.65rem',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '0.9rem',
    transition: 'border-color 0.2s',
    outline: 'none',
    '&:focus': {
      borderColor: '#6c63ff'
    }
  },
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1rem'
  },
  button: {
    padding: '0.65rem 1.2rem',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#6c63ff',
    color: '#fff',
    fontSize: '0.9rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: '#5a52d5'
    }
  },
  clearButton: {
    padding: '0.65rem 1.2rem',
    borderRadius: '4px',
    border: '1px solid #ddd',
    backgroundColor: '#fff',
    color: '#555',
    fontSize: '0.9rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  responseContainer: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '1.5rem',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    animation: 'fadeIn 0.5s ease-in',
    marginTop: '1rem'
  },
  responseTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    marginBottom: '1rem',
    padding: '0 0 0.5rem',
    borderBottom: '1px solid #f0f0f0'
  },
  loadingIndicator: {
    padding: '2rem 0',
    textAlign: 'center',
    color: '#666',
    fontSize: '0.9rem'
  },
  responseContent: {
    fontSize: '0.9rem',
    lineHeight: '1.5'
  },
  responseParagraph: {
    marginBottom: '1rem'
  },
  historyContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem'
  },
  historyItem: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    padding: '1.25rem',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    '&:hover': {
      transform: 'translateY(-3px)',
      boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
    }
  },
  historyItemHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem'
  },
  historyPlatformBadge: {
    backgroundColor: '#f0f0ff',
    color: '#6c63ff',
    padding: '0.3rem 0.6rem',
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontWeight: '500'
  },
  historyDate: {
    fontSize: '0.75rem',
    color: '#888'
  },
  historyInterests: {
    marginBottom: '1rem'
  },
  historyInterest: {
    fontSize: '0.85rem',
    marginBottom: '0.5rem'
  },
  historyInterestLabel: {
    color: '#666',
    fontWeight: '500',
    marginRight: '0.3rem'
  },
  historyItemFooter: {
    borderTop: '1px solid #f0f0f0',
    paddingTop: '0.75rem',
    marginTop: '0.5rem',
    display: 'flex',
    justifyContent: 'flex-end'
  },
  historyItemButton: {
    backgroundColor: 'transparent',
    border: '1px solid #6c63ff',
    color: '#6c63ff',
    padding: '0.4rem 0.8rem',
    borderRadius: '4px',
    fontSize: '0.75rem',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  emptyState: {
    textAlign: 'center',
    padding: '3rem',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
  },
  emptyStateButton: {
    backgroundColor: '#6c63ff',
    color: '#fff',
    border: 'none',
    padding: '0.65rem 1.2rem',
    borderRadius: '4px',
    fontSize: '0.9rem',
    marginTop: '1rem',
    cursor: 'pointer'
  },
  accountContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  accountSection: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '1.5rem',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
  },
  accountSectionTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    marginBottom: '1.5rem',
    padding: '0 0 0.5rem',
    borderBottom: '1px solid #f0f0f0'
  },
  passwordForm: {
    maxWidth: '500px'
  },
  passwordMessage: {
    padding: '0.75rem',
    borderRadius: '4px',
    marginBottom: '1.5rem',
    fontSize: '0.85rem'
  },
  comingSoonText: {
    color: '#888',
    fontSize: '0.9rem',
    fontStyle: 'italic'
  }
};

export default Dashboard;