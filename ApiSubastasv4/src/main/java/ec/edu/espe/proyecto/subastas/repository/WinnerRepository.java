package ec.edu.espe.proyecto.subastas.repository;

import ec.edu.espe.proyecto.subastas.entity.WinnerEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WinnerRepository extends JpaRepository<WinnerEntity, Integer> {
}
