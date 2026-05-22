import { ProductsRepository } from '../repositories/products.repository';
import { NotFoundError } from '../../../utils/AppError';
import { CreateProductInput, UpdateProductInput, ProductFilters } from '../types/products.types';

const productsRepository = new ProductsRepository();

export class ProductsService {
  /**
   * Get all products with filters
   */
  async getAllProducts(filters: ProductFilters) {
    return productsRepository.findAll(filters);
  }

  /**
   * Get single product by ID
   */
  async getProductById(id: number) {
    const product = await productsRepository.findById(id);

    if (!product) {
      throw new NotFoundError('Product not found');
    }

    return product;
  }

  /**
   * Create new product
   */
  async createProduct(data: CreateProductInput) {
    // Additional business logic bisa ditambahkan di sini
    // Contoh: validasi kategori, check stock limits, dll

    return productsRepository.create(data);
  }

  /**
   * Update product
   */
  async updateProduct(id: number, data: UpdateProductInput) {
    // Check if product exists
    await this.getProductById(id);

    return productsRepository.update(id, data);
  }

  /**
   * Delete product
   */
  async deleteProduct(id: number) {
    // Check if product exists
    await this.getProductById(id);

    return productsRepository.delete(id);
  }

  /**
   * Get all categories
   */
  async getCategories() {
    return productsRepository.getCategories();
  }
}