export enum QuantityType {
  PIECES = 'PIECES',
  METRE = 'METRE',
  KG = 'KG',
  BUNDLE = 'BUNDLE'
}

export interface Product {
  id: number;
  name: string;
  size: string;
  quantityType: QuantityType;
  presentStock: number;
  minimumStock: number;
  lowStock: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductRequest {
  name: string;
  size: string;
  quantityType: QuantityType;
  presentStock: number;
  minimumStock: number;
}

export interface ProductFormData {
  name: string;
  size: string;
  quantityType: QuantityType;
  presentStock: string;
  minimumStock: string;
}

export interface ProductFilters {
  name?: string;
  quantityType?: QuantityType;
  lowStock?: boolean;
}

