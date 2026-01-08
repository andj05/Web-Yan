import api from './api';

export const paymentsService = {
    async getPlans() {
        const response = await api.get('/payments/plans');
        return response.data.plans;
    },

    async createCheckout(planId: number) {
        const response = await api.post('/payments/create-checkout', { planId });
        return response.data.checkoutUrl;
    },

    async getUserSubscriptions() {
        const response = await api.get('/payments/subscriptions');
        return response.data.subscriptions;
    },
};

export const userService = {
    async getMe() {
        const response = await api.get('/user/me');
        return response.data.user;
    },

    async getCredits() {
        const response = await api.get('/user/credits');
        return response.data.credits;
    },

    async getTransactions(limit?: number) {
        const response = await api.get('/user/transactions', {
            params: { limit }
        });
        return response.data.transactions;
    },
};
