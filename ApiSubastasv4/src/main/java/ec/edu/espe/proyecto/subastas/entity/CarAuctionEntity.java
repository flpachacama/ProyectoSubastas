package ec.edu.espe.proyecto.subastas.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "autos_subasta")
public class CarAuctionEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column (name = "autosSubastaId")
    private Integer carAuctionId;

    @ManyToOne
    @JoinColumn (name = "subastaId", referencedColumnName = "subastaId")
    private AuctionEntity auction;

    @ManyToOne
    @JoinColumn (name = "autoId", referencedColumnName = "autoId")
    private CarEntity car;

    public Integer getCarAuctionId() {
        return carAuctionId;
    }

    public void setCarAuctionId(Integer carAuctionId) {
        this.carAuctionId = carAuctionId;
    }

    public AuctionEntity getAuction() {
        return auction;
    }

    public void setAuction(AuctionEntity auction) {
        this.auction = auction;
    }

    public CarEntity getCar() {
        return car;
    }

    public void setCar(CarEntity car) {
        this.car = car;
    }
}
