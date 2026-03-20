import express from "express";
import { authMiddleware } from "../../Auth/container.js";
import { learningProgressControllerInstance } from "../container.js";

const router = express.Router();

router.use(authMiddleware.authenticate());

router.get("/module", learningProgressControllerInstance.getModuleProgress);

router.get("/submodule", learningProgressControllerInstance.getSubmoduleProgress);

router.post("/mark-complete", learningProgressControllerInstance.markSubmoduleComplete);


export default router;