# 🚀 Guía de Inicio Rápido

## ⚡ Setup en 5 Minutos

### 1️⃣ Backend - Setup

```bash
cd backend

# Instalar dependencias
npm install

# Crear archivo .env (copia de .env.example)
copy .env.example .env
```

**Editar backend/.env** y configurar MÍNIMO:
```env
DATABASE_URL="postgresql://user:password@host:5432/dbname"
JWT_SECRET="cambiar-por-string-aleatorio-min-32-caracteres"
FRONTEND_URL="http://localhost:5173"
RESEND_API_KEY="re_xxxx"  # Obtener en resend.com
FROM_EMAIL="noreply@tudominio.com"
```

Luego:
```bash
# Generar Prisma Client
npx prisma generate

# Crear base de datos
npx prisma migrate dev --name init

# Iniciar servidor
npm run dev
```

✅ Backend corriendo en: **http://localhost:3000**

---

### 2️⃣ Frontend - Setup

```bash
cd frontend

# Instalar dependencias
npm install

# Crear archivo .env
copy .env.example .env
```

**Editar frontend/.env**:
```env
VITE_API_URL=http://localhost:3000/api
```

Luego:
```bash
# Iniciar aplicación
npm run dev
```

✅ Frontend corriendo en: **http://localhost:5173**

---

## 🗄️ Crear Planes de Suscripción

Antes de probar pagos, inserta los planes en la base de datos:

```bash
cd backend
npx prisma studio
```

En Prisma Studio → `subscription_plans` → Add Record:

**Plan 1 - Básico:**
```
name: Básico
description: Plan ideal para comenzar
credits_included: 50
price_usd: 9.99
duration_days: 30
is_active: true
features: ["10 videos", "Resolución SD", "Soporte email"]
```

**Plan 2 - Profesional:**
```
name: Profesional
description: Para creadores de contenido
credits_included: 200
price_usd: 29.99
duration_days: 30
is_active: true
features: ["50 videos", "Resolución HD", "Voces premium"]
```

**Plan 3 - Enterprise:**
```
name: Enterprise
description: Para equipos y agencias
credits_included: 1000
price_usd: 99.99
duration_days: 30
is_active: true
features: ["Videos ilimitados", "Resolución 4K", "API access"]
```

---

## 🔑 Servicios Externos (Opcional para Testing Completo)

### Resend (Emails)
1. Ir a [resend.com](https://resend.com)
2. Crear cuenta gratis
3. Verificar dominio o usar dominio de testing
4. Copiar API Key → `RESEND_API_KEY`

### Neon (Base de Datos)
1. Ir a [neon.tech](https://neon.tech)
2. Crear proyecto PostgreSQL
3. Copiar connection string → `DATABASE_URL`

### Link (Pagos) - Solo para producción
1. Ir a [trylink.com](https://trylink.com)
2. Crear cuenta
3. Obtener API Key → `LINK_API_KEY`

---

## ✅ Probar la Aplicación

### 1. Registrar Usuario
1. Abrir `http://localhost:5173`
2. Click en "Regístrate aquí"
3. Llenar formulario
4. Revisar email (si configuraste Resend)

### 2. Verificar Email
- Si no configuraste Resend, verificar manualmente en BD:
```sql
UPDATE users SET email_verified = true WHERE email = 'tu@email.com';
```

### 3. Comprar Plan (Mock)
Para testing sin Link, crear suscripción manual:
```sql
INSERT INTO user_subscriptions (
  user_id, 
  plan_id, 
  subscription_token, 
  credits_remaining, 
  credits_total, 
  starts_at, 
  expires_at
) VALUES (
  'tu-user-id',
  1,
  'SUB_TESTTOKEN123',
  50,
  50,
  NOW(),
  NOW() + INTERVAL '30 days'
);
```

### 4. Crear Video
1. Login con tu usuario
2. Dashboard → "Crear Video Completo"
3. Llenar formulario
4. Submit

**Nota**: Sin n8n configurado, el proyecto quedará en estado "processing". Ver sección n8n abajo.

---

## 🔧 Troubleshooting

### Error: "Prisma Client not generated"
```bash
cd backend
npx prisma generate
```

### Error: "Port 3000 already in use"
Cambiar `PORT` en backend/.env a otro puerto

### Error: "Cannot connect to database"
Verificar que `DATABASE_URL` sea correcto en backend/.env

### Frontend no se conecta al backend
Verificar que `VITE_API_URL` en frontend/.env apunte a `http://localhost:3000/api`

---

## 📝 Próximos Pasos

### Para Producción:
- [ ] Configurar n8n workflows
- [ ] Configurar AWS S3 para storage
- [ ] Obtener API keys de Link para pagos reales
- [ ] Deploy frontend en Vercel
- [ ] Deploy backend en Railway
- [ ] Configurar dominio personalizado

### Para Development:
- [ ] Probar todos los endpoints con Postman/Thunder Client
- [ ] Crear usuarios de prueba
- [ ] Probar flujo completo de registro → pago → creación

---

## 🆘 Ayuda

**Health Check Backend:**
```bash
curl http://localhost:3000/health
```

**Response esperado:**
```json
{"status": "ok", "timestamp": "2025-01-07T..."}
```

**Ver logs del backend:**
Los logs se mostrarán en la terminal donde ejecutaste `npm run dev`

**Reiniciar base de datos:**
```bash
cd backend
npx prisma migrate reset
npx prisma migrate dev
```
