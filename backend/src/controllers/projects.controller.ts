import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { ProjectsService } from '../services/projects.service';

export class ProjectsController {
    // POST /api/projects/create
    static async createFullVideo(req: AuthRequest, res: Response) {
        try {
            const userId = req.user!.userId;
            const data = req.body;

            if (!data.title || !data.centralTheme || !data.durationMinutes) {
                return res.status(400).json({ error: 'Faltan campos requeridos' });
            }

            const project = await ProjectsService.createFullVideo(userId, data);

            return res.status(201).json({
                success: true,
                project: {
                    id: project.id,
                    title: project.title,
                    status: project.status,
                    creditsUsed: project.creditsUsed
                }
            });
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    // PATCH /api/projects/:id/progress (llamado por n8n)
    static async updateProgress(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;
            const { progress, status, data } = req.body;

            const project = await ProjectsService.updateProgress(id, progress, status, data);

            return res.status(200).json({ success: true, project });
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    // GET /api/projects/:id
    static async getProject(req: AuthRequest, res: Response) {
        try {
            const userId = req.user!.userId;
            const { id } = req.params;

            const project = await ProjectsService.getProject(id, userId);

            return res.status(200).json(project);
        } catch (error: any) {
            return res.status(404).json({ error: error.message });
        }
    }

    // GET /api/projects
    static async getUserProjects(req: AuthRequest, res: Response) {
        try {
            const userId = req.user!.userId;
            const limit = parseInt(req.query.limit as string) || 50;

            const projects = await ProjectsService.getUserProjects(userId, limit);

            return res.status(200).json({ projects });
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    // POST /api/modules/images
    static async createImagesOnly(req: AuthRequest, res: Response) {
        try {
            const userId = req.user!.userId;
            const { theme, imagesCount, style } = req.body;

            if (!theme || !imagesCount || !style) {
                return res.status(400).json({ error: 'Faltan campos requeridos' });
            }

            const project = await ProjectsService.createImagesOnly(userId, {
                theme,
                imagesCount,
                style
            });

            return res.status(201).json({ success: true, project });
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    // POST /api/modules/script
    static async createScriptOnly(req: AuthRequest, res: Response) {
        try {
            const userId = req.user!.userId;
            const { theme, durationMinutes } = req.body;

            if (!theme || !durationMinutes) {
                return res.status(400).json({ error: 'Faltan campos requeridos' });
            }

            const project = await ProjectsService.createScriptOnly(userId, {
                theme,
                durationMinutes
            });

            return res.status(201).json({ success: true, project });
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    // POST /api/modules/voice
    static async createVoiceOnly(req: AuthRequest, res: Response) {
        try {
            const userId = req.user!.userId;
            const { inputText, voiceId, language } = req.body;

            if (!inputText || !voiceId) {
                return res.status(400).json({ error: 'Faltan campos requeridos' });
            }

            const project = await ProjectsService.createVoiceOnly(userId, {
                inputText,
                voiceId,
                language
            });

            return res.status(201).json({ success: true, project });
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }
}
