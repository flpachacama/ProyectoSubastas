package ec.edu.espe.proyecto.subastas.api.dto;

import ec.edu.espe.proyecto.subastas.entity.UserEntity;


public class UserDTO {

    private String nameUser;

    private String lastnameUser;

    private String emailUser;

    private String passwordUser;

    private UserEntity.RolStatus rolUser;

    private Boolean activateUser;

    public String getNameUser() {
        return nameUser;
    }

    public void setNameUser(String nameUser) {
        this.nameUser = nameUser;
    }

    public String getLastnameUser() {
        return lastnameUser;
    }

    public void setLastnameUser(String lastnameUser) {
        this.lastnameUser = lastnameUser;
    }

    public String getEmailUser() {
        return emailUser;
    }

    public void setEmailUser(String emailUser) {
        this.emailUser = emailUser;
    }

    public String getPasswordUser() {
        return passwordUser;
    }

    public void setPasswordUser(String passwordUser) {
        this.passwordUser = passwordUser;
    }

    public UserEntity.RolStatus getRolUser() {
        return rolUser;
    }

    public void setRolUser(UserEntity.RolStatus rolUser) {
        this.rolUser = rolUser;
    }

    public Boolean getActivateUser() {
        return activateUser;
    }

    public void setActivateUser(Boolean activateUser) {
        this.activateUser = activateUser;
    }
}
