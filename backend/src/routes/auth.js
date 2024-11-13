import express from 'express';
import sql from 'mssql';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { sendWelcomeEmail } from '../services/email.service.js';

const router = express.Router();

// Schema de validación para registro
const registerSchema = z.object({
  email: z.string().email('El correo electrónico no es válido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres')
});

router.post('/register', async (req, res) => {
  try {
    // Validar datos de entrada
    const validatedData = registerSchema.parse(req.body);
    const { email, password, firstName, lastName } = validatedData;
    
    const result = await sql.query`
      SELECT * FROM Users WHERE email = ${email}
    `;
    
    if (result.recordset.length > 0) {
      return res.status(400).json({ message: 'El email ya está registrado' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const insertResult = await sql.query`
      INSERT INTO Users (email, password, first_name, last_name, role_id)
      OUTPUT 
        INSERTED.id,
        INSERTED.email,
        INSERTED.first_name,
        INSERTED.last_name,
        INSERTED.created_at,
        INSERTED.profile_image
      VALUES (${email}, ${hashedPassword}, ${firstName}, ${lastName}, 2)
    `;

    const newUser = insertResult.recordset[0];
    
    // Intentar enviar email de bienvenida (no bloqueante)
    sendWelcomeEmail({
      email,
      firstName,
      lastName
    }).catch(error => {
      console.error('Error al enviar email de bienvenida:', error);
    });
    
    res.status(201).json({ 
      message: 'Usuario registrado exitosamente',
      user: newUser
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Error de validación', 
        errors: error.errors.map(e => e.message)
      });
    }
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const result = await sql.query`
      SELECT 
        u.id,
        u.email,
        u.password,
        u.first_name,
        u.last_name,
        u.created_at,
        u.profile_image,
        r.name as role,
        r.description as roleDescription
      FROM Users u
      JOIN Roles r ON u.role_id = r.id
      WHERE u.email = ${email}
    `;
    
    const user = result.recordset[0];
    
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    
    const validPassword = await bcrypt.compare(password, user.password);
    
    if (!validPassword) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your_jwt_secret_key_here_123',
      { expiresIn: '24h' }
    );
    
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        roleDescription: user.roleDescription,
        createdAt: user.created_at,
        profileImage: user.profile_image
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

router.put('/profile/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, profileImage } = req.body;

    const updateResult = await sql.query`
      UPDATE Users
      SET 
        first_name = ${firstName},
        last_name = ${lastName},
        profile_image = ${profileImage},
        updated_at = GETDATE()
      OUTPUT
        inserted.first_name,
        inserted.last_name,
        inserted.profile_image,
        inserted.updated_at
      WHERE id = ${id}
    `;

    if (updateResult.rowsAffected[0] === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const updatedUser = updateResult.recordset[0];

    res.json({ 
      message: 'Perfil actualizado exitosamente',
      user: {
        firstName: updatedUser.first_name,
        lastName: updatedUser.last_name,
        profileImage: updatedUser.profile_image
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar el perfil' });
  }
});

export default router;