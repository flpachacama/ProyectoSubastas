package ec.edu.espe.proyecto.subastas.config;

import ec.edu.espe.proyecto.subastas.handler.AuctionWebSocketHandler;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.*;

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
                .addInterceptors(jwtWebSocketInterceptor)
                .setAllowedOrigins("*");
    }
}
