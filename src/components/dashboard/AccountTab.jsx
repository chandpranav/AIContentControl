import React, { useState } from 'react';
import { colors, spacing, borderRadius, shadows, typography } from '../../styles/theme';
import { Button, Input } from '../common';

/**
 * Account Tab component
 */
const AccountTab = ({ onPasswordChange, passwordMessage }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPasswords, setShowPasswords] = useState(false);

    const styles = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            gap: spacing.lg,
        },
        section: {
            backgroundColor: colors.background.secondary,
            borderRadius: borderRadius.lg,
            padding: spacing.lg,
            boxShadow: shadows.md,
        },
        sectionTitle: {
            fontSize: typography.fontSize.lg,
            fontWeight: typography.fontWeight.semibold,
            marginBottom: spacing.lg,
            paddingBottom: spacing.sm,
            borderBottom: `1px solid ${colors.border.dark}`,
            color: colors.text.primary,
        },
        form: {
            maxWidth: '500px',
        },
        message: {
            padding: spacing.md,
            borderRadius: borderRadius.sm,
            marginBottom: spacing.lg,
            fontSize: typography.fontSize.sm,
        },
        successMessage: {
            backgroundColor: colors.status.successLight,
            color: colors.status.success,
        },
        errorMessage: {
            backgroundColor: colors.status.errorLight,
            color: colors.status.error,
        },
        comingSoon: {
            color: colors.text.muted,
            fontSize: typography.fontSize.sm,
            fontStyle: 'italic',
        },
        toggleButton: {
            background: 'none',
            border: 'none',
            color: colors.primary.light,
            cursor: 'pointer',
            fontSize: typography.fontSize.sm,
            marginBottom: spacing.md,
            padding: 0,
        },
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!currentPassword || !newPassword || !confirmPassword) {
            return;
        }

        if (newPassword !== confirmPassword) {
            return;
        }

        onPasswordChange(currentPassword, newPassword);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    return (
        <div style={styles.container}>
            {/* Password Change Section */}
            <div style={styles.section}>
                <h3 style={styles.sectionTitle}>Change Password</h3>

                {passwordMessage && passwordMessage.text && (
                    <div
                        style={{
                            ...styles.message,
                            ...(passwordMessage.type === 'success'
                                ? styles.successMessage
                                : styles.errorMessage),
                        }}
                    >
                        {passwordMessage.text}
                    </div>
                )}

                <form style={styles.form} onSubmit={handleSubmit}>
                    <Input
                        label="Current Password"
                        type={showPasswords ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter current password"
                        required
                    />

                    <Input
                        label="New Password"
                        type={showPasswords ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        required
                    />

                    <Input
                        label="Confirm New Password"
                        type={showPasswords ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        required
                        error={
                            confirmPassword && newPassword !== confirmPassword
                                ? 'Passwords do not match'
                                : null
                        }
                    />

                    <button
                        type="button"
                        style={styles.toggleButton}
                        onClick={() => setShowPasswords(!showPasswords)}
                    >
                        {showPasswords ? 'Hide passwords' : 'Show passwords'}
                    </button>

                    <Button
                        type="submit"
                        variant="primary"
                        disabled={
                            !currentPassword ||
                            !newPassword ||
                            !confirmPassword ||
                            newPassword !== confirmPassword
                        }
                    >
                        Update Password
                    </Button>
                </form>
            </div>

            {/* Preferences Section */}
            <div style={styles.section}>
                <h3 style={styles.sectionTitle}>Preferences</h3>
                <p style={styles.comingSoon}>More settings coming soon...</p>
            </div>
        </div>
    );
};

export default AccountTab;
