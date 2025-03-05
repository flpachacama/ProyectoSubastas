import React from 'react';
import { 
  createBrowserRouter,
  RouterProvider,
  Navigate
} from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginForm from './components/auth/LoginForm';

// Crear tema personalizado
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

// Componente para proteger rutas
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const auth = isAuthenticated();
  return auth ? children : <Navigate to="/login" replace />;
};

// Componente para rutas públicas
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const auth = isAuthenticated();
  return !auth ? children : <Navigate to="/dashboard" replace />;
};

// Placeholder para el Dashboard
const Dashboard = () => <div>Dashboard</div>;

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/login',
    element: (
      <PublicRoute>
        <LoginForm />
      </PublicRoute>
    ),
  },
  {
    path: '/dashboard',
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),
  },
]);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
