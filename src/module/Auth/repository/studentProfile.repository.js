import { StudentProfile } from '../models/index.js';
import { handleSequelizeError } from '../../../common/error/sequeliseError.error.js';
import { RecordNotFoundError } from '../../../common/error/domainError.error.js';

export class StudentProfileRepository {

  // CREATE QUERY OPERATION
  async createStudentProfile(data) {
    try {
      const profile = await StudentProfile.create(data);
      return this.mapToUserProfileEntity(profile);
    } catch (error) {
      handleSequelizeError(error);
    }
  }

  // READ QUERY OPERATIONS
  async getProfileByUserId(userId) {
    try {
      const profile = await StudentProfile.findOne({ where: { userId } });
      return profile ? this.mapToUserProfileEntity(profile) : null;
    } catch (error) {
      handleSequelizeError(error);
    }
  };

  async getProfileByStudentId(id) {
    try {
      const profile = await StudentProfile.findByPk(id);
      return profile ? this.mapToUserProfileEntity(profile) : null;
    } catch (error) {
      handleSequelizeError(error);
    }
  };

  // UPDATE QUERY OPERATION
  async updateStudentProfile(userId, updateData) {
    try {
      const [affectedRows] = await StudentProfile.update(updateData, { where: { userId } });      

      if (affectedRows === 0) {
        throw new RecordNotFoundError("Student profile not found");
      }

      const updatedProfile = await this.getProfileByUserId(userId);
      return updatedProfile;
    } catch (error) {
      handleSequelizeError(error);
    }
  };

  // DELETE QUERY OPERATION
  async deleteStudentProfile(userId) {
    try {
      const affectedRows = await StudentProfile.destroy({ where: { userId } });

      if (affectedRows === 0) {
        throw new RecordNotFoundError("Student profile not found");
      }

      return true;
    } catch (error) {
      handleSequelizeError(error);
    }
  };

  // HELPER: Map Sequelize instance to domain entity
  mapToUserProfileEntity(profile) {
    if (!profile) return null;

    return {
      id: profile.id,
      userId: profile.userId,
      fullName: profile.fullName,
      location: profile.location,
      phoneNumber: profile.phoneNumber,
      dailyGoal: profile.dailyGoal,
      classLevelId: profile.classLevelId,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    };
  };
}