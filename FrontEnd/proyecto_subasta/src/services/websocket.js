import { io } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:8080';

class WebSocketService {
  socket = null;
  
  connect() {
    this.socket = io(SOCKET_URL, {
      auth: {
        token: localStorage.getItem('token')
      }
    });

    this.socket.on('connect', () => {
      console.log('Conectado al servidor de WebSocket');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Error de conexión WebSocket:', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Suscribirse a una subasta específica
  joinAuction(auctionId) {
    if (this.socket) {
      this.socket.emit('join_auction', { auctionId });
    }
  }

  // Dejar de seguir una subasta
  leaveAuction(auctionId) {
    if (this.socket) {
      this.socket.emit('leave_auction', { auctionId });
    }
  }

  // Enviar una puja
  sendBid(auctionId, amount) {
    if (this.socket) {
      this.socket.emit('place_bid', { auctionId, amount });
    }
  }

  // Suscribirse a actualizaciones de pujas
  onBidUpdate(callback) {
    if (this.socket) {
      this.socket.on('bid_update', callback);
    }
  }

  // Suscribirse a actualizaciones del estado de la subasta
  onAuctionStateUpdate(callback) {
    if (this.socket) {
      this.socket.on('auction_state_update', callback);
    }
  }

  // Suscribirse a notificaciones de fin de subasta
  onAuctionEnd(callback) {
    if (this.socket) {
      this.socket.on('auction_end', callback);
    }
  }
}

export const websocketService = new WebSocketService();
export default websocketService; 