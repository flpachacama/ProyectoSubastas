package ec.edu.espe.proyecto.subastas.service;

import ec.edu.espe.proyecto.subastas.api.dto.CarAuctionDTO;
import ec.edu.espe.proyecto.subastas.api.dto.CarDTO;
import ec.edu.espe.proyecto.subastas.entity.AuctionEntity;
import ec.edu.espe.proyecto.subastas.entity.CarAuctionEntity;
import ec.edu.espe.proyecto.subastas.entity.CarEntity;
import ec.edu.espe.proyecto.subastas.entity.UserEntity;
import ec.edu.espe.proyecto.subastas.exception.DeleteException;
import ec.edu.espe.proyecto.subastas.exception.DocumentNotFoundException;
import ec.edu.espe.proyecto.subastas.exception.InsertException;
import ec.edu.espe.proyecto.subastas.repository.AuctionRepository;
import ec.edu.espe.proyecto.subastas.repository.CarAuctionRepository;
import ec.edu.espe.proyecto.subastas.repository.CarRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
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

    public List<CarAuctionDTO> FindAll() throws DocumentNotFoundException {
        try {
            List<CarAuctionEntity> carAuctionEntities = carAuctionRepository.findAll();
            List<CarAuctionDTO> carAuctionDTOS = new ArrayList<>();

            for (CarAuctionEntity carAuctionEntity : carAuctionEntities) {
                CarAuctionDTO carAuctionDTO = new CarAuctionDTO();
                carAuctionDTO.setCarAuctionId(carAuctionEntity.getCarAuctionId());
                carAuctionDTO.setAuctionId(carAuctionEntity.getAuction() != null ? carAuctionEntity.getAuction().getAuctionId() : null);
                carAuctionDTO.setCarId(carAuctionEntity.getCar() != null ? carAuctionEntity.getCar().getCarId() : null);

                carAuctionDTOS.add(carAuctionDTO);
            }

            return carAuctionDTOS;
        }catch (Exception exception){
            this.msgError = this.msgError == null ? "Don´t found carsAuctions" : this.msgError;
            throw new DocumentNotFoundException(this.msgError, UserEntity.class.getName());
        }
    }

    public CarAuctionDTO findById(Integer id) throws DocumentNotFoundException {
        try {
            Optional<CarAuctionEntity> carAuctionEntityOptional = carAuctionRepository.findById(id);
            if (!carAuctionEntityOptional.isPresent()) {
                this.msgError = "Car Auction not found";
                throw new DocumentNotFoundException(this.msgError, CarAuctionEntity.class.getName());
            }

            CarAuctionEntity carAuctionEntity = carAuctionEntityOptional.get();
            CarAuctionDTO carAuctionDTO = new CarAuctionDTO();
            carAuctionDTO.setAuctionId(carAuctionEntity.getAuction() != null ? carAuctionEntity.getAuction().getAuctionId() : null);
            carAuctionDTO.setCarId(carAuctionEntity.getCar() != null ? carAuctionEntity.getCar().getCarId() : null);

            return carAuctionDTO;
        } catch (Exception exception) {
            this.msgError = this.msgError == null ? "Error finding Car Auction" : this.msgError;
            throw new DocumentNotFoundException(this.msgError, CarAuctionEntity.class.getName());
        }
    }




    public void createCarAuction(CarAuctionDTO carAuctionDTO) throws InsertException{
        try {
            Optional <AuctionEntity> auctionEntityOptional = this.auctionRepository.findById(carAuctionDTO.getAuctionId());

            if (!auctionEntityOptional.isPresent()) {
                this.msgError = "Auction Not Found";
                throw new InsertException(this.msgError, CarAuctionEntity.class.getName());
            }

            AuctionEntity auction = auctionEntityOptional.get();
            if (auction.getStatus() != AuctionEntity.AuctionStatus.Activa) {
                throw new InsertException("Cannot add a car to a non-active auction", CarAuctionEntity.class.getName());
            }

            Optional <CarEntity> carEntityOptional = this.carRepository.findById(carAuctionDTO.getCarId());
            if (!carEntityOptional.isPresent()) {
                this.msgError = "Car Not Found";
                throw new InsertException(this.msgError, CarAuctionEntity.class.getName());
            }
            // Obtener el auto y validar su estado
            CarEntity car = carEntityOptional.get();
            if (car.getStatus() != CarEntity.CarStatus.Disponible && car.getStatus() != CarEntity.CarStatus.No_vendido) {
                throw new InsertException("The car is not eligible for auction. Only cars with status 'Disponible' or 'No_vendido' can be added.", CarAuctionEntity.class.getName());
            }

            CarAuctionEntity carAuctionToCreate = new CarAuctionEntity();
            carAuctionToCreate.setAuction(auctionEntityOptional.get());
            carAuctionToCreate.setCar(carEntityOptional.get());

            // Cambiar el estado del auto a Subastado
            car.setStatus(CarEntity.CarStatus.Subastado);
            this.carRepository.save(car);

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

            // Restaurar el estado del auto a No_vendido si la subasta se elimina
            CarEntity car = carAuctionEntity.get().getCar();
            car.setStatus(CarEntity.CarStatus.No_vendido);
            this.carRepository.save(car);

            this.carAuctionRepository.delete(carAuctionEntity.get());
        }catch (Exception exception){
            this.msgError = this.msgError == null ? "Error deleting Car Auction" : this.msgError;
            throw new DeleteException(this.msgError, CarAuctionEntity.class.getName());
        }
    }
}
