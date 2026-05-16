import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui';
import { productService } from '../services/productService';
import { Product } from '../types/product.types';
import { Package, AlertTriangle, TrendingUp, Box } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockCount: 0,
    totalStock: 0,
  });
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all products with a large size to get all data for dashboard
      const [lowStockResponse, lowStockCount, allProductsResponse] = await Promise.all([
        productService.getAllProducts({ lowStock: true, size: 100 }),
        productService.getLowStockCount(),
        productService.getAllProducts({ size: 1000 }), // Large size to get all products
      ]);

      const totalStock = allProductsResponse.content.reduce((sum, p) => sum + p.presentStock, 0);

      setLowStockProducts(lowStockResponse.content);
      setStats({
        totalProducts: allProductsResponse.totalElements,
        lowStockCount,
        totalStock,
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <Link to="/products" className="block">
          <Card className="flex items-center cursor-pointer hover:shadow-lg transition-shadow p-4 sm:p-6">
            <div className="flex-1">
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Products</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-800">{stats.totalProducts}</p>
            </div>
            <Package className="text-blue-500" size={36} />
          </Card>
        </Link>

        <Card className="flex items-center p-4 sm:p-6">
          <div className="flex-1">
            <p className="text-xs sm:text-sm text-gray-600 mb-1">Low Stock Items</p>
            <p className="text-2xl sm:text-3xl font-bold text-red-600">{stats.lowStockCount}</p>
          </div>
          <AlertTriangle className="text-red-500" size={36} />
        </Card>

        <Card className="flex items-center p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
          <div className="flex-1">
            <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Stock Units</p>
            <p className="text-2xl sm:text-3xl font-bold text-green-600">{stats.totalStock}</p>
          </div>
          <TrendingUp className="text-green-500" size={36} />
        </Card>
      </div>

      {lowStockProducts.length > 0 && (
        <Card title="Low Stock Alerts" className="mb-6 sm:mb-8">
          <div className="space-y-3">
            {lowStockProducts.map((product) => (
              <div
                key={product.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg gap-2 sm:gap-0"
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <Box className="text-red-500 flex-shrink-0" size={18} />
                  <div>
                    <p className="font-semibold text-gray-800 text-sm sm:text-base">{product.name}</p>
                    <p className="text-xs sm:text-sm text-gray-600">
                      Size: {product.size} | Type: {product.quantityType}
                    </p>
                  </div>
                </div>
                <div className="flex sm:flex-col gap-4 sm:gap-0 sm:text-right ml-6 sm:ml-0">
                  <p className="text-xs sm:text-sm text-gray-600">Current: {product.presentStock}</p>
                  <p className="text-xs sm:text-sm text-red-600">Min: {product.minimumStock}</p>
                </div>
              </div>
            ))}
          </div>
          <Link
            to="/products"
            className="block mt-4 text-center text-sm sm:text-base text-blue-600 hover:text-blue-700 font-medium"
          >
            View All Products →
          </Link>
        </Card>
      )}
    </div>
  );
};

