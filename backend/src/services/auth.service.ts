import prisma from '../config/database';
import { hashPassword, comparePassword } from '../utils/hash.util';
import { generateToken } from '../utils/jwt.util';
import { EmailService } from './email.service';

export class AuthService {
    static async register(email: string, password: string, fullName: string) {
        // Verificar si el usuario ya existe
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            throw new Error('El email ya está registrado');
        }

        // Validar contraseña (mínimo 8 caracteres)
        if (password.length < 8) {
            throw new Error('La contraseña debe tener al menos 8 caracteres');
        }

        // Hash de la contraseña
        const passwordHash = await hashPassword(password);

        // Crear usuario
        const user = await prisma.user.create({
            data: {
                email,
                passwordHash,
                fullName
            }
        });

        // Generar token de verificación
        const verificationToken = generateToken(
            { userId: user.id, email: user.email },
            '24h'
        );

        // Enviar email de verificación
        await EmailService.sendVerificationEmail(email, verificationToken);

        return {
            userId: user.id,
            message: 'Usuario registrado. Por favor, verifica tu email.'
        };
    }

    static async login(email: string, password: string) {
        // Buscar usuario
        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                subscriptions: {
                    where: { isActive: true },
                    include: { plan: true }
                }
            }
        });

        if (!user) {
            throw new Error('Credenciales inválidas');
        }

        // Verificar contraseña
        const isValid = await comparePassword(password, user.passwordHash);
        if (!isValid) {
            throw new Error('Credenciales inválidas');
        }

        // Verificar email verificado
        if (!user.emailVerified) {
            throw new Error('Por favor, verifica tu email antes de iniciar sesión');
        }

        // Verificar usuario activo
        if (!user.isActive) {
            throw new Error('Tu cuenta ha sido desactivada');
        }

        // Generar token
        const token = generateToken(
            { userId: user.id, email: user.email },
            '7d'
        );

        // Actualizar última conexión
        await prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() }
        });

        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                subscriptions: user.subscriptions
            }
        };
    }

    static async verifyEmail(token: string) {
        try {
            // Verificar token
            const { userId } = generateToken as any; // Usar verifyToken del util
            const payload = require('../utils/jwt.util').verifyToken(token);

            // Actualizar usuario
            const user = await prisma.user.update({
                where: { id: payload.userId },
                data: { emailVerified: true }
            });

            return {
                success: true,
                message: 'Email verificado exitosamente'
            };
        } catch (error) {
            throw new Error('Token de verificación inválido o expirado');
        }
    }

    static async requestPasswordReset(email: string) {
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            // Por seguridad, no revelar si el email existe
            return {
                success: true,
                message: 'Si el email existe, recibirás instrucciones para restablecer tu contraseña'
            };
        }

        // Generar token de reset
        const resetToken = generateToken(
            { userId: user.id, email: user.email },
            '1h'
        );

        // Enviar email
        await EmailService.sendPasswordReset(email, resetToken);

        return {
            success: true,
            message: 'Si el email existe, recibirás instrucciones para restablecer tu contraseña'
        };
    }

    static async resetPassword(token: string, newPassword: string) {
        try {
            // Verificar token
            const { verifyToken } = require('../utils/jwt.util');
            const payload = verifyToken(token);

            // Validar nueva contraseña
            if (newPassword.length < 8) {
                throw new Error('La contraseña debe tener al menos 8 caracteres');
            }

            // Hash de la nueva contraseña
            const passwordHash = await hashPassword(newPassword);

            // Actualizar contraseña
            await prisma.user.update({
                where: { id: payload.userId },
                data: { passwordHash }
            });

            return {
                success: true,
                message: 'Contraseña actualizada exitosamente'
            };
        } catch (error) {
            throw new Error('Token de reset inválido o expirado');
        }
    }
}
