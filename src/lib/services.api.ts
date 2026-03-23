import { api } from './api';

export interface Service {
    id: string;
    tenantId: string;
    name: string;
    description?: string;
    price: number;
    duration: number;
    category?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export const getServices = async () => {
    const res = await api.get<Service[]>('/services');
    return res.data;
};

export const createService = async (data: Omit<Service, 'id' | 'tenantId' | 'isActive' | 'createdAt' | 'updatedAt'>) => {
    const res = await api.post<Service>('/services', data);
    return res.data;
};

export const updateService = async (id: string, data: Partial<Service>) => {
    const res = await api.put<Service>(`/services/${id}`, data);
    return res.data;
};

export const deleteService = async (id: string) => {
    const res = await api.delete(`/services/${id}`);
    return res.data;
};
