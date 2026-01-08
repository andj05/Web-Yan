import { Router } from 'express';
import { authMiddleware, AuthRequest } from '../middlewares/auth.middleware';
import { CreditsService } from '../services/credits.service';
import prisma from '../config/database';

const router = Router();

router.use(authMiddleware);

// GET /api/user/me
router.get('/me', async (req: AuthRequest, res) => {
    try {
        const userId = req.user!.userId;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                fullName: true,
                emailVerified: true,
                createdAt: true
            }
        });

        return res.status(200).json({ user });
    } catch (error: any) {
        return res.status(400).json({ error: error.message });
    }
});

// GET /api/user/credits
router.get('/credits', async (req: AuthRequest, res) => {
    try {
        const userId = req.user!.userId;
        const credits = await CreditsService.getUserCredits(userId);

        return res.status(200).json({ credits });
    } catch (error: any) {
        return res.status(400).json({ error: error.message });
    }
});

// GET /api/user/transactions
router.get('/transactions', async (req: AuthRequest, res) => {
    try {
        const userId = req.user!.userId;
        const limit = parseInt(req.query.limit as string) || 50;

        const transactions = await CreditsService.getTransactionHistory(userId, limit);

        return res.status(200).json({ transactions });
    } catch (error: any) {
        return res.status(400).json({ error: error.message });
    }
});

export default router;
