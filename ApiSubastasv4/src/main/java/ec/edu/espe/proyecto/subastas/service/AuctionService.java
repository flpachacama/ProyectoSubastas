package ec.edu.espe.proyecto.subastas.service;

import ec.edu.espe.proyecto.subastas.api.dto.AuctionDTO;
import ec.edu.espe.proyecto.subastas.api.dto.UserDTO;
import ec.edu.espe.proyecto.subastas.entity.*;
import ec.edu.espe.proyecto.subastas.exception.DeleteException;
import ec.edu.espe.proyecto.subastas.exception.DocumentNotFoundException;
import ec.edu.espe.proyecto.subastas.exception.InsertException;
import ec.edu.espe.proyecto.subastas.exception.UpdateException;
import ec.edu.espe.proyecto.subastas.repository.*;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class AuctionService {
    private AuctionRepository auctionRepository;
    private UserRepository userRepository;

    private BidRepository bidRepository;
    private WinnerRepository winnerRepository;
    private CarAuctionRepository carAuctionRepository;
    private CarRepository carRepository;

    private String msgError;

    public AuctionService(AuctionRepository auctionRepository, UserRepository userRepository, BidRepository bidRepository, WinnerRepository winnerRepository, CarAuctionRepository carAuctionRepository, CarRepository carRepository) {
        this.auctionRepository = auctionRepository;
        this.userRepository = userRepository;
        this.bidRepository = bidRepository;
        this.winnerRepository = winnerRepository;
        this.carAuctionRepository = carAuctionRepository;
        this.carRepository = carRepository;
    }

    public List<AuctionDTO> getAllAuction() throws DocumentNotFoundException {
        try {
            List<AuctionEntity> auctionEntities = auctionRepository.findAll();
            List<AuctionDTO> auctionDTOS = new ArrayList<>();

            for (AuctionEntity auctionEntity : auctionEntities) {
                AuctionDTO auctionDTO = new AuctionDTO();
                auctionDTO.setSellerId(auctionEntity.getSellerId().getUserId());
                auctionDTO.setStartAuctionDate(auctionEntity.getStartDate());
                auctionDTO.setEndAuctionDate(auctionEntity.getEndDate());
                auctionDTO.setAuctionStatus(auctionEntity.getStatus());
                auctionDTOS.add(auctionDTO);
            }

            return auctionDTOS;
        }catch (Exception exception){
            this.msgError = this.msgError == null ? "Don´t found users" : this.msgError;
            throw new DocumentNotFoundException(this.msgError, UserEntity.class.getName());
        }
    }

    public void createAuction (AuctionDTO auctionDTO) throws InsertException{
        try {
            /*Optional<UserEntity> userOptional = this.userRepository.findById(auctionDTO.getSellerId());

            if (!userOptional.isPresent()) {
                this.msgError = "User don´t exist";
            }*/
            Optional<UserEntity> seller = this.userRepository.findById(auctionDTO.getSellerId());
            if (!seller.isPresent() || seller.get().getRol() != UserEntity.RolStatus.Vendedor) {
                throw new InsertException("Only sellers can create auctions", AuctionEntity.class.getName());
            }
            if (auctionDTO.getStartAuctionDate().after(auctionDTO.getEndAuctionDate())) {
                throw new InsertException("End date must be after start date", AuctionEntity.class.getName());
            }

            AuctionEntity auctionToCreate = new AuctionEntity();
            auctionToCreate.setSellerId(seller.get());
            auctionToCreate.setStartDate(auctionDTO.getStartAuctionDate());
            auctionToCreate.setEndDate(auctionDTO.getEndAuctionDate());
            auctionToCreate.setStatus(auctionDTO.getAuctionStatus());

            this.auctionRepository.save(auctionToCreate);
        }catch (Exception exception){
            this.msgError = this.msgError == null ? "Error creating auction" : this.msgError;
            throw new InsertException(this.msgError, UserEntity.class.getName());
        }
    }

    public void updateAuction (AuctionDTO auctionDTO, Integer id) throws UpdateException {
        try {
            AuctionEntity auctionToUpdate = this.auctionRepository.findById(id).get();

            if (auctionToUpdate == null) {
                this.msgError = "Auction does not exist";
                throw new UpdateException(this.msgError, AuctionEntity.class.getName());
            }

            auctionToUpdate.setStartDate(auctionDTO.getStartAuctionDate() != null ? auctionDTO.getStartAuctionDate() : auctionToUpdate.getStartDate());
            auctionToUpdate.setEndDate(auctionDTO.getEndAuctionDate() != null ? auctionDTO.getEndAuctionDate() : auctionToUpdate.getEndDate());
            auctionToUpdate.setStatus(auctionDTO.getAuctionStatus() != null ? auctionDTO.getAuctionStatus() : auctionToUpdate.getStatus());

            this.auctionRepository.save(auctionToUpdate);

        }catch (Exception exception){
            this.msgError = this.msgError == null ? "Error updating auction" : this.msgError;
            throw new UpdateException(this.msgError, AuctionEntity.class.getName());
        }
    }

    public void deleteAuction (Integer id) throws DeleteException {
        try {
            Optional<AuctionEntity> auctionToDelete = this.auctionRepository.findById(id);

            if (!auctionToDelete.isPresent()) {
                this.msgError = "Auction does not exist";
                throw new DeleteException(this.msgError, AuctionEntity.class.getName());
            }
            this.auctionRepository.delete(auctionToDelete.get());
        }catch (Exception exception){
            this.msgError = this.msgError == null ? "Error deleting auction" : this.msgError;
            throw new DeleteException(this.msgError, AuctionEntity.class.getName());
        }
    }

    @Scheduled(fixedRate = 60000) // Verifica cada minuto
    public void checkAndCloseAuctions() {
        List<AuctionEntity> activeAuctions = auctionRepository.findByStatus(AuctionEntity.AuctionStatus.Activa);
        Date now = new Date();

        for (AuctionEntity auction : activeAuctions) {
            if (auction.getEndDate().before(now)) {
                auction.setStatus(AuctionEntity.AuctionStatus.Finalizada);
                auctionRepository.save(auction);

                determineWinner(auction);
            }
        }
    }
    /*private void determineWinner(AuctionEntity auction) {
        List<BidEntity> bids = bidRepository.findByCarAuction_AuctionOrderByAmountDesc(auction);

        if (!bids.isEmpty()) {
            BidEntity highestBid = bids.get(0);
            WinnerEntity winner = new WinnerEntity();
            winner.setCarAuction(highestBid.getCarAuction());
            winner.setUser(highestBid.getBuyer());
            winner.setFinalPrice(highestBid.getAmount());

            winnerRepository.save(winner);
        }
    }*/

    private void determineWinner(AuctionEntity auction) {

        List<CarAuctionEntity> carAuctions = carAuctionRepository.findByAuction(auction);

        for (CarAuctionEntity carAuction : carAuctions) {
            CarEntity car = carAuction.getCar();

            Optional<BidEntity> highestBidOptional = bidRepository.findTopByCarAuctionOrderByAmountDesc(carAuction);

            if (highestBidOptional.isPresent()) {

                BidEntity highestBid = highestBidOptional.get();

                if (highestBid.getAmount().compareTo(car.getBasePrice()) >= 0) {

                    car.setStatus(CarEntity.CarStatus.Vendido);
                    carRepository.save(car);
                    // Crear un ganador
                    WinnerEntity winner = new WinnerEntity();
                    winner.setCarAuction(carAuction);
                    winner.setUser(highestBid.getBuyer());
                    winner.setFinalPrice(highestBid.getAmount());

                    winnerRepository.save(winner);
                } else {
                    car.setStatus(CarEntity.CarStatus.No_vendido);
                    carRepository.save(car);
                }
            } else {
                car.setStatus(CarEntity.CarStatus.No_vendido);
                carRepository.save(car);
            }
        }
    }





}




