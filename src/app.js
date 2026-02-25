import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";

import errorHandler from './common/middleware/errorHandler.middleware.js';
import authRoutes from './module/Auth/routes/auth.route.js';
import adminRoutes from './module/Auth/routes/admin.route.js';

const app = express();

const allowedOrigins = [
  "http://localhost:3000", // dev frontend
  // "https://yourapp.com",   // production frontend
  // "https://admin.yourapp.com"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use('/api/v1/auth', authRoutes);
app.use('/admin', adminRoutes);

app.get('/', (req, res) => {
  res.send('App is healthy');
});

app.use(errorHandler);

export default app;