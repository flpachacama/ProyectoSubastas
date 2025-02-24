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
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class BidService {

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
            Optional<CarAuctionEntity> carAuctionEntityOptional = this.carAuctionRepository.findById(bidDTO.getCarAuctionId());
            if (!carAuctionEntityOptional.isPresent()) {
                this.msgError = "Car Auction not found";
                throw new InsertException(this.msgError, BidEntity.class.getName());
            }
            Optional<UserEntity> userEntityOptional = this.userRepository.findById(bidDTO.getUserId());
            if (!userEntityOptional.isPresent()) {
                this.msgError = "User not found";
                throw new InsertException(this.msgError, UserEntity.class.getName());
            }

            BidEntity bidToCreate = new BidEntity();
            bidToCreate.setCarAuction(carAuctionEntityOptional.get());
            bidToCreate.setBuyer(userEntityOptional.get());
            bidToCreate.setAmount(bidDTO.getAmountBid());

            this.bidRepository.save(bidToCreate);
        }catch (Exception exception){
            this.msgError = this.msgError == null ? "Error creating bid" : this.msgError;
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
