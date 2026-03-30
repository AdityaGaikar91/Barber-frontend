/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from './api-client';

export const tenantsApi = {
  getSettings: async () => {
    const response = await api.get('/tenants/settings');
    return response.data;
  },

  updateSettings: async (data: { name?: string; slug?: string; logoUrl?: string; businessHours?: Record<string, any> }) => {
    const response = await api.patch('/tenants/settings', data);
    return response.data;
  },
};
