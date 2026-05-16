import api from './api';
import { ProductAudit } from '../types/audit.types';

export interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export const auditService = {
  getAllAudits: async (page: number = 0, size: number = 10): Promise<PageResponse<ProductAudit>> => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('size', size.toString());

    const response = await api.get<PageResponse<ProductAudit>>(`/audits?${params.toString()}`);
    return response.data;
  },

  exportAuditsToPdf: async (): Promise<Blob> => {
    const response = await api.get('/audits/export/pdf', {
      responseType: 'blob',
    });
    return response.data;
  },
};

