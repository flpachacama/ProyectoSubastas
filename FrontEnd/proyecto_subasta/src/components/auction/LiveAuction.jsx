import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  TextField,
  Alert,
  Chip,
  Divider,
} from '@mui/material';
import { Timer, LocalOffer, Person } from '@mui/icons-material';
import { auctionService } from '../../services/api';
import { websocketService } from '../../services/websocket';
import { useAuth } from '../../context/AuthContext';

const LiveAuction = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [auction, setAuction] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState('');
  const [bids, setBids] = useState([]);

  useEffect(() => {
    const loadAuction = async () => {
      try {
        const data = await auctionService.getAuctionById(id);
        setAuction(data);
        setBids(data.pujas || []);
      } catch (err) {
        setError('Error al cargar la subasta');
      } finally {
        setLoading(false);
      }
    };

    loadAuction();
    
    // Conectar WebSocket
    const socket = websocketService.connect();
    websocketService.joinAuction(id);

    // Suscribirse a actualizaciones
    websocketService.onBidUpdate((newBid) => {
      setBids(prev => [newBid, ...prev]);
      setAuction(prev => ({
        ...prev,
        currentPrice: newBid.amount
      }));
    });

    websocketService.onAuctionStateUpdate((updatedAuction) => {
      setAuction(prev => ({
        ...prev,
        ...updatedAuction
      }));
    });

    websocketService.onAuctionEnd((result) => {
      setAuction(prev => ({
        ...prev,
        estado: 'Finalizada',
        winner: result.winner
      }));
    });

    // Actualizar tiempo restante
    const timer = setInterval(() => {
      if (auction?.fechaFin) {
        const end = new Date(auction.fechaFin);
        const now = new Date();
        const diff = end - now;

        if (diff <= 0) {
          setTimeRemaining('Finalizada');
          clearInterval(timer);
        } else {
          const minutes = Math.floor(diff / 60000);
          const seconds = Math.floor((diff % 60000) / 1000);
          setTimeRemaining(`${minutes}m ${seconds}s`);
        }
      }
    }, 1000);

    return () => {
      clearInterval(timer);
      websocketService.leaveAuction(id);
      websocketService.disconnect();
    };
  }, [id]);

  const handleBid = async () => {
    try {
      setError('');
      const amount = parseFloat(bidAmount);
      
      if (isNaN(amount) || amount <= 0) {
        setError('Por favor, ingrese un monto válido');
        return;
      }

      await auctionService.placeBid(id, { amount });
      websocketService.sendBid(id, amount);
      setBidAmount('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al realizar la puja');
    }
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>Cargando...</Box>;
  }

  if (!auction) {
    return <Alert severity="error">Subasta no encontrada</Alert>;
  }

  return (
    <Container maxWidth="lg">
      <Grid container spacing={3}>
        {/* Detalles del auto */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardMedia
              component="img"
              height="400"
              image={auction.autos[0]?.foto || '/images/default-car.jpg'}
              alt={`${auction.autos[0]?.marca} ${auction.autos[0]?.modelo}`}
            />
            <CardContent>
              <Typography variant="h4" gutterBottom>
                {auction.autos[0]?.marca} {auction.autos[0]?.modelo} ({auction.autos[0]?.anio})
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Chip
                  icon={<Timer />}
                  label={`Tiempo restante: ${timeRemaining}`}
                  color={auction.estado === 'Activa' ? 'primary' : 'default'}
                />
                <Chip
                  icon={<LocalOffer />}
                  label={`Precio actual: $${auction.currentPrice?.toLocaleString()}`}
                  color="secondary"
                />
              </Box>
              <Typography variant="body1" paragraph>
                Precio base: ${auction.autos[0]?.precioBase.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Panel de pujas */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Realizar Puja
              </Typography>
              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
              
              {auction.estado === 'Activa' && user && (
                <Box sx={{ mb: 3 }}>
                  <TextField
                    fullWidth
                    label="Monto de la puja"
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleBid}
                    disabled={!bidAmount}
                  >
                    Realizar Puja
                  </Button>
                </Box>
              )}

              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" gutterBottom>
                Historial de Pujas
              </Typography>
              <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                {bids.map((bid, index) => (
                  <Box key={index} sx={{ mb: 1, p: 1, bgcolor: 'background.paper' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Person fontSize="small" />
                      <Typography variant="body2">
                        Usuario {bid.compradorId}
                      </Typography>
                    </Box>
                    <Typography variant="h6" color="primary">
                      ${bid.monto.toLocaleString()}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(bid.fechaHora).toLocaleString()}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default LiveAuction; 