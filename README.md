# Sistema de Generación de Videos con IA

Plataforma SaaS para crear videos documentales para YouTube usando Inteligencia Artificial. Genera automáticamente guiones narrativos, voz en off natural e imágenes tipo Studio Ghibli.

## 🚀 Características

- ✅ **Generación Completa de Videos**: Guión + Audio + Imágenes
- ✅ **Módulos Independientes**: Genera solo imágenes, guiones o voz
- ✅ **Sistema de Créditos**: Gestión automática de consumo
- ✅ **Pagos Integrados**: Link payment gateway
- ✅ **Tiempo Real**: Seguimiento de progreso via WebSocket
- ✅ **Autenticación Segura**: JWT + Email verification

## 📁 Estructura del Proyecto

```
Web-Yan/
├── backend/           # API REST con Node.js + Express
│   ├── src/
│   │   ├── config/      # Configuración (DB, env)
│   │   ├── controllers/ # Controladores de rutas
│   │   ├── services/    # Lógica de negocio
│   │   ├── middlewares/ # Auth, validación
│   │   ├── routes/      # Definición de rutas
│   │   └── server.ts    # Servidor principal
│   └── prisma/          # Schema de base de datos
│
├── frontend/          # React + Vite + TypeScript
│   ├── src/
│   │   ├── components/  # Componentes React
│   │   ├── services/    # Clientes API
│   │   ├── App.tsx      # Enrutador principal
│   │   └── main.tsx     # Entry point
│   └── package.json
│
└── docs/              # Documentación
```

## 🛠️ Stack Tecnológico

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express + TypeScript
- **Base de Datos**: PostgreSQL (Neon) + Prisma ORM
- **Autenticación**: JWT + Bcrypt
- **Emails**: Resend
- **Pagos**: Link API
- **WebSocket**: ws library

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Lenguaje**: TypeScript
- **Estilos**: TailwindCSS
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Iconos**: Lucide React

### Servicios Externos
- **n8n**: Workflows de generación de IA
- **Perplexity AI**: Generación de guiones
- **Inworld AI**: Text-to-Speech
- **FAL.AI**: Generación de imágenes
- **AWS S3**: Almacenamiento de archivos

## 📦 Instalación

### Prerequisitos
- Node.js 18 o superior
- PostgreSQL (o cuenta en Neon)
- npm o yarn

### Backend

```bash
cd backend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Edita .env con tus credenciales

# Generar cliente Prisma
npx prisma generate

# Crear base de datos y migrar
npx prisma migrate dev

# Iniciar servidor de desarrollo
npm run dev
```

El backend estará corriendo en `http://localhost:3000`

### Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Edita .env si es necesario

# Iniciar servidor de desarrollo
npm run dev
```

El frontend estará corriendo en `http://localhost:5173`

## 🔑 Variables de Entorno

### Backend (.env)

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/dbname"

# JWT
JWT_SECRET="your-secret-key-min-32-characters"

# Server
PORT=3000
NODE_ENV=development
FRONTEND_URL="http://localhost:5173"

# n8n
N8N_WEBHOOK_URL="https://your-n8n-instance.railway.app"

# APIs
RESEND_API_KEY="re_xxxxx"
FROM_EMAIL="noreply@yourdomain.com"
LINK_API_KEY="your-link-api-key"
LINK_WEBHOOK_SECRET="your-link-webhook-secret"

# Storage (AWS S3)
AWS_ACCESS_KEY_ID="your-aws-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret"
S3_BUCKET_NAME="video-generator-storage"
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:3000/api
```

## 📚 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/verify-email` - Verificar email
- `POST /api/auth/forgot-password` - Solicitar reset de contraseña
- `POST /api/auth/reset-password` - Restablecer contraseña

### Proyectos
- `POST /api/projects/create` - Crear video completo
- `GET /api/projects` - Listar proyectos
- `GET /api/projects/:id` - Obtener proyecto
- `PATCH /api/projects/:id/progress` - Actualizar progreso (n8n)

### Módulos
- `POST /api/projects/modules/images` - Generar solo imágenes
- `POST /api/projects/modules/script` - Generar solo guión
- `POST /api/projects/modules/voice` - Generar solo voz

### Pagos
- `POST /api/payments/create-checkout` - Crear sesión de pago
- `GET /api/payments/plans` - Obtener planes
- `GET /api/payments/subscriptions` - Suscripciones del usuario

### Usuario
- `GET /api/user/me` - Datos del usuario
- `GET /api/user/credits` - Créditos disponibles
- `GET /api/user/transactions` - Historial de transacciones

## 🎯 Flujo de Usuario

1. **Registro** → Verificación de email
2. **Compra de Plan** → Pago con Link → Recibe token de suscripción
3. **Crear Proyecto** → Sistema valida créditos
4. **Procesamiento** → n8n ejecuta workflow → Progreso en tiempo real
5. **Completado** → Email con link de descarga → Usuario descarga ZIP

## 💳 Sistema de Créditos

### Costos
- **Video Completo**: `10 + (2 × minutos) + (0.5 × imágenes)`
- **Solo Imágenes**: `1 × imagen`
- **Solo Guión**: `3 + (0.5 × minutos)`
- **Solo Voz**: `2 × minuto`

### Planes
- **Básico**: $9.99 - 50 créditos
- **Profesional**: $29.99 - 200 créditos
- **Enterprise**: $99.99 - 1000 créditos

## 🔧 Scripts Disponibles

### Backend
```bash
npm run dev        # Desarrollo con hot reload
npm run build      # Compilar TypeScript
npm start          # Producción
npx prisma studio  # Interfaz visual de BD
```

### Frontend
```bash
npm run dev        # Desarrollo con hot reload
npm run build      # Build de producción
npm run preview    # Preview del build
```

## 📖 Documentación Adicional

- [API Documentation](./docs/API.md)
- [n8n Integration Guide](./docs/N8N-INTEGRATION.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)

## 🚢 Deployment

### Backend (Railway)
1. Conecta tu repositorio a Railway
2. Configura variables de entorno
3. Railway detectará el Dockerfile automáticamente

### Frontend (Vercel)
1. Conecta tu repositorio a Vercel
2. Configura directorio: `frontend`
3. Build command: `npm run build`
4. Output directory: `dist`

### Base de Datos (Neon)
1. Crea proyecto en Neon.tech
2. Copia connection string
3. Ejecuta migraciones: `npx prisma migrate deploy`

## 🐛 Troubleshooting

### Error: "Token inválido"
- Verifica que JWT_SECRET tenga al menos 32 caracteres
- Revisa que el token no haya expirado

### Error: "No tienes suficientes créditos"
- Compra un plan desde `/pricing`
- Verifica que tu suscripción no haya expirado

### Error conexión Base de Datos
- Verifica DATABASE_URL en .env
- Asegúrate que PostgreSQL esté corriendo
- Ejecuta `npx prisma generate`

## 📝 Notas Importantes

⚠️ **Integración con n8n**: Los workflows de n8n deben ser configurados manualmente en tu instancia. Ver `docs/N8N-INTEGRATION.md`

⚠️ **Almacenamiento**: Configura AWS S3 o Cloudflare R2 para almacenar archivos generados

⚠️ **Emails**: Configura tu dominio en Resend para enviar emails

## 👥 Contribuir

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/amazing-feature`)
3. Commit cambios (`git commit -m 'Add amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia MIT.

## 🙏 Agradecimientos

- Perplexity AI por la generación de guiones
- Inworld AI por text-to-speech
- FAL.AI por generación de imágenes
- n8n por automatización de workflows
