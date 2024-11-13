import { AuthService } from '../services/auth.service.js';
import { validateLoginSchema, validateRegisterSchema } from '../schemas/auth.schema.js';

const authService = new AuthService();

export class AuthController {
  async register(req, res, next) {
    try {
      const validatedData = validateRegisterSchema(req.body);
      const result = await authService.register(validatedData);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const validatedData = validateLoginSchema(req.body);
      const result = await authService.login(validatedData);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}