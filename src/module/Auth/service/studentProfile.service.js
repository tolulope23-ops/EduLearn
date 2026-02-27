import { StudentProfileRepository } from '../repository/studentProfile.repository.js';
import { RecordNotFoundError } from '../../../common/error/domainError.error.js';
import { ClassLevelRepository } from '../../Academic/repository/classLevel.repository.js';

export class StudentProfileService {
  /**
   * @param {StudentProfileRepository} studentProfileRepo
   * @param {ClassLevelRepository} classLevelRepo
   */

  constructor(studentProfileRepo, classLevelRepo ) {
    this.studentProfileRepo = studentProfileRepo;
    this.classLevelRepo = classLevelRepo;
  };

  async createStudentProfile(data) {
    return await this.studentProfileRepo.createStudentProfile(data);
  };

  async getStudentProfileByUserId(userId) {
    const profile = await this.studentProfileRepo.getProfileByUserId(userId);
    if (!profile) throw new RecordNotFoundError('User profile not found');
    return profile;
  };

  async getStudentProfileById(id) {
    const profile = await this.studentProfileRepo.getProfileByStudentId(id);
    if (!profile) throw new RecordNotFoundError('User profile not found');
    return profile;
  };

  async updateStudentProfile(userId, updateData) {
    const updatePayload = { ...updateData };
    if(updateData.classLevel) {
      const classlevel = await this.classLevelRepo.getClassLevelByName(updateData.classLevel);

   if (!classlevel) {
      throw new RecordNotFoundError("Class level not found");
    };

    updatePayload.classLevelId = classlevel.id;
    delete updatePayload.classLevel;
  }

    const updatedProfile = await this.studentProfileRepo.updateStudentProfile(userId, updatePayload);
    if (!updatedProfile) throw new RecordNotFoundError('Student profile not found');

    return updatedProfile;
  };

  /** DELETE PROFILE */
  async deleteStudentProfile(userId) {
    const deleted = await this.studentProfileRepo.deleteStudentProfile(userId);
    if (!deleted) throw new RecordNotFoundError('Student profile not found');
    return deleted;
  };
};