import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres')
});

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida')
});

export const validateRegisterSchema = (data) => {
  return registerSchema.parse(data);
};

export const validateLoginSchema = (data) => {
  return loginSchema.parse(data);
};