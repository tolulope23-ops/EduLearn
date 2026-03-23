import { SubmoduleProgressRepository } from "../repository/subModuleProgress.repository.js";
import { RecordNotFoundError } from "../../../common/error/domainError.error.js";

export class SubmoduleProgressService {
  /**
   * @param {SubmoduleProgressRepository} submoduleProgressRepo
   */
  constructor(submoduleProgressRepo) {
    this.submoduleProgressRepo = submoduleProgressRepo;
  };

// Initialize progress for a student on a submodule
    async initSubmoduleProgress(studentId, submoduleId) {
        const data = {
            studentId,
            submoduleId,
            completedAt: null,
            score: 0,
            downloadedAt: null,
        };

        return await this.submoduleProgressRepo.createSubModuleProgress(data);
    };


// Update progress (completion, score, downloaded)
    async updateSubmoduleProgress(studentId, submoduleId, progressData) {

        const updateData = {};

        //Update score if existing record exists
        if ("score" in progressData) {
            updateData.score = progressData.score;
        };

        // Handle completed timestamp
        if ("completed" in progressData) {
            updateData.completedAt = progressData.completed ? new Date() : null;
        };

        // Handle downloaded timestamp
        if ("downloaded" in progressData) {
           updateData.downloadedAt = progressData.downloaded ? new Date() : null;
        };

        if ("lastAttemptId" in progressData) {
            updateData.lastAttemptId = progressData.lastAttemptId;
        };

        // Upsert will create if missing or update if exists
        const updatedProgress = await this.submoduleProgressRepo.updateSubModuleProgress(
            studentId,
            submoduleId,
            updateData
        );

        return { Message: "Progress updated", data: updatedProgress};
    };


//Mark submodule downloaded
    async markSubmoduleDownloaded(studentId, submoduleId) {
        return await this.updateSubmoduleProgress(studentId, submoduleId, {
            downloaded: true,
        });
    };


//Mark submodule downloaded
    async markSubmoduleCompleted(studentId, submoduleId) {
        return await this.updateSubmoduleProgress(studentId, submoduleId, {
            completed: true,
        });
    };



// Get a student's progress for a specific submodule
    async getSubmoduleProgress(studentId, submoduleId) {
        const progress = await this.submoduleProgressRepo.getSubModuleProgress(studentId, submoduleId);

        if (!progress) 
            throw new RecordNotFoundError("Submodule progress not found");

        return progress;
    };


// Get all submodule progress for a student
    async getAllSubmoduleProgress(studentId) {
        return await this.submoduleProgressRepo.getAllSubModuleProgressByStudent(studentId);
    };


// Get all progress for a student within a module
    async getSubmoduleProgressByModule(studentId, moduleId) {
        return await this.submoduleProgressRepo.getSubModuleProgressByModule(studentId, moduleId);
    };
    

    // Get all progress for a student 
    async getAllSubmoduleProgress(studentId) {
        return await this.submoduleProgressRepo.getAllSubModuleProgressByStudent(studentId);
    };


// Delete a student's submodule progress
    async deleteSubmoduleProgress(studentId, submoduleId) {
        return await this.submoduleProgressRepo.deleteProgress(studentId, submoduleId);
    };
};