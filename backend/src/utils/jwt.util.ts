import jwt from 'jsonwebtoken';
import env from '../config/env';

export interface JWTPayload {
    userId: string;
    email: string;
}

export const generateToken = (payload: JWTPayload, expiresIn: string = '7d'): string => {
    return jwt.sign(payload, env.JWT_SECRET as string, { expiresIn } as any);
};

export const verifyToken = (token: string): JWTPayload => {
    try {
        return jwt.verify(token, env.JWT_SECRET as string) as JWTPayload;
    } catch (error) {
        throw new Error('Token inválido o expirado');
    }
};
