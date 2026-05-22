import { ProductsRepository } from '../repositories/products.repository';
import { NotFoundError } from '../../../utils/AppError';
import { CreateProductInput, UpdateProductInput, ProductFilters } from '../types/products.types';

const productsRepository = new ProductsRepository();

export class ProductsService {
  async getAllProducts(filters: ProductFilters) {
    return productsRepository.findAll(filters);
  }

  async getProductById(id: number) {
    const product = await productsRepository.findById(id);

    if (!product) {
      throw new NotFoundError('Product not found');
    }

    return product;
  }

  async createProduct(data: CreateProductInput) {
    return productsRepository.create(data);
  }

  async updateProduct(id: number, data: UpdateProductInput) {
    await this.getProductById(id);

    return productsRepository.update(id, data);
  }

  async deleteProduct(id: number) {
    await this.getProductById(id);

    return productsRepository.delete(id);
  }
  
  async getCategories() {
    return productsRepository.getCategories();
  }
}