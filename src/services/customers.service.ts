import { api } from "./api-client";

export interface Customer {
    id: string;
    tenantId: string;
    name: string;
    email?: string;
    phone?: string;
    createdAt: string;
    updatedAt: string;
}

export const getCustomers = async (): Promise<Customer[]> => {
    const response = await api.get('/customers');
    return response.data;
};

export const createCustomer = async (data: Partial<Customer>): Promise<Customer> => {
    const response = await api.post('/customers', data);
    return response.data;
};

export const findOrCreateCustomer = async (data: { phone: string; name: string }): Promise<Customer> => {
    const response = await api.post('/customers/find-or-create', data);
    return response.data;
};

export const updateCustomer = async (id: string, data: Partial<Customer>): Promise<Customer> => {
    const response = await api.patch(`/customers/${id}`, data);
    return response.data;
};

export const deleteCustomer = async (id: string): Promise<void> => {
    await api.delete(`/customers/${id}`);
};
