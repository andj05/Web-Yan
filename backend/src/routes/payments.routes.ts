import { Router } from 'express';
import { PaymentsController } from '../controllers/payments.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

router.post('/create-checkout', PaymentsController.createCheckout);
router.get('/plans', PaymentsController.getPlans);
router.get('/subscriptions', PaymentsController.getUserSubscriptions);

export default router;
