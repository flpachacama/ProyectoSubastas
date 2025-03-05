const config = {
  API_URL: process.env.REACT_APP_API_URL || 'http://localhost:8081',
  SOCKET_URL: process.env.REACT_APP_SOCKET_URL || 'http://localhost:8081',
  API_TIMEOUT: 5000,
  SOCKET_OPTIONS: {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5
  }
};

export default config; 