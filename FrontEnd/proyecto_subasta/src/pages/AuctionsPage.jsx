import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  Alert,
} from '@mui/material';
import AuctionCard from '../components/auctions/AuctionCard';

const AuctionsPage = () => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    estado: 'all',
    ordenar: 'fechaFin',
    busqueda: '',
  });

  // Simulación de datos para desarrollo
  const mockAuctions = [
    {
      subastaId: 1,
      fechaInicio: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      fechaFin: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      estado: 'Activa',
      autos: [{
        marca: 'Toyota',
        modelo: 'Corolla',
        anio: 2020,
        precioBase: 15000,
        foto: '/images/toyota-corolla.jpg'
      }]
    },
    {
      subastaId: 2,
      fechaInicio: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
      fechaFin: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      estado: 'Activa',
      autos: [{
        marca: 'Honda',
        modelo: 'Civic',
        anio: 2021,
        precioBase: 18000,
        foto: '/images/honda-civic.jpg'
      }]
    },
    {
      subastaId: 3,
      fechaInicio: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
      fechaFin: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      estado: 'Finalizada',
      autos: [{
        marca: 'Volkswagen',
        modelo: 'Golf',
        anio: 2019,
        precioBase: 12000,
        foto: '/images/vw-golf.jpg'
      }]
    },
  ];

  useEffect(() => {
    // Simular carga de datos
    setLoading(true);
    setTimeout(() => {
      setAuctions(mockAuctions);
      setLoading(false);
    }, 1000);
  }, []);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const filteredAuctions = auctions
    .filter(auction => {
      if (filters.estado === 'active') {
        return new Date(auction.fechaFin) > new Date();
      }
      if (filters.estado === 'finished') {
        return new Date(auction.fechaFin) <= new Date();
      }
      return true;
    })
    .filter(auction => {
      const searchTerm = filters.busqueda.toLowerCase();
      return auction.autos.some(auto =>
        `${auto.marca} ${auto.modelo}`.toLowerCase().includes(searchTerm)
      );
    })
    .sort((a, b) => {
      switch (filters.ordenar) {
        case 'precioAsc':
          return a.autos[0].precioBase - b.autos[0].precioBase;
        case 'precioDesc':
          return b.autos[0].precioBase - a.autos[0].precioBase;
        case 'fechaFin':
          return new Date(a.fechaFin) - new Date(b.fechaFin);
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h3" component="h1" gutterBottom>
        Subastas Disponibles
      </Typography>

      {/* Filtros */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Buscar por marca o modelo"
            name="busqueda"
            value={filters.busqueda}
            onChange={handleFilterChange}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Estado</InputLabel>
            <Select
              name="estado"
              value={filters.estado}
              label="Estado"
              onChange={handleFilterChange}
            >
              <MenuItem value="all">Todas</MenuItem>
              <MenuItem value="active">Activas</MenuItem>
              <MenuItem value="finished">Finalizadas</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Ordenar por</InputLabel>
            <Select
              name="ordenar"
              value={filters.ordenar}
              label="Ordenar por"
              onChange={handleFilterChange}
            >
              <MenuItem value="fechaFin">Tiempo restante</MenuItem>
              <MenuItem value="precioAsc">Precio: Menor a Mayor</MenuItem>
              <MenuItem value="precioDesc">Precio: Mayor a Menor</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Lista de Subastas */}
      <Grid container spacing={3}>
        {filteredAuctions.length > 0 ? (
          filteredAuctions.map((auction) => (
            <Grid item xs={12} sm={6} md={4} key={auction.subastaId}>
              <AuctionCard auction={auction} />
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Alert severity="info">
              No se encontraron subastas que coincidan con los filtros seleccionados.
            </Alert>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default AuctionsPage; 