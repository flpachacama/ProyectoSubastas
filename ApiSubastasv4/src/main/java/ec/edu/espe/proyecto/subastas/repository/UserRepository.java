package ec.edu.espe.proyecto.subastas.repository;

import ec.edu.espe.proyecto.subastas.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Integer> {
    UserEntity findByEmail(String email);

}
