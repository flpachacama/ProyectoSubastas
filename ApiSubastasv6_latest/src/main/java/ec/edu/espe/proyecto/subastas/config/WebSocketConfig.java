package ec.edu.espe.proyecto.subastas.config;

import ec.edu.espe.proyecto.subastas.handler.AuctionWebSocketHandler;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.*;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.web.socket.WebSocketHandler;
import java.util.Map;
import java.util.List;
import java.security.Principal;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    private final AuctionWebSocketHandler auctionWebSocketHandler;
    private final JwtWebSocketInterceptor jwtWebSocketInterceptor;

    public WebSocketConfig(AuctionWebSocketHandler auctionWebSocketHandler, JwtWebSocketInterceptor jwtWebSocketInterceptor) {
        this.auctionWebSocketHandler = auctionWebSocketHandler;
        this.jwtWebSocketInterceptor = jwtWebSocketInterceptor;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(auctionWebSocketHandler, "/car/{carAuctionId}")
                .setAllowedOrigins("*")
                .addInterceptors(new HandshakeInterceptor() {
                    @Override
                    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response,
                            WebSocketHandler wsHandler, Map<String, Object> attributes) throws Exception {
                        // Configurar CORS
                        response.getHeaders().add("Access-Control-Allow-Origin", "*");
                        response.getHeaders().add("Access-Control-Allow-Credentials", "true");
                        return true;
                    }

                    @Override
                    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response,
                            WebSocketHandler wsHandler, Exception exception) {
                    }
                });
    }
}
