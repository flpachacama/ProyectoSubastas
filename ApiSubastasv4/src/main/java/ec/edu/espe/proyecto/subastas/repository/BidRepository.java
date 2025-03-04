package ec.edu.espe.proyecto.subastas.repository;

import ec.edu.espe.proyecto.subastas.entity.AuctionEntity;
import ec.edu.espe.proyecto.subastas.entity.BidEntity;
import ec.edu.espe.proyecto.subastas.entity.CarAuctionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BidRepository extends JpaRepository<BidEntity, Integer> {
    List<BidEntity> findByCarAuction_AuctionOrderByAmountDesc(AuctionEntity auction);
    Optional<BidEntity> findTopByCarAuctionOrderByAmountDesc(CarAuctionEntity carAuction);
}