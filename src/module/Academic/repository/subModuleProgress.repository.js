import SubmoduleProgress from "../models/subModuleProgress.model.js";
import { handleSequelizeError } from "../../../common/error/sequeliseError.error.js";
import { RecordNotFoundError } from "../../../common/error/domainError.error.js";

export class SubmoduleProgressRepository {
  
  async createSubModuleProgress(data) {
    try {
      const progress = await SubmoduleProgress.create(data);
      return this.mapToSubModuleProgressEntity(progress);
    } catch (error) {
      handleSequelizeError(error);
    }
  };


// UPDATE progress (completed, score, downloaded, downloadedAt)
  async updateSubModuleProgress(studentId, submoduleId, data) {
    try {

      if (data.downloaded === true){
        data.downloadedAt = new Date();
      };

      const [affectedRows] = await SubmoduleProgress.update(data, {
        where: { studentId, submoduleId },
      });

      if (affectedRows === 0) {
        throw new RecordNotFoundError("SubmoduleProgress not found");
      };

      const updatedProgress = await SubmoduleProgress.findOne({ where: { studentId, submoduleId } });

      return this.mapToSubModuleProgressEntity(updatedProgress);

    } catch (error) {
      handleSequelizeError(error);
    };
  };


// GET progress by student and submodule
  async getSubModuleProgress(studentId, submoduleId) {
    try {
      const progress = await SubmoduleProgress.findOne({ where: { studentId, submoduleId } });
      return progress ? this.mapToSubModuleProgressEntity(progress) : null;
    } catch (error) {
      handleSequelizeError(error);
    }
  };


// GET all progress for a student
  async getAllSubModuleProgressByStudent(studentId) {
    try {
      const progressRecords = await SubmoduleProgress.findAll({ where: { studentId } });
      return progressRecords.map((progress) => this.mapToSubModuleProgressEntity(progress));
    } catch (error) {
      handleSequelizeError(error);
    }
  };


// GET all progress for a module
  async getSubModuleProgressByModule(studentId, moduleId) {
    try {
      const progressRecords = await SubmoduleProgress.findAll({
        where: { studentId },
        include: [{
          association: 'submodule',
          where: { moduleId },
        }],
      });
      return progressRecords.map(progress => this.mapToSubModuleProgressEntity(progress));
    } catch (error) {
      handleSequelizeError(error);
    }
  };


// DELETE a submodule progress record
  async deleteProgress(studentId, submoduleId) {
    try {
      const deletedRows = await SubmoduleProgress.destroy({ where: { studentId, submoduleId } });
      if (!deletedRows) throw new RecordNotFoundError("SubmoduleProgress not found");
      return true;
    } catch (error) {
      handleSequelizeError(error);
    }
  };
  

// HELPER: Map to Domain Entity
  mapToSubModuleProgressEntity(progress) {
    if (!progress) return null;

    return {
      studentId: progress.studentId,
      submoduleId: progress.submoduleId,
      completed: progress.completed,
      score: progress.score ?? undefined,
      downloaded: progress.downloaded,
      downloadedAt: progress.downloadedAt ?? undefined,
      createdAt: progress.createdAt,
      updatedAt: progress.updatedAt,
    };
  }
}