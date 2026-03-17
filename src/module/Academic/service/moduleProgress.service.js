import { RecordNotFoundError } from "../../../common/error/domainError.error.js";
import {ModuleProgressRepository} from "../repository/moduleProgress.repository.js";

export class ModuleProgressService{
    /**
     * @param {ModuleProgressRepository} moduleProgressRepo
     */

    constructor(moduleProgressRepo) {
        this.moduleProgressRepo = moduleProgressRepo;
    };

// Initialize progress for a student on a module
    async initModuleProgress(studentId, moduleId) {
        const data = {
            studentId,
            moduleId,
            progress: 0,
            completed: false,
            score: null,
            attemptCount: 0,
            completionDate: null,
        };

        return await this.moduleProgressRepo.createModuleProgress(data)
    };


// Update progress (completion, score, attempts)
    async updateModuleProgress(studentId, moduleId, progressData) {

        // progressData can contain: completed, progress, score, completionDate
        const updatedProgress = await this.moduleProgressRepo.updateModuleProgress(
            studentId,
            moduleId,
            progressData
        );

        return { Message: 'ModuleProgress Updated', data: updatedProgress };
    };


//Increment attempt if quiz failed and retaken
    async incrementAttemptCount(studentId, moduleId) {

        const progress = await this.moduleProgressRepo.getModuleProgress(studentId, moduleId);
        if(!progress)
            throw new RecordNotFoundError('Module not found');

        if(progress.attemptCount >= 3)
            throw new Error('Maximum attempt reached for this module');

        await this.moduleProgressRepo.incrementAttemptCount(studentId, moduleId);

        return{ Message: 'Attempt Count incremented',  data: progress}
    };


// Get a student's progress for a specific module
    async getModuleProgress(studentId, moduleId) {
        const progress = await this.moduleProgressRepo.getModuleProgress(studentId, moduleId);

        if (!progress) 
            throw new RecordNotFoundError("Module progress not found");

        return progress;
    };


// Get all module progress for a student
    async getAllModuleProgress(studentId) {
        return await this.moduleProgressRepo.getAllModuleProgressByStudent(studentId);
    };
    

// Delete a student's module progress
    async deleteModuleProgress(studentId, moduleId) {
        return await this.moduleProgressRepo.deleteModuleProgress(studentId, moduleId);
    };

};