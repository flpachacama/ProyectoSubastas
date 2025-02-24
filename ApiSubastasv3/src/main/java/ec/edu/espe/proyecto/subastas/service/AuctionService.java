package ec.edu.espe.proyecto.subastas.service;

import ec.edu.espe.proyecto.subastas.api.dto.AuctionDTO;
import ec.edu.espe.proyecto.subastas.api.dto.UserDTO;
import ec.edu.espe.proyecto.subastas.entity.AuctionEntity;
import ec.edu.espe.proyecto.subastas.entity.UserEntity;
import ec.edu.espe.proyecto.subastas.exception.DeleteException;
import ec.edu.espe.proyecto.subastas.exception.DocumentNotFoundException;
import ec.edu.espe.proyecto.subastas.exception.InsertException;
import ec.edu.espe.proyecto.subastas.exception.UpdateException;
import ec.edu.espe.proyecto.subastas.repository.AuctionRepository;
import ec.edu.espe.proyecto.subastas.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class AuctionService {
    private AuctionRepository auctionRepository;
    private UserRepository userRepository;

    private String msgError;

    public AuctionService(AuctionRepository auctionRepository, UserRepository userRepository) {
        this.auctionRepository = auctionRepository;
        this.userRepository = userRepository;
    }

    public List<AuctionDTO> getAllAuction() throws DocumentNotFoundException {
        try {
            List<AuctionEntity> auctionEntities = auctionRepository.findAll();
            List<AuctionDTO> auctionDTOS = new ArrayList<>();

            for (AuctionEntity auctionEntity : auctionEntities) {
                AuctionDTO auctionDTO = new AuctionDTO();
                auctionDTO.setSellerId(auctionEntity.getSellerId().getUserId());
                auctionDTO.setStartAuctionDate(auctionEntity.getStartDate());
                auctionDTO.setEndAuctionDate(auctionEntity.getEndDate());
                auctionDTO.setAuctionStatus(auctionEntity.getStatus());
                auctionDTOS.add(auctionDTO);
            }

            return auctionDTOS;
        }catch (Exception exception){
            this.msgError = this.msgError == null ? "Don´t found users" : this.msgError;
            throw new DocumentNotFoundException(this.msgError, UserEntity.class.getName());
        }
    }

    public void createAuction (AuctionDTO auctionDTO) throws InsertException{
        try {
            Optional<UserEntity> userOptional = this.userRepository.findById(auctionDTO.getSellerId());

            if (!userOptional.isPresent()) {
                this.msgError = "User don´t exist";
            }

            AuctionEntity auctionToCreate = new AuctionEntity();
            auctionToCreate.setSellerId(userOptional.get());
            auctionToCreate.setStartDate(auctionDTO.getStartAuctionDate());
            auctionToCreate.setEndDate(auctionDTO.getEndAuctionDate());
            auctionToCreate.setStatus(auctionDTO.getAuctionStatus());

            this.auctionRepository.save(auctionToCreate);
        }catch (Exception exception){
            this.msgError = this.msgError == null ? "Error creating auction" : this.msgError;
            throw new InsertException(this.msgError, UserEntity.class.getName());
        }
    }

    public void updateAuction (AuctionDTO auctionDTO, Integer id) throws UpdateException {
        try {
            AuctionEntity auctionToUpdate = this.auctionRepository.findById(id).get();

            if (auctionToUpdate == null) {
                this.msgError = "Auction does not exist";
                throw new UpdateException(this.msgError, AuctionEntity.class.getName());
            }

            auctionToUpdate.setStartDate(auctionDTO.getStartAuctionDate() != null ? auctionDTO.getStartAuctionDate() : auctionToUpdate.getStartDate());
            auctionToUpdate.setEndDate(auctionDTO.getEndAuctionDate() != null ? auctionDTO.getEndAuctionDate() : auctionToUpdate.getEndDate());
            auctionToUpdate.setStatus(auctionDTO.getAuctionStatus() != null ? auctionDTO.getAuctionStatus() : auctionToUpdate.getStatus());

            this.auctionRepository.save(auctionToUpdate);

        }catch (Exception exception){
            this.msgError = this.msgError == null ? "Error updating auction" : this.msgError;
            throw new UpdateException(this.msgError, AuctionEntity.class.getName());
        }
    }

    public void deleteAuction (Integer id) throws DeleteException {
        try {
            Optional<AuctionEntity> auctionToDelete = this.auctionRepository.findById(id);

            if (!auctionToDelete.isPresent()) {
                this.msgError = "Auction does not exist";
                throw new DeleteException(this.msgError, AuctionEntity.class.getName());
            }
            this.auctionRepository.delete(auctionToDelete.get());
        }catch (Exception exception){
            this.msgError = this.msgError == null ? "Error deleting auction" : this.msgError;
            throw new DeleteException(this.msgError, AuctionEntity.class.getName());
        }
    }

}




