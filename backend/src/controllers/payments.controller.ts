import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { LinkPaymentService } from '../services/link.service';
import prisma from '../config/database';

const linkService = new LinkPaymentService();

export class PaymentsController {
    // POST /api/payments/create-checkout
    static async createCheckout(req: AuthRequest, res: Response) {
        try {
            const userId = req.user!.userId;
            const { planId } = req.body;

            if (!planId) {
                return res.status(400).json({ error: 'Plan ID es requerido' });
            }

            const checkoutUrl = await linkService.createCheckout(userId, planId);

            return res.status(200).json({ checkoutUrl });
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    // GET /api/payments/plans
    static async getPlans(req: AuthRequest, res: Response) {
        try {
            const plans = await prisma.subscriptionPlan.findMany({
                where: { isActive: true },
                orderBy: { priceUsd: 'asc' }
            });

            return res.status(200).json({ plans });
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    // GET /api/user/subscriptions
    static async getUserSubscriptions(req: AuthRequest, res: Response) {
        try {
            const userId = req.user!.userId;

            const subscriptions = await prisma.userSubscription.findMany({
                where: { userId },
                include: { plan: true },
                orderBy: { createdAt: 'desc' }
            });

            return res.status(200).json({ subscriptions });
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }
}
