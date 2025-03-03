import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Signup function
    const createUser = async (email, password) => {
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/api/signup', { email, password });
            localStorage.setItem('auth-token', response.data.token);
            setUser(response.data.user);
        } catch (error) {
            console.error('Signup error:', error);
        } finally {
            setLoading(false);
        }
    };

    // Login function
    const login = async (email, password) => {
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/api/login', { email, password });
            localStorage.setItem('auth-token', response.data.token);
            setUser(response.data.user);
        } catch (error) {
            console.error('Login error:', error);
        } finally {
            setLoading(false);
        }
    };

    // Logout function
    const logOut = () => {
        localStorage.removeItem('auth-token');
        setUser(null);
    };

    // Check authentication status on page load
    useEffect(() => {
        const checkAuthStatus = async () => {
            const token = localStorage.getItem('auth-token');
            if (token) {
                try {
                    const response = await axios.get('http://localhost:5000/api/me', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setUser(response.data.user);
                } catch (error) {
                    console.error('Auth check error:', error);
                    localStorage.removeItem('auth-token');
                }
            }
            setLoading(false);
        };
        checkAuthStatus();
    }, []);

    const authInfo = {
        user,
        loading,
        createUser,
        login,
        logOut,
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
