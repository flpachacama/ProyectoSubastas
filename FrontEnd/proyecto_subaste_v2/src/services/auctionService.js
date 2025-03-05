import axios from 'axios';
import config from '../config/config';

const api = axios.create({
  baseURL: config.API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
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

const auctionService = {
  // Obtener todas las subastas
  getAllAuctions: async () => {
    try {
      const response = await api.get('/auction/findAll');
      return response.data;
    } catch (error) {
      console.error('Error al obtener subastas:', error);
      throw error;
    }
  },

  // Crear una nueva subasta
  createAuction: async (auctionData) => {
    try {
      const response = await api.post('/auction/create', auctionData);
      return response.data;
    } catch (error) {
      console.error('Error al crear subasta:', error);
      throw error;
    }
  },

  // Actualizar una subasta existente
  updateAuction: async (auctionId, auctionData) => {
    try {
      const response = await api.patch(`/auction/update/${auctionId}`, auctionData);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar subasta:', error);
      throw error;
    }
  },

  // Eliminar una subasta
  deleteAuction: async (auctionId) => {
    try {
      const response = await api.delete(`/auction/delete?auctionId=${auctionId}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar subasta:', error);
      throw error;
    }
  },

  // Asociar un auto a una subasta
  createCarAuction: async (carAuctionData) => {
    try {
      const response = await api.post('/carAuction/create', carAuctionData);
      return response.data;
    } catch (error) {
      console.error('Error al asociar auto a subasta:', error);
      throw error;
    }
  },

  // Eliminar la asociación de un auto con una subasta
  deleteCarAuction: async (carAuctionId) => {
    try {
      const response = await api.delete(`/carAuction/delete?autosSubastaId=${carAuctionId}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar auto de subasta:', error);
      throw error;
    }
  }
};

export default auctionService; 