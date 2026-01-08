import api from './api';

export interface CreateVideoData {
    title: string;
    centralTheme: string;
    durationMinutes: number;
    language?: string;
    voiceId?: string;
    channelName?: string;
    videoType?: string;
}

export const projectsService = {
    async createFullVideo(data: CreateVideoData) {
        const response = await api.post('/projects/create', data);
        return response.data;
    },

    async getProjects(limit?: number) {
        const response = await api.get('/projects', {
            params: { limit }
        });
        return response.data;
    },

    async getProject(id: string) {
        const response = await api.get(`/projects/${id}`);
        return response.data;
    },

    async createImagesOnly(data: { theme: string; imagesCount: number; style: string }) {
        const response = await api.post('/projects/modules/images', data);
        return response.data;
    },

    async createScriptOnly(data: { theme: string; durationMinutes: number }) {
        const response = await api.post('/projects/modules/script', data);
        return response.data;
    },

    async createVoiceOnly(data: { inputText: string; voiceId: string; language?: string }) {
        const response = await api.post('/projects/modules/voice', data);
        return response.data;
    },
};
