import React from 'react';
import { colors, spacing, borderRadius, shadows, typography, transitions } from '../../styles/theme';
import { Button, Input } from '../common';

const PLATFORMS = ['instagram', 'facebook', 'youtube'];

/**
 * Strategy Generation Form component
 */
const StrategyForm = ({
    platform,
    userInterest,
    targetInterest,
    isLoading,
    onPlatformChange,
    onUserInterestChange,
    onTargetInterestChange,
    onSubmit,
    onClear,
}) => {
    const styles = {
        formSection: {
            backgroundColor: colors.background.card,
            borderRadius: borderRadius.lg,
            padding: spacing.xl,
            boxShadow: shadows.lg,
            marginBottom: spacing.xl,
        },
        description: {
            fontSize: typography.fontSize.sm,
            marginBottom: spacing.lg,
            color: colors.text.muted,
            lineHeight: typography.lineHeight.relaxed,
        },
        label: {
            display: 'block',
            marginBottom: spacing.sm,
            fontWeight: typography.fontWeight.semibold,
            color: colors.text.primary,
        },
        platformButtons: {
            display: 'flex',
            gap: spacing.md,
            flexWrap: 'wrap',
            marginBottom: spacing.lg,
        },
        platformButton: {
            flex: '1 0 calc(33.333% - 1rem)',
            padding: spacing.md,
            borderRadius: borderRadius.md,
            border: `1px solid ${colors.border.medium}`,
            backgroundColor: colors.background.primary,
            color: colors.text.muted,
            fontSize: typography.fontSize.sm,
            fontWeight: typography.fontWeight.semibold,
            cursor: 'pointer',
            transition: `all ${transitions.normal}`,
            textAlign: 'center',
            textTransform: 'capitalize',
        },
        platformButtonActive: {
            backgroundColor: colors.primary.main,
            color: colors.text.primary,
            border: `1px solid ${colors.primary.main}`,
            boxShadow: shadows.glowPrimary,
        },
        buttonGroup: {
            display: 'flex',
            gap: spacing.md,
            marginTop: spacing.lg,
        },
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit();
    };

    return (
        <form style={styles.formSection} onSubmit={handleSubmit}>
            <p style={styles.description}>
                Tell us what content you currently see and what you'd like to see instead.
                We'll create a personalized strategy to shift your feed.
            </p>

            <div style={{ marginBottom: spacing.lg }}>
                <label style={styles.label}>Select Platform</label>
                <div style={styles.platformButtons}>
                    {PLATFORMS.map((p) => (
                        <button
                            key={p}
                            type="button"
                            onClick={() => onPlatformChange(p)}
                            style={{
                                ...styles.platformButton,
                                ...(platform === p ? styles.platformButtonActive : {}),
                            }}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </div>

            <Input
                label="Current Content Interest"
                value={userInterest}
                onChange={(e) => onUserInterestChange(e.target.value)}
                placeholder="e.g., fast fashion, junk food"
            />

            <Input
                label="Desired Content Interest"
                value={targetInterest}
                onChange={(e) => onTargetInterestChange(e.target.value)}
                placeholder="e.g., sustainable fashion, healthy recipes"
            />

            <div style={styles.buttonGroup}>
                <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    loading={isLoading}
                    disabled={!platform || !userInterest || !targetInterest}
                >
                    Generate Strategy
                </Button>
                <Button
                    type="button"
                    variant="secondary"
                    fullWidth
                    onClick={onClear}
                    disabled={isLoading}
                >
                    Clear
                </Button>
            </div>
        </form>
    );
};

export default StrategyForm;
