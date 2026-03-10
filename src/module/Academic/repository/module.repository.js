import Module from "../models/module.model.js";
import { handleSequelizeError } from "../../../common/error/sequeliseError.error.js";
import { RecordNotFoundError } from "../../../common/error/domainError.error.js";

export class ModuleRepository {

  // CREATE
  async createModule(data) {
    try {
      const module = await Module.create(data);
      return this.mapToModuleEntity(module);
    } catch (error) {
      handleSequelizeError(error);
    }
  };

  // UPDATE
  async updateModule(id, data) {
    try {
      const [affectedRows] = await Module.update(data, { where: { id } });

      if (affectedRows === 0) {
        throw new RecordNotFoundError("Module not found");
      }

      const updatedModule = await Module.findByPk(id);
      return this.mapToModuleEntity(updatedModule);
    } catch (error) {
      handleSequelizeError(error);
    }
  };

  // DELETE
  async deleteModule(id) {
    try {
      const deletedRows = await Module.destroy({ where: { id } });

      if (deletedRows === 0) {
        throw new RecordNotFoundError("Module not found");
      }

      return true;
    } catch (error) {
      handleSequelizeError(error);
    }
  };


  async getModuleById(id) {
    try {
      const module = await Module.findByPk(id);
      return module ? this.mapToModuleEntity(module) : null;
    } catch (error) {
      handleSequelizeError(error);
    }
  }


  async getAllModules() {
    const modules = await Module.findAll({
      order: [["sequenceNumber", "ASC"]],
    });

    return modules.map(module => this.mapToModuleEntity(module));
  };

  // GET MODULES BY LESSON
  async getModulesByLesson(lessonId) {
    try {
      const modules = await Module.findAll({
        where: { lessonId },
        order: [["sequenceNumber", "ASC"]],
      });

      return modules.map(module => this.mapToModuleEntity(module));
    } catch (error) {
      handleSequelizeError(error);
    }
  };

  // GET MODULE BY SEQUENCE
  async getModuleBySequence(lessonId, sequenceNumber) {
    try {
      const module = await Module.findOne({
        where: { lessonId, sequenceNumber },
      });

      return module ? this.mapToModuleEntity(module) : null;
    } catch (error) {
      handleSequelizeError(error);
    }
  };

  // HELPER
  mapToModuleEntity(modules) {
    if (!modules) return null;

    return {
      id: modules.id,
      lessonId: modules.lessonId,
      title: modules.title,
      description: modules.description ?? undefined,
      sequenceNumber: modules.sequenceNumber,
      createdAt: modules.createdAt,
      updatedAt: modules.updatedAt,
    };
  }
}