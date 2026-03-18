import express from "express";

import { submoduleControllerInstance } from "../container.js";
import validateRequest from "../../../common/middleware/validation.middleware.js";
import { createSubmoduleSchema } from "../validation/subModule.validation.js";

const router = express.Router();


router.post("/create", validateRequest(createSubmoduleSchema), submoduleControllerInstance.createSubModule);

router.get("/:subModuleId", submoduleControllerInstance.getSubModule);  // Get submodule by id  

router.get("/all/:moduleId", submoduleControllerInstance.getSubModulesByModule); //Get all Submodules in a module

// Get submodule by sequence
router.get("/sequence/find", submoduleControllerInstance.getSubModuleBySequence);

// Update submodule
router.patch("/:subModuleId", validateRequest(createSubmoduleSchema), submoduleControllerInstance.updateSubModule);

// Delete submodule
router.delete("/:subModuleId", submoduleControllerInstance.deleteSubModule);


export default router;