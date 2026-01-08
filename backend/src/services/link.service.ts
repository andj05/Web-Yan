import axios from 'axios';
import prisma from '../config/database';
import env from '../config/env';
import { EmailService } from './email.service';

export class LinkPaymentService {
    private apiKey = env.LINK_API_KEY || '';
    private baseUrl = 'https://api.trylink.com';

    // Crear checkout de pago
    async createCheckout(userId: string, planId: number) {
        try {
            // Obtener plan
            const plan = await prisma.subscriptionPlan.findUnique({
                where: { id: planId }
            });

            if (!plan || !plan.isActive) {
                throw new Error('Plan no encontrado o no disponible');
            }

            const user = await prisma.user.findUnique({
                where: { id: userId }
            });

            if (!user) {
                throw new Error('Usuario no encontrado');
            }

            // Crear checkout en Link
            const response = await axios.post(
                `${this.baseUrl}/v1/checkouts`,
                {
                    amount: Math.round(parseFloat(plan.priceUsd.toString()) * 100), // Link usa centavos
                    currency: 'USD',
                    description: `Plan ${plan.name} - VideoGenerator AI`,
                    metadata: {
                        user_id: userId,
                        plan_id: planId.toString()
                    },
                    success_url: `${env.FRONTEND_URL}/payment/success`,
                    cancel_url: `${env.FRONTEND_URL}/payment/cancel`
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            // Guardar pago en BD
            await prisma.payment.create({
                data: {
                    userId,
                    planId,
                    linkPaymentId: response.data.id,
                    linkCheckoutUrl: response.data.url,
                    amountUsd: plan.priceUsd,
                    status: 'pending'
                }
            });

            return response.data.url; // URL de checkout
        } catch (error: any) {
            console.error('Error creating checkout:', error.response?.data || error.message);
            throw new Error('Error al crear checkout de pago');
        }
    }

    // Manejar webhook de Link
    async handleWebhook(payload: any) {
        const { type, data } = payload;

        if (type === 'checkout.completed') {
            await this.handleCheckoutCompleted(data);
        }
    }

    // Procesar pago completado
    private async handleCheckoutCompleted(data: any) {
        try {
            // Buscar pago
            const payment = await prisma.payment.findUnique({
                where: { linkPaymentId: data.id },
                include: { plan: true }
            });

            if (!payment) {
                console.error('Payment not found:', data.id);
                return;
            }

            // Verificar si ya fue procesado
            if (payment.status === 'completed') {
                console.log('Payment already processed:', data.id);
                return;
            }

            // Activar suscripción
            await this.activateSubscription(payment);

            // Actualizar pago
            await prisma.payment.update({
                where: { id: payment.id },
                data: {
                    status: 'completed',
                    completedAt: new Date()
                }
            });
        } catch (error) {
            console.error('Error handling checkout completed:', error);
            throw error;
        }
    }

    // Activar suscripción
    private async activateSubscription(payment: any) {
        const plan = payment.plan;

        // Crear suscripción
        const subscription = await prisma.userSubscription.create({
            data: {
                userId: payment.userId,
                planId: payment.planId,
                subscriptionToken: this.generateSubscriptionToken(),
                creditsRemaining: plan.creditsIncluded,
                creditsTotal: plan.creditsIncluded,
                startsAt: new Date(),
                expiresAt: new Date(Date.now() + plan.durationDays * 24 * 60 * 60 * 1000),
                paymentId: payment.linkPaymentId
            }
        });

        // Registrar transacción de créditos
        await prisma.creditTransaction.create({
            data: {
                userId: payment.userId,
                subscriptionId: subscription.id,
                transactionType: 'purchase',
                creditsAmount: plan.creditsIncluded,
                creditsBefore: 0,
                creditsAfter: plan.creditsIncluded,
                description: `Créditos incluidos en plan ${plan.name}`
            }
        });

        // Obtener usuario
        const user = await prisma.user.findUnique({
            where: { id: payment.userId }
        });

        // Enviar email
        if (user) {
            await EmailService.sendSubscriptionActivated(
                user.email,
                subscription.subscriptionToken,
                plan.name,
                plan.creditsIncluded
            );
        }
    }

    // Generar token único de suscripción
    private generateSubscriptionToken(): string {
        const prefix = 'SUB_';
        const randomString = Math.random().toString(36).substring(2, 18).toUpperCase();
        return prefix + randomString;
    }
}
