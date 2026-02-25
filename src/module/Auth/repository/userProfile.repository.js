import {UserProfile} from '../models/index.js';
import { handleSequelizeError } from '../../../common/error/sequeliseError.error.js';
import { RecordNotFoundError } from '../../../common/error/domainError.error.js';

export class UserProfileRepository {

  // CREATE QUERY OPERATION
  async createUserProfile(data) {
    try {
      const profile = await UserProfile.create(data);
      return this.mapToUserProfileEntity(profile);
    } catch (error) {
      handleSequelizeError(error);
    }
  }

  // READ QUERY OPERATIONS
  async getProfileByUserId(userId) {
    try {
      const profile = await UserProfile.findOne({ where: { userId } });
      return profile ? this.mapToUserProfileEntity(profile) : null;
    } catch (error) {
      handleSequelizeError(error);
    }
  }

  async getProfileById(id) {
    try {
      const profile = await UserProfile.findByPk(id);
      return profile ? this.mapToUserProfileEntity(profile) : null;
    } catch (error) {
      handleSequelizeError(error);
    }
  }

  // UPDATE QUERY OPERATION
  async updateUserProfile(userId, updateData) {
    try {
      const [affectedRows] = await UserProfile.update(updateData, { where: { userId } });

      if (affectedRows === 0) {
        throw new RecordNotFoundError("User profile not found");
      }

      const updatedProfile = await this.getProfileByUserId(userId);
      return updatedProfile;
    } catch (error) {
      handleSequelizeError(error);
    }
  }

  // DELETE QUERY OPERATION
  async deleteUserProfile(userId) {
    try {
      const affectedRows = await UserProfile.destroy({ where: { userId } });

      if (affectedRows === 0) {
        throw new RecordNotFoundError("User profile not found");
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
  }
}