import { SubmoduleProgressRepository } from "../repository/submoduleProgress.repository.js";
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
        const existing = await this.submoduleProgressRepo.getSubModuleProgress(
            studentId, submoduleId
        );

        if (!existing)
            throw new RecordNotFoundError("Submodule progress not found");

        const updateData = { ...progressData };

        //Only update score if new score is higher
        if ("score" in progressData) {
            if (existing.score !== null && progressData.score <= existing.score) {
                delete updateData.score;
            };
        };
        
       // Set or clear completion timestamp based on completed boolean
        if ("completed" in progressData) {
            if (progressData.completed === true && !existing.completedAt) {
                updateData.completedAt = new Date();
            } else if (progressData.completed === false) {
                updateData.completedAt = null;
            };
        };

        // Set or clear download timestamp based on downloaded boolean
        if ("downloaded" in progressData) {
            if (progressData.downloaded === true && !existing.downloadedAt) {
                updateData.downloadedAt = new Date();
            } else if (progressData.downloaded === false) {
                updateData.downloadedAt = null;
            };
        };

        // Set download timestamp only the first time
        if ("downloaded" in progressData && progressData.downloaded === true && !existing.downloadedAt) {
            updateData.downloadedAt = new Date();
        };

        // // If nothing to update, return existing
        // if (Object.keys(updateData).length === 0) return existing;

        // progressData can include: completed, score, downloaded, downloadedAt
        const updatedProgress = await this.submoduleProgressRepo.updateSubModuleProgress(
            studentId,
            submoduleId,
            updateData
        );

        return {Message: 'Progress updated', data: updatedProgress};
    };

//Mark submodule downloaded when the download button is clicked from the client
    async markSubmoduleDownloaded(studentId, submoduleId) {
        return await this.updateSubmoduleProgress(studentId, submoduleId, {
            downloaded: true,
        });
    };

//Mark submodule completed when the completed button is clicked from the client
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


// Delete a student's submodule progress
    async deleteSubmoduleProgress(studentId, submoduleId) {
        return await this.submoduleProgressRepo.deleteProgress(studentId, submoduleId);
    };
};