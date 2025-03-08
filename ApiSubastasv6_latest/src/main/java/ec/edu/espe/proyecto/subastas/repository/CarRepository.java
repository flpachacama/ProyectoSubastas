package ec.edu.espe.proyecto.subastas.repository;

import ec.edu.espe.proyecto.subastas.entity.CarEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Year;
import java.util.List;
import java.util.Optional;

@Repository
public interface CarRepository extends JpaRepository<CarEntity, Integer> {

    Optional<CarEntity> findByBrandAndModelAndYear(@Param("brand") String brand, @Param("model") String model, @Param("year") Year year);

    List<CarEntity> findByStatus(CarEntity.CarStatus status);

}
