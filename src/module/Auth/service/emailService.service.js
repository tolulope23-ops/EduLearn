import sgMail from "@sendgrid/mail";
import { SENDGRID_API_KEY, SENDGRID_FROM_EMAIL } from "../../../common/config/env.config.js";
import { verifyEmailTemplate } from "../template/emailVerification.template.js";
import { passwordResetTemplate } from "../template/passwordReset.template.js";

export class EmailService {
    constructor() {
    sgMail.setApiKey(SENDGRID_API_KEY);
  }

  /**
   * Send an email
   * @param {string} to - Recipient email
   * @param {string} subject - Email subject
   * @param {string} html - HTML content
   */

  async sendMail(to, subject, html) {
    try {
      await sgMail.send({
        to,
        from: SENDGRID_FROM_EMAIL,
        subject,
        html,
      });
    } catch (error) {
      console.error("Failed to send email:", error.response?.body || error.message);
      throw error;
    }
  };

  /**
   * Send verification email
   * @param {string} to
   * @param {"EMAIL_VERIFICATION"|"PASSWORD_RESET"} type
   * @param {string} token 
   */
  async sendVerification(to, type, token, name) {
    let subject, html;

    switch (type) {
      case "EMAIL_VERIFICATION":
        subject = "Verify your email";
        html = verifyEmailTemplate(token, name);
        break;
      case "PASSWORD_RESET":
        subject = "Reset your password";
        html = passwordResetTemplate(token, name);
        break;
      default:
        throw new Error("Unsupported email template type");
    }

    return this.sendMail(to, subject, html);
  }
}

// Export templates
export const emailTemplates = {
  EMAIL_VERIFICATION: verifyEmailTemplate,
  PASSWORD_RESET: passwordResetTemplate,
};