import { Router } from 'express';
import { ProductsController } from '../controllers/products.controller';
import { validate } from '../../../middlewares/validation.middleware';
import { authenticate, authorize } from '../../../middlewares/auth.middleware';
import {
  createProductSchema,
  updateProductSchema,
  getProductSchema,
  listProductsSchema,
} from '../types/products.types';

const router = Router();
const productsController = new ProductsController();

// Public routes
router.get(
  '/',
  validate(listProductsSchema),
  productsController.getAllProducts.bind(productsController)
);

router.get(
  '/categories',
  productsController.getCategories.bind(productsController)
);

router.get(
  '/:id',
  validate(getProductSchema),
  productsController.getProductById.bind(productsController)
);

// Protected routes - ADMIN only
router.post(
  '/',
  authenticate,
  authorize('ADMIN'),
  validate(createProductSchema),
  productsController.createProduct.bind(productsController)
);

router.put(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  validate(updateProductSchema),
  productsController.updateProduct.bind(productsController)
);

router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  validate(getProductSchema),
  productsController.deleteProduct.bind(productsController)
);

export default router;