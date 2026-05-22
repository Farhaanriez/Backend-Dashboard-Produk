import { Request, Response, NextFunction } from 'express';
import { ProductsService } from '../services/products.service';
import { successResponse } from '../../../utils/response';
import { CreateProductInput, UpdateProductInput, ProductFilters } from '../types/products.types';

const productsService = new ProductsService();

export class ProductsController {
  /**
   * GET /api/products
   */
  async getAllProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const filters: ProductFilters = req.query;
      const result = await productsService.getAllProducts(filters);

      res.status(200).json(
        successResponse(result, 'Products retrieved successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/products/:id
   */
  async getProductById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(String(req.params.id), 20);
      const product = await productsService.getProductById(id);

      res.status(200).json(
        successResponse(product, 'Product retrieved successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/products
   * Protected - ADMIN only
   */
  async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const data: CreateProductInput = req.body;
      const product = await productsService.createProduct(data);

      res.status(201).json(
        successResponse(product, 'Product created successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/products/:id
   * Protected - ADMIN only
   */
  async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(String(req.params.id), 10);
      const data: UpdateProductInput = req.body;
      const product = await productsService.updateProduct(id, data);

      res.status(200).json(
        successResponse(product, 'Product updated successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/products/:id
   * Protected - ADMIN only
   */
  async deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(String(req.params.id), 10);
      await productsService.deleteProduct(id);

      res.status(200).json(
        successResponse(null, 'Product deleted successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/products/categories
   */
  async getCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await productsService.getCategories();

      res.status(200).json(
        successResponse(categories, 'Categories retrieved successfully')
      );
    } catch (error) {
      next(error);
    }
  }
}