package ec.edu.espe.proyecto.subastas.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "pujas")
public class BidEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column (name = "pujaId")
    private Integer bidId;

    @ManyToOne
    @JoinColumn (name = "autosSubastaId", referencedColumnName = "autosSubastaId")
    private CarAuctionEntity carAuction;

    @ManyToOne
    @JoinColumn (name = "compradorId", referencedColumnName = "usuarioId")
    private UserEntity buyer;

    @Column (name = "monto")
    private BigDecimal amount;

    @Column (name = "fechaHora")
    private LocalDateTime dateTime;

    @PrePersist
    protected void onCreate() {
        dateTime = LocalDateTime.now();
    }

    public Integer getBidId() {
        return bidId;
    }

    public void setBidId(Integer bidId) {
        this.bidId = bidId;
    }

    public CarAuctionEntity getCarAuction() {
        return carAuction;
    }

    public void setCarAuction(CarAuctionEntity carAuction) {
        this.carAuction = carAuction;
    }

    public UserEntity getBuyer() {
        return buyer;
    }

    public void setBuyer(UserEntity buyer) {
        this.buyer = buyer;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public LocalDateTime getDateTime() {
        return dateTime;
    }

    public void setDateTime(LocalDateTime dateTime) {
        this.dateTime = dateTime;
    }
}
