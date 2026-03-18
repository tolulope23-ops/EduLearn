import express from "express";
const router = express.Router();

import { LessonControllerInstance } from "../container.js";
import validateRequest from "../../../common/middleware/validation.middleware.js";
import { createLessonSchema, updateLessonSchema } from "../validation/Lesson.validation.js";


router.post("/create", validateRequest(createLessonSchema), LessonControllerInstance.createLesson);

router.get("/all", LessonControllerInstance.getAllLessons);  //Get all Lesson for a student

router.get("/:lessonId", LessonControllerInstance.getLesson);  //Get Lesson By Id

router.get("/sequence/find", LessonControllerInstance.getLessonBySequence);

router.patch("/:lessonId", validateRequest(updateLessonSchema), LessonControllerInstance.updateLesson);

router.delete("/:lessonId", LessonControllerInstance.deleteLesson);


export default router;