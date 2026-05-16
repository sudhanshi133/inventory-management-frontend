import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Input, Select, Button } from './ui';
import { ProductFormData, ProductRequest, Product, QuantityType } from '../types/product.types';

interface ProductFormProps {
  onSubmit: (data: ProductRequest) => void;
  onCancel: () => void;
  initialData?: Product;
  isSubmitting?: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  isSubmitting = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProductFormData>({
    defaultValues: initialData
      ? {
          name: initialData.name,
          size: initialData.size,
          quantityType: initialData.quantityType,
          presentStock: initialData.presentStock.toString(),
          minimumStock: initialData.minimumStock.toString(),
        }
      : {
          name: '',
          size: '',
          quantityType: QuantityType.PIECES,
          presentStock: '',
          minimumStock: '',
        },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        size: initialData.size,
        quantityType: initialData.quantityType,
        presentStock: initialData.presentStock.toString(),
        minimumStock: initialData.minimumStock.toString(),
      });
    }
  }, [initialData, reset]);

  const handleFormSubmit = (data: ProductFormData) => {
    const productData: ProductRequest = {
      name: data.name,
      size: data.size,
      quantityType: data.quantityType,
      presentStock: parseInt(data.presentStock),
      minimumStock: parseInt(data.minimumStock),
    };
    onSubmit(productData);
  };

  const quantityTypeOptions = [
    { value: QuantityType.PIECES, label: 'Pieces' },
    { value: QuantityType.METRE, label: 'Metre' },
    { value: QuantityType.KG, label: 'KG' },
    { value: QuantityType.BUNDLE, label: 'Bundle' },
  ];

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <Input
        label="Product Name"
        {...register('name', { required: 'Product name is required' })}
        error={errors.name?.message}
        placeholder="Enter product name"
      />

      <Input
        label="Size"
        {...register('size', { required: 'Size is required' })}
        error={errors.size?.message}
        placeholder="Enter size"
      />

      <Select
        label="Quantity Type"
        {...register('quantityType', { required: 'Quantity type is required' })}
        options={quantityTypeOptions}
        error={errors.quantityType?.message}
      />

      <Input
        label="Present Stock"
        type="number"
        {...register('presentStock', {
          required: 'Present stock is required',
          min: { value: 0, message: 'Present stock cannot be negative' },
        })}
        error={errors.presentStock?.message}
        placeholder="Enter present stock"
      />

      <Input
        label="Minimum Stock"
        type="number"
        {...register('minimumStock', {
          required: 'Minimum stock is required',
          min: { value: 0, message: 'Minimum stock cannot be negative' },
        })}
        error={errors.minimumStock?.message}
        placeholder="Enter minimum stock"
      />

      <div className="flex justify-end gap-3 mt-6">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : initialData ? 'Update Product' : 'Add Product'}
        </Button>
      </div>
    </form>
  );
};

