import { ModuleProgressService } from "./moduleProgress.service.js";
import { SubModuleService } from "./subModule.service.js";
import { SubmoduleProgressService } from "./subModuleProgress.service.js";

export class LearningProgress{
    /**
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
    
    const moduleProgress = await this.moduleProgressService.getModuleProgress(studentId, moduleId);

    if (!moduleProgress) 
        throw new RecordNotFoundError("Module progress not found");

    return moduleProgress;
  };

  // Get a student's progress on a submodule
  async getSubmoduleProgress(studentId, submoduleId) {
    const submoduleProgress = await this.submoduleProgressService.getSubmoduleProgress(studentId, submoduleId);

    if (!submoduleProgress) 
        throw new RecordNotFoundError("Submodule progress not found");

    return submoduleProgress;
  }


//Mark submodule completed when the completed button is clicked from the client
    async markSubModuleComplete(studentId, submoduleId) {
        //Ensure submodule progress exists
        let submoduleProgress;

        try {
            submoduleProgress = await this.submoduleProgressService.getSubmoduleProgress(studentId, submoduleId);
        } catch (error) {
            submoduleProgress = await this.submoduleProgressService.initSubmoduleProgress(studentId, submoduleId);
        }

        // Mark submodule as completed
        await this.submoduleProgressService.updateSubmoduleProgress(
            studentId,
            submoduleId,
            { completed: true }
        );

        // Get module
        const submodule = await this.submoduleService.getSubmoduleById(submoduleId);
        const moduleId = submodule.moduleId;

        // Ensure module progress exists
        let moduleProgress;

        try {
            moduleProgress = await this.moduleProgressService.getModuleProgress(studentId, moduleId);
        } catch (error) {
            moduleProgress = await this.moduleProgressService.initModuleProgress(studentId, moduleId);
        }

        // Get all submodules
        const submodules = await this.submoduleService.getSubmodulesByModule(moduleId);

        // Get progress list
        const progressList = await Promise.all(
            submodules.map(sm =>
                this.submoduleProgressService.getSubmoduleProgress(studentId, sm.id)
                    .catch(() => null)
            )
        );

        // Calculate progress
        const completedCount = progressList.filter(p => p && p.completedAt !== null).length;
        const totalCount = submodules.length;

        const moduleProgressPercent = Math.floor((completedCount / totalCount) * 100);

        // Update module progress
        const progress = await this.moduleProgressService.updateModuleProgress(
            studentId,
            moduleId,
            {
                progress: moduleProgressPercent,
                score: submoduleProgress.score,
                completed: moduleProgressPercent === 100,
                completionDate: moduleProgressPercent === 100 ? new Date() : null
            }
        );

        return {
            message: "Submodule marked complete and module updated",
            data: progress
        };
    };

};