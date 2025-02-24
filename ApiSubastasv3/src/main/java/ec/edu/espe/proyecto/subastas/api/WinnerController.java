package ec.edu.espe.proyecto.subastas.api;

import ec.edu.espe.proyecto.subastas.api.dto.WinnerDTO;
import ec.edu.espe.proyecto.subastas.exception.InsertException;
import ec.edu.espe.proyecto.subastas.service.WinnerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(maxAge = 3600)
@RestController
@RequestMapping("/api/winner")
public class WinnerController {

    private WinnerService winnerService;

    public WinnerController(WinnerService winnerService) {
        this.winnerService = winnerService;
    }

    @PostMapping("/create")
    public ResponseEntity createWinner(@RequestBody WinnerDTO winnerDTO) {
        try {
            this.winnerService.createWiner(winnerDTO);
            return ResponseEntity.ok().body("Winner created");
        }catch (InsertException insertException){
            return ResponseEntity.badRequest().body(insertException.getMessage());
        }
    }
}
