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
  Alert,
  CircularProgress,
  Divider,
  Card,
  CardContent,
  CardMedia,
  Chip
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { addHours } from 'date-fns';
import vehicleService from '../../services/vehicleService';

const AuctionForm = () => {
  const navigate = useNavigate();
  const { vehicleId } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [vehicle, setVehicle] = useState(null);

  const [formData, setFormData] = useState({
    startDate: addHours(new Date(), 1), // Por defecto, inicia en 1 hora
    endDate: addHours(new Date(), 25), // Por defecto, dura 24 horas
    minimumBid: 0,
    reservePrice: 0,
    description: ''
  });

  useEffect(() => {
    if (vehicleId) {
      loadVehicleData();
    }
  }, [vehicleId]);

  const loadVehicleData = async () => {
    try {
      setLoading(true);
      const vehicleData = await vehicleService.getVehicleById(vehicleId);
      setVehicle(vehicleData);
      
      // Establecer precio mínimo de puja y precio de reserva
      setFormData(prev => ({
        ...prev,
        minimumBid: Math.ceil(vehicleData.price * 0.05), // 5% del precio como puja mínima
        reservePrice: vehicleData.price // Precio base como precio de reserva
      }));
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

  const handleDateChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.startDate || !formData.endDate) {
      throw new Error('Las fechas de inicio y fin son requeridas');
    }
    
    if (formData.startDate >= formData.endDate) {
      throw new Error('La fecha de fin debe ser posterior a la fecha de inicio');
    }

    if (formData.startDate < new Date()) {
      throw new Error('La fecha de inicio debe ser futura');
    }

    if (formData.minimumBid <= 0) {
      throw new Error('La puja mínima debe ser mayor a 0');
    }

    if (formData.reservePrice <= 0) {
      throw new Error('El precio de reserva debe ser mayor a 0');
    }

    if (formData.minimumBid > formData.reservePrice) {
      throw new Error('La puja mínima no puede ser mayor al precio de reserva');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      validateForm();

      const auctionData = {
        ...formData,
        vehicleId,
        status: 'pending'
      };

      await vehicleService.createAuction(auctionData);
      setSuccess(true);
      setTimeout(() => {
        navigate('/my-cars');
      }, 2000);
    } catch (error) {
      console.error('Error al crear la subasta:', error);
      setError(error.message || 'Error al crear la subasta');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !vehicle) {
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
            Crear Subasta
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Subasta creada exitosamente
          </Alert>
        )}

        {vehicle && (
          <Card sx={{ mb: 4 }}>
            <CardMedia
              component="img"
              height="200"
              image={vehicle.image}
              alt={`${vehicle.brand} ${vehicle.model}`}
              onError={(e) => {
                e.target.src = '/placeholder-car.jpg';
                e.target.onerror = null;
              }}
            />
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {vehicle.brand} {vehicle.model} ({vehicle.year})
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Precio Base: ${vehicle.price.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {vehicle.description}
              </Typography>
              <Box sx={{ mt: 1 }}>
                {vehicle.features.map((feature, index) => (
                  <Chip
                    key={index}
                    label={feature}
                    size="small"
                    sx={{ mr: 0.5, mb: 0.5 }}
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }}>Configuración de la Subasta</Divider>
            </Grid>

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Grid item xs={12} sm={6}>
                <DateTimePicker
                  label="Fecha y hora de inicio"
                  value={formData.startDate}
                  onChange={(newValue) => handleDateChange('startDate', newValue)}
                  minDateTime={addHours(new Date(), 1)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DateTimePicker
                  label="Fecha y hora de fin"
                  value={formData.endDate}
                  onChange={(newValue) => handleDateChange('endDate', newValue)}
                  minDateTime={addHours(formData.startDate, 1)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true
                    }
                  }}
                />
              </Grid>
            </LocalizationProvider>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Puja mínima"
                name="minimumBid"
                type="number"
                value={formData.minimumBid}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <span>$</span>
                }}
                helperText="Monto mínimo para cada puja"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Precio de reserva"
                name="reservePrice"
                type="number"
                value={formData.reservePrice}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <span>$</span>
                }}
                helperText="Precio mínimo para vender el vehículo"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Descripción de la subasta"
                name="description"
                value={formData.description}
                onChange={handleChange}
                helperText="Información adicional para los compradores"
              />
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
                  ) : (
                    'Crear Subasta'
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

export default AuctionForm; 