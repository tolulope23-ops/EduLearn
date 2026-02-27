import express from 'express';
import cookieParser from "cookie-parser";

import { corsMiddleware } from './common/config/cors.config.js';
import errorHandler from './common/middleware/errorHandler.middleware.js';
import authRoutes from './module/Auth/routes/auth.route.js';
import profileRoutes from './module/Auth/routes/studentProfile.route.js';
import adminRoutes from './module/Auth/routes/admin.route.js';


const app = express();

app.use(corsMiddleware);
app.use(cookieParser());
app.use(express.json());

app.use('/api/v1/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/api/v1/profile', profileRoutes);

app.get('/', (req, res) => {
  res.send('App is healthy');
});

app.use(errorHandler);

export default app;