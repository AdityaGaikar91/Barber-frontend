import { api } from './api';

export interface Employee {
    id: string;
    tenantId: string;
    userId: string;
    bio?: string;
    createdAt: string;
    updatedAt: string;
    name?: string; // Pulled from users join
    email?: string; // Pulled from users join
}

export const getEmployees = async () => {
    const res = await api.get<Employee[]>('/employees');
    return res.data;
};

export const updateEmployee = async (id: string, data: Partial<Employee>): Promise<Employee> => {
    const response = await api.patch(`/employees/${id}`, data);
    return response.data;
}

export interface EmployeeMetrics {
    totalRevenue: number;
    totalServices: number;
    timeSeries: Array<{ date: string; revenue: number }>;
}

export const getEmployeeMetrics = async (employeeId: string, startDate?: Date, endDate?: Date): Promise<EmployeeMetrics> => {
    let url = `/employees/${employeeId}/metrics`;
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate.toISOString());
    if (endDate) params.append('endDate', endDate.toISOString());
    
    if (params.toString()) {
        url += `?${params.toString()}`;
    }

    const response = await api.get(url);
    return response.data;
};

export const createEmployee = async (data: {
    name: string;
    email: string;
    password?: string; // Optional for creating employees right now, backend autogenerates or we send one
    bio?: string;
}) => {
    // Ensuring basic default password if not provided by form
    const requestData = {
        ...data,
        password: data.password || 'Employee123!',
    };
    const res = await api.post<Employee>('/employees', requestData);
    return res.data;
};
