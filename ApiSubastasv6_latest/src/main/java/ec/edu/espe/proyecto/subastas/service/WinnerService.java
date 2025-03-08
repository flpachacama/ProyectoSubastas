package ec.edu.espe.proyecto.subastas.service;

import ec.edu.espe.proyecto.subastas.api.dto.WinnerDTO;
import ec.edu.espe.proyecto.subastas.entity.CarAuctionEntity;
import ec.edu.espe.proyecto.subastas.entity.UserEntity;
import ec.edu.espe.proyecto.subastas.entity.WinnerEntity;
import ec.edu.espe.proyecto.subastas.exception.InsertException;
import ec.edu.espe.proyecto.subastas.repository.CarAuctionRepository;
import ec.edu.espe.proyecto.subastas.repository.UserRepository;
import ec.edu.espe.proyecto.subastas.repository.WinnerRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class WinnerService {

    private WinnerRepository winnerRepository;
    private CarAuctionRepository carAuctionRepository;
    private UserRepository userRepository;

    private String msgError;

    public WinnerService(WinnerRepository winnerRepository, CarAuctionRepository carAuctionRepository, UserRepository userRepository) {
        this.winnerRepository = winnerRepository;
        this.carAuctionRepository = carAuctionRepository;
        this.userRepository = userRepository;
    }

    public void createWiner(WinnerDTO winnerDTO) throws InsertException{
        try {
            Optional<CarAuctionEntity> carAuctionOptional = this.carAuctionRepository.findById(winnerDTO.getCarAuctionId());

            if(!carAuctionOptional.isPresent()){
                this.msgError = "Car Auction Not Found";
                throw new InsertException(this.msgError, WinnerEntity.class.getName());
            }

            Optional<UserEntity> userOptional = this.userRepository.findById(winnerDTO.getUserId());

            if(!userOptional.isPresent()){
                this.msgError = "User Not Found";
                throw new InsertException(this.msgError, UserEntity.class.getName());
            }

            WinnerEntity winerToCrate = new WinnerEntity();

            winerToCrate.setCarAuction(carAuctionOptional.get());
            winerToCrate.setUser(userOptional.get());
            winerToCrate.setFinalPrice(winnerDTO.getFinalPriceWiner());

            this.winnerRepository.save(winerToCrate);
        }catch (Exception exception){
            this.msgError = this.msgError == null ? "Error creating Winer" : this.msgError;
            throw new InsertException(this.msgError, WinnerEntity.class.getName());
        }
    }

}
