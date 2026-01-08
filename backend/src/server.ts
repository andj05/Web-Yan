import express, { Request, Response } from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import env from './config/env';

// Routes
import authRoutes from './routes/auth.routes';
import projectsRoutes from './routes/projects.routes';
import paymentsRoutes from './routes/payments.routes';
import webhooksRoutes from './routes/webhooks.routes';
import userRoutes from './routes/user.routes';

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

// Configurar CORS
app.use(cors({
    origin: env.FRONTEND_URL,
    credentials: true
}));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/webhooks', webhooksRoutes);
app.use('/api/user', userRoutes);

// Ruta de health check
app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// WebSocket para actualizaciones en tiempo real
wss.on('connection', (ws) => {
    console.log('Cliente conectado via WebSocket');

    ws.on('message', (message) => {
        console.log('Mensaje recibido:', message.toString());
    });

    ws.on('close', () => {
        console.log('Cliente desconectado');
    });
});

// Función para enviar actualización a todos los clientes
export const broadcastProgress = (projectId: string, data: any) => {
    wss.clients.forEach((client) => {
        if (client.readyState === 1) { // OPEN
            client.send(JSON.stringify({
                type: 'progress',
                projectId,
                data
            }));
        }
    });
};

// Manejo de errores global
app.use((err: any, req: Request, res: Response, next: any) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
});

const PORT = parseInt(env.PORT) || 3000;

server.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    console.log(`📡 WebSocket disponible en ws://localhost:${PORT}`);
    console.log(`🌍 Entorno: ${env.NODE_ENV}`);
});

export default app;
