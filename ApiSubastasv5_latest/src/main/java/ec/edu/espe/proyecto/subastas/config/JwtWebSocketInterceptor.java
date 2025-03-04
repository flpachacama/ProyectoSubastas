package ec.edu.espe.proyecto.subastas.config;

import ec.edu.espe.proyecto.subastas.entity.UserEntity;
import ec.edu.espe.proyecto.subastas.repository.UserRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.security.MessageDigest;
import java.util.Map;

@Configuration
public class JwtWebSocketInterceptor implements HandshakeInterceptor {
    private static final String HEADER = "Authorization";
    private static final String PREFIX = "Bearer ";
    private final UserRepository userRepository;

    public JwtWebSocketInterceptor(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler, Map<String, Object> attributes) throws Exception {
        if (checkJwtToken(request)) {
            Claims claims = validateJwt(request);
            if (claims.get("authority") != null && claims.get("authority").equals("ROLE_Comprador")) {
                String email = claims.getSubject();
                UserEntity user = userRepository.findByEmail(email);
                if (user != null) {
                    attributes.put("user", email);
                    attributes.put("userId", user.getUserId());
                    return true;
                }
            }
        }
        response.setStatusCode(HttpStatus.UNAUTHORIZED);
        return false;
    }

    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler, Exception exception) {
    }

    private boolean checkJwtToken(ServerHttpRequest request) {
        String authenticationHeader = request.getHeaders().getFirst(HEADER);
        return authenticationHeader != null && authenticationHeader.startsWith(PREFIX);
    }

    private Claims validateJwt(ServerHttpRequest request) {
        String jwtToken = request.getHeaders().getFirst(HEADER).replace(PREFIX, "");
        return Jwts.parser()
                .setSigningKey(generateKeyFromSecret())
                .build()
                .parseClaimsJws(jwtToken)
                .getBody();
    }

    private SecretKey generateKeyFromSecret() {
        try {
            String secret = "CONTRASENIA-1234";
            MessageDigest sha = MessageDigest.getInstance("SHA-512");
            byte[] keyBytes = sha.digest(secret.getBytes());
            return new SecretKeySpec(keyBytes, "HmacSHA512");
        } catch (Exception exception) {
            throw new RuntimeException("Error generating key: " + exception.getMessage());
        }
    }
}
