import express from "express";

import { authMiddleware } from "../../Auth/container.js";
import { studentCourseControllerInstance } from "../container.js";
import { studentCourseSchema } from "../validation/studentCourse.validation.js";
import validateRequest from "../../../common/middleware/validation.middleware.js";

  const router = express.Router();

  router.use(authMiddleware.authenticate());

// Assign courses to student
  router.post("/assign", validateRequest(studentCourseSchema), studentCourseControllerInstance.assignCourseToStudent);

export default router;


