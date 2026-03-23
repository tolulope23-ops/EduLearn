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
  };


//Mark Submodule downloaded when the download button is clicked
    async markSubModuleDownloaded(studentId, submoduleId) {

        //Calls service download from submoduleProgressService
        const downloadSubModule = await this.submoduleProgressService.markSubmoduleDownloaded(studentId, submoduleId);
        
        return {
            message: 'Submodule Download Completed', 
            data: downloadSubModule
        };
    };


//Mark submodule completed when the completed button is clicked from the client
    async markSubModuleComplete(studentId, submoduleId) {

        //Calls service mark submodule complete from submoduleProgressService
        const markComplete = await this.submoduleProgressService.markSubmoduleCompleted(studentId, submoduleId);

        // Get module
        const submodule = await this.submoduleService.getSubmoduleById(submoduleId);

        const moduleId = submodule.moduleId;

        await this.moduleProgressService.calculateModuleProgress(studentId, moduleId);

        return {
            message: "Submodule marked complete",
            data: markComplete
        };
    };

};