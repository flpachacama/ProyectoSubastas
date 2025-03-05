import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Alert,
  Paper,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/api';

const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    emailUser: '',
    passwordUser: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error cuando el usuario empieza a escribir
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Intentando login con:', formData);
      const response = await authService.login(formData);
      console.log('Respuesta de login:', response);
      
      if (response && response.token) {
        login(response.token, response.user || response.userData);
        // Redirigir a la página anterior o al dashboard
        const redirectTo = location.state?.from?.pathname || '/dashboard';
        navigate(redirectTo);
      } else {
        setError('Respuesta inválida del servidor');
      }
    } catch (err) {
      console.error('Error completo:', err);
      setError(
        err.response?.data?.message || 
        err.response?.data?.error || 
        err.message || 
        'Error al iniciar sesión'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5" gutterBottom>
            Iniciar Sesión
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="emailUser"
              label="Correo Electrónico"
              name="emailUser"
              autoComplete="email"
              autoFocus
              value={formData.emailUser}
              onChange={handleChange}
              disabled={loading}
              error={!!error}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="passwordUser"
              label="Contraseña"
              type="password"
              id="passwordUser"
              autoComplete="current-password"
              value={formData.passwordUser}
              onChange={handleChange}
              disabled={loading}
              error={!!error}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={20} color="inherit" />
                  <span>Iniciando sesión...</span>
                </Box>
              ) : (
                'Iniciar Sesión'
              )}
            </Button>
            <Button
              fullWidth
              variant="text"
              onClick={() => navigate('/register')}
              disabled={loading}
            >
              ¿No tienes cuenta? Regístrate
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginForm; 