package ec.edu.espe.proyecto.subastas.service;

import ec.edu.espe.proyecto.subastas.api.dto.CarAuctionDTO;
import ec.edu.espe.proyecto.subastas.entity.AuctionEntity;
import ec.edu.espe.proyecto.subastas.entity.CarAuctionEntity;
import ec.edu.espe.proyecto.subastas.entity.CarEntity;
import ec.edu.espe.proyecto.subastas.exception.DeleteException;
import ec.edu.espe.proyecto.subastas.exception.InsertException;
import ec.edu.espe.proyecto.subastas.repository.AuctionRepository;
import ec.edu.espe.proyecto.subastas.repository.CarAuctionRepository;
import ec.edu.espe.proyecto.subastas.repository.CarRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CarAuctionService {

    private CarAuctionRepository carAuctionRepository;
    private AuctionRepository auctionRepository;
    private CarRepository carRepository;

    private String msgError;

    public CarAuctionService(CarAuctionRepository carAuctionRepository, AuctionRepository auctionRepository, CarRepository carRepository) {
        this.carAuctionRepository = carAuctionRepository;
        this.auctionRepository = auctionRepository;
        this.carRepository = carRepository;
    }

    public void createCarAuction(CarAuctionDTO carAuctionDTO) throws InsertException{
        try {
            Optional <AuctionEntity> auctionEntityOptional = this.auctionRepository.findById(carAuctionDTO.getCarId());

            if (!auctionEntityOptional.isPresent()) {
                this.msgError = "Car Not Found";
                throw new InsertException(this.msgError, CarAuctionEntity.class.getName());
            }
            Optional <CarEntity> carEntityOptional = this.carRepository.findById(carAuctionDTO.getAuctionId());
            if (!carEntityOptional.isPresent()) {
                this.msgError = "Car Not Found";
                throw new InsertException(this.msgError, CarAuctionEntity.class.getName());
            }

            CarAuctionEntity carAuctionToCreate = new CarAuctionEntity();
            carAuctionToCreate.setAuction(auctionEntityOptional.get());
            carAuctionToCreate.setCar(carEntityOptional.get());
            this.carAuctionRepository.save(carAuctionToCreate);
        }catch (Exception exception){
            this.msgError = this.msgError == null ? "Error creating Car Auction" : this.msgError;
            throw new InsertException(this.msgError, CarAuctionEntity.class.getName());
        }
    }

    public void deleteCarAuction (Integer id) throws DeleteException {
        try {
            Optional<CarAuctionEntity> carAuctionEntity = this.carAuctionRepository.findById(id);

            if (!carAuctionEntity.isPresent()) {
                this.msgError = "Car_Auction Not Found";
                throw new DeleteException(this.msgError, CarAuctionEntity.class.getName());
            }

            this.carAuctionRepository.delete(carAuctionEntity.get());
        }catch (Exception exception){
            this.msgError = this.msgError == null ? "Error deleting Car Auction" : this.msgError;
            throw new DeleteException(this.msgError, CarAuctionEntity.class.getName());
        }
    }
}
