import axios from 'axios';
import env from '../config/env';

export interface CreateVideoRequest {
    project_id: string;
    title: string;
    central_theme: string;
    duration_minutes: number;
    language: string;
    voice_id?: string;
    channel_name?: string;
    video_type?: string;
}

export class N8nService {
    private webhookBaseUrl = env.N8N_WEBHOOK_URL;

    // Crear video completo
    async createFullVideo(projectData: CreateVideoRequest) {
        try {
            const response = await axios.post(
                `${this.webhookBaseUrl}/webhook/create-video`,
                projectData,
                {
                    headers: { 'Content-Type': 'application/json' },
                    timeout: 30000
                }
            );

            return response.data;
        } catch (error: any) {
            console.error('Error calling n8n webhook:', error.message);
            throw new Error('Error al iniciar generación de video');
        }
    }

    // Generar solo imágenes
    async generateImagesOnly(theme: string, count: number, style: string, projectId: string) {
        try {
            const response = await axios.post(
                `${this.webhookBaseUrl}/webhook/generate-images`,
                {
                    project_id: projectId,
                    theme,
                    images_count: count,
                    style
                },
                {
                    headers: { 'Content-Type': 'application/json' },
                    timeout: 30000
                }
            );

            return response.data;
        } catch (error: any) {
            console.error('Error calling n8n images webhook:', error.message);
            throw new Error('Error al generar imágenes');
        }
    }

    // Generar solo guión
    async generateScriptOnly(theme: string, duration: number, projectId: string) {
        try {
            const response = await axios.post(
                `${this.webhookBaseUrl}/webhook/generate-script`,
                {
                    project_id: projectId,
                    theme,
                    duration_minutes: duration
                },
                {
                    headers: { 'Content-Type': 'application/json' },
                    timeout: 30000
                }
            );

            return response.data;
        } catch (error: any) {
            console.error('Error calling n8n script webhook:', error.message);
            throw new Error('Error al generar guión');
        }
    }

    // Generar solo voz
    async generateVoiceOnly(text: string, voiceId: string, projectId: string) {
        try {
            const response = await axios.post(
                `${this.webhookBaseUrl}/webhook/generate-voice`,
                {
                    project_id: projectId,
                    text,
                    voice_id: voiceId
                },
                {
                    headers: { 'Content-Type': 'application/json' },
                    timeout: 30000
                }
            );

            return response.data;
        } catch (error: any) {
            console.error('Error calling n8n voice webhook:', error.message);
            throw new Error('Error al generar voz');
        }
    }
}
