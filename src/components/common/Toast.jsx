import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { colors, spacing, borderRadius, shadows, transitions, zIndex } from '../../styles/theme';

// Toast Context
const ToastContext = createContext(null);

/**
 * Toast Provider component
 */
export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info', duration = 4000) => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type, duration }]);
        return id;
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const toast = {
        success: (message, duration) => addToast(message, 'success', duration),
        error: (message, duration) => addToast(message, 'error', duration),
        warning: (message, duration) => addToast(message, 'warning', duration),
        info: (message, duration) => addToast(message, 'info', duration),
    };

    return (
        <ToastContext.Provider value={toast}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
};

/**
 * Hook to use toast notifications
 */
export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

/**
 * Toast Container component
 */
const ToastContainer = ({ toasts, removeToast }) => {
    const containerStyles = {
        position: 'fixed',
        top: spacing.xl,
        right: spacing.xl,
        zIndex: zIndex.toast,
        display: 'flex',
        flexDirection: 'column',
        gap: spacing.sm,
        maxWidth: '400px',
    };

    return (
        <div style={containerStyles}>
            {toasts.map((toast) => (
                <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
            ))}
        </div>
    );
};

/**
 * Individual Toast component
 */
const Toast = ({ id, message, type, duration, onClose }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        // Animate in
        setTimeout(() => setIsVisible(true), 10);

        // Auto dismiss
        const timer = setTimeout(() => {
            handleClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration]);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(onClose, 200);
    };

    const typeStyles = {
        success: {
            backgroundColor: colors.status.successLight,
            color: colors.status.success,
            borderColor: colors.status.success,
            icon: '✓',
        },
        error: {
            backgroundColor: colors.status.errorLight,
            color: colors.status.error,
            borderColor: colors.status.error,
            icon: '✕',
        },
        warning: {
            backgroundColor: colors.status.warningLight,
            color: '#92400e',
            borderColor: colors.status.warning,
            icon: '⚠',
        },
        info: {
            backgroundColor: colors.status.infoLight,
            color: '#1e40af',
            borderColor: colors.status.info,
            icon: 'ℹ',
        },
    };

    const style = typeStyles[type] || typeStyles.info;

    const toastStyles = {
        display: 'flex',
        alignItems: 'center',
        gap: spacing.md,
        padding: `${spacing.md} ${spacing.lg}`,
        backgroundColor: style.backgroundColor,
        color: style.color,
        borderRadius: borderRadius.md,
        borderLeft: `4px solid ${style.borderColor}`,
        boxShadow: shadows.md,
        transform: isExiting ? 'translateX(100%)' : isVisible ? 'translateX(0)' : 'translateX(100%)',
        opacity: isExiting ? 0 : isVisible ? 1 : 0,
        transition: `all ${transitions.normal}`,
    };

    const iconStyles = {
        width: '24px',
        height: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: borderRadius.full,
        backgroundColor: style.borderColor,
        color: '#fff',
        fontSize: '12px',
        fontWeight: 'bold',
        flexShrink: 0,
    };

    const closeButtonStyles = {
        marginLeft: 'auto',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: '18px',
        color: 'inherit',
        opacity: 0.7,
        transition: `opacity ${transitions.fast}`,
        padding: spacing.xs,
    };

    return (
        <div style={toastStyles} role="alert">
            <span style={iconStyles}>{style.icon}</span>
            <span style={{ flex: 1 }}>{message}</span>
            <button
                onClick={handleClose}
                style={closeButtonStyles}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = 0.7)}
                aria-label="Close"
            >
                ×
            </button>
        </div>
    );
};

export default Toast;
