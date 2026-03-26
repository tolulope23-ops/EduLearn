import express from "express";
import { authMiddleware } from "../../Auth/container.js";
import { learningProgressControllerInstance } from "../container.js";

const router = express.Router();

router.use(authMiddleware.authenticate());

router.get("/module/:moduleId", learningProgressControllerInstance.getModuleProgress);

router.get("/submodule/:submoduleId", learningProgressControllerInstance.getSubmoduleProgress);

router.post("/mark-complete", learningProgressControllerInstance.markSubmoduleComplete);

router.get("/download/:submoduleId", learningProgressControllerInstance.downloadSubmodule);

router.get("/:moduleId/completed-submodules", learningProgressControllerInstance.getCompletedSubmodulesByModule);


export default router;