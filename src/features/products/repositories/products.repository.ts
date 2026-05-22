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

    const where: Prisma.ProductWhereInput = {};

    if (search) {
      where.OR = [
        { nama: { contains: search, mode: 'insensitive' } },
        { kategori: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (kategori) {
      where.kategori = kategori;
    }

    if (minHarga || maxHarga) {
      where.harga = {};
      if (minHarga) where.harga.gte = parseInt(minHarga, 10);
      if (maxHarga) where.harga.lte = parseInt(maxHarga, 10);
    }

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

  async findById(id: number): Promise<Product | null> {
    return prisma.product.findUnique({
      where: { id },
    });
  }

  async create(data: CreateProductInput): Promise<Product> {
    return prisma.product.create({
      data,
    });
  }

  async update(id: number, data: UpdateProductInput): Promise<Product> {
    return prisma.product.update({
      where: { id },
      data,
    });
  }


  async delete(id: number): Promise<Product> {
    return prisma.product.delete({
      where: { id },
    });
  }

  async getCategories(): Promise<string[]> {
    const result = await prisma.product.findMany({
      select: { kategori: true },
      distinct: ['kategori'],
    });

    return result.map((r) => r.kategori);
  }
}