import React from 'react';
import { colors, spacing, borderRadius, shadows, transitions, typography } from '../../styles/theme';

/**
 * Reusable Button component with variants
 */
const Button = ({
    children,
    variant = 'primary',
    size = 'medium',
    fullWidth = false,
    disabled = false,
    loading = false,
    leftIcon,
    rightIcon,
    onClick,
    type = 'button',
    style,
    ...props
}) => {
    const variants = {
        primary: {
            backgroundColor: colors.primary.main,
            color: colors.primary.contrast,
            border: 'none',
            ':hover': { backgroundColor: colors.primary.dark },
        },
        secondary: {
            backgroundColor: 'transparent',
            color: colors.text.secondary,
            border: `1px solid ${colors.border.medium}`,
        },
        outline: {
            backgroundColor: 'transparent',
            color: colors.primary.main,
            border: `1px solid ${colors.primary.main}`,
        },
        ghost: {
            backgroundColor: 'transparent',
            color: colors.text.secondary,
            border: 'none',
        },
        danger: {
            backgroundColor: colors.status.error,
            color: '#fff',
            border: 'none',
        },
    };

    const sizes = {
        small: {
            padding: `${spacing.sm} ${spacing.md}`,
            fontSize: typography.fontSize.sm,
        },
        medium: {
            padding: `0.75rem ${spacing.lg}`,
            fontSize: typography.fontSize.md,
        },
        large: {
            padding: `${spacing.md} ${spacing.xl}`,
            fontSize: typography.fontSize.lg,
        },
    };

    const baseStyles = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
        fontFamily: typography.fontFamily.primary,
        fontWeight: typography.fontWeight.semibold,
        borderRadius: borderRadius.md,
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        transition: `all ${transitions.normal}`,
        opacity: disabled ? 0.5 : 1,
        width: fullWidth ? '100%' : 'auto',
        ...variants[variant],
        ...sizes[size],
        ...style,
    };

    const handleMouseEnter = (e) => {
        if (!disabled && !loading) {
            if (variant === 'primary') {
                e.currentTarget.style.backgroundColor = colors.primary.dark;
                e.currentTarget.style.boxShadow = shadows.glowPrimary;
            } else if (variant === 'secondary' || variant === 'ghost') {
                e.currentTarget.style.backgroundColor = colors.background.hover;
            }
        }
    };

    const handleMouseLeave = (e) => {
        if (!disabled && !loading) {
            if (variant === 'primary') {
                e.currentTarget.style.backgroundColor = colors.primary.main;
                e.currentTarget.style.boxShadow = 'none';
            } else {
                e.currentTarget.style.backgroundColor = 'transparent';
            }
        }
    };

    return (
        <button
            type={type}
            style={baseStyles}
            disabled={disabled || loading}
            onClick={onClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            {...props}
        >
            {loading && (
                <span style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid transparent',
                    borderTopColor: 'currentColor',
                    borderRadius: '50%',
                    animation: 'spin 0.6s linear infinite',
                }} />
            )}
            {!loading && leftIcon}
            {children}
            {!loading && rightIcon}
        </button>
    );
};

export default Button;
