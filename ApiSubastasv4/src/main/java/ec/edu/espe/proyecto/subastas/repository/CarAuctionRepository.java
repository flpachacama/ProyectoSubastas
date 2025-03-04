package ec.edu.espe.proyecto.subastas.repository;

import ec.edu.espe.proyecto.subastas.entity.AuctionEntity;
import ec.edu.espe.proyecto.subastas.entity.CarAuctionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CarAuctionRepository extends JpaRepository<CarAuctionEntity, Integer> {
    List<CarAuctionEntity> findByAuction(AuctionEntity auction);
}
