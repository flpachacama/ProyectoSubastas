package ec.edu.espe.proyecto.subastas.handler;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import ec.edu.espe.proyecto.subastas.api.dto.BidDTO;
import ec.edu.espe.proyecto.subastas.config.JwtWebSocketInterceptor;
import ec.edu.espe.proyecto.subastas.entity.AuctionEntity;
import ec.edu.espe.proyecto.subastas.entity.CarAuctionEntity;

import ec.edu.espe.proyecto.subastas.exception.InsertException;
import ec.edu.espe.proyecto.subastas.repository.CarAuctionRepository;

import ec.edu.espe.proyecto.subastas.service.BidService;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.*;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import java.io.IOException;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.security.MessageDigest;


@Component
public class AuctionWebSocketHandler extends TextWebSocketHandler {

    private final BidService bidService;
    private final ObjectMapper objectMapper;
    private final CarAuctionRepository carAuctionRepository;
    private final JwtWebSocketInterceptor jwtWebSocketInterceptor;
    private final ConcurrentHashMap<Integer, ConcurrentHashMap<String, WebSocketSession>> auctionSessions = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<WebSocketSession, Boolean> authenticatedSessions = new ConcurrentHashMap<>();

    public AuctionWebSocketHandler(BidService bidService, ObjectMapper objectMapper, CarAuctionRepository carAuctionRepository, JwtWebSocketInterceptor jwtWebSocketInterceptor) {
        this.bidService = bidService;
        this.objectMapper = objectMapper;
        this.carAuctionRepository = carAuctionRepository;
        this.jwtWebSocketInterceptor = jwtWebSocketInterceptor;
    }


    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        // La sesión se marca como no autenticada inicialmente
        authenticatedSessions.put(session, false);
    }

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        JsonNode jsonNode = objectMapper.readTree(message.getPayload());
        
        // Si la sesión no está autenticada, esperar mensaje de autenticación
        if (!authenticatedSessions.getOrDefault(session, false)) {
            if (jsonNode.has("type") && "auth".equals(jsonNode.get("type").asText())) {
                handleAuthMessage(session, jsonNode);
            } else {
                session.close(CloseStatus.POLICY_VIOLATION);
            }
            return;
        }

        // Procesar mensaje solo si la sesión está autenticada
        if (jsonNode.has("type") && "bid".equals(jsonNode.get("type").asText())) {
            handleBidMessage(session, jsonNode);
        }
    }

    private void handleAuthMessage(WebSocketSession session, JsonNode jsonNode) throws IOException {
        String token = jsonNode.get("token").asText();
        if (jwtWebSocketInterceptor.validateToken(token)) {
            authenticatedSessions.put(session, true);
            Integer auctionId = getCarAuctionIdFromPath(session);
            String userEmail = getUserEmailFromToken(token);
            auctionSessions.computeIfAbsent(auctionId, k -> new ConcurrentHashMap<>()).put(userEmail, session);
            session.sendMessage(new TextMessage("{\"type\":\"auth\",\"status\":\"success\"}"));
        } else {
            session.close(CloseStatus.POLICY_VIOLATION);
        }
    }

    private void handleBidMessage(WebSocketSession session, JsonNode jsonNode) throws IOException {
        Integer auctionId = getCarAuctionIdFromPath(session);
        BidDTO bidDTO = objectMapper.treeToValue(jsonNode, BidDTO.class);

        Optional<CarAuctionEntity> carAuctionEntityOptional = carAuctionRepository.findById(bidDTO.getCarAuctionId());
        if (!carAuctionEntityOptional.isPresent() || 
            carAuctionEntityOptional.get().getAuction().getStatus() != AuctionEntity.AuctionStatus.Activa) {
            session.sendMessage(new TextMessage("{\"type\":\"error\",\"message\":\"La subasta no está activa\"}"));
            return;
        }

        try {
            bidService.createBid(bidDTO);
            broadcastMessage(auctionId, objectMapper.writeValueAsString(bidDTO));
        } catch (InsertException e) {
            session.sendMessage(new TextMessage("{\"type\":\"error\",\"message\":\"" + e.getMessage() + "\"}"));
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        authenticatedSessions.remove(session);
        Integer auctionId = getCarAuctionIdFromPath(session);
        auctionSessions.getOrDefault(auctionId, new ConcurrentHashMap<>()).values().remove(session);
    }

    private void broadcastMessage(Integer auctionId, String message) throws IOException {
        for (WebSocketSession session : auctionSessions.getOrDefault(auctionId, new ConcurrentHashMap<>()).values()) {
            if (session.isOpen()) {
                session.sendMessage(new TextMessage(message));
            }
        }
    }

    private Integer getCarAuctionIdFromPath(WebSocketSession session) {
        String path = session.getUri().getPath();
        return Integer.parseInt(path.substring(path.lastIndexOf('/') + 1));
    }

    private String getUserEmailFromToken(String token) {
        try {
            Claims claims = Jwts.parser()
                    .setSigningKey(generateKeyFromSecret())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            return claims.getSubject();
        } catch (Exception e) {
            throw new RuntimeException("Error extracting email from token: " + e.getMessage());
        }
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
