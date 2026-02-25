import { UserProfileRepository } from '../repository/userProfile.repository.js';
import { ClassLevelRepository } from '../../academic/repositories/classLevel.repository.js';
import { RecordNotFoundError, InvalidReferenceError } from '../../../common/error/domainError.error.js';

export class UserProfileService {
  /**
   * @param {UserProfileRepository} userProfileRepo
   * @param {ClassLevelRepository} classLevelRepo
   */
  constructor() {
    this.userProfileRepo = new UserProfileRepository();
    this.classLevelRepo = new ClassLevelRepository();
  }

  async createUserProfile(userId, profileData) {
    // Validate classLevelId exists
    const classLevel = await this.classLevelRepo.getClassLevelById(profileData.classLevelId);
    if (!classLevel) {
      throw new InvalidReferenceError('Invalid class level selected');
    }

    const data = {
      userId,
      fullName: profileData.fullName,
      location: profileData.location,
      phoneNumber: profileData.phoneNumber || null,
      dailyGoal: profileData.dailyGoal || null,
      classLevelId: profileData.classLevelId,
    };

    return await this.userProfileRepo.createUserProfile(data);
  };

  /** GET PROFILE BY USER ID */
  async getProfileByUserId(userId) {
    const profile = await this.userProfileRepo.getProfileByUserId(userId);
    if (!profile) throw new RecordNotFoundError('User profile not found');
    return profile;
  }

  /** UPDATE USER PROFILE */
  async updateUserProfile(userId, updateData) {
    // Validate classLevelId if being updated
    if (updateData.classLevelId) {
      const classLevel = await this.classLevelRepo.getClassLevelById(updateData.classLevelId);
      if (!classLevel) {
        throw new InvalidReferenceError('Invalid class level selected');
      }
    }

    const updatedProfile = await this.userProfileRepo.updateUserProfile(userId, updateData);
    if (!updatedProfile) throw new RecordNotFoundError('User profile not found');

    return updatedProfile;
  }

  /** DELETE PROFILE */
  async deleteUserProfile(userId) {
    const deleted = await this.userProfileRepo.deleteUserProfile(userId);
    if (!deleted) throw new RecordNotFoundError('User profile not found');
    return deleted;
  }
}