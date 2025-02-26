import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Chip,
  Grid,
} from '@mui/material';
import { Timer, LocalOffer, DirectionsCar } from '@mui/icons-material';
import { ROUTES } from '../../utils/routes';

const AuctionCard = ({ auction }) => {
  const navigate = useNavigate();
  const timeRemaining = new Date(auction.fechaFin) - new Date();
  const isActive = timeRemaining > 0;

  const formatTimeRemaining = () => {
    if (!isActive) return 'Finalizada';
    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    return `${days}d ${hours}h ${minutes}m`;
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="200"
        image={auction.autos[0]?.foto || '/images/default-car.jpg'}
        alt={auction.autos[0]?.marca}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          {auction.autos[0]?.marca} {auction.autos[0]?.modelo}
        </Typography>
        
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12}>
            <Box display="flex" alignItems="center" gap={1}>
              <Timer color="action" />
              <Typography variant="body2">
                {isActive ? 'Tiempo restante: ' : 'Estado: '}
                <strong>{formatTimeRemaining()}</strong>
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" alignItems="center" gap={1}>
              <LocalOffer color="action" />
              <Typography variant="body2">
                Precio base: <strong>${auction.autos[0]?.precioBase.toLocaleString()}</strong>
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" alignItems="center" gap={1}>
              <DirectionsCar color="action" />
              <Typography variant="body2">
                Año: <strong>{auction.autos[0]?.anio}</strong>
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Box display="flex" gap={1} mb={2}>
          <Chip
            label={isActive ? 'Activa' : 'Finalizada'}
            color={isActive ? 'success' : 'default'}
            size="small"
          />
          <Chip
            label={`${auction.autos.length} vehículo${auction.autos.length !== 1 ? 's' : ''}`}
            color="primary"
            size="small"
          />
        </Box>

        <Button
          variant="contained"
          fullWidth
          onClick={() => navigate(`${ROUTES.AUCTIONS.LIST}/${auction.subastaId}`)}
        >
          {isActive ? 'Participar en Subasta' : 'Ver Detalles'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AuctionCard; 