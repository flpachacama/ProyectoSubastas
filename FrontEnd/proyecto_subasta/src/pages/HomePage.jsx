import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
} from '@mui/material';
import { GavelRounded, DirectionsCarRounded, SecurityRounded } from '@mui/icons-material';
import { ROUTES } from '../utils/routes';

const HomePage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <GavelRounded sx={{ fontSize: 40 }} />,
      title: 'Subastas en Tiempo Real',
      description: 'Participa en subastas en vivo y compite por los mejores vehículos.',
    },
    {
      icon: <DirectionsCarRounded sx={{ fontSize: 40 }} />,
      title: 'Amplio Catálogo',
      description: 'Encuentra una gran variedad de autos de diferentes marcas y modelos.',
    },
    {
      icon: <SecurityRounded sx={{ fontSize: 40 }} />,
      title: 'Transacciones Seguras',
      description: 'Garantizamos la seguridad en todas las operaciones realizadas.',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          mb: 6,
          borderRadius: '0 0 20px 20px',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" component="h1" gutterBottom>
                Subastas de Autos Online
              </Typography>
              <Typography variant="h5" paragraph>
                La forma más segura y eficiente de comprar y vender vehículos.
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                onClick={() => navigate(ROUTES.AUCTIONS.LIST)}
                sx={{ mr: 2 }}
              >
                Ver Subastas
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                size="large"
                onClick={() => navigate(ROUTES.REGISTER)}
              >
                Registrarse
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="/images/hero-car.jpg"
                alt="Subasta de autos"
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 2,
                  boxShadow: 3,
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 6 }}>
        <Typography variant="h3" align="center" gutterBottom>
          ¿Por qué elegirnos?
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
                <Box sx={{ color: 'primary.main', mb: 2 }}>
                  {feature.icon}
                </Box>
                <CardContent>
                  <Typography variant="h5" component="h2" align="center" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" align="center">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box sx={{ bgcolor: 'grey.100', py: 6 }}>
        <Container maxWidth="lg">
          <Card>
            <Grid container>
              <Grid item xs={12} md={6}>
                <CardMedia
                  component="img"
                  height="300"
                  image="/images/auction-cta.jpg"
                  alt="Subasta en vivo"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h4" gutterBottom>
                    ¿Listo para comenzar?
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Únete a nuestra plataforma y descubre una nueva forma de participar en subastas de vehículos.
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={() => navigate(ROUTES.REGISTER)}
                  >
                    Crear Cuenta
                  </Button>
                </CardContent>
              </Grid>
            </Grid>
          </Card>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage; 