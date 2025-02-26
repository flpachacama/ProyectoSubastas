import { ThemeProvider } from '@mui/material/styles';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { theme } from './theme/theme';
import { store } from './store/store';
import MainLayout from './components/layout/MainLayout';
import HomePage from './pages/HomePage';
import AuctionsPage from './pages/AuctionsPage';
import { ROUTES } from './utils/routes';
import './App.css';

// Placeholder para páginas pendientes
const LoginPage = () => <div>Login Page</div>;
const RegisterPage = () => <div>Register Page</div>;
const CarsPage = () => <div>Cars Page</div>;

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
              <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
            </Routes>
          </MainLayout>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
