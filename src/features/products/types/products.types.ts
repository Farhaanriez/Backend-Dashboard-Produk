import { z } from 'zod';

export const createProductSchema = z.object({
  body: z.object({
    nama: z.string().min(3, 'Name must be at least 3 characters'),
    kategori: z.string().min(2, 'Category is required'),
    harga: z.number().int().positive('Price must be positive'),
    deskripsi: z.string().min(10, 'Description must be at least 10 characters'),
    stok: z.number().int().nonnegative('Stock cannot be negative'),
  }),
});

export const updateProductSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'Invalid product ID'),
  }),
  body: z.object({
    nama: z.string().min(3).optional(),
    kategori: z.string().min(2).optional(),
    harga: z.number().int().positive().optional(),
    deskripsi: z.string().min(10).optional(),
    stok: z.number().int().nonnegative().optional(),
  }),
});

export const getProductSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'Invalid product ID'),
  }),
});

export const listProductsSchema = z.object({
  query: z.object({
    search: z.string().optional(),
    kategori: z.string().optional(),
    minHarga: z.string().regex(/^\d+$/).optional(),
    maxHarga: z.string().regex(/^\d+$/).optional(),
    page: z.string().regex(/^\d+$/).optional(),
    limit: z.string().regex(/^\d+$/).optional(),
  }),
});

/**
 * TypeScript Types
 */

export type CreateProductInput = z.infer<typeof createProductSchema>['body'];
export type UpdateProductInput = z.infer<typeof updateProductSchema>['body'];
export type ProductFilters = z.infer<typeof listProductsSchema>['query'];