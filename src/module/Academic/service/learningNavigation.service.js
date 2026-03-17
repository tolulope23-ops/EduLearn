import { LessonService } from "./lesson.service.js";
import { ModuleService } from "./module.service.js";
import { SubModuleService } from "./subModule.service.js";
import { SubmoduleProgressService } from "./subModuleProgress.service.js";

export class LearningNavigation{
    /**
     * @param {LessonService} lessonService 
     * @param {ModuleService} moduleService 
     * @param {SubModuleService} submoduleService 
     * @param {SubmoduleProgressService} submoduleProgressService
     */

    constructor(lessonService, moduleService, submoduleService, submoduleProgressService){
        this.lessonService = lessonService;
        this.moduleService = moduleService;
        this.submoduleService = submoduleService;
        this.submoduleProgressService = submoduleProgressService;
    };


//Next Lesson
    async getNextLesson(courseName, classLevelName, currentSequenceNumber) {

        const nextSequence = currentSequenceNumber + 1;

        return this.lessonService.getLessonBySequence(courseName, classLevelName, nextSequence);
    };


//Next Module
    async getNextModule(lessonId, currentSequenceNumber) {

        const nextSequence = currentSequenceNumber + 1;

        const module = await this.moduleService.getModuleBySequence(lessonId, nextSequence);

        if (!module)
            return { message: 'No more modules in this lesson'};

        return module;
    };


//Next SubModule
    async getNextSubmodule(moduleId, currentSequenceNumber) {

        const nextSequence = currentSequenceNumber + 1;

        const submodule = await this.submoduleService.getSubmoduleBySequence(moduleId, nextSequence);

        if (!submodule) 
            return { message: 'No more submodules in this module'};

        return submodule;
    };


    async getNextIncompleteSubmodule(studentId, lessonId) {

        //Get modules in lesson
        const modules = await this.moduleService.getModulesByLesson(lessonId);

        if (!modules || modules.length === 0)
            throw new RecordNotFoundError("No modules found for this lesson");

        for (const module of modules) {

            //Get submodules for module
            const submodules = await this.submoduleService.getSubmodulesByModule(module.id);

            for (const submodule of submodules) {

                //Check progress
                const progress = await this.submoduleProgressService.getSubmoduleProgress(
                    studentId,
                    submodule.id
                );

                //If not completed → return it
                if (!progress || !progress.completed) {
                    return {
                        lessonId,
                        moduleId: module.id,
                        submoduleId: submodule.id
                    };
                };
            };
        };

        //Everything completed
        
        return {
            message: "Lesson fully completed"
        };
    };
    
}