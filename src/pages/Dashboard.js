import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/common/Toast';
import strategyService from '../services/strategyService';
import { downloadStrategyPdf } from '../utils/pdfGenerator';
import { colors, spacing, typography } from '../styles/theme';

// Dashboard components
import {
  Sidebar,
  StrategyForm,
  StrategyResult,
  HistoryTab,
  AccountTab,
} from '../components/dashboard';

/**
 * Dashboard Page - Refactored version
 */
function Dashboard() {
  const navigate = useNavigate();
  const { user, logout, changePassword } = useAuth();
  const toast = useToast();

  // Tab state
  const [activeTab, setActiveTab] = useState('search');

  // Form state
  const [platform, setPlatform] = useState('');
  const [userInterest, setUserInterest] = useState('');
  const [targetInterest, setTargetInterest] = useState('');
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // History state
  const [searchHistory, setSearchHistory] = useState([]);

  // Account state
  const [passwordMessage, setPasswordMessage] = useState({ text: '', type: '' });

  // Load history on mount
  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    setSearchHistory(history);
  }, []);

  // Save to history
  const saveToHistory = (strategy) => {
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
  };

  // Generate strategy
  const handleGenerateStrategy = async () => {
    if (!platform) {
      toast.warning('Please select a platform');
      return;
    }
    if (!userInterest || !targetInterest) {
      toast.warning('Please enter both interests');
      return;
    }

    setIsLoading(true);
    setResponse(null);

    try {
      const result = await strategyService.generateStrategy(
        platform,
        userInterest,
        targetInterest
      );

      const strategy = result.strategy || result;
      setResponse(strategy);
      saveToHistory(strategy);
      toast.success('Strategy generated successfully!');
    } catch (error) {
      console.error('Strategy generation error:', error);
      toast.error(error.error?.message || 'Failed to generate strategy');
      setResponse({ error: error.error?.message || 'Strategy generation failed' });
    } finally {
      setIsLoading(false);
    }
  };

  // Clear form
  const handleClear = () => {
    setPlatform('');
    setUserInterest('');
    setTargetInterest('');
    setResponse(null);
  };

  // Handle history item click
  const handleHistoryClick = (item) => {
    setPlatform(item.platform);
    setUserInterest(item.userInterest);
    setTargetInterest(item.targetInterest);
    setResponse(item.response);
    setActiveTab('search');
  };

  // Handle password change
  const handlePasswordChange = async (currentPassword, newPassword) => {
    try {
      await changePassword(currentPassword, newPassword);
      setPasswordMessage({ text: 'Password updated! Please sign in again.', type: 'success' });
      setTimeout(() => navigate('/signin'), 2000);
    } catch (error) {
      setPasswordMessage({
        text: error.error?.message || 'Failed to update password',
        type: 'error',
      });
    }
    setTimeout(() => setPasswordMessage({ text: '', type: '' }), 3000);
  };

  // Handle logout
  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Download PDF
  const handleDownloadPdf = () => {
    downloadStrategyPdf(response, platform, userInterest, targetInterest);
  };

  // Styles
  const styles = {
    container: {
      display: 'flex',
      minHeight: '100vh',
      fontFamily: typography.fontFamily.primary,
      backgroundColor: colors.background.primary,
      color: colors.text.secondary,
    },
    content: {
      flex: 1,
      padding: spacing.xl,
      overflow: 'auto',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.xl,
    },
    heading: {
      fontSize: typography.fontSize.h1,
      fontWeight: typography.fontWeight.bold,
      color: colors.text.primary,
    },
    userSection: {
      display: 'flex',
      alignItems: 'center',
      gap: spacing.md,
    },
    greeting: {
      fontSize: typography.fontSize.sm,
      color: colors.text.muted,
    },
  };

  // Tab titles
  const tabTitles = {
    search: 'Customize Your Feed',
    history: 'Search History',
    account: 'Account Settings',
  };

  return (
    <div style={styles.container}>
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
      />

      <div style={styles.content}>
        <header style={styles.header}>
          <h1 style={styles.heading}>{tabTitles[activeTab]}</h1>
          <div style={styles.userSection}>
            <span style={styles.greeting}>
              Hello, {user?.username || 'User'}!
            </span>
          </div>
        </header>

        {/* Search Tab */}
        {activeTab === 'search' && (
          <>
            <StrategyForm
              platform={platform}
              userInterest={userInterest}
              targetInterest={targetInterest}
              isLoading={isLoading}
              onPlatformChange={setPlatform}
              onUserInterestChange={setUserInterest}
              onTargetInterestChange={setTargetInterest}
              onSubmit={handleGenerateStrategy}
              onClear={handleClear}
            />

            {(response || isLoading) && (
              <StrategyResult
                strategy={response}
                platform={platform}
                userInterest={userInterest}
                targetInterest={targetInterest}
                onDownloadPdf={handleDownloadPdf}
              />
            )}
          </>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <HistoryTab
            history={searchHistory}
            onItemClick={handleHistoryClick}
            onNewSearch={() => setActiveTab('search')}
          />
        )}

        {/* Account Tab */}
        {activeTab === 'account' && (
          <AccountTab
            onPasswordChange={handlePasswordChange}
            passwordMessage={passwordMessage}
          />
        )}
      </div>
    </div>
  );
}

export default Dashboard;