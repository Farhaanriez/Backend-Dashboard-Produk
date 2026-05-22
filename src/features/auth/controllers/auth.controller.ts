import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { successResponse } from '../../../utils/response';
import { RegisterInput, LoginInput } from '../types/auth.types';

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const data: RegisterInput = req.body;
      const result = await authService.register(data);

      res.status(201).json(
        successResponse(result, 'User registered successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/login
   */
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const data: LoginInput = req.body;
      const result = await authService.login(data);

      res.status(200).json(
        successResponse(result, 'Login successful')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/refresh
   */
  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({ message: 'Refresh token is required' });
      }

      const tokens = await authService.refreshToken(refreshToken);

      res.status(200).json(
        successResponse(tokens, 'Token refreshed successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/logout
   */
  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;

      if (refreshToken) {
        await authService.logout(refreshToken);
      }

      res.status(200).json(
        successResponse(null, 'Logout successful')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/auth/me
   */
  async getCurrentUser(req: Request, res: Response, next: NextFunction) {
    try {
      // User data already attached by authenticate middleware
      res.status(200).json(
        successResponse((req as any).user, 'User retrieved successfully')
      );
    } catch (error) {
      next(error);
    }
  }
}

