import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Alert,
  CircularProgress,
  MenuItem
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import carService from '../../services/carService';
import authService from '../../services/authService';

const CarForm = () => {
  const navigate = useNavigate();
  const { carId } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    brandCar: '',
    modelCar: '',
    yearCar: new Date().getFullYear(),
    basePriceCar: '',
    photoCar: '',
    statusCar: 'DISPONIBLE'
  });

  useEffect(() => {
    if (carId) {
      loadCarData();
    }
  }, [carId]);

  const loadCarData = async () => {
    try {
      setLoading(true);
      const cars = await carService.getAllCars();
      const car = cars.find(c => c.id === parseInt(carId));
      if (car) {
        setFormData({
          brandCar: car.brandCar,
          modelCar: car.modelCar,
          yearCar: car.yearCar,
          basePriceCar: car.basePriceCar,
          photoCar: car.photoCar,
          statusCar: car.statusCar
        });
      }
    } catch (error) {
      console.error('Error al cargar datos del auto:', error);
      setError('Error al cargar los datos del auto');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = authService.getUser();
      const carData = {
        ...formData,
        sellerId: user.id
      };

      if (carId) {
        await carService.updateCar(carId, carData);
      } else {
        await carService.createCar(carData, user.id);
      }

      navigate('/my-cars');
    } catch (error) {
      console.error('Error al guardar auto:', error);
      setError(error.response?.data || 'Error al guardar el auto');
    } finally {
      setLoading(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  if (loading && carId) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/my-cars')}
            sx={{ mb: 2 }}
          >
            Volver
          </Button>
          <Typography variant="h4" component="h1" gutterBottom>
            {carId ? 'Editar Auto' : 'Agregar Auto'}
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Marca"
                name="brandCar"
                value={formData.brandCar}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Modelo"
                name="modelCar"
                value={formData.modelCar}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                required
                fullWidth
                label="Año"
                name="yearCar"
                value={formData.yearCar}
                onChange={handleChange}
              >
                {years.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                type="number"
                label="Precio Base"
                name="basePriceCar"
                value={formData.basePriceCar}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <span>$</span>
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="URL de la Foto"
                name="photoCar"
                value={formData.photoCar}
                onChange={handleChange}
                helperText="Ingresa la URL de la imagen del auto"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                required
                fullWidth
                label="Estado"
                name="statusCar"
                value={formData.statusCar}
                onChange={handleChange}
              >
                <MenuItem value="DISPONIBLE">Disponible</MenuItem>
                <MenuItem value="EN_SUBASTA">En Subasta</MenuItem>
                <MenuItem value="VENDIDO">Vendido</MenuItem>
              </TextField>
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/my-cars')}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} />
              ) : carId ? (
                'Guardar Cambios'
              ) : (
                'Crear Auto'
              )}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default CarForm; 