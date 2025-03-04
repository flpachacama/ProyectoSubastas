package ec.edu.espe.proyecto.subastas.api;

import ec.edu.espe.proyecto.subastas.api.dto.LoginDTO;
import ec.edu.espe.proyecto.subastas.exception.AccountNotFound;
import ec.edu.espe.proyecto.subastas.exception.InvalidCredentialsException;
import ec.edu.espe.proyecto.subastas.service.AccountService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(maxAge = 3600)
@RestController
@RequestMapping("/api/authorization-server")
public class AccountController {

    private final AccountService accountService;

    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginDTO loginDTO) {
        try {
            String token = accountService.login(loginDTO.getEmail(), loginDTO.getPassword());
            return ResponseEntity.ok(token);
        } catch (AccountNotFound accountNotFound) {
            return ResponseEntity.notFound().build();
        } catch (InvalidCredentialsException invalidCredentialsException) {
            return ResponseEntity.badRequest().build();
        }
    }
}
