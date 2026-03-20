import express from "express";

import { AIController } from "./ai.controller.js";

// import { authMiddleware } from "../../module/Auth/container.js";

const router = express.Router();

// router.use(authMiddleware.authenticate);


router.post("/chat", AIController.chat);

export default router;