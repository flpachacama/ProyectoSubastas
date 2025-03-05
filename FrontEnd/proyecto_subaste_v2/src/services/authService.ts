import axios from 'axios';
import config from '../config/config';

const api = axios.create({
  baseURL: config.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
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
    } else if (error.request) {
      // La petición fue hecha pero no se recibió respuesta
      console.error('Error de petición:', error.request);
    } else {
      // Algo sucedió en la configuración de la petición que causó el error
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export interface LoginCredentials {
  emailUser: string;
  passwordUser: string;
}

export interface RegisterData {
  nameUser: string;
  lastnameUser: string;
  emailUser: string;
  passwordUser: string;
  rolUser: string;
  activateUser: boolean;
}

export const authService = {
  login: async (credentials: LoginCredentials) => {
    try {
      const url = '/api/authorization-server/login';
      console.log('Enviando petición de login a:', `${config.API_URL}${url}`);
      console.log('Credenciales:', credentials);
      
      const response = await api.post(url, credentials);
      console.log('Login response:', response.data);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  register: async (userData: RegisterData) => {
    try {
      const url = '/api/user/create';
      console.log('Enviando petición de registro a:', `${config.API_URL}${url}`);
      console.log('Datos de registro:', userData);
      
      const response = await api.post(url, userData);
      console.log('Register response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('token');
    return !!token;
  },

  getToken: (): string | null => {
    return localStorage.getItem('token');
  },

  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};

export default authService; 