import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Gavel as GavelIcon
} from '@mui/icons-material';
import carService from '../../services/carService';
import authService from '../../services/authService';

const CarList = () => {
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);

  useEffect(() => {
    loadCars();
  }, []);

  const loadCars = async () => {
    try {
      const data = await carService.getAllCars();
      // Filtrar solo los autos del vendedor actual
      const user = authService.getUser();
      const userCars = data.filter(car => car.sellerId === user.id);
      setCars(userCars);
    } catch (error) {
      console.error('Error al cargar autos:', error);
      setError('Error al cargar los autos. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCar = () => {
    navigate('/cars/create');
  };

  const handleEditCar = (carId) => {
    navigate(`/cars/edit/${carId}`);
  };

  const handleCreateAuction = (carId) => {
    navigate(`/auctions/create/${carId}`);
  };

  const handleDeleteClick = (car) => {
    setSelectedCar(car);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await carService.deleteCar(selectedCar.id);
      setCars(cars.filter(car => car.id !== selectedCar.id));
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error al eliminar auto:', error);
      setError('Error al eliminar el auto. Por favor, intenta nuevamente.');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          Mis Autos
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateCar}
        >
          Agregar Auto
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {cars.map((car) => (
          <Grid item xs={12} sm={6} md={4} key={car.id}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={car.photoCar || '/placeholder-car.jpg'}
                alt={`${car.brandCar} ${car.modelCar}`}
                onError={(e) => {
                  e.target.src = '/placeholder-car.jpg';
                  e.target.onerror = null;
                }}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {car.brandCar} {car.modelCar}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Año: {car.yearCar}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Precio Base: ${car.basePriceCar.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Estado: {car.statusCar}
                </Typography>

                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                  <IconButton
                    color="primary"
                    onClick={() => handleEditCar(car.id)}
                    title="Editar"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteClick(car)}
                    title="Eliminar"
                  >
                    <DeleteIcon />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => handleCreateAuction(car.id)}
                    title="Crear Subasta"
                  >
                    <GavelIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar este auto?
            {selectedCar && (
              <Typography component="div" sx={{ mt: 1, fontWeight: 'bold' }}>
                {selectedCar.brandCar} {selectedCar.modelCar} ({selectedCar.yearCar})
              </Typography>
            )}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CarList; 