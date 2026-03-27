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

export async function sendWelcomeEmail(to:string, name:string):Promise<boolean>{
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