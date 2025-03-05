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

const carService = {
  // Obtener todos los autos del vendedor
  getAllCars: async () => {
    try {
      const response = await api.get('/car/findAll');
      return response.data;
    } catch (error) {
      console.error('Error al obtener autos:', error);
      throw error;
    }
  },

  // Crear un nuevo auto
  createCar: async (carData, sellerId) => {
    try {
      const response = await api.post(`/car/create/${sellerId}`, carData);
      return response.data;
    } catch (error) {
      console.error('Error al crear auto:', error);
      throw error;
    }
  },

  // Actualizar un auto existente
  updateCar: async (carId, carData) => {
    try {
      const response = await api.patch(`/car/update?autoId=${carId}`, carData);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar auto:', error);
      throw error;
    }
  },

  // Eliminar un auto
  deleteCar: async (carId) => {
    try {
      const response = await api.delete(`/car/delete?autoId=${carId}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar auto:', error);
      throw error;
    }
  }
};

export default carService; 