import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Fab,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Gavel as GavelIcon,
  Add as AddIcon,
  DirectionsCar as CarIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import vehicleService from '../../services/vehicleService';

const VehicleList = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      setLoading(true);
      const data = await vehicleService.getAllVehicles();
      setVehicles(data);
    } catch (error) {
      console.error('Error al cargar vehículos:', error);
      setError('Error al cargar la lista de vehículos');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      setLoading(true);
      await vehicleService.deleteVehicle(selectedVehicle.id);
      setDeleteDialogOpen(false);
      setSelectedVehicle(null);
      // Recargar la lista después de eliminar
      await loadVehicles();
    } catch (error) {
      console.error('Error al eliminar vehículo:', error);
      setError('Error al eliminar el vehículo');
    } finally {
      setLoading(false);
    }
  };

  const getStatusChip = (status) => {
    const statusConfig = {
      available: { label: 'Disponible', color: 'success' },
      in_auction: { label: 'En Subasta', color: 'primary' },
      sold: { label: 'Vendido', color: 'default' }
    };

    const config = statusConfig[status] || statusConfig.available;
    return <Chip label={config.label} color={config.color} size="small" />;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Mis Vehículos
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate('/my-cars/add')}
        >
          Agregar Vehículo
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {vehicles.map((vehicle) => (
          <Grid item xs={12} sm={6} md={4} key={vehicle.id}>
            <Card elevation={3}>
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
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h6" component="div">
                    {vehicle.brand} {vehicle.model}
                  </Typography>
                  {getStatusChip(vehicle.status)}
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Año: {vehicle.year}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Precio Base: ${vehicle.price.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
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
              <CardActions sx={{ justifyContent: 'flex-end' }}>
                <Tooltip title="Editar">
                  <IconButton 
                    size="small" 
                    onClick={() => navigate(`/my-cars/edit/${vehicle.id}`)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Eliminar">
                  <IconButton 
                    size="small" 
                    onClick={() => {
                      setSelectedVehicle(vehicle);
                      setDeleteDialogOpen(true);
                    }}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
                {vehicle.status === 'available' && (
                  <Tooltip title="Crear Subasta">
                    <IconButton 
                      size="small" 
                      onClick={() => navigate(`/create-auction/${vehicle.id}`)}
                      color="secondary"
                    >
                      <GavelIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Diálogo de confirmación para eliminar */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          ¿Estás seguro de que deseas eliminar este vehículo?
          {selectedVehicle && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              {selectedVehicle.brand} {selectedVehicle.model} ({selectedVehicle.year})
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Botón flotante para agregar (visible en móviles) */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          display: { xs: 'flex', sm: 'none' }
        }}
        onClick={() => navigate('/my-cars/add')}
      >
        <AddIcon />
      </Fab>
    </Container>
  );
};

export default VehicleList; 