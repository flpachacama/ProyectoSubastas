import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Alert,
  Paper,
  CircularProgress,
  MenuItem,
} from '@mui/material';
import { authService } from '../../services/api';

const RegisterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nameUser: '',
    lastnameUser: '',
    emailUser: '',
    passwordUser: '',
    rolUser: 'Comprador',
    activateUser: true
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const roles = ['Comprador', 'Vendedor', 'Administrador'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Enviando datos de registro:', formData);
      const response = await authService.register(formData);
      console.log('Respuesta del registro:', response);
      navigate('/login');
    } catch (err) {
      console.error('Error de registro:', err);
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Error al registrar usuario'
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
            Registro de Usuario
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
              name="nameUser"
              label="Nombre"
              autoFocus
              value={formData.nameUser}
              onChange={handleChange}
              disabled={loading}
              error={!!error}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="lastnameUser"
              label="Apellido"
              value={formData.lastnameUser}
              onChange={handleChange}
              disabled={loading}
              error={!!error}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="emailUser"
              label="Correo Electrónico"
              type="email"
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
              value={formData.passwordUser}
              onChange={handleChange}
              disabled={loading}
              error={!!error}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="rolUser"
              label="Rol"
              select
              value={formData.rolUser}
              onChange={handleChange}
              disabled={loading}
              error={!!error}
            >
              {roles.map((role) => (
                <MenuItem key={role} value={role}>
                  {role}
                </MenuItem>
              ))}
            </TextField>

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
                  <span>Registrando...</span>
                </Box>
              ) : (
                'Registrarse'
              )}
            </Button>
            <Button
              fullWidth
              variant="text"
              onClick={() => navigate('/login')}
              disabled={loading}
            >
              ¿Ya tienes cuenta? Inicia Sesión
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default RegisterForm; 