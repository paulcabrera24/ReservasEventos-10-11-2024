import dotenv from 'dotenv';

dotenv.config();

export const getEmailTemplate = (user) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      background-color: #f3f4f6;
      color: #1f2937;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }

    .wrapper {
      width: 100%;
      background-color: #f3f4f6;
      padding: 20px;
    }

    .container {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .header {
      background: #6366f1;
      padding: 24px;
      text-align: center;
    }

    .header h1 {
      color: #ffffff;
      font-size: 24px;
      font-weight: 600;
      margin: 0;
      line-height: 1.2;
    }

    .content {
      padding: 24px;
    }

    .welcome-text {
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 24px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .message {
      color: #4b5563;
      margin-bottom: 24px;
      font-size: 15px;
      line-height: 1.6;
    }

    .features-box {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 20px;
      margin: 24px 0;
    }

    .features-title {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .features-list {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .features-list li {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      margin-bottom: 12px;
      color: #4b5563;
      font-size: 14px;
      line-height: 1.4;
    }

    .email-container {
      margin: 16px 0;
    }

    .email-box {
      background: #f3f4f6;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 16px;
      text-align: center;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 14px;
      color: #4b5563;
      word-break: break-all;
      text-decoration: none !important;
      pointer-events: none;
    }

    .button-container {
      text-align: center;
      margin-top: 32px;
    }

    .button {
      display: inline-block;
      padding: 12px 24px;
      background: #6366f1;
      color: #ffffff !important;
      text-decoration: none !important;
      border-radius: 8px;
      font-weight: 500;
      font-size: 15px;
      line-height: 1;
    }

    .button:hover {
      background: #4f46e5;
    }

    .button-text {
      color: #ffffff !important;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }

    .footer {
      text-align: center;
      padding: 24px;
      background: #f9fafb;
      border-top: 1px solid #e5e7eb;
    }

    .footer p {
      color: #6b7280;
      font-size: 14px;
      line-height: 1.5;
      margin: 8px 0;
    }

    /* Asegurar que los enlaces no se coloreen automáticamente */
    a {
      color: inherit !important;
      text-decoration: none !important;
    }

    .no-underline {
      text-decoration: none !important;
    }

    .monospace {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace !important;
    }

    /* Media Queries para responsividad */
    @media only screen and (max-width: 600px) {
      .wrapper {
        padding: 10px;
      }

      .content {
        padding: 20px;
      }

      .header {
        padding: 20px;
      }

      .header h1 {
        font-size: 20px;
      }

      .welcome-text {
        font-size: 18px;
      }

      .features-box {
        padding: 16px;
      }

      .button {
        display: block;
        width: 100%;
        text-align: center;
        padding: 14px 20px;
      }
    }

    /* Soporte para modo oscuro en clientes que lo soporten */
    @media (prefers-color-scheme: dark) {
      .email-box {
        background: #1f2937;
        border-color: #374151;
        color: #e5e7eb;
      }
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <h1>¡Bienvenido a EventHub Pro!</h1>
      </div>
      
      <div class="content">
        <div class="welcome-text">
          ¡Hola ${user.firstName}! 👋
        </div>
        
        <p class="message">
          Nos alegra mucho darte la bienvenida a EventHub Pro, tu nueva plataforma para la gestión de eventos. 
          Has dado el primer paso para una experiencia única en la organización de eventos.
        </p>

        <div class="features-box">
          <div class="features-title">
            ✨ Con tu cuenta podrás:
          </div>
          <ul class="features-list">
            <li>🎯 Reservar eventos en las fechas disponibles de manera fácil y rápida</li>
            <li>📊 Gestionar todas tus reservaciones desde un solo lugar</li>
            <li>🔔 Recibir notificaciones importantes sobre tus eventos</li>
            <li>📱 Acceder a tu cuenta desde cualquier dispositivo</li>
            <li>💫 Y muchas más funcionalidades por descubrir...</li>
          </ul>
        </div>

        <p class="message">
          Para comenzar, simplemente inicia sesión con tu correo electrónico:
        </p>
        
        <div class="email-container">
          <div class="email-box monospace no-underline">
            ${user.email}
          </div>
        </div>

        <div class="button-container">
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login" class="button no-underline">
            <span class="button-text">Iniciar Sesión →</span>
          </a>
        </div>
      </div>

      <div class="footer">
        <p>¿Tienes alguna pregunta? No dudes en contactarnos.</p>
        <p>¡Gracias por confiar en nosotros! 🚀</p>
        <p style="font-weight: 600;">El equipo de EventHub Pro</p>
      </div>
    </div>
  </div>
</body>
</html>
`;