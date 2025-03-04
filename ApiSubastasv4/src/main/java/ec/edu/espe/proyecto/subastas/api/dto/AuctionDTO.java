package ec.edu.espe.proyecto.subastas.api.dto;

import ec.edu.espe.proyecto.subastas.entity.AuctionEntity;


import java.util.Date;

public class AuctionDTO {
    private Integer sellerId;

    private Date startAuctionDate;

    private Date endAuctionDate;

    private AuctionEntity.AuctionStatus auctionStatus;

    public Integer getSellerId() {
        return sellerId;
    }

    public void setSellerId(Integer sellerId) {
        this.sellerId = sellerId;
    }

    public Date getStartAuctionDate() {
        return startAuctionDate;
    }

    public void setStartAuctionDate(Date startAuctionDate) {
        this.startAuctionDate = startAuctionDate;
    }

    public Date getEndAuctionDate() {
        return endAuctionDate;
    }

    public void setEndAuctionDate(Date endAuctionDate) {
        this.endAuctionDate = endAuctionDate;
    }

    public AuctionEntity.AuctionStatus getAuctionStatus() {
        return auctionStatus;
    }

    public void setAuctionStatus(AuctionEntity.AuctionStatus auctionStatus) {
        this.auctionStatus = auctionStatus;
    }
}
