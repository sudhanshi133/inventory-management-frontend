import api from './api';
import { Product, ProductRequest, QuantityType } from '../types/product.types';

export interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export const productService = {
  // Get all products with optional filters and pagination
  getAllProducts: async (filters?: {
    name?: string;
    quantityType?: QuantityType;
    lowStock?: boolean;
    page?: number;
    size?: number;
  }): Promise<PageResponse<Product>> => {
    const params = new URLSearchParams();
    if (filters?.name) params.append('name', filters.name);
    if (filters?.quantityType) params.append('quantityType', filters.quantityType);
    if (filters?.lowStock) params.append('lowStock', 'true');
    params.append('page', (filters?.page ?? 0).toString());
    params.append('size', (filters?.size ?? 10).toString());

    const response = await api.get<PageResponse<Product>>(`/products?${params.toString()}`);
    return response.data;
  },

  // Get product by ID
  getProductById: async (id: number): Promise<Product> => {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  },

  // Create new product
  createProduct: async (product: ProductRequest): Promise<Product> => {
    const response = await api.post<Product>('/products', product);
    return response.data;
  },

  // Update product
  updateProduct: async (id: number, product: ProductRequest): Promise<Product> => {
    const response = await api.put<Product>(`/products/${id}`, product);
    return response.data;
  },

  // Delete product
  deleteProduct: async (id: number): Promise<void> => {
    await api.delete(`/products/${id}`);
  },

  // Get low stock count
  getLowStockCount: async (): Promise<number> => {
    const response = await api.get<number>('/products/stats/low-stock-count');
    return response.data;
  },

  // Add stock to product
  addStock: async (id: number, quantity: number): Promise<Product> => {
    const response = await api.patch<Product>(`/products/${id}/add-stock?quantity=${quantity}`);
    return response.data;
  },

  // Reduce stock from product
  reduceStock: async (id: number, quantity: number): Promise<Product> => {
    const response = await api.patch<Product>(`/products/${id}/reduce-stock?quantity=${quantity}`);
    return response.data;
  },

  // Export products to PDF
  exportProductsToPdf: async (filters?: {
    name?: string;
    quantityType?: string;
    lowStock?: boolean;
  }): Promise<Blob> => {
    const params = new URLSearchParams();
    if (filters?.name) params.append('name', filters.name);
    if (filters?.quantityType) params.append('quantityType', filters.quantityType);
    if (filters?.lowStock) params.append('lowStock', 'true');

    const response = await api.get(`/products/export/pdf?${params.toString()}`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

