package ec.edu.espe.proyecto.subastas.api;

import ec.edu.espe.proyecto.subastas.api.dto.CarDTO;
import ec.edu.espe.proyecto.subastas.api.dto.UserDTO;
import ec.edu.espe.proyecto.subastas.exception.DeleteException;
import ec.edu.espe.proyecto.subastas.exception.DocumentNotFoundException;
import ec.edu.espe.proyecto.subastas.exception.InsertException;
import ec.edu.espe.proyecto.subastas.exception.UpdateException;
import ec.edu.espe.proyecto.subastas.service.CarService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(maxAge = 3600)
@RestController
@RequestMapping("/api/car")
public class CarController {

    private CarService carService;

    public CarController(CarService carService) {
        this.carService = carService;
    }

    @PreAuthorize("hasAnyAuthority('ROLE_Administrador') or hasAnyAuthority('ROLE_Vendedor') or hasAnyAuthority('ROLE_Comprador')")
    @GetMapping("/findAll")
    public ResponseEntity<List<CarDTO>> getAllCars() {
        try {
            List<CarDTO> carDTOS = this.carService.getAllCars();
            return ResponseEntity.ok().body(carDTOS);
        }catch (DocumentNotFoundException documentNotFoundException){
            return ResponseEntity.notFound().build();
        }
    }

    @PreAuthorize("hasAnyAuthority('ROLE_Comprador')")
    @GetMapping("/auctioned")
    public ResponseEntity<List<CarDTO>> getAuctionedCars() {
        try {
            List<CarDTO> carDTOS = this.carService.getAuctionedCars();
            return ResponseEntity.ok().body(carDTOS);
        } catch (DocumentNotFoundException documentNotFoundException) {
            return ResponseEntity.notFound().build();
        }
    }

    @PreAuthorize("hasAnyAuthority('ROLE_Administrador') or hasAnyAuthority('ROLE_Vendedor')")
    @PostMapping("/create/{id}")
    public ResponseEntity createCar(@RequestBody CarDTO carDTO, @PathVariable Integer id) {
        try {
            this.carService.createCar(carDTO, id);
            return ResponseEntity.ok().body("Car created");
        }catch (InsertException insertException){
            return ResponseEntity.badRequest().body(insertException.getMessage());
        }
    }

    @PreAuthorize("hasAnyAuthority('ROLE_Administrador') or hasAnyAuthority('ROLE_Vendedor')")
    @PatchMapping("/update")
    private ResponseEntity<String> updateCar (@RequestParam("autoId") Integer id, @RequestBody CarDTO carDTO) {
        try {
            this.carService.updateCar(carDTO, id);
            return ResponseEntity.ok().body("Car updated");
        }catch (UpdateException updateException){
            return ResponseEntity.badRequest().body(updateException.getMessage());
        }
    }

    @PreAuthorize("hasAnyAuthority('ROLE_Administrador') or hasAnyAuthority('ROLE_Vendedor')")
    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteCar(@RequestParam("autoId") Integer id) {
        try {
            this.carService.deleteCar(id);
            return ResponseEntity.ok().body("Car deleted");
        }catch (DeleteException deleteException){
            return ResponseEntity.badRequest().body(deleteException.getMessage());
        }
    }
}
