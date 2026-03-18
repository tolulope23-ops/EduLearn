import express from "express";
import { moduleControllerInstance } from "../container.js";
import validateRequest from "../../../common/middleware/validation.middleware.js";
import { createModuleSchema, updateModuleSchema } from "../validation/module.validation.js";

const router = express.Router();

router.post("/create", validateRequest(createModuleSchema), moduleControllerInstance.createModule);

router.get("/:moduleId", moduleControllerInstance.getModule); //Get a single module in a lesson

router.get("/all/:lessonId", moduleControllerInstance.getModulesByLesson); //Get all module in a lesson

router.get("/sequence/find", moduleControllerInstance.getModuleBySequence);

router.patch("/:moduleId", validateRequest(updateModuleSchema), moduleControllerInstance.updateModule);

router.delete("/:moduleId", moduleControllerInstance.deleteModule);

export default router;