import express from "express";
import { authMiddleware } from "../../Auth/container.js";
import { learningSyncControllerInstance } from "../container.js";

const router = express.Router();

router.use(authMiddleware.authenticate());


router.post("/sync", learningSyncControllerInstance.syncProgress);


export default router;