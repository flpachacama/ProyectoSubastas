import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Menu as MenuIcon,
  DirectionsCar,
  Gavel,
  AccountCircle,
  ExitToApp,
  Dashboard,
  Settings,
  Group,
} from '@mui/icons-material';
import authService from '../../services/authService';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const isAuthenticated = authService.isAuthenticated();

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigation = (path) => {
    handleMenuClose();
    navigate(path);
  };

  const handleLogout = () => {
    handleMenuClose();
    authService.logout();
    navigate('/login');
  };

  // No mostrar la barra de navegación en las páginas de login y registro
  if (['/login', '/register'].includes(location.pathname)) {
    return null;
  }

  const getNavigationOptions = () => {
    const options = [];

    if (authService.isVendedor()) {
      options.push(
        { text: 'Mis Autos', path: '/my-cars', icon: <DirectionsCar /> },
        { text: 'Mis Subastas', path: '/my-auctions', icon: <Gavel /> }
      );
    }

    if (authService.isComprador()) {
      options.push(
        { text: 'Subastas Activas', path: '/auctions', icon: <Gavel /> },
        { text: 'Mis Pujas', path: '/my-bids', icon: <Gavel /> },
        { text: 'Subastas Ganadas', path: '/won-auctions', icon: <Gavel /> }
      );
    }

    if (authService.isAdmin()) {
      options.push(
        { text: 'Usuarios', path: '/users', icon: <Group /> },
        { text: 'Configuración', path: '/settings', icon: <Settings /> }
      );
    }

    // Opciones comunes para usuarios autenticados
    if (isAuthenticated) {
      options.push(
        { text: 'Dashboard', path: '/dashboard', icon: <Dashboard /> },
        { text: 'Perfil', path: '/profile', icon: <AccountCircle /> },
        { text: 'Cerrar Sesión', path: '/logout', icon: <ExitToApp />, action: handleLogout }
      );
    }

    return options;
  };

  const navigationOptions = getNavigationOptions();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Subastas Online
        </Typography>

        {isAuthenticated ? (
          <Box>
            <IconButton
              size="large"
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={handleMenuClick}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              onClick={handleMenuClose}
            >
              {navigationOptions.map((option, index) => (
                <MenuItem
                  key={index}
                  onClick={() => option.action ? option.action() : handleNavigation(option.path)}
                >
                  <ListItemIcon>
                    {option.icon}
                  </ListItemIcon>
                  <ListItemText>{option.text}</ListItemText>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        ) : (
          <Box>
            <Button color="inherit" onClick={() => navigate('/login')}>
              Iniciar Sesión
            </Button>
            <Button color="inherit" onClick={() => navigate('/register')}>
              Registrarse
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 