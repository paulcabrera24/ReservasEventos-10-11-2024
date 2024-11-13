import dotenv from 'dotenv';
import { format } from 'date-fns';
import es from 'date-fns/locale/es/index.js';

dotenv.config();

export const getReservationTemplate = (data) => `
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

    .details-box {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 20px;
      margin: 24px 0;
    }

    .details-title {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .details-list {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .details-list li {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      margin-bottom: 12px;
      color: #4b5563;
      font-size: 14px;
      line-height: 1.4;
    }

    .important-box {
      background: #fef3c7;
      border: 1px solid #fcd34d;
      border-radius: 12px;
      padding: 20px;
      margin: 24px 0;
    }

    .important-title {
      color: #92400e;
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 8px;
    }

    .important-text {
      color: #92400e;
      font-size: 14px;
      line-height: 1.4;
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

      .details-box {
        padding: 16px;
      }

      .button {
        display: block;
        width: 100%;
        text-align: center;
        padding: 14px 20px;
      }
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <h1>¡Reserva Confirmada!</h1>
      </div>
      
      <div class="content">
        <div class="welcome-text">
          ¡Hola ${data.firstName}! 🎉
        </div>
        
        <p class="message">
          Tu reserva ha sido confirmada exitosamente. A continuación, te proporcionamos los detalles de tu evento:
        </p>

        <div class="details-box">
          <div class="details-title">
            📅 Detalles del Evento
          </div>
          <ul class="details-list">
            <li>📆 <strong>Fecha:</strong> ${format(data.eventDate, "EEEE d 'de' MMMM 'de' yyyy", { locale: es })}</li>
            <li>⏰ <strong>Horario:</strong> 8:00 PM - 11:00 PM</li>
            <li>🎫 <strong>Número de Reserva:</strong> #${data.reservationId}</li>
          </ul>
        </div>

        <div class="important-box">
          <div class="important-title">⚠️ Importante</div>
          <p class="important-text">
            Por favor, llega al menos 15 minutos antes del inicio del evento. 
            Si necesitas cancelar tu reserva, hazlo con al menos 24 horas de anticipación.
          </p>
        </div>

        <div class="button-container">
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/calendar" class="button">
            Ver Mis Reservas →
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