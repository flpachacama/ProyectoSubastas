package ec.edu.espe.proyecto.subastas.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.Year;

@Entity
@Table(name = "autos")
public class CarEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column (name = "autoId")
    private Integer carId;

    @Column (name = "marca")
    private String brand;

    @Column (name = "modelo")
    private String model;

    @Column (name = "anio")
    private Year year;

    @Column (name = "precioBase")
    private BigDecimal basePrice;

    @Column (name = "foto")
    private String photo;

    @ManyToOne
    @JoinColumn (name = "vendedorId", referencedColumnName = "usuarioId")
    private UserEntity sellerId;

    @Enumerated(EnumType.STRING)
    @Column (name = "estado")
    private CarStatus status;

    public enum CarStatus {
        Disponible,
        Subastado,
        No_vendido,
        Vendido
    }

    public Integer getCarId() {
        return carId;
    }

    public void setCarId(Integer carId) {
        this.carId = carId;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public Year getYear() {
        return year;
    }

    public void setYear(Year year) {
        this.year = year;
    }

    public BigDecimal getBasePrice() {
        return basePrice;
    }

    public void setBasePrice(BigDecimal basePrice) {
        this.basePrice = basePrice;
    }

    public String getPhoto() {
        return photo;
    }

    public void setPhoto(String photo) {
        this.photo = photo;
    }

    public UserEntity getSellerId() {
        return sellerId;
    }

    public void setSellerId(UserEntity sellerId) {
        this.sellerId = sellerId;
    }

    public CarStatus getStatus() {
        return status;
    }

    public void setStatus(CarStatus status) {
        this.status = status;
    }
}
