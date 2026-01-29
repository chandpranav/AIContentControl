import React from 'react';
import { colors, spacing, borderRadius, shadows, typography } from '../../styles/theme';
import { Button } from '../common';
import StrategyCard from './StrategyCard';

/**
 * Strategy Result display component
 */
const StrategyResult = ({ strategy, platform, userInterest, targetInterest, onDownloadPdf }) => {
    const styles = {
        wrapper: {
            backgroundColor: colors.background.secondary,
            borderRadius: borderRadius.lg,
            padding: spacing.xl,
            boxShadow: shadows.lg,
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: spacing.lg,
            flexWrap: 'wrap',
            gap: spacing.md,
        },
        title: {
            fontSize: typography.fontSize.xl,
            fontWeight: typography.fontWeight.semibold,
            color: colors.text.primary,
        },
        grid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: spacing.lg,
        },
        loading: {
            padding: spacing.xl,
            textAlign: 'center',
            color: colors.text.muted,
            fontSize: typography.fontSize.md,
        },
        error: {
            padding: spacing.xl,
            textAlign: 'center',
            color: colors.status.error,
            backgroundColor: colors.status.errorLight,
            borderRadius: borderRadius.md,
        },
    };

    if (!strategy) {
        return null;
    }

    if (strategy.error) {
        return (
            <div style={styles.wrapper}>
                <div style={styles.error}>
                    Error: {strategy.error}
                </div>
            </div>
        );
    }

    return (
        <div style={styles.wrapper}>
            <div style={styles.header}>
                <h2 style={styles.title}>
                    {strategy.title || `Strategy for ${platform}`}
                </h2>
                <Button
                    variant="primary"
                    size="small"
                    onClick={onDownloadPdf}
                >
                    📥 Download PDF
                </Button>
            </div>

            <div id="pdf-wrapper" style={styles.grid}>
                {strategy.sections?.map((section, idx) => (
                    <StrategyCard key={idx} section={section} />
                ))}
            </div>
        </div>
    );
};

export default StrategyResult;
