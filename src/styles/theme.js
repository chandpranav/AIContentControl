/**
 * AIContentControl Design System
 * Centralized theme configuration
 */

export const colors = {
    // Primary brand colors
    primary: {
        main: '#7857FF',
        light: '#9b5cff',
        dark: '#5a52d5',
        contrast: '#ffffff',
    },

    // Secondary accent
    secondary: {
        main: '#007c89',
        light: '#00a0b0',
        dark: '#005f6a',
        contrast: '#ffffff',
    },

    // Background colors
    background: {
        primary: '#1e1e2f',
        secondary: '#27293d',
        card: '#2b2954',
        hover: '#353659',
        gradient: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
    },

    // Text colors
    text: {
        primary: '#ffffff',
        secondary: '#e0e0e0',
        muted: '#b0b0c3',
        disabled: '#666680',
    },

    // Status colors
    status: {
        success: '#079455',
        successLight: '#e6fff2',
        error: '#d30000',
        errorLight: '#ffeded',
        warning: '#f59e0b',
        warningLight: '#fef3c7',
        info: '#3b82f6',
        infoLight: '#dbeafe',
    },

    // Border colors
    border: {
        light: 'rgba(255, 255, 255, 0.1)',
        medium: '#444',
        dark: '#353659',
    },
};

export const spacing = {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    xxl: '3rem',     // 48px
};

export const typography = {
    fontFamily: {
        primary: "'Poppins', 'Helvetica', 'Arial', sans-serif",
        mono: "'Fira Code', 'Monaco', monospace",
    },
    fontSize: {
        xs: '0.75rem',   // 12px
        sm: '0.875rem',  // 14px
        md: '1rem',      // 16px
        lg: '1.125rem',  // 18px
        xl: '1.25rem',   // 20px
        xxl: '1.5rem',   // 24px
        h3: '1.3rem',
        h2: '1.8rem',
        h1: '2rem',
        display: '3.2rem',
    },
    fontWeight: {
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
    },
    lineHeight: {
        tight: 1.2,
        normal: 1.5,
        relaxed: 1.8,
    },
};

export const borderRadius = {
    sm: '4px',
    md: '6px',
    lg: '8px',
    xl: '12px',
    full: '9999px',
};

export const shadows = {
    sm: '0 2px 4px rgba(0, 0, 0, 0.1)',
    md: '0 4px 10px rgba(0, 0, 0, 0.2)',
    lg: '0 4px 20px rgba(0, 0, 0, 0.3)',
    xl: '0 8px 32px rgba(0, 0, 0, 0.15)',
    glow: '0 0 20px rgba(155, 92, 255, 0.3)',
    glowPrimary: '0 4px 15px rgba(120, 87, 255, 0.4)',
};

export const transitions = {
    fast: '0.15s ease',
    normal: '0.2s ease',
    slow: '0.3s ease',
    spring: '0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
};

export const breakpoints = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
};

// Z-index scale
export const zIndex = {
    dropdown: 100,
    sticky: 200,
    modal: 300,
    toast: 400,
    tooltip: 500,
};

// Default theme object
const theme = {
    colors,
    spacing,
    typography,
    borderRadius,
    shadows,
    transitions,
    breakpoints,
    zIndex,
};

export default theme;
