package ec.edu.espe.proyecto.subastas.service;

import ec.edu.espe.proyecto.subastas.api.dto.UserDTO;
import ec.edu.espe.proyecto.subastas.entity.UserEntity;
import ec.edu.espe.proyecto.subastas.exception.DeleteException;
import ec.edu.espe.proyecto.subastas.exception.DocumentNotFoundException;
import ec.edu.espe.proyecto.subastas.exception.InsertException;
import ec.edu.espe.proyecto.subastas.exception.UpdateException;
import ec.edu.espe.proyecto.subastas.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private UserRepository userRepository;

    private String msgError;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<UserDTO> getAllUsers() throws DocumentNotFoundException{
        try {
            List<UserEntity> userEntities = userRepository.findAll();
            List<UserDTO> userDTOs = new ArrayList<>();

            for (UserEntity userEntity : userEntities) {
                UserDTO userDTO = new UserDTO();
                userDTO.setNameUser(userEntity.getName());
                userDTO.setLastnameUser(userEntity.getLastname());
                userDTO.setEmailUser(userEntity.getEmail());
                userDTO.setPasswordUser(userEntity.getPassword());
                userDTO.setRolUser(userEntity.getRol());
                userDTO.setActivateUser(userEntity.getActivate());

                userDTOs.add(userDTO);
            }

            return userDTOs;
        }catch (Exception exception){
            this.msgError = this.msgError == null ? "Don´t found users" : this.msgError;
            throw new DocumentNotFoundException(this.msgError, UserEntity.class.getName());
        }
    }

    public void createUser(UserDTO userDTO) throws InsertException {
        try {
            UserEntity userToCreate = new UserEntity();
            userToCreate.setName(userDTO.getNameUser());
            userToCreate.setLastname(userDTO.getLastnameUser());
            userToCreate.setEmail(userDTO.getEmailUser());
            userToCreate.setPassword(userDTO.getPasswordUser());
            userToCreate.setRol(userDTO.getRolUser());
            userToCreate.setActivate(userDTO.getActivateUser());

            this.userRepository.save(userToCreate);
        }catch (Exception exception){
            this.msgError = this.msgError == null ? "Error creating user" : this.msgError;
            throw new InsertException(this.msgError, UserEntity.class.getName());
        }
    }

    public void updateUser(UserDTO userDTO) throws UpdateException {
        try {
            UserEntity userToUpdate = this.userRepository.findByEmail(userDTO.getEmailUser());

            if (userToUpdate == null) {
                this.msgError = this.msgError == null ? "User not found" : this.msgError;
                throw new UpdateException(this.msgError, UserEntity.class.getName());
            }

            userToUpdate.setName(userDTO.getNameUser() != null ? userDTO.getNameUser() : userToUpdate.getName());
            userToUpdate.setLastname(userDTO.getLastnameUser() != null ? userDTO.getLastnameUser() : userToUpdate.getLastname());
            userToUpdate.setEmail(userDTO.getEmailUser() != null ? userDTO.getEmailUser() : userToUpdate.getEmail());
            userToUpdate.setPassword(userDTO.getPasswordUser() != null ? userDTO.getPasswordUser() : userToUpdate.getPassword());
            userToUpdate.setRol(userDTO.getRolUser() != null ? userDTO.getRolUser() : userToUpdate.getRol());
            userToUpdate.setActivate(userDTO.getActivateUser() != null ? userDTO.getActivateUser() : userToUpdate.getActivate());

            this.userRepository.save(userToUpdate);
        }catch (Exception exception){
            this.msgError = this.msgError == null ? "Error updating user" : this.msgError;
            throw new UpdateException(this.msgError, UserEntity.class.getName());
        }
    }

    public void deleteUser(Integer id) throws DeleteException {
        try {
            Optional<UserEntity> userEntityOptional = this.userRepository.findById(id);

            if (!userEntityOptional.isPresent()) {
                this.msgError = this.msgError == null ? "User not found" : this.msgError;
                throw new DeleteException(this.msgError, UserEntity.class.getName());
            }
            this.userRepository.delete(userEntityOptional.get());
        }catch (Exception exception){
            this.msgError = this.msgError == null ? "Error deleting user" : this.msgError;
            throw new DeleteException(this.msgError, UserEntity.class.getName());
        }
    }
}
