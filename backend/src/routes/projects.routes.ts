import { Router } from 'express';
import { ProjectsController } from '../controllers/projects.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Video completo
router.post('/create', ProjectsController.createFullVideo);
router.get('/', ProjectsController.getUserProjects);
router.get('/:id', ProjectsController.getProject);
router.patch('/:id/progress', ProjectsController.updateProgress);

// Módulos independientes
router.post('/modules/images', ProjectsController.createImagesOnly);
router.post('/modules/script', ProjectsController.createScriptOnly);
router.post('/modules/voice', ProjectsController.createVoiceOnly);

export default router;
