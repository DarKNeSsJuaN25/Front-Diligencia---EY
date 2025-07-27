import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import {
  loginUser,
  logoutUser,
  getToken,
  setToken,
  removeToken,
  verifyToken
} from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const storedToken = getToken();
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
          let parsedUser;
          let decodedToken;

          try {
            parsedUser = JSON.parse(storedUser);
            decodedToken = jwtDecode(storedToken);
          } catch (decodeError) {
            removeToken();
            setUser(null);
            setIsLoading(false);
            return;
          }

          const currentTime = Date.now() / 1000;

          if (decodedToken.exp < currentTime) {
            removeToken();
            setUser(null);
          } else {
            const isBackendTokenValid = await verifyToken(storedToken);

            if (isBackendTokenValid) {
              const userRoles = Array.isArray(parsedUser.roles) ? parsedUser.roles : (parsedUser.roles ? [parsedUser.roles] : []);
              setUser({
                userId: parsedUser.userId,
                email: parsedUser.email,
                roles: userRoles,
                token: storedToken
              });
            } else {
              removeToken();
              setUser(null);
            }
          }
        } else {
          removeToken();
          setUser(null);
        }
      } catch (error) {
        removeToken();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const handleLogin = async (email, password) => {
    setIsLoading(true);
    try {
      const authData = await loginUser(email, password);

      const userRoles = Array.isArray(authData.roles) ? authData.roles : (authData.roles ? [authData.roles] : []);

      setToken(authData.token);
      localStorage.setItem('user', JSON.stringify({
        userId: authData.userId,
        email: authData.email,
        roles: userRoles
      }));

      setUser({
        userId: authData.userId,
        email: authData.email,
        roles: userRoles,
        token: authData.token
      });

      navigate('/providers');
      return true;
    } catch (error) {
      removeToken();
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    navigate('/login');
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login: handleLogin,
    logout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
