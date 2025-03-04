package ec.edu.espe.proyecto.subastas.api;

import ec.edu.espe.proyecto.subastas.api.dto.CarAuctionDTO;
import ec.edu.espe.proyecto.subastas.exception.DeleteException;
import ec.edu.espe.proyecto.subastas.exception.InsertException;
import ec.edu.espe.proyecto.subastas.service.CarAuctionService;
import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(maxAge = 3600)
@RestController
@RequestMapping("/api/carAuction")
public class CarAuctionController {

    private final CarAuctionService carAuctionService;

    public CarAuctionController(CarAuctionService carAuctionService) {
        this.carAuctionService = carAuctionService;
    }

    @PreAuthorize("hasAnyAuthority('ROLE_Administrador') or hasAnyAuthority('ROLE_Vendedor')")
    @PostMapping ("/create")
    public ResponseEntity createCarAuction (@RequestBody CarAuctionDTO carAuctionDTO){
        try {
            this.carAuctionService.createCarAuction(carAuctionDTO);
            return ResponseEntity.ok().body("Car Auction Created");
        }catch (InsertException insertException){
            return ResponseEntity.badRequest().body(insertException.getMessage());
        }
    }

    @PreAuthorize("hasAnyAuthority('ROLE_Administrador') or hasAnyAuthority('ROLE_Vendedor')")
    @DeleteMapping("/delete")
    public ResponseEntity deleteCarAuction (@RequestParam("autosSubastaId") Integer id){
        try {
            this.carAuctionService.deleteCarAuction(id);
            return ResponseEntity.ok().body("Car Auction Deleted");
        }catch (DeleteException deleteException){
            return ResponseEntity.badRequest().body(deleteException.getMessage());
        }
    }
}
