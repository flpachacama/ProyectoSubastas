import { ThemeProvider } from '@mui/material/styles';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { theme } from './theme/theme';
import { store } from './store/store';
import MainLayout from './components/layout/MainLayout';
import { ROUTES } from './utils/routes';
import './App.css';

// Importar páginas (las crearemos después)
const HomePage = () => <div>Home Page</div>; // Placeholder
const LoginPage = () => <div>Login Page</div>; // Placeholder
const RegisterPage = () => <div>Register Page</div>; // Placeholder
const AuctionsPage = () => <div>Auctions Page</div>; // Placeholder
const CarsPage = () => <div>Cars Page</div>; // Placeholder

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <MainLayout>
            <Routes>
              <Route path={ROUTES.HOME} element={<HomePage />} />
              <Route path={ROUTES.LOGIN} element={<LoginPage />} />
              <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
              <Route path={ROUTES.AUCTIONS.LIST} element={<AuctionsPage />} />
              <Route path={ROUTES.CARS.LIST} element={<CarsPage />} />
              {/* Redirigir rutas no encontradas al inicio */}
              <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
            </Routes>
          </MainLayout>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
