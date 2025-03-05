import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  MenuItem,
  InputAdornment,
  Divider,
  Alert,
  CircularProgress,
  IconButton
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  PhotoCamera as PhotoCameraIcon
} from '@mui/icons-material';

const VehicleForm = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Para edición
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    price: '',
    description: '',
    transmission: '',
    fuelType: '',
    mileage: '',
    color: '',
    doors: '',
    features: '',
    images: []
  });

  const transmissionTypes = [
    { value: 'manual', label: 'Manual' },
    { value: 'automatic', label: 'Automático' }
  ];

  const fuelTypes = [
    { value: 'gasoline', label: 'Gasolina' },
    { value: 'diesel', label: 'Diésel' },
    { value: 'electric', label: 'Eléctrico' },
    { value: 'hybrid', label: 'Híbrido' }
  ];

  useEffect(() => {
    if (id) {
      // Cargar datos del vehículo si estamos en modo edición
      loadVehicleData();
    }
  }, [id]);

  const loadVehicleData = async () => {
    try {
      setLoading(true);
      // Aquí irá la llamada a la API para obtener los datos del vehículo
      // const response = await api.get(`/vehicles/${id}`);
      // setFormData(response.data);
    } catch (error) {
      console.error('Error al cargar datos del vehículo:', error);
      setError('Error al cargar los datos del vehículo');
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

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    // Aquí puedes agregar validación de archivos
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validaciones
      if (!formData.brand || !formData.model || !formData.price) {
        throw new Error('Por favor completa todos los campos requeridos');
      }

      // Crear FormData para manejar las imágenes
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'images') {
          formData.images.forEach(image => {
            submitData.append('images', image);
          });
        } else {
          submitData.append(key, formData[key]);
        }
      });

      // Aquí irá la llamada a la API
      // const response = await api.post('/vehicles', submitData);
      console.log('Datos a enviar:', formData);
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/my-cars');
      }, 2000);
    } catch (error) {
      console.error('Error al guardar vehículo:', error);
      setError(error.message || 'Error al guardar el vehículo');
    } finally {
      setLoading(false);
    }
  };

  if (loading && id) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/my-cars')}
            sx={{ mb: 2 }}
          >
            Volver
          </Button>
          <Typography variant="h4" component="h1" gutterBottom>
            {id ? 'Editar Vehículo' : 'Agregar Nuevo Vehículo'}
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Vehículo guardado exitosamente
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Marca"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Modelo"
                name="model"
                value={formData.model}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Año"
                name="year"
                type="number"
                value={formData.year}
                onChange={handleChange}
                inputProps={{ min: 1900, max: new Date().getFullYear() + 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Precio Base"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }}>Detalles del Vehículo</Divider>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Transmisión"
                name="transmission"
                value={formData.transmission}
                onChange={handleChange}
              >
                {transmissionTypes.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Tipo de Combustible"
                name="fuelType"
                value={formData.fuelType}
                onChange={handleChange}
              >
                {fuelTypes.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Kilometraje"
                name="mileage"
                type="number"
                value={formData.mileage}
                onChange={handleChange}
                InputProps={{
                  endAdornment: <InputAdornment position="end">km</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Color"
                name="color"
                value={formData.color}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Número de Puertas"
                name="doors"
                type="number"
                value={formData.doors}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Descripción"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="outlined"
                component="label"
                startIcon={<PhotoCameraIcon />}
              >
                Subir Imágenes
                <input
                  type="file"
                  hidden
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </Button>
              {formData.images.length > 0 && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {formData.images.length} imágenes seleccionadas
                </Typography>
              )}
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
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
                  ) : id ? (
                    'Guardar Cambios'
                  ) : (
                    'Crear Vehículo'
                  )}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default VehicleForm; 