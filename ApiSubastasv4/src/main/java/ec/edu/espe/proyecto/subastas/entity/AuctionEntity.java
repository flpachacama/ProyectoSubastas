package ec.edu.espe.proyecto.subastas.entity;

import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name = "subastas")
public class AuctionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column (name = "subastaId")
    private Integer auctionId;

    @ManyToOne
    @JoinColumn (name = "vendedorId", referencedColumnName = "usuarioId")
    private UserEntity sellerId;

    @Column (name = "fechaInicio")
    private Date startDate;

    @Column (name = "fechaFin")
    private Date endDate;

    @Enumerated(EnumType.STRING)
    @Column (name = "estado")
    private AuctionStatus status;

    public enum AuctionStatus {
        Activa,
        Finalizada,
        Cancelada
    }

    public Integer getAuctionId() {
        return auctionId;
    }

    public void setAuctionId(Integer auctionId) {
        this.auctionId = auctionId;
    }

    public UserEntity getSellerId() {
        return sellerId;
    }

    public void setSellerId(UserEntity sellerId) {
        this.sellerId = sellerId;
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    public AuctionStatus getStatus() {
        return status;
    }

    public void setStatus(AuctionStatus status) {
        this.status = status;
    }
}
