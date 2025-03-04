package ec.edu.espe.proyecto.subastas.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "usuarios")
public class UserEntity {
    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    @Column (name = "usuarioId")
    private Integer userId;

    @Column (name = "nombre")
    private String name;

    @Column (name = "apellido")
    private String lastname;

    @Column (name = "email")
    private String email;

    @Column (name = "contraseña")
    private String password;

    @Enumerated(EnumType.STRING)
    @Column (name = "rol")
    private RolStatus rol;

    public enum RolStatus {
        Vendedor,
        Comprador,
        Administrador
    }

    @Column (name = "activo")
    private Boolean activate = true;

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLastname() {
        return lastname;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public RolStatus getRol() {
        return rol;
    }

    public void setRol(RolStatus rol) {
        this.rol = rol;
    }

    public Boolean getActivate() {
        return activate;
    }

    public void setActivate(Boolean activate) {
        this.activate = activate;
    }
}
