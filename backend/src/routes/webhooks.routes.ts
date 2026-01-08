import { Router } from 'express';
import { WebhooksController } from '../controllers/webhooks.controller';

const router = Router();

// Webhook de Link (no requiere autenticación)
router.post('/link', WebhooksController.handleLinkWebhook);

export default router;
