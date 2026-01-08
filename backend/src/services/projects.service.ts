import prisma from '../config/database';
import { N8nService } from './n8n.service';
import { CreditsService } from './credits.service';
import { EmailService } from './email.service';

const n8nService = new N8nService();

export class ProjectsService {
    // Crear proyecto de video completo
    static async createFullVideo(userId: string, data: {
        title: string;
        centralTheme: string;
        durationMinutes: number;
        language?: string;
        voiceId?: string;
        channelName?: string;
        videoType?: string;
    }) {
        // Estimar imágenes (aprox 5 imágenes por minuto) 
        const estimatedImages = data.durationMinutes * 5;

        // Calcular créditos necesarios
        const creditsNeeded = CreditsService.calculateFullVideoCredits(
            data.durationMinutes,
            estimatedImages
        );

        // Validar créditos
        const hasCredits = await CreditsService.hasEnoughCredits(userId, creditsNeeded);
        if (!hasCredits) {
            throw new Error(`No tienes suficientes créditos. Se requieren ${creditsNeeded} créditos.`);
        }

        // Crear proyecto en BD
        const project = await prisma.videoProject.create({
            data: {
                userId,
                title: data.title,
                centralTheme: data.centralTheme,
                durationMinutes: data.durationMinutes,
                language: data.language || 'es',
                voiceId: data.voiceId,
                channelName: data.channelName,
                videoType: data.videoType,
                status: 'pending',
                creditsUsed: creditsNeeded
            }
        });

        // Consumir créditos
        await CreditsService.consumeCredits(
            userId,
            creditsNeeded,
            `Video: ${data.title}`,
            project.id
        );

        // Iniciar workflow en n8n
        try {
            await n8nService.createFullVideo({
                project_id: project.id,
                title: data.title,
                central_theme: data.centralTheme,
                duration_minutes: data.durationMinutes,
                language: data.language || 'es',
                voice_id: data.voiceId,
                channel_name: data.channelName,
                video_type: data.videoType
            });

            // Actualizar estado
            await prisma.videoProject.update({
                where: { id: project.id },
                data: {
                    status: 'processing',
                    processingStartedAt: new Date()
                }
            });
        } catch (error) {
            // Revertir si falla
            await prisma.videoProject.update({
                where: { id: project.id },
                data: {
                    status: 'failed',
                    errorMessage: 'Error al iniciar procesamiento'
                }
            });
            throw error;
        }

        return project;
    }

    // Actualizar progreso (llamado por n8n)
    static async updateProgress(projectId: string, progress: number, status?: string, data?: any) {
        const updateData: any = { progress };

        if (status) updateData.status = status;
        if (data?.scriptPart1) updateData.scriptPart1 = data.scriptPart1;
        if (data?.scriptPart2) updateData.scriptPart2 = data.scriptPart2;
        if (data?.scriptPart3) updateData.scriptPart3 = data.scriptPart3;
        if (data?.scriptComplete) updateData.scriptComplete = data.scriptComplete;
        if (data?.audioUrl) updateData.audioUrl = data.audioUrl;
        if (data?.imagesCount) updateData.imagesCount = data.imagesCount;
        if (data?.zipFileUrl) {
            updateData.zipFileUrl = data.zipFileUrl;
            updateData.processingCompletedAt = new Date();
            updateData.status = 'completed';
            updateData.progress = 100;
        }

        const project = await prisma.videoProject.update({
            where: { id: projectId },
            data: updateData,
            include: { user: true }
        });

        // Si se completó, enviar email
        if (project.status === 'completed' && project.zipFileUrl) {
            await EmailService.sendProjectCompleted(
                project.user.email,
                project.title,
                project.zipFileUrl
            );
        }

        return project;
    }

    // Obtener proyecto
    static async getProject(projectId: string, userId: string) {
        const project = await prisma.videoProject.findFirst({
            where: { id: projectId, userId },
            include: {
                images: true,
                audioParts: true
            }
        });

        if (!project) {
            throw new Error('Proyecto no encontrado');
        }

        return project;
    }

    // Listar proyectos del usuario
    static async getUserProjects(userId: string, limit: number = 50) {
        return await prisma.videoProject.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: limit,
            select: {
                id: true,
                title: true,
                status: true,
                progress: true,
                durationMinutes: true,
                creditsUsed: true,
                zipFileUrl: true,
                createdAt: true,
                processingCompletedAt: true
            }
        });
    }

    // Módulo: Solo imágenes
    static async createImagesOnly(userId: string, data: {
        theme: string;
        imagesCount: number;
        style: string;
    }) {
        const creditsNeeded = CreditsService.calculateImagesOnlyCredits(data.imagesCount);

        const hasCredits = await CreditsService.hasEnoughCredits(userId, creditsNeeded);
        if (!hasCredits) {
            throw new Error(`No tienes suficientes créditos. Se requieren ${creditsNeeded} créditos.`);
        }

        const project = await prisma.imageOnlyProject.create({
            data: {
                userId,
                theme: data.theme,
                imagesCount: data.imagesCount,
                style: data.style,
                creditsUsed: creditsNeeded
            }
        });

        await CreditsService.consumeCredits(
            userId,
            creditsNeeded,
            `Imágenes: ${data.theme} (${data.imagesCount})`
        );

        await n8nService.generateImagesOnly(data.theme, data.imagesCount, data.style, project.id);

        return project;
    }

    // Módulo: Solo guión
    static async createScriptOnly(userId: string, data: {
        theme: string;
        durationMinutes: number;
    }) {
        const creditsNeeded = CreditsService.calculateScriptOnlyCredits(data.durationMinutes);

        const hasCredits = await CreditsService.hasEnoughCredits(userId, creditsNeeded);
        if (!hasCredits) {
            throw new Error(`No tienes suficientes créditos. Se requieren ${creditsNeeded} créditos.`);
        }

        const project = await prisma.scriptOnlyProject.create({
            data: {
                userId,
                theme: data.theme,
                durationMinutes: data.durationMinutes,
                creditsUsed: creditsNeeded
            }
        });

        await CreditsService.consumeCredits(
            userId,
            creditsNeeded,
            `Guión: ${data.theme}`
        );

        await n8nService.generateScriptOnly(data.theme, data.durationMinutes, project.id);

        return project;
    }

    // Módulo: Solo voz
    static async createVoiceOnly(userId: string, data: {
        inputText: string;
        voiceId: string;
        language?: string;
    }) {
        const creditsNeeded = CreditsService.calculateVoiceOnlyCredits(data.inputText.length);

        const hasCredits = await CreditsService.hasEnoughCredits(userId, creditsNeeded);
        if (!hasCredits) {
            throw new Error(`No tienes suficientes créditos. Se requieren ${creditsNeeded} créditos.`);
        }

        const project = await prisma.voiceOnlyProject.create({
            data: {
                userId,
                inputText: data.inputText,
                voiceId: data.voiceId,
                language: data.language || 'es',
                creditsUsed: creditsNeeded
            }
        });

        await CreditsService.consumeCredits(
            userId,
            creditsNeeded,
            'Generación de voz'
        );

        await n8nService.generateVoiceOnly(data.inputText, data.voiceId, project.id);

        return project;
    }
}
