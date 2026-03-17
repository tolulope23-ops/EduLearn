import { ModuleProgressService } from "./moduleProgress.service.js";
import { SubModuleService } from "./subModule.service.js";
import { SubmoduleProgressService } from "./subModuleProgress.service.js";

export class LearningProgress{
    /**
     * 
     * @param {ModuleProgressService} moduleProgressService 
     * @param {SubmoduleProgressService} submoduleProgressService 
     * @param {SubModuleService} submoduleService
     */

    constructor(moduleProgressService,submoduleProgressService, submoduleService){
        this.moduleProgressService = moduleProgressService;
        this.submoduleProgressService = submoduleProgressService;
        this.submoduleService = submoduleService;
    };

// Get a student's progress on a module
    async getModuleProgress(studentId, moduleId) {
        return this.moduleProgressService.getModuleProgress(studentId, moduleId);
    };


// Get a student's progress on a submodule
    async getSubmoduleProgress(studentId, submoduleId) {
        return this.submoduleProgressService.getSubmoduleProgress(studentId, submoduleId);
    };

// Mark submodule as completed for a student
    async markSubModuleComplete(studentId, submoduleId) {
        await this.submoduleProgressService.markSubmoduleCompleted(studentId, submoduleId);

        //Find module, this submodule belongs to
        const submodule = await this.submoduleService.getSubmoduleById(submoduleId);

        if(!submodule)
            throw new RecordNotFoundError(`Submodule not found`);

        const moduleId = submodule.moduleId;

        //Get all submodules in the module
        const submodules = await this.submoduleService.getSubmodulesByModule(moduleId);

        //Check progress for each submodules
        const progressList = await Promise.all(
            submodules.map(submodule => 
                this.getSubmoduleProgress(studentId, submodule.id)
            )
        );
        
        //Count completed submodules
        const completedCount = progressList.filter(p => p && p.completed).length;
        const totalCount = submodules.length; 

        //Calculate progress percentage
        const moduleProgress = Math.floor((completedCount / totalCount) * 100);

        //Update module progress
        const progress = await this.moduleProgressService.updateModuleProgress(studentId, moduleId,
            {   
                progress: moduleProgress,
                completed: moduleProgress === 100, 
                completionDate: moduleProgress === 100 ? new Date() : null
            }
        );

        return {message: "Submodule marked completed, Module Progress: ", data: progress};
    };
}