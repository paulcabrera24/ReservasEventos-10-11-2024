import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { getEmailTemplate } from '../templates/welcome.js';
import { getReservationTemplate } from '../templates/reservation.js';

dotenv.config();

const createTransporter = () => {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASSWORD;

  if (!user || !pass) {
    console.warn('Credenciales de email no configuradas. Servicio de email deshabilitado.');
    return null;
  }

  console.log('Credenciales de email configuradas. Servicio de email habilitado.');

  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user,
      pass
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

const transporter = createTransporter();

export const sendWelcomeEmail = async (user) => {
  if (!transporter) {
    console.log('Servicio de email deshabilitado. Omitiendo email de bienvenida.');
    return;
  }

  try {
    const mailOptions = {
      from: `"EventHub Pro" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: '¡Bienvenido a EventHub Pro!',
      html: getEmailTemplate(user)
    };

    await transporter.sendMail(mailOptions);
    console.log('Email de bienvenida enviado a:', user.email);
  } catch (error) {
    console.error('Error al enviar email de bienvenida:', error);
    throw error;
  }
};

export const sendReservationConfirmationEmail = async (data) => {
  if (!transporter) {
    console.log('Servicio de email deshabilitado. Omitiendo email de confirmación de reserva.');
    return;
  }

  try {
    const mailOptions = {
      from: `"EventHub Pro" <${process.env.EMAIL_USER}>`,
      to: data.email,
      subject: '¡Reserva Confirmada! - EventHub Pro',
      html: getReservationTemplate(data)
    };

    await transporter.sendMail(mailOptions);
    console.log('Email de confirmación de reserva enviado a:', data.email);
  } catch (error) {
    console.error('Error al enviar email de confirmación de reserva:', error);
    throw error;
  }
};