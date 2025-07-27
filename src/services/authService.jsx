import { API_BASE_URL } from '../config/apiConfig';
import { jwtDecode } from 'jwt-decode';

const API_URL = `${API_BASE_URL}/Auth`;

export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      let errorMessage = 'Error al iniciar sesión';
      if (errorData.errors) {
        const validationErrors = Object.values(errorData.errors).flat();
        if (validationErrors.length > 0) {
          errorMessage = validationErrors.join(', ');
        }
      } else if (errorData.title) {
        errorMessage = errorData.title;
      } else if (errorData.message) {
        errorMessage = errorData.message;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error de red o inesperado durante el login:', error);
    throw error;
  }
};

export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const setToken = (token) => {
  localStorage.setItem('token', token);
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const removeToken = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  if (!token || !user) return false;

  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decodedToken.exp > currentTime;
  } catch (e) {
    console.error('Error decodificando o verificando el token:', e);
    return false;
  }
};

export const verifyToken = async (token) => {
  if (!token) return false;

  try {
    const response = await fetch(`${API_BASE_URL}/Auth/verify-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.isValid;
    } else {
      console.warn('Token verification failed on backend:', response.status, await response.text());
      return false;
    }
  } catch (error) {
    console.error('Error during token verification request:', error);
    return false;
  }
};
