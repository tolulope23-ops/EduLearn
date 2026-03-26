import { RecordNotFoundError } from "../../../common/error/domainError.error.js";
import {ModuleProgressRepository} from "../repository/moduleProgress.repository.js";
import { SubModuleService } from "./subModule.service.js";
import { SubmoduleProgressService } from "./subModuleProgress.service.js";

export class ModuleProgressService{
    /**
     * @param {ModuleProgressRepository} moduleProgressRepo
     * @param {SubModuleService} submoduleService
     * @param {SubmoduleProgressService} submoduleProgressService
     */

    constructor(moduleProgressRepo, submoduleService, submoduleProgressService) {
        this.moduleProgressRepo = moduleProgressRepo;
        this.submoduleService = submoduleService;
        this.submoduleProgressService = submoduleProgressService;
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

    
    async calculateModuleProgress(studentId, moduleId) {

        // Get all submodules in module
        const submodules = await this.submoduleService.getSubmodulesByModule(moduleId);

        const total = submodules.length;

        // Get all progress for the student
        const allProgress = await this.submoduleProgressService.getAllSubmoduleProgress(studentId);

        // Filter progress for only submodules in this module and return an array of objects of submodules
        const submoduleIds = submodules.map(sm => sm.id);

        //Filter submodules belonging to a student in a particular module
        const progressList = allProgress.filter(p => submoduleIds.includes(p.submoduleId));

        // Only consider quiz submodules for score
        const quizSubmodules = submodules.filter(sm => sm.type === 'quiz');
        
        //Get the submodule of type quiz Id
        const quizSubmoduleIds = quizSubmodules.map(sm => sm.id);


        const quizScores = progressList
        .filter(p => quizSubmoduleIds.includes(p.submoduleId))
        .map(p => p.score)
        .filter(score => score !== undefined && score !== null);


        const moduleScore = quizScores.length ? quizScores[quizScores.length -1] : 0;
        
        const completedCount = progressList.filter(p => p.completed).length;

        const percentage = Math.floor((completedCount / total) * 100);

        // Update module progress
        await this.updateModuleProgress(studentId, moduleId, {
            progress: percentage,
            score: moduleScore,
            completed: percentage === 100,
            completedAt: percentage === 100 ? new Date() : null
        });
    };


//Increment attempt if quiz failed and retaken
    async incrementAttemptCount(studentId, moduleId) {

        const progress = await this.moduleProgressRepo.getModuleProgress(studentId, moduleId);
        if(!progress)
            throw new RecordNotFoundError('Module not found');

        if(progress.attemptCount >= 3)
            throw new Error('Maximum attempt reached for this module');

        const attemptCount = await this.moduleProgressRepo.incrementAttemptCount(studentId, moduleId);

        return{ Message: 'Attempt Count incremented',  data: attemptCount}
    };


// Get a student's progress for a specific module
    async getModuleProgress(studentId, moduleId) {
        const progress = await this.moduleProgressRepo.getModuleProgress(studentId, moduleId);

        if (!progress) 
            throw new RecordNotFoundError("Module progress not found");

        return progress;
    };

//Get Submodule 


// Get all module progress for a student
    async getAllModuleProgress(studentId) {
        return await this.moduleProgressRepo.getAllModuleProgressByStudent(studentId);
    };
    

// Delete a student's module progress
    async deleteModuleProgress(studentId, moduleId) {
        return await this.moduleProgressRepo.deleteModuleProgress(studentId, moduleId);
    };
};