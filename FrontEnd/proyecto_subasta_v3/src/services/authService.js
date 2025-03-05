import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = 'http://localhost:8081';

const login = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/api/authorization-server/login`, {
            email,
            password
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.data) {
            localStorage.setItem('token', response.data);
            return response.data;
        }
        return null;
    } catch (error) {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    throw new Error('Credenciales inválidas');
                case 404:
                    throw new Error('Usuario no encontrado');
                default:
                    throw new Error('Error en el servidor');
            }
        }
        throw new Error('Error de conexión');
    }
};

const register = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/api/user/create`, userData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || 'Error en el registro');
        }
        throw new Error('Error de conexión');
    }
};

const logout = () => {
    localStorage.removeItem('token');
};

const getToken = () => {
    return localStorage.getItem('token');
};

const isAuthenticated = () => {
    const token = getToken();
    return !!token;
};

const authService = {
  login,
  logout,
  getToken,
  isAuthenticated,

  getUser: () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      return jwtDecode(token);
    } catch {
      return null;
    }
  },

  register,

  // Role-based authentication helpers
  isVendedor: () => {
    const user = authService.getUser();
    return user?.authority === 'ROLE_Vendedor';
  },

  isComprador: () => {
    const user = authService.getUser();
    return user?.authority === 'ROLE_Comprador';
  },

  isAdmin: () => {
    const user = authService.getUser();
    return user?.authority === 'ROLE_Admin';
  }
};

export default authService; 