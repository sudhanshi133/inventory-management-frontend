import React, { useState } from 'react';
import { Modal, Button, Input } from './ui';
import { Product } from '../types/product.types';

interface StockAdjustmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onAdjust: (quantity: number, type: 'add' | 'reduce') => void;
  type: 'add' | 'reduce';
}

export const StockAdjustmentModal: React.FC<StockAdjustmentModalProps> = ({
  isOpen,
  onClose,
  product,
  onAdjust,
  type,
}) => {
  const [quantity, setQuantity] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const qty = parseInt(quantity);
    
    if (!qty || qty <= 0) {
      setError('Please enter a valid positive quantity');
      return;
    }

    if (type === 'reduce' && product && qty > product.presentStock) {
      setError(`Cannot reduce by ${qty}. Current stock is only ${product.presentStock}`);
      return;
    }

    onAdjust(qty, type);
    setQuantity('');
    setError('');
    onClose();
  };

  const handleClose = () => {
    setQuantity('');
    setError('');
    onClose();
  };

  if (!product) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={type === 'add' ? 'Add Stock' : 'Reduce Stock'}
    >
      <div className="mb-4">
        <p className="text-gray-700 mb-2">
          <span className="font-semibold">Product:</span> {product.name}
        </p>
        <p className="text-gray-700 mb-2">
          <span className="font-semibold">Size:</span> {product.size}
        </p>
        <p className="text-gray-700 mb-4">
          <span className="font-semibold">Current Stock:</span> {product.presentStock}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Input
          label={type === 'add' ? 'Quantity to Add' : 'Quantity to Reduce'}
          type="number"
          value={quantity}
          onChange={(e) => {
            setQuantity(e.target.value);
            setError('');
          }}
          error={error}
          placeholder="Enter quantity"
          min="1"
          autoFocus
        />

        <div className="flex justify-end gap-3 mt-6">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" variant={type === 'add' ? 'success' : 'danger'}>
            {type === 'add' ? 'Add Stock' : 'Reduce Stock'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

