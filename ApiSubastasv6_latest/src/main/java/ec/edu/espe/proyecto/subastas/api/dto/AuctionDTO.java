package ec.edu.espe.proyecto.subastas.api.dto;

import ec.edu.espe.proyecto.subastas.entity.AuctionEntity;

import java.util.Date;
import java.util.List;

public class AuctionDTO {
    private Integer id;
    private Integer sellerId;
    private Date startAuctionDate;
    private Date endAuctionDate;
    private AuctionEntity.AuctionStatus auctionStatus;
    private List<CarDTO> cars;
    private Integer totalBids;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

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

    public List<CarDTO> getCars() {
        return cars;
    }

    public void setCars(List<CarDTO> cars) {
        this.cars = cars;
    }

    public Integer getTotalBids() {
        return totalBids;
    }

    public void setTotalBids(Integer totalBids) {
        this.totalBids = totalBids;
    }
}
