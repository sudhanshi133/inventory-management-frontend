import { QuantityType } from './product.types';

export enum AuditAction {
  CREATED = 'CREATED',
  UPDATED = 'UPDATED',
  DELETED = 'DELETED',
  STOCK_ADDED = 'STOCK_ADDED',
  STOCK_REDUCED = 'STOCK_REDUCED'
}

export interface ProductAudit {
  id: number;
  productId: number;
  productName: string;
  productSize: string;
  quantityType: QuantityType;
  action: AuditAction;
  oldQuantity: number | null;
  newQuantity: number | null;
  quantityChange: number | null;
  oldMinimumStock: number | null;
  newMinimumStock: number | null;
  timestamp: string;
}

