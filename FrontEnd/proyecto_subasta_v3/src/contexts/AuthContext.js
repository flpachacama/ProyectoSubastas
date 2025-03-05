import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';
import socketService from '../services/socketService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      const token = authService.getToken();
      if (token) {
        try {
          const userData = authService.getUser();
          if (userData) {
            setUser(userData);
            socketService.connect();
          } else {
            // Token inválido
            authService.logout();
          }
        } catch (error) {
          console.error('Error al inicializar la autenticación:', error);
          authService.logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const token = await authService.login(credentials.email, credentials.password);
      if (token) {
        const userData = authService.getUser();
        setUser(userData);
        socketService.connect();
        return token;
      }
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    socketService.disconnect();
    setUser(null);
  };

  const isAuthenticated = () => {
    return !!user && !!authService.getToken();
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export default AuthContext; 