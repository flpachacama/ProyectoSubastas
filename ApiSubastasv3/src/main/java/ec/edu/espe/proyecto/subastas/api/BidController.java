package ec.edu.espe.proyecto.subastas.api;

import ec.edu.espe.proyecto.subastas.api.dto.AuctionDTO;
import ec.edu.espe.proyecto.subastas.api.dto.BidDTO;
import ec.edu.espe.proyecto.subastas.exception.DeleteException;
import ec.edu.espe.proyecto.subastas.exception.InsertException;
import ec.edu.espe.proyecto.subastas.exception.UpdateException;
import ec.edu.espe.proyecto.subastas.service.BidService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(maxAge = 3600)
@RestController
@RequestMapping("/api/bid")
public class BidController {

    private final BidService bidService;

    public BidController(BidService bidService) {
        this.bidService = bidService;
    }

    @PostMapping("/create")
    public ResponseEntity createBid(@RequestBody BidDTO bidDTO){
        try {
            this.bidService.createBid(bidDTO);
            return ResponseEntity.ok().body("Correct creation");
        }catch (InsertException insertException){
            return ResponseEntity.badRequest().body(insertException.getMessage());
        }
    }

    @PatchMapping ("/update/{id}")
    public ResponseEntity updateBid(@RequestBody BidDTO bidDTO, @PathVariable Integer id){
        try {
            this.bidService.updateBid(bidDTO, id);
            return ResponseEntity.ok().body("Correct update");
        }catch (UpdateException updateException){
            return ResponseEntity.badRequest().body(updateException.getMessage());
        }
    }

    @DeleteMapping("/delete")
    public ResponseEntity deleteBid(@PathVariable Integer id){
        try {
            this.bidService.delete(id);
            return ResponseEntity.ok().body("Correct delete");
        }catch (DeleteException deleteException){
            return ResponseEntity.badRequest().body(deleteException.getMessage());
        }
    }
}
