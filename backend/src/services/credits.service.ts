import prisma from '../config/database';

export class CreditsService {
    // Costos de créditos
    static readonly CREDIT_COSTS = {
        FULL_VIDEO: {
            BASE: 10,
            PER_MINUTE: 2,
            PER_IMAGE: 0.5
        },
        IMAGES_ONLY: {
            PER_IMAGE: 1
        },
        SCRIPT_ONLY: {
            BASE: 3,
            PER_MINUTE: 0.5
        },
        VOICE_ONLY: {
            PER_MINUTE: 2
        }
    };

    // Calcular costo de video completo
    static calculateFullVideoCredits(durationMinutes: number, imagesCount: number): number {
        return Math.ceil(
            this.CREDIT_COSTS.FULL_VIDEO.BASE +
            (durationMinutes * this.CREDIT_COSTS.FULL_VIDEO.PER_MINUTE) +
            (imagesCount * this.CREDIT_COSTS.FULL_VIDEO.PER_IMAGE)
        );
    }

    // Calcular costo de imágenes
    static calculateImagesOnlyCredits(imagesCount: number): number {
        return Math.ceil(imagesCount * this.CREDIT_COSTS.IMAGES_ONLY.PER_IMAGE);
    }

    // Calcular costo de guión
    static calculateScriptOnlyCredits(durationMinutes: number): number {
        return Math.ceil(
            this.CREDIT_COSTS.SCRIPT_ONLY.BASE +
            (durationMinutes * this.CREDIT_COSTS.SCRIPT_ONLY.PER_MINUTE)
        );
    }

    // Calcular costo de voz
    static calculateVoiceOnlyCredits(textLength: number): number {
        // Estimar minutos basado en caracteres (aprox 150 palabras/min, 5 chars/palabra)
        const estimatedMinutes = textLength / (150 * 5);
        return Math.ceil(estimatedMinutes * this.CREDIT_COSTS.VOICE_ONLY.PER_MINUTE);
    }

    // Obtener créditos disponibles del usuario
    static async getUserCredits(userId: string): Promise<number> {
        const activeSubscription = await prisma.userSubscription.findFirst({
            where: {
                userId,
                isActive: true,
                expiresAt: { gt: new Date() }
            },
            orderBy: { expiresAt: 'desc' }
        });

        return activeSubscription?.creditsRemaining || 0;
    }

    // Validar si el usuario tiene suficientes créditos
    static async hasEnoughCredits(userId: string, requiredCredits: number): Promise<boolean> {
        const availableCredits = await this.getUserCredits(userId);
        return availableCredits >= requiredCredits;
    }

    // Consumir créditos
    static async consumeCredits(
        userId: string,
        amount: number,
        description: string,
        projectId?: string
    ): Promise<void> {
        // Obtener suscripción activa
        const subscription = await prisma.userSubscription.findFirst({
            where: {
                userId,
                isActive: true,
                expiresAt: { gt: new Date() }
            },
            orderBy: { expiresAt: 'desc' }
        });

        if (!subscription) {
            throw new Error('No tienes una suscripción activa');
        }

        if (subscription.creditsRemaining < amount) {
            throw new Error('No tienes suficientes créditos');
        }

        const creditsBefore = subscription.creditsRemaining;
        const creditsAfter = creditsBefore - amount;

        // Actualizar créditos en la suscripción
        await prisma.userSubscription.update({
            where: { id: subscription.id },
            data: { creditsRemaining: creditsAfter }
        });

        // Registrar transacción
        await prisma.creditTransaction.create({
            data: {
                userId,
                subscriptionId: subscription.id,
                projectId,
                transactionType: 'usage',
                creditsAmount: -amount,
                creditsBefore,
                creditsAfter,
                description
            }
        });
    }

    // Añadir créditos (por compra de plan)
    static async addCredits(
        userId: string,
        subscriptionId: string,
        amount: number,
        description: string
    ): Promise<void> {
        const subscription = await prisma.userSubscription.findUnique({
            where: { id: subscriptionId }
        });

        if (!subscription) {
            throw new Error('Suscripción no encontrada');
        }

        const creditsBefore = subscription.creditsRemaining;
        const creditsAfter = creditsBefore + amount;

        // Actualizar créditos
        await prisma.userSubscription.update({
            where: { id: subscriptionId },
            data: { creditsRemaining: creditsAfter }
        });

        // Registrar transacción
        await prisma.creditTransaction.create({
            data: {
                userId,
                subscriptionId,
                transactionType: 'purchase',
                creditsAmount: amount,
                creditsBefore,
                creditsAfter,
                description
            }
        });
    }

    // Obtener historial de transacciones
    static async getTransactionHistory(userId: string, limit: number = 50) {
        return await prisma.creditTransaction.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: limit,
            include: {
                project: {
                    select: {
                        id: true,
                        title: true
                    }
                }
            }
        });
    }
}
