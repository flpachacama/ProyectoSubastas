package ec.edu.espe.proyecto.subastas.api.dto;

import ec.edu.espe.proyecto.subastas.entity.CarEntity;
import ec.edu.espe.proyecto.subastas.entity.UserEntity;

import java.math.BigDecimal;
import java.time.Year;

public class CarDTO {
    private String brandCar;

    private String modelCar;

    private Year yearCar;

    private BigDecimal basePriceCar;

    private String photoCar;

    private Integer sellerId;

    private CarEntity.CarStatus statusCar;

    public String getBrandCar() {
        return brandCar;
    }

    public void setBrandCar(String brandCar) {
        this.brandCar = brandCar;
    }

    public String getModelCar() {
        return modelCar;
    }

    public void setModelCar(String modelCar) {
        this.modelCar = modelCar;
    }

    public Year getYearCar() {
        return yearCar;
    }

    public void setYearCar(Year yearCar) {
        this.yearCar = yearCar;
    }

    public BigDecimal getBasePriceCar() {
        return basePriceCar;
    }

    public void setBasePriceCar(BigDecimal basePriceCar) {
        this.basePriceCar = basePriceCar;
    }

    public String getPhotoCar() {
        return photoCar;
    }

    public void setPhotoCar(String photoCar) {
        this.photoCar = photoCar;
    }

    public Integer getSellerId() {
        return sellerId;
    }

    public void setSellerId(Integer sellerId) {
        this.sellerId = sellerId;
    }

    public CarEntity.CarStatus getStatusCar() {
        return statusCar;
    }

    public void setStatusCar(CarEntity.CarStatus statusCar) {
        this.statusCar = statusCar;
    }
}
