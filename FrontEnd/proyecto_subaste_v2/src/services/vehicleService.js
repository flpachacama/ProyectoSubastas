import axios from 'axios';
import config from '../config/config';

const { API_URL } = config;

const vehicleService = {
  // Vehículos
  getAllVehicles: async () => {
    try {
      const response = await axios.get(`${API_URL}/vehicles`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener vehículos:', error);
      throw error;
    }
  },

  getVehicleById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/vehicles/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener vehículo:', error);
      throw error;
    }
  },

  createVehicle: async (vehicleData) => {
    try {
      const formData = new FormData();
      
      // Agregar todos los campos del vehículo
      Object.keys(vehicleData).forEach(key => {
        if (key === 'images') {
          vehicleData.images.forEach(image => {
            formData.append('images', image);
          });
        } else {
          formData.append(key, vehicleData[key]);
        }
      });

      const response = await axios.post(`${API_URL}/vehicles`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error al crear vehículo:', error);
      throw error;
    }
  },

  updateVehicle: async (id, vehicleData) => {
    try {
      const formData = new FormData();
      
      Object.keys(vehicleData).forEach(key => {
        if (key === 'images') {
          vehicleData.images.forEach(image => {
            formData.append('images', image);
          });
        } else {
          formData.append(key, vehicleData[key]);
        }
      });

      const response = await axios.put(`${API_URL}/vehicles/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error al actualizar vehículo:', error);
      throw error;
    }
  },

  deleteVehicle: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/vehicles/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar vehículo:', error);
      throw error;
    }
  },

  // Subastas
  createAuction: async (auctionData) => {
    try {
      const response = await axios.post(`${API_URL}/auctions`, auctionData);
      return response.data;
    } catch (error) {
      console.error('Error al crear subasta:', error);
      throw error;
    }
  },

  getAuctionsByVehicle: async (vehicleId) => {
    try {
      const response = await axios.get(`${API_URL}/auctions/vehicle/${vehicleId}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener subastas del vehículo:', error);
      throw error;
    }
  },

  getMyAuctions: async () => {
    try {
      const response = await axios.get(`${API_URL}/auctions/my-auctions`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener mis subastas:', error);
      throw error;
    }
  },

  updateAuction: async (id, auctionData) => {
    try {
      const response = await axios.put(`${API_URL}/auctions/${id}`, auctionData);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar subasta:', error);
      throw error;
    }
  },

  cancelAuction: async (id) => {
    try {
      const response = await axios.post(`${API_URL}/auctions/${id}/cancel`);
      return response.data;
    } catch (error) {
      console.error('Error al cancelar subasta:', error);
      throw error;
    }
  }
};

export default vehicleService; 