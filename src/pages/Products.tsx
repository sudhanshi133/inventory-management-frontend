import React, { useEffect, useState } from 'react';
import { Card, Button, Modal, Input, Select, useToast, ConfirmDialog } from '../components/ui';
import { ProductForm } from '../components/ProductForm';
import { StockAdjustmentModal } from '../components/StockAdjustmentModal';
import { productService } from '../services/productService';
import { Product, ProductRequest, QuantityType } from '../types/product.types';
import { Plus, Search, Edit, Trash2, AlertCircle, TrendingUp, TrendingDown, ChevronLeft, ChevronRight, Download } from 'lucide-react';

export const Products: React.FC = () => {
  const { showToast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [stockAdjustmentType, setStockAdjustmentType] = useState<'add' | 'reduce'>('add');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState(''); // For typing
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);
  const [filterType, setFilterType] = useState<string>('');
  const [showLowStock, setShowLowStock] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    loadProducts();
  }, [currentPage, searchTerm, filterType, showLowStock]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getAllProducts({
        name: searchTerm || undefined,
        quantityType: filterType as QuantityType || undefined,
        lowStock: showLowStock || undefined,
        page: currentPage,
        size: pageSize,
      });
      setProducts(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (error) {
      console.error('Failed to load products:', error);
      showToast('error', 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const hasActiveFilters = searchTerm !== '' || filterType !== '' || showLowStock;

  const handleSearch = () => {
    setSearchTerm(searchInput);
    setCurrentPage(0);
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSearchInput('');
    setFilterType('');
    setShowLowStock(false);
    setCurrentPage(0);
  };

  const handleAddProduct = async (data: ProductRequest) => {
    try {
      setIsSubmitting(true);
      await productService.createProduct(data);
      setCurrentPage(0); // Reset to first page to see the new product
      await loadProducts();
      setIsAddModalOpen(false);
      showToast('success', 'Product added successfully!');
    } catch (error: any) {
      console.error('Failed to add product:', error);
      showToast('error', error.response?.data?.message || 'Failed to add product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditProduct = async (data: ProductRequest) => {
    if (!selectedProduct) return;

    try {
      setIsSubmitting(true);
      await productService.updateProduct(selectedProduct.id, data);
      await loadProducts();
      setIsEditModalOpen(false);
      setSelectedProduct(null);
      showToast('success', 'Product updated successfully!');
    } catch (error) {
      console.error('Failed to update product:', error);
      showToast('error', 'Failed to update product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (id: number) => {
    setProductToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;

    try {
      await productService.deleteProduct(productToDelete);
      await loadProducts();
      showToast('success', 'Product deleted successfully!');
    } catch (error) {
      console.error('Failed to delete product:', error);
      showToast('error', 'Failed to delete product');
    } finally {
      setProductToDelete(null);
    }
  };

  const handleAdjustStock = async (quantity: number, type: 'add' | 'reduce') => {
    if (!selectedProduct) return;

    try {
      setIsSubmitting(true);
      if (type === 'add') {
        await productService.addStock(selectedProduct.id, quantity);
        showToast('success', `Successfully added ${quantity} to stock!`);
      } else {
        await productService.reduceStock(selectedProduct.id, quantity);
        showToast('success', `Successfully reduced ${quantity} from stock!`);
      }
      await loadProducts();
      setIsStockModalOpen(false);
      setSelectedProduct(null);
    } catch (error: any) {
      console.error('Failed to adjust stock:', error);
      showToast('error', error.response?.data?.message || 'Failed to adjust stock');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (product: Product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleDownloadPdf = async () => {
    try {
      const params: any = {};
      if (searchTerm) params.name = searchTerm;
      if (filterType) params.quantityType = filterType;
      if (showLowStock) params.lowStock = showLowStock;

      const blob = await productService.exportProductsToPdf(params);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'products_inventory.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      showToast('success', 'PDF downloaded successfully!');
    } catch (error: any) {
      console.error('Failed to download PDF:', error);
      showToast('error', 'Failed to download PDF');
    }
  };

  const quantityTypeOptions = [
    { value: '', label: 'All Types' },
    { value: QuantityType.PIECES, label: 'Pieces' },
    { value: QuantityType.METRE, label: 'Metre' },
    { value: QuantityType.KG, label: 'KG' },
    { value: QuantityType.BUNDLE, label: 'Bundle' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      <div className="mb-3 sm:mb-4 flex justify-between items-center">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Products</h1>
        <button
          onClick={handleDownloadPdf}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
        >
          <Download size={16} />
          <span>Download PDF</span>
        </button>
      </div>

      <Card className="mb-3 sm:mb-4 p-3 sm:p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
          <div className="relative sm:col-span-2 lg:col-span-1">
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={handleSearchKeyPress}
              className="w-full pl-9 pr-10 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSearch}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              title="Search"
            >
              <Search size={16} className="stroke-2" />
            </button>
          </div>

          <select
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value);
              setCurrentPage(0);
            }}
            className="w-full px-2 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {quantityTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <label className="flex items-center gap-2 cursor-pointer px-1">
            <input
              type="checkbox"
              checked={showLowStock}
              onChange={(e) => {
                setShowLowStock(e.target.checked);
                setCurrentPage(0);
              }}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Low Stock</span>
          </label>

          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="w-full px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </Card>

      {products.length === 0 ? (
        <Card>
          <div className="text-center py-8 sm:py-12">
            <p className="text-gray-500 text-base sm:text-lg">No products found</p>
          </div>
        </Card>
      ) : (
        <>
          <Card className="overflow-hidden">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Size
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Present Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Min Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          {product.lowStock && (
                            <span className="ml-2 flex items-center gap-1 text-red-600 text-xs">
                              <AlertCircle size={14} />
                              Low
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {product.size}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {product.quantityType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {product.presentStock}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {product.minimumStock}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() => {
                              setSelectedProduct(product);
                              setStockAdjustmentType('add');
                              setIsStockModalOpen(true);
                            }}
                            title="Add Stock"
                          >
                            <TrendingUp size={16} />
                          </Button>
                          <Button
                            size="sm"
                            variant="warning"
                            onClick={() => {
                              setSelectedProduct(product);
                              setStockAdjustmentType('reduce');
                              setIsStockModalOpen(true);
                            }}
                            title="Reduce Stock"
                          >
                            <TrendingDown size={16} />
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => openEditModal(product)}
                            title="Edit"
                          >
                            <Edit size={16} />
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleDeleteClick(product.id)}
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-gray-200">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="p-3"
                >
                  {/* Header with Name and Low Stock Badge */}
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-gray-900 flex-1">{product.name}</h3>
                    {product.lowStock && (
                      <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full font-medium ml-2">
                        <AlertCircle size={12} />
                        Low
                      </span>
                    )}
                  </div>

                  {/* Product Details - Compact Grid */}
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs mb-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Size:</span>
                      <span className="font-medium text-gray-900">{product.size}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Type:</span>
                      <span className="font-medium text-gray-900">{product.quantityType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Stock:</span>
                      <span className="font-medium text-gray-900">{product.presentStock}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Min:</span>
                      <span className="font-medium text-gray-900">{product.minimumStock}</span>
                    </div>
                  </div>

                  {/* Action Buttons - Compact */}
                  <div className="flex gap-1.5 pt-2 border-t border-gray-200">
                    <button
                      onClick={() => {
                        setSelectedProduct(product);
                        setStockAdjustmentType('add');
                        setIsStockModalOpen(true);
                      }}
                      className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-green-50 text-green-700 rounded text-xs font-medium hover:bg-green-100"
                      title="Add Stock"
                    >
                      <TrendingUp size={14} />
                      <span>Add</span>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedProduct(product);
                        setStockAdjustmentType('reduce');
                        setIsStockModalOpen(true);
                      }}
                      className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-orange-50 text-orange-700 rounded text-xs font-medium hover:bg-orange-100"
                      title="Reduce Stock"
                    >
                      <TrendingDown size={14} />
                      <span>Reduce</span>
                    </button>
                    <button
                      onClick={() => openEditModal(product)}
                      className="flex items-center justify-center px-2 py-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                      title="Edit"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(product.id)}
                      className="flex items-center justify-center px-2 py-1.5 bg-red-50 text-red-700 rounded hover:bg-red-100"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

        {/* Pagination Controls - Minimal Mobile-First */}
        {totalPages > 0 && (
          <div className="mt-4 flex items-center justify-between px-2 py-3 bg-white rounded-lg border border-gray-200">
            {/* Previous Button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
              className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentPage === 0
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ChevronLeft size={18} />
              <span className="hidden sm:inline">Prev</span>
            </button>

            {/* Page Indicator */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                Page <span className="font-semibold text-gray-900">{currentPage + 1}</span> of{' '}
                <span className="font-semibold text-gray-900">{totalPages}</span>
              </span>
            </div>

            {/* Next Button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages - 1}
              className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentPage === totalPages - 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight size={18} />
            </button>
          </div>
        )}
        </>
      )}

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Product"
      >
        <ProductForm
          onSubmit={handleAddProduct}
          onCancel={() => setIsAddModalOpen(false)}
          isSubmitting={isSubmitting}
        />
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedProduct(null);
        }}
        title="Edit Product"
      >
        {selectedProduct && (
          <ProductForm
            onSubmit={handleEditProduct}
            onCancel={() => {
              setIsEditModalOpen(false);
              setSelectedProduct(null);
            }}
            initialData={selectedProduct}
            isSubmitting={isSubmitting}
          />
        )}
      </Modal>

      <StockAdjustmentModal
        isOpen={isStockModalOpen}
        onClose={() => {
          setIsStockModalOpen(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
        onAdjust={handleAdjustStock}
        type={stockAdjustmentType}
      />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setProductToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />

      {/* Floating Add Product Button */}
      <button
        onClick={() => setIsAddModalOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-200 z-40 flex items-center justify-center group"
        title="Add Product"
      >
        <Plus size={24} />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap group-hover:ml-2">
          Add Product
        </span>
      </button>
    </div>
  );
};

