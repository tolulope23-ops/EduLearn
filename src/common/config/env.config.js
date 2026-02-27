import 'dotenv/config';  //importing .env

export const PORT = process.env.PORT || 4000;


//Email Configuration
export const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
export const SENDGRID_FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL


//Local Development
export const FRONTEND_URL = process.env.FRONTEND_URL;
export const JWT_SECRET = process.env.JWT_SECRET;


export const allowedOrigins = process.env.ALLOWED_ORIGINS
?.split(",")
  .map(origin => origin.trim()) || [];