import { SubmoduleProgressRepository } from "../repository/submoduleProgress.repository.js";
import { RecordNotFoundError } from "../../../common/error/domainError.error.js";

export class SubmoduleProgressService {
  /**
   * @param {SubmoduleProgressRepository} submoduleProgressRepo
   */
  constructor(submoduleProgressRepo) {
    this.submoduleProgressRepo = submoduleProgressRepo;
  }

// Initialize progress for a student on a submodule
    async initSubmoduleProgress(studentId, submoduleId) {
        const data = {
        studentId,
        submoduleId,
        completed: false,
        score: null,
        downloaded: false,
        downloadedAt: null,
        };

        return await this.submoduleProgressRepo.createSubModuleProgress(data);
    };


// Update progress (completion, score, downloaded)
    async updateSubmoduleProgress(studentId, submoduleId, progressData) {

        // progressData can include: completed, score, downloaded, downloadedAt
        const updatedProgress = await this.submoduleProgressRepo.updateSubModuleProgress(
            studentId,
            submoduleId,
            progressData
        );

        return updatedProgress;
    };

//Mark submodule downloaded when the download button is clicked from the client
    async markSubmoduleDownloaded(studentId, submoduleId) {
        return await this.updateSubmoduleProgress(studentId, submoduleId, {
            downloaded: true,
            downloadedAt: new Date()
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
}