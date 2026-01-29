import React, { useState } from 'react';
import { colors, spacing, borderRadius, typography, transitions } from '../../styles/theme';

/**
 * Reusable Input component with label and error handling
 */
const Input = ({
    label,
    type = 'text',
    value,
    onChange,
    placeholder,
    error,
    disabled = false,
    required = false,
    fullWidth = true,
    leftIcon,
    rightIcon,
    onRightIconClick,
    style,
    inputStyle,
    ...props
}) => {
    const [isFocused, setIsFocused] = useState(false);

    const containerStyles = {
        marginBottom: spacing.md,
        width: fullWidth ? '100%' : 'auto',
        ...style,
    };

    const labelStyles = {
        display: 'block',
        marginBottom: spacing.sm,
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.semibold,
        color: error ? colors.status.error : colors.text.primary,
    };

    const inputWrapperStyles = {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
    };

    const inputStyles = {
        width: '100%',
        padding: leftIcon ? `0.75rem 0.75rem 0.75rem 2.5rem` : '0.75rem',
        paddingRight: rightIcon ? '2.5rem' : '0.75rem',
        fontSize: typography.fontSize.md,
        fontFamily: typography.fontFamily.primary,
        color: colors.text.primary,
        backgroundColor: colors.background.primary,
        border: `1px solid ${error ? colors.status.error : isFocused ? colors.primary.main : colors.border.medium}`,
        borderRadius: borderRadius.md,
        outline: 'none',
        transition: `border-color ${transitions.normal}`,
        opacity: disabled ? 0.5 : 1,
        ...inputStyle,
    };

    const iconStyles = {
        position: 'absolute',
        color: colors.text.muted,
        display: 'flex',
        alignItems: 'center',
    };

    const errorStyles = {
        marginTop: spacing.xs,
        fontSize: typography.fontSize.sm,
        color: colors.status.error,
    };

    return (
        <div style={containerStyles}>
            {label && (
                <label style={labelStyles}>
                    {label}
                    {required && <span style={{ color: colors.status.error, marginLeft: '2px' }}>*</span>}
                </label>
            )}
            <div style={inputWrapperStyles}>
                {leftIcon && (
                    <span style={{ ...iconStyles, left: spacing.md }}>
                        {leftIcon}
                    </span>
                )}
                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    required={required}
                    style={inputStyles}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    {...props}
                />
                {rightIcon && (
                    <span
                        style={{
                            ...iconStyles,
                            right: spacing.md,
                            cursor: onRightIconClick ? 'pointer' : 'default',
                        }}
                        onClick={onRightIconClick}
                    >
                        {rightIcon}
                    </span>
                )}
            </div>
            {error && <div style={errorStyles}>{error}</div>}
        </div>
    );
};

export default Input;
