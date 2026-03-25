import { RecordNotFoundError } from "../../../common/error/domainError.error.js";
import { StudentProfileRepository } from "../../Auth/repository/studentProfile.repository.js";
import { ModuleProgressService } from "./moduleProgress.service.js";
import { SubModuleService } from "./subModule.service.js";
import { SubmoduleProgressService } from "./subModuleProgress.service.js";

export class LearningSyncService{
    /**
     * @param {SubmoduleProgressService} submoduleProgressService
     * @param {StudentProfileRepository} studentProfileRepo
     * @param {ModuleProgressService} moduleProgressService
     * @param {SubModuleService} submoduleService
     */

        constructor(submoduleProgressService, studentProfileRepo, moduleProgressService, submoduleService){
            this.submoduleProgressService = submoduleProgressService;
            this.studentProfileRepo = studentProfileRepo;
            this.moduleProgressService = moduleProgressService;
            this.submoduleService = submoduleService;
        };

//Sync progress between local frontend and BE    
    async syncProgress(userId, progressArray) {
        if (!Array.isArray(progressArray) || progressArray.length === 0) {
            throw new Error("No progress data provided");
        };

        const studentId = await this.studentProfileRepo.getStudentIdByUserId(userId);

        const results = [];
        const errors = [];

        // Keep track of which modules we need to recalc (avoid duplicates)
        const modulesToRecalc = new Set();

        for (const record of progressArray) {
            try {
                const { submoduleId, completed, score} = record;

                if (!submoduleId) {
                    throw new RecordNotFoundError("submoduleId is required");
                };

                // Get submodule (needed for type and moduleId)
                const submodule = await this.submoduleService.getSubmoduleById(submoduleId);

                if (!submodule) {
                    throw new RecordNotFoundError("Submodule not found");
                };


                // Update submodule progress
                const updateData = {
                    ...(completed !== undefined && { completedAt: completed ? new Date() : null }),
                    ...(score !== undefined && { score }),
                };

                const updatedSubmodule = await this.submoduleProgressService.updateSubmoduleProgress(
                    studentId,
                    submoduleId,
                    updateData
                );

                // Track module for recalculation
                if (submodule.moduleId) {
                    modulesToRecalc.add(submodule.moduleId);
                };

                results.push({
                    submoduleId,
                    status: "synced",
                    data: updatedSubmodule.data
                });

            } catch (error) {
                errors.push({
                    submoduleId: record.submoduleId,
                    status: "failed",
                    message: error.message
                });
            }
        }

        // Recalculate module progress for all affected submodules have been updated
        for (const moduleId of modulesToRecalc) {
            try {
                await this.moduleProgressService.calculateModuleProgress(studentId, moduleId);
            } catch (error) {
                errors.push({
                    moduleId,
                    status: "failed",
                    message: `Module recalculation failed: ${error.message}`
                });
            }
        };

        return {
            message: "Sync completed",
            totalDataUpdated: progressArray.length,
            dataUpdated: results,
            errors
        };
    };

};