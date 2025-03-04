package ec.edu.espe.proyecto.subastas.api;

import ec.edu.espe.proyecto.subastas.api.dto.AuctionDTO;
import ec.edu.espe.proyecto.subastas.api.dto.UserDTO;
import ec.edu.espe.proyecto.subastas.exception.DeleteException;
import ec.edu.espe.proyecto.subastas.exception.DocumentNotFoundException;
import ec.edu.espe.proyecto.subastas.exception.InsertException;
import ec.edu.espe.proyecto.subastas.exception.UpdateException;
import ec.edu.espe.proyecto.subastas.service.AuctionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(maxAge = 3600)
@RestController
@RequestMapping("/api/auction")
public class AuctionController {

    private final AuctionService auctionService;

    public AuctionController(AuctionService auctionService) {
        this.auctionService = auctionService;
    }

    @PreAuthorize("hasAnyAuthority('ROLE_Administrador') or hasAnyAuthority('ROLE_Vendedor')")
    @GetMapping("/findAll")
    public ResponseEntity<List<AuctionDTO>> getAllAuction() {
        try {
            List<AuctionDTO> auctionDTOS = this.auctionService.getAllAuction();
            return ResponseEntity.ok().body(auctionDTOS);
        }catch (DocumentNotFoundException documentNotFoundException){
            return ResponseEntity.notFound().build();
        }
    }

    @PreAuthorize("hasAnyAuthority('ROLE_Administrador') or hasAnyAuthority('ROLE_Vendedor')")
    @PostMapping("/create")
    public ResponseEntity createAuction(@RequestBody AuctionDTO auctionDTO){
        try {
            this.auctionService.createAuction(auctionDTO);
            return ResponseEntity.ok().body("Correct Creation");
        }catch (InsertException insertException){
            return ResponseEntity.badRequest().body(insertException.getMessage());
        }
    }

    @PreAuthorize("hasAnyAuthority('ROLE_Administrador') or hasAnyAuthority('ROLE_Vendedor')")
    @PatchMapping("/update/{id}")
    public ResponseEntity updateAuction(@RequestBody AuctionDTO auctionDTO, @PathVariable Integer id){
        try {
            this.auctionService.updateAuction(auctionDTO, id);
            return ResponseEntity.ok().body("Correct Update");
        }catch (UpdateException updateException){
            return ResponseEntity.badRequest().body(updateException.getMessage());
        }
    }

    @PreAuthorize("hasAnyAuthority('ROLE_Administrador') or hasAnyAuthority('ROLE_Vendedor')")
    @DeleteMapping("/delete")
    public ResponseEntity deleteAuction(@RequestParam("auctionId") Integer id){
        try {
            this.auctionService.deleteAuction(id);
            return ResponseEntity.ok().body("Correct Delete");
        }catch (DeleteException deleteException){
            return ResponseEntity.badRequest().body(deleteException.getMessage());
        }
    }

}
