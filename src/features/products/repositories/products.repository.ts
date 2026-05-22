import { prisma } from '../../../config/database';
import { Product, Prisma } from '@prisma/client';
import { CreateProductInput, UpdateProductInput, ProductFilters } from '../types/products.types';

export class ProductsRepository {
  async findAll(filters: ProductFilters) {
    const {
      search,
      kategori,
      minHarga,
      maxHarga,
      page = '1',
      limit = '100',
    } = filters;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // Build where clause
    const where: Prisma.ProductWhereInput = {};

    // Search filter (nama or kategori)
    if (search) {
      where.OR = [
        { nama: { contains: search, mode: 'insensitive' } },
        { kategori: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Category filter
    if (kategori) {
      where.kategori = kategori;
    }

    // Price range filter
    if (minHarga || maxHarga) {
      where.harga = {};
      if (minHarga) where.harga.gte = parseInt(minHarga, 10);
      if (maxHarga) where.harga.lte = parseInt(maxHarga, 10);
    }

    // Execute query with pagination
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where }),
    ]);

    return {
      products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    };
  }

  /**
   * Find product by ID
   */
  async findById(id: number): Promise<Product | null> {
    return prisma.product.findUnique({
      where: { id },
    });
  }

  /**
   * Create new product
   */
  async create(data: CreateProductInput): Promise<Product> {
    return prisma.product.create({
      data,
    });
  }

  /**
   * Update product
   */
  async update(id: number, data: UpdateProductInput): Promise<Product> {
    return prisma.product.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete product
   */
  async delete(id: number): Promise<Product> {
    return prisma.product.delete({
      where: { id },
    });
  }

  /**
   * Get all categories (unique)
   */
  async getCategories(): Promise<string[]> {
    const result = await prisma.product.findMany({
      select: { kategori: true },
      distinct: ['kategori'],
    });

    return result.map((r) => r.kategori);
  }
}