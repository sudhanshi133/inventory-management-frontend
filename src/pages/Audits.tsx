import React, { useEffect, useState } from 'react';
import { Card, useToast } from '../components/ui';
import { auditService } from '../services/auditService';
import { ProductAudit, AuditAction } from '../types/audit.types';
import { ChevronLeft, ChevronRight, FileText, Package, Plus, Minus, Edit, Trash2, Download } from 'lucide-react';
import { format } from 'date-fns';

export const Audits: React.FC = () => {
  const { showToast } = useToast();
  const [audits, setAudits] = useState<ProductAudit[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    loadAudits();
  }, [currentPage]);

  const loadAudits = async () => {
    try {
      setLoading(true);
      const response = await auditService.getAllAudits(currentPage, pageSize);
      setAudits(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (error) {
      console.error('Failed to load audits:', error);
      showToast('error', 'Failed to load audits');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleDownloadPdf = async () => {
    try {
      const blob = await auditService.exportAuditsToPdf();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'product_audits.pdf';
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

  const getActionIcon = (action: AuditAction) => {
    switch (action) {
      case AuditAction.CREATED:
        return <Package className="h-4 w-4 text-green-600" />;
      case AuditAction.UPDATED:
        return <Edit className="h-4 w-4 text-blue-600" />;
      case AuditAction.DELETED:
        return <Trash2 className="h-4 w-4 text-red-600" />;
      case AuditAction.STOCK_ADDED:
        return <Plus className="h-4 w-4 text-green-600" />;
      case AuditAction.STOCK_REDUCED:
        return <Minus className="h-4 w-4 text-orange-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActionBadge = (action: AuditAction) => {
    const baseClasses = 'px-2 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1';
    switch (action) {
      case AuditAction.CREATED:
        return <span className={`${baseClasses} bg-green-100 text-green-800`}>{getActionIcon(action)} Created</span>;
      case AuditAction.UPDATED:
        return <span className={`${baseClasses} bg-blue-100 text-blue-800`}>{getActionIcon(action)} Updated</span>;
      case AuditAction.DELETED:
        return <span className={`${baseClasses} bg-red-100 text-red-800`}>{getActionIcon(action)} Deleted</span>;
      case AuditAction.STOCK_ADDED:
        return <span className={`${baseClasses} bg-green-100 text-green-800`}>{getActionIcon(action)} Stock Added</span>;
      case AuditAction.STOCK_REDUCED:
        return <span className={`${baseClasses} bg-orange-100 text-orange-800`}>{getActionIcon(action)} Stock Reduced</span>;
      default:
        return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>{getActionIcon(action)} {action}</span>;
    }
  };

  const formatQuantityChange = (change: number | null) => {
    if (change === null) return '-';
    if (change > 0) return `+${change}`;
    return change.toString();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Audit Logs</h1>
          <p className="mt-1 text-sm text-gray-600">
            Track all product changes and stock movements
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            Total Records: <span className="font-semibold">{totalElements}</span>
          </div>
          <button
            onClick={handleDownloadPdf}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
          >
            <Download size={16} />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <p className="mt-2 text-gray-600">Loading audits...</p>
            </div>
          ) : audits.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No audit records</h3>
              <p className="mt-1 text-sm text-gray-500">
                Audit records will appear here when products are modified
              </p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Old Qty
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    New Qty
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Change
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Min Stock Change
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {audits.map((audit) => (
                  <tr key={audit.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {format(new Date(audit.timestamp), 'MMM dd, yyyy HH:mm:ss')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{audit.productName}</div>
                      <div className="text-sm text-gray-500">
                        {audit.productSize} • {audit.quantityType}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getActionBadge(audit.action)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {audit.oldQuantity ?? '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {audit.newQuantity ?? '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={
                        audit.quantityChange && audit.quantityChange > 0
                          ? 'text-green-600 font-semibold'
                          : audit.quantityChange && audit.quantityChange < 0
                          ? 'text-red-600 font-semibold'
                          : 'text-gray-500'
                      }>
                        {formatQuantityChange(audit.quantityChange)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {audit.oldMinimumStock !== null && audit.newMinimumStock !== null
                        ? `${audit.oldMinimumStock} → ${audit.newMinimumStock}`
                        : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {!loading && audits.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{' '}
                  <span className="font-medium">{currentPage * pageSize + 1}</span>
                  {' '}-{' '}
                  <span className="font-medium">
                    {Math.min((currentPage + 1) * pageSize, totalElements)}
                  </span>
                  {' '}of{' '}
                  <span className="font-medium">{totalElements}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                    Page {currentPage + 1} of {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages - 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

