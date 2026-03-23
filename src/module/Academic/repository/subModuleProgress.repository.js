import SubmoduleProgress from "../models/subModuleProgress.model.js";
import SubModule from "../models/subModule.model.js";

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


// UPDATE or CREATE progress (upsert) progress (completed, score, downloaded, downloadedAt)
  async updateSubModuleProgress(studentId, submoduleId, data) {
    try {
      // upsert: creates if missing, updates if exists
      const [progress, created] = await SubmoduleProgress.upsert(
        { studentId, submoduleId, ...data },
        { returning: true }
      );

      return this.mapToSubModuleProgressEntity(progress);
    } catch (error) {
      handleSequelizeError(error);
    }
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
        include: [
          {
            model: SubModule,  
            as: 'submodule', 
            where: { moduleId },
            attributes: ['id', 'title', 'moduleId']
          }
        ]
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
      completed: progress.completedAt !== null,
      completedAt: progress.completedAt ?? undefined,
      score: progress.score ?? undefined,
      downloaded: progress.downloadedAt !== null,
      downloadedAt: progress.downloadedAt ?? undefined,
      lastAttemptId: progress.lastAttemptId,
      createdAt: progress.createdAt,
      updatedAt: progress.updatedAt,
    };
  };
};