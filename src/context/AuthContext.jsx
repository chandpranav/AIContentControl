import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';

// Create context
const AuthContext = createContext(null);

/**
 * Auth Provider component
 */
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Check for existing session on mount
    useEffect(() => {
        const initAuth = async () => {
            const storedUser = localStorage.getItem('user');
            const accessToken = localStorage.getItem('accessToken');

            if (storedUser && accessToken) {
                try {
                    setUser(JSON.parse(storedUser));
                    setIsAuthenticated(true);
                } catch (error) {
                    // Invalid stored data
                    localStorage.removeItem('user');
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                }
            }
            setIsLoading(false);
        };

        initAuth();
    }, []);

    /**
     * Sign up new user
     */
    const signup = useCallback(async (businessEmail, username, password) => {
        const response = await authService.signup(businessEmail, username, password);
        const { user: userData, accessToken, refreshToken } = response;

        // Store tokens and user
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(userData));

        setUser(userData);
        setIsAuthenticated(true);

        return userData;
    }, []);

    /**
     * Sign in user
     */
    const signin = useCallback(async (email, password) => {
        const response = await authService.signin(email, password);
        const { user: userData, accessToken, refreshToken } = response;

        // Store tokens and user
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(userData));

        setUser(userData);
        setIsAuthenticated(true);

        return userData;
    }, []);

    /**
     * Logout user
     */
    const logout = useCallback(async () => {
        await authService.logout();
        setUser(null);
        setIsAuthenticated(false);
    }, []);

    /**
     * Change password
     */
    const changePassword = useCallback(async (currentPassword, newPassword) => {
        const response = await authService.changePassword(currentPassword, newPassword);
        // After password change, user needs to re-login
        await logout();
        return response;
    }, [logout]);

    /**
     * Update user data
     */
    const updateUser = useCallback((userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    }, []);

    const value = {
        user,
        isLoading,
        isAuthenticated,
        signup,
        signin,
        logout,
        changePassword,
        updateUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook to use auth context
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
