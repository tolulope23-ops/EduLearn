import { RecordNotFoundError } from "../../../common/error/domainError.error";
import { ModuleRepository } from "../repository/module.repository";
import { SubModuleRepository } from "../repository/subModule.repository";

export class SubModuleService {
    /**
     * @param {SubModuleRepository} subModuleRepo 
     * @param {ModuleRepository} moduleRepo
     */

    constructor(subModuleRepo, moduleRepo){
        this.subModuleRepo = subModuleRepo;
        this.moduleRepo = moduleRepo
    };

    async createsubModule({ moduleId, title, type, contentText, contentUrl, downloadable, contentSize, sequenceNumber }) {
        const module = await this.moduleRepo.getModuleById(moduleId);
        if (!module) 
            throw new RecordNotFoundError("Module not found");

        const data = {
            moduleId,
            title,
            type,
            contentText,
            contentUrl,
            downloadable,
            contentSize,
            sequenceNumber
        };

        return await this.subModuleRepo.createSubmodule(data);
    };
    

    async getSubmoduleById(subModuleId) {
        const subModule = await this.subModuleRepo.getSubmoduleById(subModuleId);

        if (!subModule) 
            throw new RecordNotFoundError("SubModule not found");

        return subModule;
    };


    async getSubmodulesByModule(moduleId) {
        const module = await this.moduleRepo.getModuleById(moduleId);

        if (!module) 
            throw new RecordNotFoundError("Module not found");

        return await this.subModuleRepo.getSubmodulesByModule(moduleId);
    };


    async getSubmoduleBySequence(moduleId, sequenceNumber) {
        const subModule = await this.subModuleRepo.getSubmoduleBySequence(moduleId, sequenceNumber);

        if (!subModule) 
            throw new RecordNotFoundError("SubModule not found");

        return subModule;
    };


    async updateSubmodule(subModuleId, updateData) {
        const subModule = await this.subModuleRepo.getSubmoduleById(subModuleId);

        if (!subModule) 
            throw new RecordNotFoundError("SubModule not found");

        return await this.subModuleRepo.updateSubmodule(subModuleId, updateData);
    };


    async deleteSubmodule(subModuleId) {
        const subModule = await this.subModuleRepo.getSubmoduleById(subModuleId);
        if (!subModule) 
            throw new RecordNotFoundError("SubModule not found");

        return await this.subModuleRepo.deleteSubmodule(subModuleId);
    };
};