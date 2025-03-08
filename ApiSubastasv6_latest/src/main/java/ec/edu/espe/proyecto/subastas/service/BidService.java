package ec.edu.espe.proyecto.subastas.service;

import ec.edu.espe.proyecto.subastas.api.dto.BidDTO;
import ec.edu.espe.proyecto.subastas.entity.BidEntity;
import ec.edu.espe.proyecto.subastas.entity.CarAuctionEntity;
import ec.edu.espe.proyecto.subastas.entity.UserEntity;
import ec.edu.espe.proyecto.subastas.exception.DeleteException;
import ec.edu.espe.proyecto.subastas.exception.InsertException;
import ec.edu.espe.proyecto.subastas.exception.UpdateException;
import ec.edu.espe.proyecto.subastas.repository.BidRepository;
import ec.edu.espe.proyecto.subastas.repository.CarAuctionRepository;
import ec.edu.espe.proyecto.subastas.repository.UserRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Optional;

@Service
public class BidService {

    private static final Logger logger = LoggerFactory.getLogger(BidService.class);
    private BidRepository bidRepository;
    private CarAuctionRepository carAuctionRepository;
    private UserRepository userRepository;

    private String msgError;

    public BidService(BidRepository bidRepository, CarAuctionRepository carAuctionRepository, UserRepository userRepository) {
        this.bidRepository = bidRepository;
        this.carAuctionRepository = carAuctionRepository;
        this.userRepository = userRepository;
    }


    public void createBid (BidDTO bidDTO) throws InsertException{
        try {
            logger.info("Creating bid for car auction ID: {} by user ID: {}", bidDTO.getCarAuctionId(), bidDTO.getUserId());
            Optional<CarAuctionEntity> carAuctionEntityOptional = this.carAuctionRepository.findById(bidDTO.getCarAuctionId());
            if (!carAuctionEntityOptional.isPresent()) {
                this.msgError = "Car Auction not found";
                logger.error(this.msgError);
                throw new InsertException(this.msgError, BidEntity.class.getName());
            }
            Optional<UserEntity> userEntityOptional = this.userRepository.findById(bidDTO.getUserId());
            if (!userEntityOptional.isPresent()) {
                this.msgError = "User not found";
                logger.error(this.msgError);
                throw new InsertException(this.msgError, UserEntity.class.getName());
            }
            CarAuctionEntity carAuction = carAuctionEntityOptional.get();
            UserEntity buyer = userEntityOptional.get();

            if (carAuction.getAuction().getSellerId().getUserId().equals(buyer.getUserId())) {
                this.msgError = "Buyers cannot bid on their own cars";
                logger.error(this.msgError);
                throw new InsertException(this.msgError, BidEntity.class.getName());
            }

            Optional<BidEntity> highestBid = bidRepository.findTopByCarAuctionOrderByAmountDesc(carAuction);
            if (highestBid.isPresent() && bidDTO.getAmountBid().compareTo(highestBid.get().getAmount()) <= 0) {
                this.msgError = "The bid amount must be higher than the current highest bid";
                logger.error(this.msgError);
                throw new InsertException(this.msgError, BidEntity.class.getName());
            }

            BidEntity bidToCreate = new BidEntity();
            bidToCreate.setCarAuction(carAuctionEntityOptional.get());
            bidToCreate.setBuyer(userEntityOptional.get());
            bidToCreate.setAmount(bidDTO.getAmountBid());

            this.bidRepository.save(bidToCreate);

            logger.info("Bid created successfully: {}", bidToCreate);
        }catch (Exception exception){
            this.msgError = this.msgError == null ? "Error creating bid" : this.msgError;
            logger.error("Error creating bid: {}", this.msgError);
            throw new InsertException(this.msgError, BidEntity.class.getName());
        }
    }

    public void updateBid (BidDTO bidDTO, Integer id) throws UpdateException {
        try {
            BidEntity bidToUpdate = this.bidRepository.findById(id).get();

            if (bidToUpdate == null){
                this.msgError = "Bid not found";
                throw new UpdateException(this.msgError, BidEntity.class.getName());
            }

            bidToUpdate.setAmount(bidDTO.getAmountBid() != null ? bidDTO.getAmountBid() : bidToUpdate.getAmount());
            bidToUpdate.setDateTime(bidDTO.getDateTimeBid() != null ? bidDTO.getDateTimeBid() : bidToUpdate.getDateTime());

            this.bidRepository.save(bidToUpdate);
        }catch (Exception exception){
            this.msgError = this.msgError == null ? "Error editing bid" : this.msgError;
            throw new UpdateException(this.msgError, BidEntity.class.getName());
        }
    }

    public void delete (Integer id) throws DeleteException {
        try {
            Optional<BidEntity> bidEntityOptional = this.bidRepository.findById(id);
            if (!bidEntityOptional.isPresent()){
                this.msgError = "Bid not found";
                throw new DeleteException(this.msgError, BidEntity.class.getName());
            }

            this.bidRepository.delete(bidEntityOptional.get());
        }catch (Exception exception){
            this.msgError = this.msgError == null ? "Error deleting bid" : this.msgError;
            throw new DeleteException(this.msgError, BidEntity.class.getName());
        }
    }
}
