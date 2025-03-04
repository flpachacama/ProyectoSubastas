package ec.edu.espe.proyecto.subastas.service;

import ec.edu.espe.proyecto.subastas.entity.UserEntity;
import ec.edu.espe.proyecto.subastas.exception.AccountNotFound;
import ec.edu.espe.proyecto.subastas.exception.InvalidCredentialsException;
import ec.edu.espe.proyecto.subastas.repository.UserRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.security.MessageDigest;
import java.util.Date;
import java.util.UUID;

@Service
public class AccountService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;


    public AccountService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public String login(String email, String password) throws InvalidCredentialsException, AccountNotFound {
        // Buscar al usuario por email
        UserEntity user = userRepository.findByEmail(email);

        if (user == null || !user.getActivate()) {
            throw new AccountNotFound("Account does not exist or is inactive");
        }

        // Validar la contraseña usando BCrypt
        if (!passwordEncoder.matches(password, user.getPassword()) ){
            throw new InvalidCredentialsException("Invalid credentials");
        }

        // Generar el token JWT
        SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + user.getRol().toString());

        return Jwts.builder()
                .setId(UUID.randomUUID().toString())
                .setSubject(user.getEmail())
                .claim("authority", authority.getAuthority())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 3600000)) // Token válido por 1 hora
                .signWith(generateKeyFromSecret(), SignatureAlgorithm.HS256)
                .compact();
    }

    private SecretKey generateKeyFromSecret() {
        try {
            String secret = "CONTRASENIA-1234"; // Clave secreta para firmar el token
            MessageDigest sha = MessageDigest.getInstance("SHA-512");
            byte[] keyBytes = sha.digest(secret.getBytes());
            return new SecretKeySpec(keyBytes, "HmacSHA512");
        } catch (Exception exception) {
            throw new RuntimeException("Error generating key: " + exception.getMessage());
        }
    }
}
