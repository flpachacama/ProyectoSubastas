import { ThemeProvider } from '@mui/material/styles';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { theme } from './theme/theme';
import { store } from './store/store';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <div className="App">
            {/* Aquí irán los componentes de rutas */}
          </div>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
