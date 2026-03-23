import ModuleProgress from "../models/moduleProgress.model.js";
import { handleSequelizeError } from "../../../common/error/sequeliseError.error.js";
import { RecordNotFoundError } from "../../../common/error/domainError.error.js";

export class ModuleProgressRepository {

  async createModuleProgress(data) {
    try {
      const progress = await ModuleProgress.create(data);
      return this.mapToModuleProgressEntity(progress);
    } catch (error) {
      handleSequelizeError(error);
    }
  };

  async incrementAttemptCount(studentId, moduleId){
    try {

      await ModuleProgress.increment(
        {
          attemptCount: 1
        },

        { where: {studentId, moduleId}}
      ); 

    } catch (error) {
      handleSequelizeError(error);
    };
  };

  
  // UPDATE progress (completed, score, completionDate)
  async updateModuleProgress(studentId, moduleId, data) {
    try {
      // Upsert: create if missing, update if exists
      const [progress, created] = await ModuleProgress.upsert(
        {
          studentId,
          moduleId,
          ...data,
        },
        {
          returning: true, // ensures we get the updated/created instance
        }
      );

      return this.mapToModuleProgressEntity(progress);
    } catch (error) {
      handleSequelizeError(error);
    }
  }


  // GET progress by student + module
  async getModuleProgress(studentId, moduleId) {
    try {
      const progress = await ModuleProgress.findOne({ where: { studentId, moduleId } });
      return progress ? this.mapToModuleProgressEntity(progress) : null;
    } catch (error) {
      handleSequelizeError(error);
    }
  };


  // GET all progress for a student
  async getAllModuleProgressByStudent(studentId) {
    try {
      const progressRecords = await ModuleProgress.findAll({ where: { studentId } });
      return progressRecords.map(progress => this.mapToModuleProgressEntity(progress));
    } catch (error) {
      handleSequelizeError(error);
    }
  };


  // DELETE a module progress record
  async deleteModuleProgress(studentId, moduleId) {
    try {
      const deletedRows = await ModuleProgress.destroy({ where: { studentId, moduleId } });
      if (!deletedRows) throw new RecordNotFoundError("ModuleProgress not found");
      return true;
    } catch (error) {
      handleSequelizeError(error);
    }
  };


  // HELPER
  mapToModuleProgressEntity(progress) {
    if (!progress) return null;

    return {
      studentId: progress.studentId,
      moduleId: progress.moduleId,
      progress: progress.progress ?? undefined,
      completed: progress.completed,
      score: progress.score ?? undefined,
      attemptCount: progress.attemptCount,
      completionDate: progress.completionDate ?? undefined,
      createdAt: progress.createdAt,
      updatedAt: progress.updatedAt,
    };
  }
};