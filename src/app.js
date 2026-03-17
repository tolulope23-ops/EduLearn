import express from 'express';
import cookieParser from "cookie-parser";

import { corsMiddleware } from './common/config/cors.config.js';

import errorHandler from './common/middleware/errorHandler.middleware.js';

//Student Routes
import authRoutes from './module/Auth/routes/auth.route.js';
import profileRoutes from './module/Auth/routes/studentProfile.route.js';

//Admin Routes
import adminRoutes from './common/config/admin.js';
import lessonRoutes from './module/Academic/routes/lesson.routes.js';
import moduleRoutes from './module/Academic/routes/module.route.js'
import submoduleRoutes from './module/Academic/routes/submodule.routes.js';
import quizRoutes from './module/Academic/routes/quiz.routes.js';



const app = express();

app.use(corsMiddleware);
app.use(cookieParser());
app.use(express.json());

//Admin
app.use('/admin', adminRoutes);
app.use('/api/v1/lesson', lessonRoutes);
app.use('/api/v1/module', moduleRoutes);
app.use('/api/v1/submodule', submoduleRoutes);
app.use('/api/v1/submodule/quiz', quizRoutes);


//Student
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/profile', profileRoutes);


app.get('/', (req, res) => {
  res.send('App is healthy');
});

app.use(errorHandler);

export default app;