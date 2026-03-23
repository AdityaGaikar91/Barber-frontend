import { api } from './api';

export const adminApi = {
  getPlatformStats: async () => {
    const res = await api.get('/admin/stats');
    return res.data;
  },

  listAllTenants: async () => {
    const res = await api.get('/admin/tenants');
    return res.data;
  },

  getTenantDetail: async (id: string) => {
    const res = await api.get(`/admin/tenants/${id}`);
    return res.data;
  },

  updateTenantSubscription: async (id: string, tier: string) => {
    const res = await api.patch(`/admin/tenants/${id}/subscription`, { tier });
    return res.data;
  },
};
