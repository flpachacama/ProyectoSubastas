package ec.edu.espe.proyecto.subastas.service;

import ec.edu.espe.proyecto.subastas.api.dto.CarDTO;
import ec.edu.espe.proyecto.subastas.entity.CarEntity;
import ec.edu.espe.proyecto.subastas.entity.UserEntity;
import ec.edu.espe.proyecto.subastas.exception.DeleteException;
import ec.edu.espe.proyecto.subastas.exception.DocumentNotFoundException;
import ec.edu.espe.proyecto.subastas.exception.InsertException;
import ec.edu.espe.proyecto.subastas.exception.UpdateException;
import ec.edu.espe.proyecto.subastas.repository.CarRepository;
import ec.edu.espe.proyecto.subastas.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CarService {

    private CarRepository carRepository;
    private UserRepository userRepository;

    private String msgError;

    public CarService(CarRepository carRepository, UserRepository userRepository) {
        this.carRepository = carRepository;
        this.userRepository = userRepository;
    }

    public List<CarDTO> getAllCars() throws DocumentNotFoundException {
        try {
            List<CarEntity> carEntities = carRepository.findAll();
            List<CarDTO> carDTOS = new ArrayList<>();

            for (CarEntity carEntity : carEntities) {
                CarDTO carDTO = new CarDTO();
                carDTO.setBrandCar(carEntity.getBrand());
                carDTO.setModelCar(carEntity.getModel());
                carDTO.setYearCar(carEntity.getYear());
                carDTO.setBasePriceCar(carEntity.getBasePrice());
                carDTO.setPhotoCar(carEntity.getPhoto());
                carDTO.setSellerId(carEntity.getSellerId() != null ? carEntity.getSellerId().getUserId() : null);
                carDTO.setStatusCar(carEntity.getStatus());

                carDTOS.add(carDTO);
            }

            return carDTOS;
        }catch (Exception exception){
            this.msgError = this.msgError == null ? "Don´t found cars" : this.msgError;
            throw new DocumentNotFoundException(this.msgError, UserEntity.class.getName());
        }
    }

    public List<CarDTO> getAuctionedCars() throws DocumentNotFoundException {
        try {
            List<CarEntity> carEntities = carRepository.findByStatus(CarEntity.CarStatus.Subastado);
            List<CarDTO> carDTOS = new ArrayList<>();

            for (CarEntity carEntity : carEntities) {
                CarDTO carDTO = new CarDTO();
                carDTO.setBrandCar(carEntity.getBrand());
                carDTO.setModelCar(carEntity.getModel());
                carDTO.setYearCar(carEntity.getYear());
                carDTO.setBasePriceCar(carEntity.getBasePrice());
                carDTO.setPhotoCar(carEntity.getPhoto());
                carDTO.setSellerId(carEntity.getSellerId() != null ? carEntity.getSellerId().getUserId() : null);
                carDTO.setStatusCar(carEntity.getStatus());

                carDTOS.add(carDTO);
            }

            return carDTOS;
        } catch (Exception exception) {
            this.msgError = this.msgError == null ? "No auctioned cars found" : this.msgError;
            throw new DocumentNotFoundException(this.msgError, CarEntity.class.getName());
        }
    }

    public void createCar(CarDTO carDTO, Integer id) throws InsertException {
        try {
            Optional<UserEntity> userEntityOptional = this.userRepository.findById(id);
            if (!userEntityOptional.isPresent()) {
                throw new InsertException("User not found", UserEntity.class.getName());
            }
            Optional<CarEntity> existingCar = carRepository.findByBrandAndModelAndYear(
                    carDTO.getBrandCar(), carDTO.getModelCar(), carDTO.getYearCar());

            if (existingCar.isPresent()) {
                throw new InsertException("This car is already registered ", CarEntity.class.getName());
            }
            CarEntity carToCreate = new CarEntity();
            carToCreate.setBrand(carDTO.getBrandCar());
            carToCreate.setModel(carDTO.getModelCar());
            carToCreate.setYear(carDTO.getYearCar());
            carToCreate.setBasePrice(carDTO.getBasePriceCar());
            carToCreate.setPhoto(carDTO.getPhotoCar());
            carToCreate.setSellerId(userEntityOptional.get());
            carToCreate.setStatus(carDTO.getStatusCar());

            this.carRepository.save(carToCreate);
        } catch (Exception exception) {
            throw new InsertException("Error creating car", UserEntity.class.getName());
        }
    }

    public void updateCar (CarDTO carDTO, Integer id) throws UpdateException {
        try {
            CarEntity car = carRepository.findById(id).get();
            if (car == null) {
                this.msgError = "Car not found";
                throw new UpdateException(this.msgError, CarEntity.class.getName());
            }
            UserEntity user = userRepository.findById(carDTO.getSellerId())
                    .orElseThrow(() -> new UpdateException("User not found ", UserEntity.class.getName()));
            car.setBrand(carDTO.getBrandCar() != null ? carDTO.getBrandCar() : car.getBrand());
            car.setModel(carDTO.getModelCar() != null ? carDTO.getModelCar() : car.getModel());
            car.setYear(carDTO.getYearCar() != null ? carDTO.getYearCar() : car.getYear());
            car.setBasePrice(carDTO.getBasePriceCar() != null ? carDTO.getBasePriceCar() : car.getBasePrice());
            car.setPhoto(carDTO.getPhotoCar() != null ? carDTO.getPhotoCar() : car.getPhoto());
            car.setSellerId(user);
            car.setStatus(carDTO.getStatusCar() != null ? carDTO.getStatusCar() : car.getStatus());

            this.carRepository.save(car);
        }catch (Exception exception){
            this.msgError = this.msgError == null ? "Error updating car" : this.msgError;
            throw new UpdateException(this.msgError, CarEntity.class.getName());
        }
    }

    public void deleteCar (Integer id) throws DeleteException {
        try {
            CarEntity carToDelete = this.carRepository.findById(id).get();
            if (carToDelete == null){
                this.msgError = "Car not found";
                throw new DeleteException(this.msgError, UserEntity.class.getName());
            }
            this.carRepository.delete(carToDelete);
        }catch (Exception exception){
            this.msgError = this.msgError == null ? "Error delete car" : this.msgError;
            throw new DeleteException(this.msgError, UserEntity.class.getName());
        }
    }
}
