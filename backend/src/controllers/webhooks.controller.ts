import { Request, Response } from 'express';
import { LinkPaymentService } from '../services/link.service';

const linkService = new LinkPaymentService();

export class WebhooksController {
    // POST /api/webhooks/link
    static async handleLinkWebhook(req: Request, res: Response) {
        try {
            const payload = req.body;

            await linkService.handleWebhook(payload);

            return res.status(200).json({ received: true });
        } catch (error: any) {
            console.error('Error handling Link webhook:', error);
            return res.status(500).json({ error: 'Error processing webhook' });
        }
    }
}
