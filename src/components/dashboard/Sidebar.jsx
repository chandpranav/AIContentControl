import React from 'react';
import { colors, spacing, typography, transitions } from '../../styles/theme';

/**
 * Dashboard Sidebar component
 */
const Sidebar = ({ activeTab, onTabChange, onLogout }) => {
    const tabs = [
        { id: 'search', label: 'Search', icon: '🔍' },
        { id: 'history', label: 'History', icon: '📜' },
        { id: 'account', label: 'Account', icon: '⚙️' },
    ];

    const styles = {
        sidebar: {
            width: '260px',
            backgroundColor: colors.background.secondary,
            boxShadow: '0 0 15px rgba(0,0,0,0.3)',
            padding: `${spacing.xl} 0`,
            position: 'sticky',
            top: 0,
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
        },
        logo: {
            fontSize: '1.4rem',
            fontWeight: typography.fontWeight.bold,
            color: colors.primary.main,
            padding: `0 ${spacing.xl} ${spacing.xl}`,
            marginBottom: spacing.xl,
        },
        nav: {
            flex: 1,
        },
        navItem: {
            padding: `${spacing.md} ${spacing.xl}`,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            transition: `background-color ${transitions.normal}`,
            fontSize: typography.fontSize.md,
            marginBottom: spacing.sm,
            color: colors.text.muted,
            borderLeft: '4px solid transparent',
        },
        navItemActive: {
            backgroundColor: colors.background.hover,
            color: colors.text.primary,
            fontWeight: typography.fontWeight.semibold,
            borderLeftColor: colors.primary.main,
        },
        icon: {
            marginRight: spacing.md,
            fontSize: '1.2rem',
        },
        footer: {
            padding: `${spacing.md} ${spacing.xl}`,
            borderTop: `1px solid ${colors.border.dark}`,
        },
        logoutButton: {
            width: '100%',
            padding: `${spacing.sm} ${spacing.md}`,
            background: 'transparent',
            border: `1px solid ${colors.border.medium}`,
            borderRadius: '4px',
            fontSize: typography.fontSize.sm,
            cursor: 'pointer',
            color: colors.text.muted,
            transition: `all ${transitions.normal}`,
        },
    };

    return (
        <div style={styles.sidebar}>
            <div style={styles.logo}>AI Content Control</div>

            <nav style={styles.nav}>
                {tabs.map((tab) => (
                    <div
                        key={tab.id}
                        style={{
                            ...styles.navItem,
                            ...(activeTab === tab.id ? styles.navItemActive : {}),
                        }}
                        onClick={() => onTabChange(tab.id)}
                    >
                        <span style={styles.icon}>{tab.icon}</span>
                        {tab.label}
                    </div>
                ))}
            </nav>

            <div style={styles.footer}>
                <button
                    style={styles.logoutButton}
                    onClick={onLogout}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = colors.background.hover;
                        e.currentTarget.style.borderColor = colors.text.muted;
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.borderColor = colors.border.medium;
                    }}
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
