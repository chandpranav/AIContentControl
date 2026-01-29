import React from 'react';
import { colors, spacing, borderRadius, shadows } from '../../styles/theme';

/**
 * Reusable Card component
 */
const Card = ({
    children,
    variant = 'default',
    padding = 'medium',
    hoverable = false,
    onClick,
    style,
    ...props
}) => {
    const variants = {
        default: {
            backgroundColor: colors.background.secondary,
        },
        primary: {
            backgroundColor: colors.background.card,
        },
        dark: {
            backgroundColor: colors.background.primary,
        },
    };

    const paddings = {
        none: '0',
        small: spacing.md,
        medium: spacing.lg,
        large: spacing.xl,
    };

    const baseStyles = {
        ...variants[variant],
        padding: paddings[padding],
        borderRadius: borderRadius.lg,
        boxShadow: shadows.lg,
        transition: hoverable ? 'transform 0.2s ease, box-shadow 0.2s ease' : 'none',
        cursor: onClick || hoverable ? 'pointer' : 'default',
        ...style,
    };

    const handleMouseEnter = (e) => {
        if (hoverable) {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = shadows.xl;
        }
    };

    const handleMouseLeave = (e) => {
        if (hoverable) {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = shadows.lg;
        }
    };

    return (
        <div
            style={baseStyles}
            onClick={onClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            {...props}
        >
            {children}
        </div>
    );
};

/**
 * Card Header component
 */
export const CardHeader = ({ children, style, ...props }) => (
    <div
        style={{
            marginBottom: spacing.md,
            paddingBottom: spacing.sm,
            borderBottom: `1px solid ${colors.border.dark}`,
            ...style,
        }}
        {...props}
    >
        {children}
    </div>
);

/**
 * Card Title component
 */
export const CardTitle = ({ children, style, ...props }) => (
    <h3
        style={{
            fontSize: '1.1rem',
            fontWeight: 600,
            color: colors.text.primary,
            margin: 0,
            ...style,
        }}
        {...props}
    >
        {children}
    </h3>
);

/**
 * Card Content component
 */
export const CardContent = ({ children, style, ...props }) => (
    <div style={{ ...style }} {...props}>
        {children}
    </div>
);

export default Card;
