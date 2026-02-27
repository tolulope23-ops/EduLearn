import { StudentProfileService } from "../service/studentProfile.service.js";

export class StudentProfileController {
    /**
     * @param {StudentProfileService} studentProfileService
     */

    constructor(studentProfileService){
        this.studentProfileService = studentProfileService;
    };

//CREATE PROFILE
    createStudentProfile = async (req, res, next) => {
        try {
            const profile = await this.studentProfileService.createStudentProfile(req.body);

        return res.status(201).json({
            success: true,
            message: 'Student profile created successfully',
            data: profile
        });

        } catch (error) {
            next(error);
        }
    };

  // GET PROFILE BY USER ID (current logged-in user)
    getMyProfile = async (req, res, next) => {
        try {
            const userId = req.user.userId;

            const profile = await this.studentProfileService.getStudentProfileByUserId(userId);

        return res.status(200).json({
            success: true,
            data: profile
        });

        } catch (error) {
            next(error);
        };
  };

  // GET PROFILE BY ID (admin or internal use)
    getProfileById = async (req, res, next) => {
        try {
            const { id } = req.params;

            const profile = await this.studentProfileService.getStudentProfileById(id);

        return res.status(200).json({
            success: true,
            data: profile
        });

        } catch (error) {
            next(error);
        }
    };

  // UPDATE PROFILE
    updateProfile = async (req, res, next) => {
        try {
            const userId = req.user.userId;
            const updateData = req.body;

            const updatedProfile = await this.studentProfileService.updateStudentProfile(userId, updateData);

        return res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: updatedProfile
        });

        } catch (error) {
            next(error);
        }
    };

  // DELETE PROFILE
    deleteProfile = async(req, res, next) => {
        try {
            const userId = req.user.userId;
            await this.studentProfileService.deleteStudentProfile(userId);
        return res.status(200).json({
            success: true,
            message: 'Profile deleted successfully',
        });

        } catch (error) {
            next(error);
        }
    };
};