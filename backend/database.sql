-- Modificar tabla de Reservations para usar event_date en lugar de event_id
ALTER TABLE Reservations DROP CONSTRAINT FK_Reservations_Events;
ALTER TABLE Reservations DROP COLUMN event_id;
ALTER TABLE Reservations ADD event_date DATE NOT NULL;

-- Actualizar la tabla de Reservations
ALTER TABLE Reservations ADD participant_count INT NOT NULL DEFAULT 1;

-- Tabla de Participantes
CREATE TABLE Participants (
    id INT IDENTITY(1,1) PRIMARY KEY,
    reservation_id INT NOT NULL,
    dni VARCHAR(8) NOT NULL,
    instagram_account VARCHAR(100) NOT NULL,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_Participants_Reservations FOREIGN KEY (reservation_id) REFERENCES Reservations(id)
);