package ec.edu.espe.proyecto.subastas.exception;

public class InsertException extends Exception {
    private String entityName;

    public InsertException(String entityName, String message) {
        super(message);
        this.entityName = entityName;
    }
}
