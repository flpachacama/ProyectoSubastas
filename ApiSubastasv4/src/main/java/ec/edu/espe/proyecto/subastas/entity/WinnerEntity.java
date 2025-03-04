package ec.edu.espe.proyecto.subastas.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table (name = "ganadores")
public class WinnerEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column (name = "ganadorId")
    private Integer winerId;

    @ManyToOne
    @JoinColumn (name = "autosSubastaId", referencedColumnName = "autosSubastaId")
    private CarAuctionEntity carAuction;

    @ManyToOne
    @JoinColumn (name = "compradorId", referencedColumnName = "usuarioId")
    private UserEntity user;

    @Column (name = "precioFinal")
    private BigDecimal finalPrice;

    public Integer getWinerId() {
        return winerId;
    }

    public void setWinerId(Integer winerId) {
        this.winerId = winerId;
    }

    public CarAuctionEntity getCarAuction() {
        return carAuction;
    }

    public void setCarAuction(CarAuctionEntity carAuction) {
        this.carAuction = carAuction;
    }

    public UserEntity getUser() {
        return user;
    }

    public void setUser(UserEntity user) {
        this.user = user;
    }

    public BigDecimal getFinalPrice() {
        return finalPrice;
    }

    public void setFinalPrice(BigDecimal finalPrice) {
        this.finalPrice = finalPrice;
    }
}
