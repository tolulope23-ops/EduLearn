import nodemailer from 'nodemailer';
import {MAIL_HOST, MAIL_PASSWORD, MAIL_USER, MAIL_PORT} from '../../../common/config/env.config.js';
import {verifyEmailTemplate} from '../template/emailVerification.template.js';
import {passwordResetTemplate} from '../template/passwordReset.template.js'

export class EmailService{

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: MAIL_HOST,
            port: MAIL_PORT,
            secure: false,
            auth: {
                user: MAIL_USER,
                pass: MAIL_PASSWORD,
            },
        });
    };

    async sendVerification(to, subject, html) {
        const mailOptions = {
            from: MAIL_USER,
            to,
            subject,
            html,
        };

    await this.transporter.sendMail(mailOptions);
  };
};

// Export templates
export const emailTemplates = {
  EMAIL_VERIFICATION: verifyEmailTemplate,
  PASSWORD_RESET: passwordResetTemplate,
};


