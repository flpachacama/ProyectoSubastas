import React from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider
} from '@mui/material';
import {
  Gavel as GavelIcon,
  DirectionsCar as CarIcon,
  Person as PersonIcon,
  Timeline as TimelineIcon,
  MonetizationOn as MoneyIcon,
  Schedule as ScheduleIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import authService from '../../services/authService';

const DashboardCard = ({ title, value, icon, description }) => (
  <Card elevation={3} sx={{ height: '100%' }}>
    <CardHeader
      avatar={icon}
      title={title}
      titleTypographyProps={{ variant: 'h6' }}
    />
    <CardContent>
      <Typography variant="h4" component="div" gutterBottom align="center">
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const user = authService.getUser();

  const getAdminDashboard = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6} lg={3}>
        <DashboardCard
          title="Usuarios Totales"
          value="120"
          icon={<PersonIcon color="primary" />}
          description="Total de usuarios registrados en la plataforma"
        />
      </Grid>
      <Grid item xs={12} md={6} lg={3}>
        <DashboardCard
          title="Subastas Activas"
          value="25"
          icon={<GavelIcon color="secondary" />}
          description="Subastas en curso actualmente"
        />
      </Grid>
      <Grid item xs={12} md={6} lg={3}>
        <DashboardCard
          title="Vehículos"
          value="85"
          icon={<CarIcon color="success" />}
          description="Total de vehículos registrados"
        />
      </Grid>
      <Grid item xs={12} md={6} lg={3}>
        <DashboardCard
          title="Ventas Totales"
          value="$1.2M"
          icon={<MoneyIcon color="info" />}
          description="Valor total de ventas realizadas"
        />
      </Grid>
      <Grid item xs={12} md={8}>
        <Paper sx={{ p: 2, height: '100%' }}>
          <Typography variant="h6" gutterBottom>
            Actividad Reciente
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon><StarIcon color="primary" /></ListItemIcon>
              <ListItemText 
                primary="Nueva subasta creada" 
                secondary="BMW M3 2022 - Hace 2 horas"
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemIcon><MoneyIcon color="success" /></ListItemIcon>
              <ListItemText 
                primary="Subasta finalizada" 
                secondary="Mercedes-Benz C200 - $45,000"
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemIcon><PersonIcon color="info" /></ListItemIcon>
              <ListItemText 
                primary="Nuevo usuario registrado" 
                secondary="Juan Pérez - Vendedor"
              />
            </ListItem>
          </List>
        </Paper>
      </Grid>
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2, height: '100%' }}>
          <Typography variant="h6" gutterBottom>
            Estadísticas Generales
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon><TrendingUpIcon color="success" /></ListItemIcon>
              <ListItemText 
                primary="Tasa de Éxito" 
                secondary="85% de subastas completadas"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><TimelineIcon color="primary" /></ListItemIcon>
              <ListItemText 
                primary="Promedio de Pujas" 
                secondary="12 pujas por subasta"
              />
            </ListItem>
          </List>
        </Paper>
      </Grid>
    </Grid>
  );

  const getVendedorDashboard = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6} lg={3}>
        <DashboardCard
          title="Mis Vehículos"
          value="8"
          icon={<CarIcon color="primary" />}
          description="Total de vehículos registrados"
        />
      </Grid>
      <Grid item xs={12} md={6} lg={3}>
        <DashboardCard
          title="Subastas Activas"
          value="3"
          icon={<GavelIcon color="secondary" />}
          description="Mis subastas en curso"
        />
      </Grid>
      <Grid item xs={12} md={6} lg={3}>
        <DashboardCard
          title="Ventas Realizadas"
          value="5"
          icon={<MoneyIcon color="success" />}
          description="Total de ventas completadas"
        />
      </Grid>
      <Grid item xs={12} md={6} lg={3}>
        <DashboardCard
          title="Ingresos Totales"
          value="$85K"
          icon={<TrendingUpIcon color="info" />}
          description="Ingresos por ventas realizadas"
        />
      </Grid>
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Mis Subastas Activas
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon><CarIcon color="primary" /></ListItemIcon>
              <ListItemText 
                primary="Toyota Corolla 2021" 
                secondary="Puja más alta: $25,000 - Tiempo restante: 2 días"
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemIcon><CarIcon color="primary" /></ListItemIcon>
              <ListItemText 
                primary="Honda Civic 2020" 
                secondary="Puja más alta: $18,500 - Tiempo restante: 5 días"
              />
            </ListItem>
          </List>
        </Paper>
      </Grid>
    </Grid>
  );

  const getCompradorDashboard = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6} lg={3}>
        <DashboardCard
          title="Subastas Participando"
          value="4"
          icon={<GavelIcon color="primary" />}
          description="Subastas en las que has pujado"
        />
      </Grid>
      <Grid item xs={12} md={6} lg={3}>
        <DashboardCard
          title="Pujas Realizadas"
          value="12"
          icon={<TimelineIcon color="secondary" />}
          description="Total de pujas enviadas"
        />
      </Grid>
      <Grid item xs={12} md={6} lg={3}>
        <DashboardCard
          title="Subastas Ganadas"
          value="2"
          icon={<StarIcon color="success" />}
          description="Subastas que has ganado"
        />
      </Grid>
      <Grid item xs={12} md={6} lg={3}>
        <DashboardCard
          title="Inversión Total"
          value="$35K"
          icon={<MoneyIcon color="info" />}
          description="Total invertido en compras"
        />
      </Grid>
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Subastas en Seguimiento
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon><CarIcon color="primary" /></ListItemIcon>
              <ListItemText 
                primary="Mazda CX-5 2022" 
                secondary="Tu puja: $28,000 - Estado: Puja más alta"
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemIcon><CarIcon color="primary" /></ListItemIcon>
              <ListItemText 
                primary="Volkswagen Golf 2021" 
                secondary="Tu puja: $22,000 - Estado: Superado"
              />
            </ListItem>
          </List>
        </Paper>
      </Grid>
    </Grid>
  );

  return (
    <Box sx={{ flexGrow: 1, py: 3 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" gutterBottom component="h1" sx={{ mb: 4 }}>
          Dashboard - {user?.role || 'Usuario'}
        </Typography>
        
        {authService.isAdmin() && getAdminDashboard()}
        {authService.isVendedor() && getVendedorDashboard()}
        {authService.isComprador() && getCompradorDashboard()}
      </Container>
    </Box>
  );
};

export default Dashboard; 