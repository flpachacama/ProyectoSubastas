package ec.edu.espe.proyecto.subastas.api;

import ec.edu.espe.proyecto.subastas.api.dto.CarAuctionDTO;
import ec.edu.espe.proyecto.subastas.exception.DeleteException;
import ec.edu.espe.proyecto.subastas.exception.DocumentNotFoundException;
import ec.edu.espe.proyecto.subastas.exception.InsertException;
import ec.edu.espe.proyecto.subastas.service.CarAuctionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @PreAuthorize("hasAnyAuthority('ROLE_Administrador') or hasAnyAuthority('ROLE_Comprador')")
    @GetMapping("/findAll")
    public ResponseEntity<List<CarAuctionDTO>> findAll() {
        try {
            List<CarAuctionDTO> carAuctionDTOS = this.carAuctionService.FindAll();
            return ResponseEntity.ok().body(carAuctionDTOS);
        }catch (DocumentNotFoundException documentNotFoundException){
            return ResponseEntity.notFound().build();
        }
    }

    @PreAuthorize("hasAnyAuthority('ROLE_Administrador') or hasAnyAuthority('ROLE_Comprador')")
    @GetMapping("/findById")
    public ResponseEntity<CarAuctionDTO> findById(@RequestParam("id") Integer id) {
        try {
            CarAuctionDTO carAuctionDTO = this.carAuctionService.findById(id);
            return ResponseEntity.ok().body(carAuctionDTO);
        } catch (DocumentNotFoundException documentNotFoundException) {
            return ResponseEntity.notFound().build();
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
