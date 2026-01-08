import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
    // POST /api/auth/register
    static async register(req: Request, res: Response) {
        try {
            const { email, password, fullName } = req.body;

            if (!email || !password || !fullName) {
                return res.status(400).json({ error: 'Faltan campos requeridos' });
            }

            const result = await AuthService.register(email, password, fullName);

            return res.status(201).json({
                success: true,
                message: result.message,
                userId: result.userId
            });
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    // POST /api/auth/login
    static async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ error: 'Email y contraseña son requeridos' });
            }

            const result = await AuthService.login(email, password);

            return res.status(200).json(result);
        } catch (error: any) {
            return res.status(401).json({ error: error.message });
        }
    }

    // POST /api/auth/verify-email
    static async verifyEmail(req: Request, res: Response) {
        try {
            const { token } = req.body;

            if (!token) {
                return res.status(400).json({ error: 'Token es requerido' });
            }

            const result = await AuthService.verifyEmail(token);

            return res.status(200).json(result);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    // POST /api/auth/forgot-password
    static async forgotPassword(req: Request, res: Response) {
        try {
            const { email } = req.body;

            if (!email) {
                return res.status(400).json({ error: 'Email es requerido' });
            }

            const result = await AuthService.requestPasswordReset(email);

            return res.status(200).json(result);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    // POST /api/auth/reset-password
    static async resetPassword(req: Request, res: Response) {
        try {
            const { token, newPassword } = req.body;

            if (!token || !newPassword) {
                return res.status(400).json({ error: 'Token y nueva contraseña son requeridos' });
            }

            const result = await AuthService.resetPassword(token, newPassword);

            return res.status(200).json(result);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }
}
