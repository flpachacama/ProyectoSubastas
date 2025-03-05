import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import Dashboard from './components/dashboard/Dashboard';
import Navbar from './components/layout/Navbar';
import authService from './services/authService';
import AuctionForm from './components/seller/AuctionForm';
import CarList from './components/seller/CarList';
import CarForm from './components/seller/CarForm';
import PrivateRoute from './components/auth/PrivateRoute';

// Componente de ruta pública (no accesible si está autenticado)
const PublicRoute = ({ children }) => {
  const isAuthenticated = authService.isAuthenticated();
  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
};

// Componentes temporales para las rutas que aún no tienen implementación
const TemporaryComponent = ({ title }) => (
  <div style={{ padding: '20px' }}>
    <h2>{title}</h2>
    <p>Esta página está en construcción...</p>
  </div>
);

// Tema personalizado
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Navbar />
          <Routes>
            {/* Rutas Públicas */}
            <Route path="/login" element={
              <PublicRoute>
                <LoginForm />
              </PublicRoute>
            } />
            <Route path="/register" element={
              <PublicRoute>
                <RegisterForm />
              </PublicRoute>
            } />

            {/* Rutas Protegidas Comunes */}
            <Route path="/dashboard" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />

            {/* Rutas para Compradores */}
            <Route path="/auctions" element={
              <PrivateRoute>
                <TemporaryComponent title="Subastas Activas" />
              </PrivateRoute>
            } />
            <Route path="/my-bids" element={
              <PrivateRoute>
                <TemporaryComponent title="Mis Pujas" />
              </PrivateRoute>
            } />
            <Route path="/won-auctions" element={
              <PrivateRoute>
                <TemporaryComponent title="Subastas Ganadas" />
              </PrivateRoute>
            } />

            {/* Rutas para Vendedores */}
            <Route path="/my-cars" element={
              <PrivateRoute>
                {authService.isVendedor() ? (
                  <CarList />
                ) : (
                  <Navigate to="/dashboard" replace />
                )}
              </PrivateRoute>
            } />
            <Route path="/cars/create" element={
              <PrivateRoute>
                {authService.isVendedor() ? (
                  <CarForm />
                ) : (
                  <Navigate to="/dashboard" replace />
                )}
              </PrivateRoute>
            } />
            <Route path="/cars/edit/:carId" element={
              <PrivateRoute>
                {authService.isVendedor() ? (
                  <CarForm />
                ) : (
                  <Navigate to="/dashboard" replace />
                )}
              </PrivateRoute>
            } />

            {/* Rutas para Administradores */}
            <Route path="/users" element={
              <PrivateRoute>
                <TemporaryComponent title="Gestión de Usuarios" />
              </PrivateRoute>
            } />
            <Route path="/settings" element={
              <PrivateRoute>
                <TemporaryComponent title="Configuración" />
              </PrivateRoute>
            } />

            {/* Rutas Comunes Protegidas */}
            <Route path="/profile" element={
              <PrivateRoute>
                <TemporaryComponent title="Perfil de Usuario" />
              </PrivateRoute>
            } />

            {/* Rutas para Crear Subasta */}
            <Route path="/create-auction/:vehicleId" element={
              <PrivateRoute>
                <AuctionForm />
              </PrivateRoute>
            } />

            {/* Redirección por defecto */}
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;