import api from './api';

export interface RegisterData {
    email: string;
    password: string;
    fullName: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export const authService = {
    async register(data: RegisterData) {
        const response = await api.post('/auth/register', data);
        return response.data;
    },

    async login(data: LoginData) {
        const response = await api.post('/auth/login', data);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    },

    async verifyEmail(token: string) {
        const response = await api.post('/auth/verify-email', { token });
        return response.data;
    },

    async forgotPassword(email: string) {
        const response = await api.post('/auth/forgot-password', { email });
        return response.data;
    },

    async resetPassword(token: string, newPassword: string) {
        const response = await api.post('/auth/reset-password', { token, newPassword });
        return response.data;
    },

    logout() {
        localStorage.removeItem('token');
        window.location.href = '/login';
    },

    isAuthenticated(): boolean {
        return !!localStorage.getItem('token');
    },
};
