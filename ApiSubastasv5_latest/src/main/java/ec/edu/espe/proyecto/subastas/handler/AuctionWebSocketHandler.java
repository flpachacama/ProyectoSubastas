package ec.edu.espe.proyecto.subastas.handler;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import ec.edu.espe.proyecto.subastas.api.dto.BidDTO;
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


@Component
public class AuctionWebSocketHandler extends TextWebSocketHandler {

    private final BidService bidService;
    private final ObjectMapper objectMapper;
    private final CarAuctionRepository carAuctionRepository;
    private final ConcurrentHashMap<Integer, ConcurrentHashMap<String, WebSocketSession>> auctionSessions = new ConcurrentHashMap<>();

    public AuctionWebSocketHandler(BidService bidService, ObjectMapper objectMapper, CarAuctionRepository carAuctionRepository) {
        this.bidService = bidService;
        this.objectMapper = objectMapper;
        this.carAuctionRepository = carAuctionRepository;
    }


    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        Integer auctionId = getCarAuctionIdFromPath(session);
        String userEmail = (String) session.getAttributes().get("user");

        auctionSessions.computeIfAbsent(auctionId, k -> new ConcurrentHashMap<>()).put(userEmail, session);
        broadcastMessage(auctionId, "User " + userEmail + " joined the auction.");
    }

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {

        Integer auctionId = getCarAuctionIdFromPath(session);
        String userEmail = (String) session.getAttributes().get("user");
        Integer userId = (Integer) session.getAttributes().get("userId");

        JsonNode jsonNode = objectMapper.readTree(message.getPayload());
        BidDTO bidDTO = objectMapper.treeToValue(jsonNode, BidDTO.class);
        bidDTO.setUserId(userId);
        bidDTO.setCarAuctionId(auctionId);

        Optional<CarAuctionEntity> carAuctionEntityOptional = carAuctionRepository.findById(bidDTO.getCarAuctionId());
        if (!carAuctionEntityOptional.isPresent() || carAuctionEntityOptional.get().getAuction().getStatus() != AuctionEntity.AuctionStatus.Activa) {
            session.sendMessage(new TextMessage("The auction is not active. You cannot place bids."));
            return;
        }

        try {
            bidService.createBid(bidDTO);
            session.sendMessage(new TextMessage("Bid placed successfully"));
            broadcastMessage(auctionId, "New bid by " + userEmail + ": " + bidDTO.getAmountBid());
        } catch (InsertException e) {
            session.sendMessage(new TextMessage("Error placing bid: " + bidDTO.getAmountBid()));
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        Integer auctionId = getCarAuctionIdFromPath(session);
        String userEmail = (String) session.getAttributes().get("user");

        auctionSessions.getOrDefault(auctionId, new ConcurrentHashMap<>()).remove(userEmail);
        broadcastMessage(auctionId, "User " + userEmail + " left the auction.");
    }
    private void broadcastMessage(Integer auctionId, String message) throws IOException {
        for (WebSocketSession session : auctionSessions.getOrDefault(auctionId, new ConcurrentHashMap<>()).values()) {
            session.sendMessage(new TextMessage(message));
        }
    }
    private Integer getCarAuctionIdFromPath(WebSocketSession session) {
        String path = session.getUri().getPath();
        return Integer.parseInt(path.split("/")[2]);
    }

}
