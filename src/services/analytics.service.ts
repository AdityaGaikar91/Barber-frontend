import { api } from './api-client';

export interface DashboardMetrics {
    totalCustomers: number;
    totalRevenue: number;
    todayRevenue: number;
    yesterdayRevenue: number;
    monthToDateRevenue: number;
    topEmployeeId: string | null;
    topEmployeeName: string | null;
    topEmployeeRevenue: number;
    timeSeries: Array<{ date: string; revenue: number }>;
    topServices: Array<{ id: string; name: string; revenue: number; count: number }>;
}

export const getDashboardMetrics = async (startDate?: Date, endDate?: Date): Promise<DashboardMetrics> => {
    let url = '/analytics/dashboard';
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate.toISOString());
    if (endDate) params.append('endDate', endDate.toISOString());
    
    if (params.toString()) {
        url += `?${params.toString()}`;
    }

    const response = await api.get(url);
    return response.data;
};

export interface RecentActivity {
    id: string;
    amount: number;
    timestamp: string;
    status: string;
    serviceName: string;
    employeeName: string;
    customerName: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export const getRecentActivity = async (limit: number = 10, page: number = 1): Promise<PaginatedResponse<RecentActivity>> => {
    const response = await api.get(`/analytics/activity?limit=${limit}&page=${page}`);
    return response.data;
};
