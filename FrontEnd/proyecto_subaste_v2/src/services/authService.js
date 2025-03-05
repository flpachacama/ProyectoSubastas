import axios from 'axios';
import config from '../config/config';
import { jwtDecode } from 'jwt-decode';

const api = axios.create({
  baseURL: config.API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true
});

// Interceptor para agregar el token a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Log de la petición para debugging
    console.log('Request Config:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      data: config.data
    });
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // El servidor respondió con un código de estado fuera del rango 2xx
      console.error('Error de respuesta:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      });
      if (error.response.status === 403) {
        console.error('Error de autenticación - Detalles completos:', error);
      }
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // La petición fue hecha pero no se recibió respuesta
      console.error('Error de petición:', error.request);
      return Promise.reject('No se pudo conectar con el servidor');
    } else {
      // Algo sucedió en la configuración de la petición que causó el error
      console.error('Error:', error.message);
      return Promise.reject('Error al procesar la solicitud');
    }
  }
);

const authService = {
  login: async (credentials) => {
    try {
      console.log('Intentando login con:', credentials);
      const loginData = {
        email: credentials.email,
        password: credentials.password
      };
      console.log('Datos enviados al servidor:', loginData);
      
      const response = await api.post('/api/authorization-server/login', loginData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Respuesta del servidor:', response.data);
      
      if (response.data && response.data.token) {
        console.log('Token recibido:', response.data.token);
        localStorage.setItem('token', response.data.token);
        return response.data;
      } else {
        throw new Error('No se recibió un token válido del servidor');
      }
    } catch (error) {
      console.error('Error en login:', error);
      if (error.response) {
        throw error.response.data;
      }
      throw error;
    }
  },

  register: async (userData) => {
    try {
      const registerData = {
        email: userData.email,
        password: userData.password,
        name: userData.name,
        lastName: userData.lastName,
        role: userData.role
      };
      console.log('Datos de registro enviados:', registerData);
      const response = await api.post('/api/user/create', registerData);
      console.log('Respuesta del registro:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error en registro:', error);
      if (error.response) {
        throw error.response.data;
      }
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    console.log('Token para verificar autenticación:', token);
    if (!token) return false;
    
    try {
      const decodedToken = jwtDecode(token);
      return decodedToken.exp * 1000 > Date.now();
    } catch (error) {
      console.error('Error al verificar autenticación:', error);
      return false;
    }
  },

  getUser: () => {
    const token = localStorage.getItem('token');
    console.log('Token para decodificar usuario:', token);
    if (!token) return null;
    
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Error al decodificar token:', error);
      return null;
    }
  },

  isVendedor: () => {
    const user = authService.getUser();
    return user && user.role === 'VENDEDOR';
  },

  isComprador: () => {
    const user = authService.getUser();
    return user && user.role === 'COMPRADOR';
  },

  isAdmin: () => {
    const user = authService.getUser();
    return user && user.role === 'ADMIN';
  }
};

export default authService; 