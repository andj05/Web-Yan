import { Resend } from 'resend';
import env from '../config/env';

const resend = new Resend(env.RESEND_API_KEY);

export class EmailService {
    static async send({ to, subject, html }: { to: string; subject: string; html: string }) {
        try {
            const { data, error } = await resend.emails.send({
                from: env.FROM_EMAIL,
                to: [to],
                subject,
                html
            });

            if (error) {
                console.error('Error enviando email:', error);
                throw error;
            }

            return data;
        } catch (error) {
            console.error('Error en EmailService:', error);
            throw error;
        }
    }

    static async sendVerificationEmail(email: string, token: string) {
        const verificationUrl = `${env.FRONTEND_URL}/verify-email?token=${token}`;

        return this.send({
            to: email,
            subject: 'Verifica tu cuenta - VideoGenerator AI',
            html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
              .container { 
                max-width: 600px; 
                margin: 0 auto; 
                background: white; 
                padding: 40px; 
                border-radius: 10px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
              }
              .button { 
                display: inline-block; 
                background: #4F46E5; 
                color: white; 
                padding: 12px 30px; 
                text-decoration: none; 
                border-radius: 6px; 
                margin-top: 20px;
              }
              h1 { color: #333; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>🎬 Bienvenido a VideoGenerator AI</h1>
              <p>Gracias por registrarte. Por favor, verifica tu cuenta haciendo clic en el siguiente enlace:</p>
              <a href="${verificationUrl}" class="button">Verificar mi cuenta</a>
              <p style="margin-top: 30px; color: #666; font-size: 14px;">
                Si no creaste esta cuenta, puedes ignorar este correo.
              </p>
            </div>
          </body>
        </html>
      `
        });
    }

    static async sendSubscriptionActivated(email: string, token: string, planName: string, creditsTotal: number) {
        return this.send({
            to: email,
            subject: `✅ Tu plan ${planName} está activo`,
            html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
              .container { 
                max-width: 600px; 
                margin: 0 auto; 
                background: white; 
                padding: 40px; 
                border-radius: 10px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
              }
              .token-box { 
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 20px; 
                border-radius: 8px; 
                text-align: center;
                font-size: 24px;
                font-weight: bold;
                letter-spacing: 3px;
                margin: 30px 0;
              }
              .credits-badge {
                background: #10B981;
                color: white;
                padding: 10px 20px;
                border-radius: 20px;
                display: inline-block;
                font-weight: bold;
              }
              .button { 
                display: inline-block; 
                background: #4F46E5; 
                color: white; 
                padding: 12px 30px; 
                text-decoration: none; 
                border-radius: 6px; 
                margin-top: 20px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>🎉 ¡Tu suscripción está activa!</h1>
              <p>Tu plan <strong>${planName}</strong> ha sido activado exitosamente.</p>
              
              <div class="credits-badge">
                💎 ${creditsTotal} créditos disponibles
              </div>

              <h2>Tu Token de Acceso</h2>
              <div class="token-box">${token}</div>
              
              <p>⚠️ <strong>Guarda este token de forma segura.</strong> Lo necesitarás para acceder a todas las funciones premium.</p>
              
              <a href="${env.FRONTEND_URL}/dashboard" class="button">
                Ir al Dashboard
              </a>

              <p style="margin-top: 30px; color: #666; font-size: 14px;">
                ¿Tienes preguntas? Responde este correo y te ayudaremos.
              </p>
            </div>
          </body>
        </html>
      `
        });
    }

    static async sendProjectCompleted(email: string, projectTitle: string, downloadUrl: string) {
        return this.send({
            to: email,
            subject: `✨ Tu proyecto "${projectTitle}" está listo`,
            html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
              .container { 
                max-width: 600px; 
                margin: 0 auto; 
                background: white; 
                padding: 40px; 
                border-radius: 10px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
              }
              .button { 
                display: inline-block; 
                background: #10B981; 
                color: white; 
                padding: 15px 40px; 
                text-decoration: none; 
                border-radius: 6px;
                font-size: 18px;
                font-weight: bold;
              }
              .success-icon {
                font-size: 64px;
                text-align: center;
                margin: 20px 0;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="success-icon">🎬</div>
              <h1>¡Tu video está listo!</h1>
              <p>El proyecto <strong>${projectTitle}</strong> ha sido procesado exitosamente.</p>
              
              <p>Puedes descargar todos los archivos (guión, audio e imágenes) en formato ZIP.</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${downloadUrl}" class="button">
                  📥 Descargar ZIP
                </a>
              </div>

              <p style="color: #666; font-size: 14px;">
                ⏰ El enlace de descarga estará disponible por 7 días.
              </p>
            </div>
          </body>
        </html>
      `
        });
    }

    static async sendPasswordReset(email: string, resetToken: string) {
        const resetUrl = `${env.FRONTEND_URL}/reset-password?token=${resetToken}`;

        return this.send({
            to: email,
            subject: 'Recupera tu contraseña - VideoGenerator AI',
            html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
              .container { 
                max-width: 600px; 
                margin: 0 auto; 
                background: white; 
                padding: 40px; 
                border-radius: 10px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
              }
              .button { 
                display: inline-block; 
                background: #EF4444; 
                color: white; 
                padding: 12px 30px; 
                text-decoration: none; 
                border-radius: 6px; 
                margin-top: 20px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>🔐 Recuperación de Contraseña</h1>
              <p>Recibimos una solicitud para restablecer tu contraseña.</p>
              <p>Haz clic en el siguiente botón para crear una nueva contraseña:</p>
              
              <a href="${resetUrl}" class="button">Restablecer Contraseña</a>

              <p style="margin-top: 30px; color: #666; font-size: 14px;">
                Si no solicitaste este cambio, puedes ignorar este correo. Tu contraseña permanecerá sin cambios.
              </p>
              <p style="color: #666; font-size: 14px;">
                Este enlace expirará en 1 hora.
              </p>
            </div>
          </body>
        </html>
      `
        });
    }
}
