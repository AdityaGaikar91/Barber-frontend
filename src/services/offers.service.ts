import { api } from "./api-client";

export interface Offer {
    id: string;
    tenantId: string;
    title: string;
    discountPercentage: number;
    validFrom: string;
    validUntil: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export const getOffers = async (): Promise<Offer[]> => {
    const response = await api.get('/offers');
    return response.data;
};

export const createOffer = async (data: Partial<Offer>): Promise<Offer> => {
    const response = await api.post('/offers', data);
    return response.data;
};

export const updateOffer = async (id: string, data: Partial<Offer>): Promise<Offer> => {
    const response = await api.patch(`/offers/${id}`, data);
    return response.data;
};

export const deleteOffer = async (id: string): Promise<void> => {
    await api.delete(`/offers/${id}`);
};
