import React from 'react';
import { colors, spacing, borderRadius, shadows, typography, transitions } from '../../styles/theme';
import { Button } from '../common';

/**
 * History Tab component
 */
const HistoryTab = ({ history, onItemClick, onNewSearch }) => {
    const styles = {
        container: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: spacing.lg,
        },
        item: {
            backgroundColor: colors.background.secondary,
            borderRadius: borderRadius.lg,
            boxShadow: shadows.md,
            padding: spacing.lg,
            cursor: 'pointer',
            transition: `all ${transitions.normal}`,
        },
        itemHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: spacing.md,
        },
        badge: {
            backgroundColor: colors.background.hover,
            color: colors.text.primary,
            padding: `${spacing.xs} ${spacing.sm}`,
            borderRadius: borderRadius.sm,
            fontSize: typography.fontSize.xs,
            fontWeight: typography.fontWeight.medium,
            textTransform: 'capitalize',
        },
        date: {
            fontSize: typography.fontSize.xs,
            color: colors.text.muted,
        },
        interests: {
            marginBottom: spacing.md,
        },
        interest: {
            fontSize: typography.fontSize.sm,
            marginBottom: spacing.xs,
            color: colors.text.secondary,
        },
        interestLabel: {
            color: colors.text.muted,
            fontWeight: typography.fontWeight.medium,
            marginRight: spacing.xs,
        },
        footer: {
            borderTop: `1px solid ${colors.border.dark}`,
            paddingTop: spacing.md,
            marginTop: spacing.sm,
            display: 'flex',
            justifyContent: 'flex-end',
        },
        viewButton: {
            backgroundColor: 'transparent',
            border: `1px solid ${colors.primary.main}`,
            color: colors.primary.main,
            padding: `${spacing.xs} ${spacing.sm}`,
            borderRadius: borderRadius.sm,
            fontSize: typography.fontSize.xs,
            cursor: 'pointer',
            transition: `all ${transitions.normal}`,
        },
        emptyState: {
            textAlign: 'center',
            padding: spacing.xxl,
            backgroundColor: colors.background.secondary,
            borderRadius: borderRadius.lg,
            boxShadow: shadows.md,
            color: colors.text.muted,
        },
        emptyIcon: {
            fontSize: '3rem',
            marginBottom: spacing.md,
        },
        emptyText: {
            marginBottom: spacing.lg,
        },
    };

    if (!history || history.length === 0) {
        return (
            <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>📋</div>
                <p style={styles.emptyText}>No search history yet. Generate your first strategy!</p>
                <Button variant="primary" onClick={onNewSearch}>
                    Create Strategy
                </Button>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            {history.map((item) => (
                <div
                    key={item.id}
                    style={styles.item}
                    onClick={() => onItemClick(item)}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow = shadows.xl;
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = shadows.md;
                    }}
                >
                    <div style={styles.itemHeader}>
                        <span style={styles.badge}>{item.platform}</span>
                        <span style={styles.date}>{item.date}</span>
                    </div>
                    <div style={styles.interests}>
                        <div style={styles.interest}>
                            <span style={styles.interestLabel}>From:</span>
                            {item.userInterest}
                        </div>
                        <div style={styles.interest}>
                            <span style={styles.interestLabel}>To:</span>
                            {item.targetInterest}
                        </div>
                    </div>
                    <div style={styles.footer}>
                        <button
                            style={styles.viewButton}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = colors.primary.main;
                                e.currentTarget.style.color = colors.text.primary;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                                e.currentTarget.style.color = colors.primary.main;
                            }}
                        >
                            View Details
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default HistoryTab;
