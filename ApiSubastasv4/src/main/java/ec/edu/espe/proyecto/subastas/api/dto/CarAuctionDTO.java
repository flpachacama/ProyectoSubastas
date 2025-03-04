package ec.edu.espe.proyecto.subastas.api.dto;

import ec.edu.espe.proyecto.subastas.entity.AuctionEntity;
import ec.edu.espe.proyecto.subastas.entity.CarEntity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

public class CarAuctionDTO {

    private Integer auctionId;

    private Integer carId;

    public Integer getAuctionId() {
        return auctionId;
    }

    public void setAuctionId(Integer auctionId) {
        this.auctionId = auctionId;
    }

    public Integer getCarId() {
        return carId;
    }

    public void setCarId(Integer carId) {
        this.carId = carId;
    }
}
