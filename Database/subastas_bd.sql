CREATE DATABASE subastas;
USE subastas;

CREATE TABLE usuarios (
    usuarioId INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    contraseña VARCHAR(255) NOT NULL,
    rol ENUM('Vendedor', 'Comprador', 'Administrador') NOT NULL,
    activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE autos (
    autoId INT AUTO_INCREMENT PRIMARY KEY,
    marca VARCHAR(50) NOT NULL,
    modelo VARCHAR(50) NOT NULL,
    anio YEAR NOT NULL,
    precioBase DECIMAL(10,2) NOT NULL,
    foto VARCHAR(250) NOT NULL,
    vendedorId INT NOT NULL,
    estado ENUM('Disponible', 'Subastado', 'No vendido') DEFAULT 'Disponible',
    FOREIGN KEY (vendedorId) REFERENCES usuarios(usuarioId) ON DELETE CASCADE
);

CREATE TABLE subastas (
    subastaId INT AUTO_INCREMENT PRIMARY KEY,
    vendedorId INT NOT NULL,
    fechaInicio DATETIME NOT NULL,
    fechaFin DATETIME NOT NULL,
    estado ENUM('Activa', 'Finalizada', 'Cancelada') DEFAULT 'Activa',
    FOREIGN KEY (vendedorId) REFERENCES usuarios(usuarioId) ON DELETE CASCADE
);

CREATE TABLE autos_subasta (
    autosSubastaId INT AUTO_INCREMENT PRIMARY KEY,
    subastaId INT NOT NULL,
    autoId INT NOT NULL,
    FOREIGN KEY (subastaId) REFERENCES subastas(subastaId) ON DELETE CASCADE,
    FOREIGN KEY (autoId) REFERENCES autos(autoId) ON DELETE CASCADE
);

CREATE TABLE pujas (
    pujaId INT AUTO_INCREMENT PRIMARY KEY,
    autosSubastaId INT NOT NULL,
    compradorId INT NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    fechaHora DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (autosSubastaId) REFERENCES autos_subasta(autosSubastaId) ON DELETE CASCADE,
    FOREIGN KEY (compradorId) REFERENCES usuarios(usuarioId) ON DELETE CASCADE,
    CHECK (monto > 0)
);

CREATE TABLE ganadores (
    ganadorId INT AUTO_INCREMENT PRIMARY KEY,
    autosSubastaId INT NOT NULL,
    compradorId INT NOT NULL,
    precioFinal DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (autosSubastaId) REFERENCES autos_subasta(autosSubastaId) ON DELETE CASCADE,
    FOREIGN KEY (compradorId) REFERENCES usuarios(usuarioId) ON DELETE CASCADE
);