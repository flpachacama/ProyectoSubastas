package ec.edu.espe.proyecto.subastas.api.dto;

import ec.edu.espe.proyecto.subastas.entity.CarAuctionEntity;
import ec.edu.espe.proyecto.subastas.entity.UserEntity;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class BidDTO {

    private Integer carAuctionId;

    private Integer userId;

    private BigDecimal amountBid;

    private LocalDateTime dateTimeBid;

    public Integer getCarAuctionId() {
        return carAuctionId;
    }

    public void setCarAuctionId(Integer carAuctionId) {
        this.carAuctionId = carAuctionId;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public BigDecimal getAmountBid() {
        return amountBid;
    }

    public void setAmountBid(BigDecimal amountBid) {
        this.amountBid = amountBid;
    }

    public LocalDateTime getDateTimeBid() {
        return dateTimeBid;
    }

    public void setDateTimeBid(LocalDateTime dateTimeBid) {
        this.dateTimeBid = dateTimeBid;
    }
}
