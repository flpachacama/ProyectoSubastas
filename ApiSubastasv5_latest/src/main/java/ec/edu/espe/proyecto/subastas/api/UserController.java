package ec.edu.espe.proyecto.subastas.api;

import ec.edu.espe.proyecto.subastas.api.dto.UserDTO;
import ec.edu.espe.proyecto.subastas.exception.DeleteException;
import ec.edu.espe.proyecto.subastas.exception.DocumentNotFoundException;
import ec.edu.espe.proyecto.subastas.exception.InsertException;
import ec.edu.espe.proyecto.subastas.exception.UpdateException;
import ec.edu.espe.proyecto.subastas.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(maxAge = 3600)
@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PreAuthorize("hasAnyAuthority('ROLE_Administrador')")
    @GetMapping("/findAll")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        try {
            List<UserDTO> userDTOS = this.userService.getAllUsers();
            return ResponseEntity.ok().body(userDTOS);
        }catch (DocumentNotFoundException documentNotFoundException){
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/create")
    public ResponseEntity createUser(@RequestBody UserDTO userDTO) {
        try {
            this.userService.createUser(userDTO);
            return ResponseEntity.ok().body("User created");
        }catch (InsertException insertException){
            return ResponseEntity.badRequest().body(insertException.getMessage());
        }
    }

    @PreAuthorize("hasAnyAuthority('ROLE_Administrador')")
    @PatchMapping("/update")
    public ResponseEntity updateUser(@RequestBody UserDTO userDTO) {
        try {
            this.userService.updateUser(userDTO);
            return ResponseEntity.ok().body("User updated");
        }catch (UpdateException updateException){
            return ResponseEntity.badRequest().body(updateException.getMessage());
        }
    }


    @PreAuthorize("hasAnyAuthority('ROLE_Administrador')")
    @DeleteMapping("/delete")
    public ResponseEntity deleteUser(@RequestParam("usuarioId") Integer id) {
        try {
            this.userService.deleteUser(id);
            return ResponseEntity.ok().body("User deleted");
        }catch (DeleteException deleteException){
            return ResponseEntity.badRequest().body(deleteException.getMessage());
        }
    }
}
