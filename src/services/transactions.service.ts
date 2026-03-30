import { api } from './api-client';

export interface Transaction {
    id: string;
    tenantId: string;
    serviceId: string;
    employeeId: string;
    customerId: string | null;
    amount: number;
    status: string;
    timestamp: string;
    createdAt: string;
    updatedAt: string;
}

export interface LogTransactionPayload {
    serviceId: string;
    amount: number;
    customerId?: string;
}

export const logTransaction = async (employeeId: string, data: { serviceId: string, amount: number, customerId?: string }): Promise<Transaction> => {
    const response = await api.post(`/employees/${employeeId}/transactions`, data);
    return response.data;
};

export const getEmployeeTransactions = async (employeeId: string) => {
    const res = await api.get<Transaction[]>(`/employees/${employeeId}/transactions`);
    return res.data;
};
