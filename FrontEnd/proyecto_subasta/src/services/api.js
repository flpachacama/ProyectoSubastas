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
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Servicios de autenticación
export const authService = {
  login: async (credentials) => {
    try {
      console.log('Enviando petición de login a:', `${config.API_URL}/api/authorization-server/login`);
      console.log('Credenciales:', credentials);
      const response = await api.post('/api/authorization-server/login', credentials);
      console.log('Login response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      throw error;
    }
  },
  register: async (userData) => {
    try {
      console.log('Enviando petición de registro a:', `${config.API_URL}/user/create`);
      const response = await api.post('/user/create', userData);
      console.log('Register response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Register error:', error.response?.data || error.message);
      throw error;
    }
  },
};

// Servicios de subastas
export const auctionService = {
  getActiveAuctions: async () => {
    const response = await api.get('/subastas/activas');
    return response.data;
  },
  getAuctionById: async (id) => {
    const response = await api.get(`/subastas/${id}`);
    return response.data;
  },
  placeBid: async (auctionId, bid) => {
    const response = await api.post(`/subastas/${auctionId}/pujar`, bid);
    return response.data;
  },
  createAuction: async (auctionData) => {
    const response = await api.post('/subastas', auctionData);
    return response.data;
  },
};

// Servicios de autos
export const carService = {
  getCars: async () => {
    const response = await api.get('/autos');
    return response.data;
  },
  getCarById: async (id) => {
    const response = await api.get(`/autos/${id}`);
    return response.data;
  },
  createCar: async (carData) => {
    const response = await api.post('/autos', carData);
    return response.data;
  },
};

export default api; 