import { RecordNotFoundError } from "../../../common/error/domainError.error";
import { LessonRepository } from "../repository/lesson.repository";
import { ModuleRepository } from "../repository/module.repository";

export class ModuleService{
    /**
     * @param {LessonRepository} lessonRepo
     * @param {ModuleRepository} moduleRepo
     */

    constructor(lessonRepo, moduleRepo){
        this.lessonRepo = lessonRepo;
        this.moduleRepo = moduleRepo;
    };

    async createModule({lessonId, title, description, sequenceNumber }) {
        const lesson = await this.lessonRepo.getLessonById(lessonId);

        if (!lesson)
            throw new RecordNotFoundError("Lesson not found");

        const data = {
            lessonId,
            title,
            description,
            sequenceNumber
        };

        return await this.moduleRepo.createModule(data);
    };


    async getModule(moduleId) {

        const module = await this.moduleRepo.getModuleById(moduleId);

        if (!module)
            throw new RecordNotFoundError("Module not found");

        return module;
    };


    async getModulesByLesson(lessonId) {

        const lesson = await this.lessonRepo.getLessonById(lessonId);

        if (!lesson)
            throw new RecordNotFoundError("Lesson not found");

        return await this.moduleRepo.getModulesByLesson(lessonId);
    };


    async getModuleBySequence(lessonId, sequenceNumber) {

        const module = await this.moduleRepo.getModuleBySequence(
            lessonId,
            sequenceNumber
        );

        if (!module)
            throw new RecordNotFoundError("Module not found");

        return module;
    };


    async updateModule(moduleId, updateData) {

        const module = await this.moduleRepo.getModuleById(moduleId);

        if (!module)
            throw new RecordNotFoundError("Module not found");

        return await this.moduleRepo.updateModule(moduleId, updateData);
    };


    async deleteModule(moduleId) {

        const module = await this.moduleRepo.getModuleById(moduleId);

        if (!module)
            throw new RecordNotFoundError("Module not found");

        return await this.moduleRepo.deleteModule(moduleId);
    };
};