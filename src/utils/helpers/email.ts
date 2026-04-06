import transporter, { EMAIL_FROM } from "../../config/emailConfig";
import logger from "../../config/loggerConfig";
import { EmailOptions } from "../../types";

export async function sendMail(options: EmailOptions): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: EMAIL_FROM,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });
    logger.info(`Email sent to ${options.to}: ${options.subject}`);
    return true;
  } catch (error: any) {
    logger.error(`Failed to send email to ${options.to}`, {
      error: error.message,
    });
    return false;
  }
}

export async function sendWelcomeEmail(
  to: string,
  name: string,
): Promise<boolean> {
  return sendMail({
    to,
    subject: "Welcome to Hospital Management System",
    html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Welcome, ${name}!</h2>
        <p>Thank you for registering with our Hospital Management System.</p>
        <p>Your account has been created successfully. You can now log in and access our services.</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb;" />
        <p style="color: #6b7280; font-size: 0.875rem;">
          This is an automated message. Please do not reply.
        </p>
      </div>
        `,
  });
}

export async function sendAppointmentConfirmation(
  to: string,
  patientName: string,
  doctorName: string,
  date: string,
  time: string,
): Promise<boolean> {
  return sendMail({
    to,
    subject: "Appointment Confirmed",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Appointment Confirmed</h2>
        <p>Dear ${patientName},</p>
        <p>Your appointment has been confirmed with the following details:</p>
        <table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
          <tr><td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Doctor</strong></td><td style="padding: 8px; border: 1px solid #e5e7eb;">Dr. ${doctorName}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Date</strong></td><td style="padding: 8px; border: 1px solid #e5e7eb;">${date}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Time</strong></td><td style="padding: 8px; border: 1px solid #e5e7eb;">${time}</td></tr>
        </table>
        <p>Please arrive 15 minutes before your scheduled time.</p>
      </div>
    `,
  });
}

export async function sendPaymentReceiptEmail(
  to: string,
  patientName: string,
  amount: number,
  transactionId: string,
  date: string,
): Promise<boolean> {
  return sendMail({
    to,
    subject: "Payment Receipt — Hospital Management",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Payment Receipt</h2>
        <p>Dear ${patientName},</p>
        <p>Your payment has been received successfully.</p>
        <table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
          <tr><td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Amount</strong></td><td style="padding: 8px; border: 1px solid #e5e7eb;">₹${(amount / 100).toFixed(2)}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Transaction ID</strong></td><td style="padding: 8px; border: 1px solid #e5e7eb;">${transactionId}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Date</strong></td><td style="padding: 8px; border: 1px solid #e5e7eb;">${date}</td></tr>
        </table>
      </div>
    `,
  });
}
