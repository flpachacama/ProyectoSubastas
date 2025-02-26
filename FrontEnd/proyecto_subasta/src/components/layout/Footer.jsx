import React from 'react';
import { Box, Container, Grid, Typography, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../utils/routes';

const Footer = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.grey[200],
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Subastas de Autos
            </Typography>
            <Typography variant="body2" color="text.secondary">
              La plataforma líder en subastas de vehículos en línea.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Enlaces Rápidos
            </Typography>
            <Link
              component="button"
              variant="body2"
              onClick={() => navigate(ROUTES.AUCTIONS.LIST)}
              sx={{ display: 'block', mb: 1 }}
            >
              Subastas Activas
            </Link>
            <Link
              component="button"
              variant="body2"
              onClick={() => navigate(ROUTES.CARS.LIST)}
              sx={{ display: 'block', mb: 1 }}
            >
              Catálogo de Autos
            </Link>
            <Link
              component="button"
              variant="body2"
              onClick={() => navigate(ROUTES.REGISTER)}
              sx={{ display: 'block' }}
            >
              Registrarse
            </Link>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Contacto
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Email: info@subastasautos.com
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Teléfono: (123) 456-7890
            </Typography>
          </Grid>
        </Grid>
        <Box mt={3}>
          <Typography variant="body2" color="text.secondary" align="center">
            {'© '}
            {currentYear}
            {' Subastas de Autos. Todos los derechos reservados.'}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 