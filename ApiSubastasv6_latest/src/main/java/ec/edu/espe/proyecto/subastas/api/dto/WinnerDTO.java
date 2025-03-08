package ec.edu.espe.proyecto.subastas.api.dto;


import java.math.BigDecimal;

public class WinnerDTO {

    private Integer carAuctionId;

    private Integer userId;

    private BigDecimal finalPriceWiner;

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

    public BigDecimal getFinalPriceWiner() {
        return finalPriceWiner;
    }

    public void setFinalPriceWiner(BigDecimal finalPriceWiner) {
        this.finalPriceWiner = finalPriceWiner;
    }
}
