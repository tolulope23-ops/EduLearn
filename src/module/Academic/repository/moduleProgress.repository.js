import ModuleProgress from "../models/moduleProgress.model.js";
import { handleSequelizeError } from "../../../common/error/sequeliseError.error.js";
import { RecordNotFoundError } from "../../../common/error/domainError.error.js";

export class ModuleProgressRepository {

  // CREATE or INIT progress
  async createModuleProgress(data) {
    try {
      const progress = await ModuleProgress.create(data);
      return this.mapToEntity(progress);
    } catch (error) {
      handleSequelizeError(error);
    }
  }

  // UPDATE progress (completed, score, attemptCount, completionDate)
  async updateModuleProgress(studentId, moduleId, data) {
    try {
      const [affectedRows] = await ModuleProgress.update(data, {
        where: { studentId, moduleId },
      });

      if (affectedRows === 0) {
        throw new RecordNotFoundError("ModuleProgress not found");
      }

      const updatedProgress = await ModuleProgress.findOne({ where: { studentId, moduleId } });
      return this.mapToEntity(updatedProgress);
    } catch (error) {
      handleSequelizeError(error);
    }
  }

  // GET progress by student + module
  async getModuleProgress(studentId, moduleId) {
    try {
      const progress = await ModuleProgress.findOne({ where: { studentId, moduleId } });
      return progress ? this.mapToEntity(progress) : null;
    } catch (error) {
      handleSequelizeError(error);
    }
  }

  // GET all progress for a student
  async getAllModuleProgressByStudent(studentId) {
    try {
      const progressRecords = await ModuleProgress.findAll({ where: { studentId } });
      return progressRecords.map(this.mapToEntity);
    } catch (error) {
      handleSequelizeError(error);
    }
  }

  // DELETE a module progress record
  async deleteModuleProgress(studentId, moduleId) {
    try {
      const deletedRows = await ModuleProgress.destroy({ where: { studentId, moduleId } });
      if (!deletedRows) throw new RecordNotFoundError("ModuleProgress not found");
      return true;
    } catch (error) {
      handleSequelizeError(error);
    }
  }

  // HELPER
  mapToEntity(progress) {
    if (!progress) return null;

    return {
      studentId: progress.studentId,
      moduleId: progress.moduleId,
      completed: progress.completed,
      score: progress.score ?? undefined,
      attemptCount: progress.attemptCount,
      completionDate: progress.completionDate ?? undefined,
      createdAt: progress.createdAt,
      updatedAt: progress.updatedAt,
    };
  }
}