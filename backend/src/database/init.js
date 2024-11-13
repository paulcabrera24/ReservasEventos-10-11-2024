import sql from 'mssql';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const config = {
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || '456',
  server: process.env.DB_SERVER || 'localhost',
  database: 'master',
  options: {
    encrypt: true,
    trustServerCertificate: true
  }
};

export async function initializeDatabase() {
  let pool;
  try {
    // Conectar a master para crear la base de datos
    pool = await sql.connect(config);
    
    // Crear la base de datos si no existe
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'EventBookingDB')
      BEGIN
        CREATE DATABASE EventBookingDB;
      END
    `);

    await pool.close();

    // Reconectar a la base de datos EventBookingDB
    const dbConfig = {
      ...config,
      database: 'EventBookingDB'
    };
    
    pool = await sql.connect(dbConfig);

    // Crear tabla de roles si no existe
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Roles]') AND type in (N'U'))
      BEGIN
        CREATE TABLE [dbo].[Roles] (
          [id] INT IDENTITY(1,1) PRIMARY KEY,
          [name] NVARCHAR(50) NOT NULL UNIQUE,
          [description] NVARCHAR(255)
        );

        INSERT INTO Roles (name, description) VALUES 
          ('admin', 'Administrador del sistema'),
          ('user', 'Usuario cliente');
      END
    `);

    // Verificar si la columna profile_image existe en la tabla Users
    const checkProfileImageColumn = await pool.request().query(`
      SELECT COUNT(*) as count
      FROM sys.columns 
      WHERE object_id = OBJECT_ID('Users') AND name = 'profile_image'
    `);

    // Crear o modificar la tabla Users según sea necesario
    if (!checkProfileImageColumn.recordset[0].count) {
      // Si la tabla Users no existe, crearla con todas las columnas
      await pool.request().query(`
        IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Users]') AND type in (N'U'))
        BEGIN
          CREATE TABLE [dbo].[Users] (
            [id] INT IDENTITY(1,1) PRIMARY KEY,
            [first_name] NVARCHAR(50) NOT NULL,
            [last_name] NVARCHAR(50) NOT NULL,
            [email] NVARCHAR(255) NOT NULL UNIQUE,
            [password] NVARCHAR(255) NOT NULL,
            [role_id] INT NOT NULL,
            [profile_image] NVARCHAR(MAX),
            [created_at] DATETIME DEFAULT GETDATE(),
            [updated_at] DATETIME DEFAULT GETDATE(),
            CONSTRAINT FK_Users_Roles FOREIGN KEY (role_id) REFERENCES Roles(id)
          );
        END
        ELSE
        BEGIN
          -- Si la tabla existe pero no tiene la columna profile_image, agregarla
          ALTER TABLE Users
          ADD profile_image NVARCHAR(MAX);
        END
      `);
    }

    // Crear o modificar la tabla Reservations
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Reservations]') AND type in (N'U'))
      BEGIN
        CREATE TABLE [dbo].[Reservations] (
          [id] INT IDENTITY(1,1) PRIMARY KEY,
          [user_id] INT NOT NULL,
          [event_date] DATE NOT NULL,
          [participant_count] INT NOT NULL DEFAULT 1,
          [status] NVARCHAR(20) DEFAULT 'pending',
          [created_at] DATETIME DEFAULT GETDATE(),
          [updated_at] DATETIME DEFAULT GETDATE(),
          CONSTRAINT FK_Reservations_Users FOREIGN KEY (user_id) REFERENCES Users(id)
        );
      END
      ELSE
      BEGIN
        -- Verificar y agregar columnas necesarias
        IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Reservations') AND name = 'event_date')
        BEGIN
          ALTER TABLE Reservations ADD event_date DATE NOT NULL DEFAULT GETDATE();
        END

        IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Reservations') AND name = 'participant_count')
        BEGIN
          ALTER TABLE Reservations ADD participant_count INT NOT NULL DEFAULT 1;
        END
      END
    `);

    // Crear tabla de Participants si no existe
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Participants]') AND type in (N'U'))
      BEGIN
        CREATE TABLE [dbo].[Participants] (
          [id] INT IDENTITY(1,1) PRIMARY KEY,
          [reservation_id] INT NOT NULL,
          [dni] VARCHAR(8) NOT NULL,
          [instagram_account] VARCHAR(100) NOT NULL,
          [created_at] DATETIME DEFAULT GETDATE(),
          [updated_at] DATETIME DEFAULT GETDATE(),
          CONSTRAINT FK_Participants_Reservations FOREIGN KEY (reservation_id) REFERENCES Reservations(id)
        );
      END
    `);

    // Crear usuario admin por defecto si no existe
    const adminRoleResult = await pool.request()
      .query("SELECT id FROM Roles WHERE name = 'admin'");
    
    if (adminRoleResult.recordset.length > 0) {
      const adminRoleId = adminRoleResult.recordset[0].id;
      const hashedPassword = await bcrypt.hash('admin123', 10);

      await pool.request().query`
        IF NOT EXISTS (SELECT * FROM Users WHERE email = 'admin@eventhub.com')
        BEGIN
          INSERT INTO Users (first_name, last_name, email, password, role_id)
          VALUES (
            'Admin',
            'System',
            'admin@eventhub.com',
            ${hashedPassword},
            ${adminRoleId}
          );
        END
      `;
    }

    console.log('Base de datos inicializada correctamente');
    return pool;
  } catch (err) {
    console.error('Error al inicializar la base de datos:', err);
    throw err;
  }
}