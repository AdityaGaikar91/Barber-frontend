import { api } from './api';

export const appointmentsApi = {
  getPublicBookingInfo: async (slug: string) => {
    const response = await api.get(`/appointments/public/${slug}`);
    return response.data;
  },

  createAppointment: async (data: any) => {
    const response = await api.post('/appointments/public', data);
    return response.data;
  },

  getTenantAppointments: async (params?: { startDate?: string; endDate?: string }) => {
    const response = await api.get('/appointments', { params });
    return response.data;
  },

  updateStatus: async (id: string, status: string) => {
    const response = await api.patch(`/appointments/${id}/status`, { status });
    return response.data;
  },
};
