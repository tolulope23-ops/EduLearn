import SubModule from "../models/subModule.model.js";
import { handleSequelizeError } from "../../../common/error/sequeliseError.error.js";
import { RecordNotFoundError } from "../../../common/error/domainError.error.js";

export class SubModuleRepository {

  async createSubmodule(data) {
    try {
      const submodule = await SubModule.create(data);
      return this.mapToSubModuleEntity(submodule);
    } catch (error) {
      handleSequelizeError(error);
    }
  };


  async updateSubmodule(id, data) {
    try {
      const [affectedRows] = await SubModule.update(data, { where: { id } });

      if (affectedRows === 0) {
        throw new RecordNotFoundError("Submodule not found");
      }

      const updatedSubmodule = await SubModule.findByPk(id);
      return this.mapToSubModuleEntity(updatedSubmodule);
    } catch (error) {
      handleSequelizeError(error);
    }
  };



  async deleteSubmodule(id) {
    try {
      const deletedRows = await SubModule.destroy({ where: { id } });

      if (deletedRows === 0) {
        throw new RecordNotFoundError("Submodule not found");
      }

      return true;
    } catch (error) {
      handleSequelizeError(error);
    }
  };


  async getSubmoduleById(id) {
    try {
      const submodule = await SubModule.findByPk(id);
      return submodule ? this.mapToSubModuleEntity(submodule) : null;
    } catch (error) {
      handleSequelizeError(error);
    }
  };


  async getAllSubmodules() {
    try {
      const submodules = await SubModule.findAll({
        order: [["sequenceNumber", "ASC"]],
      });

      return submodules.map((submodule) => this.mapToSubModuleEntity(submodule));
      
    } catch (error) {
      handleSequelizeError(error);
    }
  };


  async getSubmodulesByModule(moduleId) {
    try {
      const submodules = await SubModule.findAll({
        where: { moduleId },
        order: [["sequenceNumber", "ASC"]],
      });

      return submodules.map((submodule) => this.mapToSubModuleEntity(submodule));
    } catch (error) {
      handleSequelizeError(error);
    }
  };


  async getSubmoduleBySequence(moduleId, sequenceNumber) {
    try {
      const submodule = await SubModule.findOne({
        where: { moduleId, sequenceNumber },
      });

      return submodule ? this.mapToSubModuleEntity(submodule) : null;
    } catch (error) {
      handleSequelizeError(error);
    }
  };
  

// HELPER: Map to Domain Entity
  mapToSubModuleEntity(submodule) {
    if (!submodule) return null;

    return {
      id: submodule.id,
      moduleId: submodule.moduleId,
      title: submodule.title,
      type: submodule.type,
      contentText: submodule.contentText ?? undefined,
      contentUrl: submodule.contentUrl ?? undefined,
      downloadable: submodule.downloadable,
      contentSize: submodule.contentSize ?? undefined,
      contentVersion: submodule.contentVersion,
      sequenceNumber: submodule.sequenceNumber,
      createdAt: submodule.createdAt,
      updatedAt: submodule.updatedAt,
    };
  }
}