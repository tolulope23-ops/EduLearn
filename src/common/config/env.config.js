import 'dotenv/config';  //importing .env

export const PORT = process.env.PORT;


//Email Configuration
export const MAIL_HOST = process.env.MAIL_HOST;
export const MAIL_PASSWORD = process.env.MAIL_PASSWORD;
export const MAIL_PORT = Number(process.env.MAIL_PORT);
export const MAIL_USER = process.env.MAIL_USER;


//Local Development
export const FRONTEND_URL = process.env.FRONTEND_URL;
export const JWT_SECRET = process.env.JWT_SECRET;