import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../../../middlewares/validation.middleware';
import { authenticate } from '../../../middlewares/auth.middleware';
import { authLimiter } from '../../../middlewares/rateLimiter.middleware';
import { registerSchema, loginSchema } from '../types/auth.types';

const router = Router();
const authController = new AuthController();

// Public routes (with rate limiting)
router.post(
  '/register',
  authLimiter,
  validate(registerSchema),
  authController.register.bind(authController)
);

router.post(
  '/login',
  authLimiter,
  validate(loginSchema),
  authController.login.bind(authController)
);

router.post(
  '/refresh',
  authController.refreshToken.bind(authController)
);

router.post(
  '/logout',
  authController.logout.bind(authController)
);

// Protected routes
router.get(
  '/me',
  authenticate,
  authController.getCurrentUser.bind(authController)
);

export default router;