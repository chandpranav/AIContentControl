import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import html2pdf from 'html2pdf.js';

const styles = {
  '@keyframes fadeIn': {
    from: { opacity: 0 },
    to:   { opacity: 1 }
  },

  container: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: "'Poppins', sans-serif",
    backgroundColor: '#1e1e2f',
    color: '#e0e0e0',
  },

  sidebar: {
    width: '260px',
    backgroundColor: '#27293d',
    boxShadow: '0 0 15px rgba(0,0,0,0.3)',
    padding: '2rem 0',
    position: 'sticky',
    top: 0,
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },

  logo: {
    fontSize: '1.4rem',
    fontWeight: '700',
    color: '#7857FF',
    padding: '0 2rem 2rem',
    marginBottom: '2rem',
  },

  navItem: {
    padding: '1rem 2rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    transition: 'background-color 0.2s',
    fontSize: '1rem',
    marginBottom: '0.5rem',
    color: '#b0b0c3',
  },

  activeNavItem: {
    backgroundColor: '#353659',
    color: '#fff',
    fontWeight: '600',
    borderLeft: '4px solid #7857FF',
  },

  icon: {
    marginRight: '1rem',
    width: '20px',
    color: 'inherit',
  },

  content: {
    flex: 1,
    padding: '2rem',
    overflow: 'auto',
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
  },

  heading: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#fff',
  },

  userSection: {
    display: 'flex',
    alignItems: 'center',
  },

  userGreeting: {
    marginRight: '1rem',
    fontSize: '0.9rem',
    color: '#ccc',
  },

  logoutButton: {
    padding: '0.5rem 1rem',
    background: 'transparent',
    border: '1px solid #444',
    borderRadius: '4px',
    fontSize: '0.9rem',
    cursor: 'pointer',
    color: '#ccc',
    transition: 'background 0.2s, border-color 0.2s',
  },

  tabContent: {
    opacity: 1,
    transition: 'opacity 0.3s ease-in',
  },

  formSection: {
    backgroundColor: '#2b2954',
    borderRadius: '8px',
    padding: '2rem',
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
    marginBottom: '2rem',
  },

  formDescription: {
    fontSize: '0.95rem',
    marginBottom: '1.5rem',
    color: '#ccc',
  },

  formGroup: {
    marginBottom: '1rem',
  },

  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '600',
    color: '#e0e0e0',
  },

  input: {
    width: '100%',
    padding: '0.75rem',
    borderRadius: '4px',
    border: '1px solid #444',
    backgroundColor: '#1e1e2f',
    color: '#e0e0e0',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border-color 0.2s',
  },

  inputFocus: {
    borderColor: '#7857FF',
  },

  platformButtons: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
    marginBottom: '1.5rem',
  },

  platformButton: {
    flex: '1 0 calc(25% - 1rem)',
    padding: '0.75rem',
    borderRadius: '6px',
    border: '1px solid #444',
    backgroundColor: '#1e1e2f',
    color: '#ccc',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    textAlign: 'center',
  },

  platformButtonActive: {
    backgroundColor: '#7857FF',
    color: '#fff',
    border: '1px solid #7857FF',
    boxShadow: '0 4px 15px rgba(120,87,255,0.4)',
  },

  buttonGroup: {
    display: 'flex',
    gap: '1rem',
  },

  button: {
    flex: 1,
    padding: '0.75rem',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#7857FF',
    color: '#fff',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background 0.2s ease',
  },

  clearButton: {
    flex: 1,
    padding: '0.75rem',
    borderRadius: '6px',
    border: '1px solid #444',
    backgroundColor: '#2b2954',
    color: '#aaa',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background 0.2s, border-color 0.2s',
  },

  responseWrapper: {
    backgroundColor: '#27293d',
    borderRadius: '8px',
    padding: '2rem',
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
    transition: 'opacity 0.5s ease-in',
  },

  responseHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },

  responseTitle: {
    fontSize: '1.3rem',
    fontWeight: '600',
    color: '#fff',
  },

  pdfButton: {
    padding: '0.6rem 1.2rem',
    backgroundColor: '#7857FF',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'background 0.2s ease',
  },

  loadingIndicator: {
    padding: '2rem 0',
    textAlign: 'center',
    color: '#aaa',
    fontSize: '0.95rem',
  },

  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1.5rem',
  },

  card: {
    background: '#1e1e2f',
    borderRadius: '8px',
    padding: '1.5rem',
    boxShadow: '0 2px 10px rgba(0,0,0,0.4)',
    display: 'flex',
    flexDirection: 'column',
  },

  cardTitle: {
    fontSize: '1.1rem',
    marginBottom: '1rem',
    color: '#fff',
    borderBottom: '1px solid rgba(120,87,255,0.3)',
    paddingBottom: '0.5rem',
  },

  cardList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },

  cardListItem: {
    marginBottom: '1rem',
    padding: '0.75rem',
    borderRadius: '6px',
    backgroundColor: '#2b2954',
  },

  cardDesc: {
    fontSize: '0.9rem',
    color: '#ccc',
    marginTop: '0.5rem',
    lineHeight: '1.5',
  },

  historyContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem',
  },

  historyItem: {
    backgroundColor: '#27293d',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
    padding: '1.25rem',
    cursor: 'pointer',
    transition: 'transform 0.2s, boxShadow 0.2s',
  },

  historyItemHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },

  historyPlatformBadge: {
    backgroundColor: '#353659',
    color: '#fff',
    padding: '0.3rem 0.6rem',
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontWeight: '500',
  },

  historyDate: {
    fontSize: '0.75rem',
    color: '#ccc',
  },

  historyInterests: {
    marginBottom: '1rem',
  },

  historyInterest: {
    fontSize: '0.85rem',
    marginBottom: '0.5rem',
    color: '#e0e0e0',
  },

  historyInterestLabel: {
    color: '#aaa',
    fontWeight: '500',
    marginRight: '0.3rem',
  },

  historyItemFooter: {
    borderTop: '1px solid #353659',
    paddingTop: '0.75rem',
    marginTop: '0.5rem',
    display: 'flex',
    justifyContent: 'flex-end',
  },

  historyItemButton: {
    backgroundColor: 'transparent',
    border: '1px solid #7857FF',
    color: '#7857FF',
    padding: '0.4rem 0.8rem',
    borderRadius: '4px',
    fontSize: '0.75rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },

  emptyState: {
    textAlign: 'center',
    padding: '3rem',
    backgroundColor: '#27293d',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
    color: '#ccc',
  },

  emptyStateButton: {
    backgroundColor: '#7857FF',
    color: '#fff',
    border: 'none',
    padding: '0.65rem 1.2rem',
    borderRadius: '4px',
    fontSize: '0.9rem',
    marginTop: '1rem',
    cursor: 'pointer',
  },

  accountContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },

  accountSection: {
    backgroundColor: '#27293d',
    borderRadius: '8px',
    padding: '1.5rem',
    boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
  },

  accountSectionTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    marginBottom: '1.5rem',
    padding: '0 0 0.5rem',
    borderBottom: '1px solid #353659',
    color: '#fff',
  },

  passwordForm: {
    maxWidth: '500px',
  },

  passwordMessage: {
    padding: '0.75rem',
    borderRadius: '4px',
    marginBottom: '1.5rem',
    fontSize: '0.85rem',
  },

  comingSoonText: {
    color: '#aaa',
    fontSize: '0.9rem',
    fontStyle: 'italic',
  },
};

function Dashboard() {
  const navigate = useNavigate();

  // Main state
  const [activeTab, setActiveTab] = useState('search');
  const [platform, setPlatform] = useState('');
  const [userInterest, setUserInterest] = useState('');
  const [targetInterest, setTargetInterest] = useState('');
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

// ←– **NEW**: track which history item is hovered
  const [hoveredId, setHoveredId] = useState(null);

  // History state
  const [searchHistory, setSearchHistory] = useState([]);

  // Account state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState({ text: '', type: '' });

  // User
  const [user, setUser] = useState(null);

  // On mount: load history and user
  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    setSearchHistory(history);

    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  // Save history function (hoisted)
  function saveToHistory(strategy) {
    const newItem = {
      id: Date.now(),
      date: new Date().toLocaleString(),
      platform,
      userInterest,
      targetInterest,
      response: strategy,
    };
    const updated = [newItem, ...searchHistory].slice(0, 10);
    setSearchHistory(updated);
    localStorage.setItem('searchHistory', JSON.stringify(updated));
  }

  // PDF download
  const contentRef = useRef(null);
/* Dashboard.js */
const downloadPdf = () => {
  const node = document.getElementById('pdf-wrapper');
  if (!node) { alert('Nothing to print'); return; }

  /* ----------------------------------------
   * 1)  temporary print-stylesheet
   * -------------------------------------- */
  const style = document.createElement('style');
  style.id = 'print-theme';
  style.textContent = `
    #pdf-wrapper,
    #pdf-wrapper * {
      background: transparent !important;
      color: #222 !important;
    }

    /* page paddings */
    #pdf-wrapper {
      width: 100%;
      box-sizing: border-box;
      padding: 18mm 15mm;
      display: flex;
      flex-wrap: wrap;
      gap: 12mm;
      font-family: "Poppins", sans-serif;
    }

    /* headline + sub */
    #pdf-wrapper h1 {
      flex: 1 0 100%;
      margin: 0 0 6mm 0;
      font-size: 24pt;
      color: #5e56f0 !important;
    }
    #pdf-wrapper .date-stamp {
      flex: 1 0 100%;
      margin: -4mm 0 8mm 0;
      font-size: 9pt;
      color: #666 !important;
    }

    /* cards — now single-column, never split */
    #pdf-wrapper .card {
      flex: 1 0 100%;
      max-width: 100%;
      background: #fafafa !important;
      border: 1px solid #ddd !important;
      border-radius: 6px;
      padding: 14pt 16pt;
      break-inside: avoid;
      page-break-inside: avoid;
      margin-bottom: 8mm;           /* ensure room before next page */
    }
    #pdf-wrapper .cardTitle {
      font-size: 13pt !important;
      font-weight: 600;
      margin: 0 0 6pt 0;
      border-bottom: 1px solid #5e56f0;
      padding-bottom: 4pt;
    }
    #pdf-wrapper li {
      font-size: 10pt !important;
      margin-bottom: 5pt;
      line-height: 1.35;
    }
    #pdf-wrapper footer {
      flex: 1 0 100%;
      margin-top: 12mm;
      text-align: center;
      font-size: 8pt;
      color: #888 !important;
    }
  `;
  document.head.appendChild(style);

  /* ----------------------------------------
   * 2)  header   &   footer
   * -------------------------------------- */
  const capPlatform = platform.charAt(0).toUpperCase() + platform.slice(1);
  const header = document.createElement('h1');
  header.textContent =
    `Steps to transform your ${capPlatform} algorithm ` +
    `from "${userInterest}" to "${targetInterest}"`;

  const date = document.createElement('p');
  date.className = 'date-stamp';
  date.textContent = 'Generated on ' + new Date().toLocaleDateString();

  const footer = document.createElement('footer');
  footer.textContent = 'For education purposes only';

  node.prepend(date);
  node.prepend(header);
  node.appendChild(footer);

  /* ----------------------------------------
   * 3)  build PDF
   * -------------------------------------- */
  html2pdf()
    .from(node)
    .set({
      margin: 0,                                    // we added our own
      filename: `${response?.title || 'AI_Recommendations'}.pdf`,
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    })
    .save()
    .finally(() => {
      header.remove(); date.remove(); footer.remove(); style.remove();
    });
};



  // Fetch strategy
  const getStrategy = async () => {
    if (!platform) return alert('Please select a platform!');
    if (!userInterest || !targetInterest) return alert('Please enter both your current and desired interests!');

    setIsLoading(true);
    setResponse(null);

try {
  const res = await fetch('http://localhost:5000/api/get-strategy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ platform, userInterest, targetInterest })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Error ${res.status}`);
  }
  const data = await res.json();
  const strategy = data.strategy || data.response || data
    (data.title && data);
  if (!strategy) throw new Error('Unexpected response format');
  setResponse(strategy);
  saveToHistory(strategy);
} catch (err) {
  alert('Error: ' + err.message); // helps you debug directly
  setResponse({ error: err.message });
} finally {
  setIsLoading(false);
}
};


  // Handle history item click
  const handleHistoryItemClick = (item) => {
    setPlatform(item.platform);
    setUserInterest(item.userInterest);
    setTargetInterest(item.targetInterest);
    setResponse(item.response);
    setActiveTab('search');
  };

  // Change password
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      return setPasswordMessage({ text: 'All fields are required', type: 'error' });
    }
    if (newPassword !== confirmPassword) {
      return setPasswordMessage({ text: 'New passwords do not match', type: 'error' });
    }
    if (!user) {
      return setPasswordMessage({ text: 'User not found. Please sign in again.', type: 'error' });
    }
    try {
      const res = await fetch('http://localhost:5000/api/auth/change-password', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, currentPassword, newPassword }),
      });
      const result = await res.json();
      if (res.ok) {
        setPasswordMessage({ text: result.message, type: 'success' });
        setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
      } else {
        setPasswordMessage({ text: result.error, type: 'error' });
      }
    } catch {
      setPasswordMessage({ text: 'Failed to update password', type: 'error' });
    }
    setTimeout(() => setPasswordMessage({ text: '', type: '' }), 3000);
  };
  
    // Clear form
    const clearForm = () => {
      setPlatform(''); setUserInterest(''); setTargetInterest(''); setResponse(null);
    };

     // Logout
  const handleLogout = () => { localStorage.removeItem('user'); navigate('/'); };
    return (
      <>
        <div style={styles.container}>
          <div style={styles.sidebar}>
            <div style={styles.logo}>AI Content Control</div>
            <div
              style={activeTab === 'search' ? { ...styles.navItem, ...styles.activeNavItem } : styles.navItem}
              onClick={() => setActiveTab('search')}
            >
              <i className="fas fa-search" style={styles.icon}></i>
              Search
            </div>
            <div
              style={activeTab === 'history' ? { ...styles.navItem, ...styles.activeNavItem } : styles.navItem}
              onClick={() => setActiveTab('history')}
            >
              <i className="fas fa-history" style={styles.icon}></i>
              History
            </div>
            <div
              style={activeTab === 'account' ? { ...styles.navItem, ...styles.activeNavItem } : styles.navItem}
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
                <span style={styles.userGreeting}>
                  Hello, {user && user.username ? user.username : 'User'}!
                </span>
                <button
                  style={styles.logoutButton}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f0f0f0';
                    e.currentTarget.style.borderColor = '#ccc';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.borderColor = '#ddd';
                  }}
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </header>
    
            {/* Search Tab */}
            {activeTab === 'search' && (
              <>
                <div style={styles.tabContent}>
                  <div style={styles.formAndResultContainer}>
                    {/* Form Section */}
                    <div style={styles.formSection}>
                      <p style={styles.formDescription}>
                        Tell us what content you currently see and what you'd like to see instead. We'll create a personalized strategy to shift your feed.
                      </p>
    
                      <div style={styles.formGroup}>
                        <label style={styles.label}>Select Platform</label>
                        <div style={styles.platformButtons}>
                          {['instagram', 'facebook', 'youtube'].map((p) => (
                            <button
                              key={p}
                              onClick={() => setPlatform(p)}
                              style={{
                                ...styles.platformButton,
                                ...(platform === p ? styles.platformButtonActive : {}),
                              }}
                            >
                              {p.charAt(0).toUpperCase() + p.slice(1)}
                            </button>
                          ))}
                        </div>
                      </div>
    
                      <div style={styles.formGroup}>
                        <label style={styles.label}>Current Content Interest</label>
                        <input
                          type="text"
                          value={userInterest}
                          onChange={(e) => setUserInterest(e.target.value)}
                          placeholder="e.g., fast fashion, junk food"
                          style={styles.input}
                          onFocus={(e) => (e.target.style.borderColor = '#6c63ff')}
                          onBlur={(e) => (e.target.style.borderColor = '#ddd')}
                        />
                      </div>
    
                      <div style={styles.formGroup}>
                        <label style={styles.label}>Desired Content Interest</label>
                        <input
                          type="text"
                          value={targetInterest}
                          onChange={(e) => setTargetInterest(e.target.value)}
                          placeholder="e.g., sustainable fashion, healthy recipes"
                          style={styles.input}
                          onFocus={(e) => (e.target.style.borderColor = '#6c63ff')}
                          onBlur={(e) => (e.target.style.borderColor = '#ddd')}
                        />
                      </div>
    
                      <div style={styles.buttonGroup}>
                        <button
                          onClick={getStrategy}
                          style={styles.button}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#5a52d5';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#6c63ff';
                          }}
                        >
                          Generate Strategy
                        </button>
                        <button
                          onClick={clearForm}
                          style={styles.clearButton}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#f5f5f5';
                            e.currentTarget.style.borderColor = '#ccc';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#fff';
                            e.currentTarget.style.borderColor = '#ddd';
                          }}
                        >
                          Clear Form
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
    
                {(isLoading || response) && (
                  <div style={styles.responseWrapper}>
                    <div style={styles.responseHeader}>
                      <h3 style={styles.responseTitle}>
                        {isLoading ? 'AI Recommendations' : response.title}
                      </h3>
                      {!isLoading && response && !response.error && (
                        <button
                          onClick={downloadPdf}
                          style={styles.pdfButton}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#5a52d5';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#6c63ff';
                          }}
                        >
                          Save to PDF
                        </button>
                      )}
                    </div>
    
                    {isLoading ? (
                      <div style={styles.loadingIndicator}>
                        Generating your personalized strategy...
                      </div>
                    ) : response?.error ? (
                      <div style={styles.errorContainer}>
                        <div style={styles.errorIcon}>⚠️</div>
                        <p style={styles.errorMessage}>{response.error}</p>
                        <div style={styles.errorHelp}>
                          Please check your inputs and try again.
                        </div>
                      </div>
                    ) : (
                      <div id="pdf-wrapper" ref={contentRef} style={styles.cardsGrid}>
                        {response.sections?.map((sec) => (
                          <div key={sec.name} style={styles.card}>
                            <h4 style={styles.cardTitle}>{sec.name}</h4>
                            <ul style={styles.cardList}>
                              {sec.items.map((it, i) => (
                                <li key={i} style={styles.cardListItem}>
                                  <strong>{it.label}</strong>
                                  {it.meta && ` – ${it.meta}`}
                                  <div style={styles.cardDesc}>{it.description}</div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
    
            {/* History Tab */}
            {activeTab === 'history' && (
              <div style={styles.tabContent}>
                <div style={styles.historyContainer}>
                  {searchHistory.length === 0 ? (
                    <div style={styles.emptyState}>
                      <p>You haven't made any searches yet.</p>
                      <button
                        onClick={() => setActiveTab('search')}
                        style={styles.emptyStateButton}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#5a52d5';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#6c63ff';
                        }}
                      >
                        Make your first search
                      </button>
                    </div>
                  ) : (
                    searchHistory.map((item) => {
                      const isHovered = hoveredId === item.id;
                      return (
                        <div
                          key={item.id}
                          style={{
                            ...styles.historyItem,
                            transform: isHovered ? 'translateY(-3px)' : 'none',
                            boxShadow: isHovered
                              ? '0 5px 15px rgba(0,0,0,0.1)'
                              : '0 2px 10px rgba(0,0,0,0.05)',
                          }}
                          onClick={() => handleHistoryItemClick(item)}
                          onMouseEnter={() => setHoveredId(item.id)}
                          onMouseLeave={() => setHoveredId(null)}
                        >
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
                            <button
                              style={styles.historyItemButton}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#f0f0ff';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                              }}
                            >
                              View Results
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
    
            {/* Account Tab */}
            {activeTab === 'account' && (
              <div style={styles.tabContent}>
                <div style={styles.accountContainer}>
                  <div style={styles.accountSection}>
                    <h3 style={styles.accountSectionTitle}>Change Password</h3>
    
                    {passwordMessage.text && (
                      <div
                        style={{
                          ...styles.passwordMessage,
                          backgroundColor: passwordMessage.type === 'success' ? '#e6f7e6' : '#fce9e9',
                          color: passwordMessage.type === 'success' ? '#2e7d32' : '#d32f2f',
                        }}
                      >
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
                          onFocus={(e) => (e.target.style.borderColor = '#6c63ff')}
                          onBlur={(e) => (e.target.style.borderColor = '#ddd')}
                          style={styles.input}
                        />
                      </div>
    
                      <div style={styles.formGroup}>
                        <label style={styles.label}>New Password</label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          onFocus={(e) => (e.target.style.borderColor = '#6c63ff')}
                          onBlur={(e) => (e.target.style.borderColor = '#ddd')}
                          style={styles.input}
                        />
                      </div>
    
                      <div style={styles.formGroup}>
                        <label style={styles.label}>Confirm New Password</label>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          onFocus={(e) => (e.target.style.borderColor = '#6c63ff')}
                          onBlur={(e) => (e.target.style.borderColor = '#ddd')}
                          style={styles.input}
                        />
                      </div>
    
                      <button
                        type="submit"
                        style={styles.button}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#5a52d5')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#6c63ff')}
                      >
                        Update Password
                      </button>
                    </form>
                  </div>
    
                </div>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }    
export default Dashboard;