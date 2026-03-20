import { StudentProfileRepository } from "../../Auth/repository/studentProfile.repository.js";
import { LearningProgress } from "../service/learningProgress.service.js";

export class LearningProgressController{

    /**
     * @param {StudentProfileRepository} studentProfileRepo
     * @param {LearningProgress} learningProgressService
     */

    constructor(learningProgressService, studentProfileRepo) {
        this.learningProgressService = learningProgressService;
        this.studentProfileRepo = studentProfileRepo;
    };
    

// GET module progress
    getModuleProgress = async (req, res, next) => {
        try {
        const { moduleId } = req.params;

        const {userId} = req.user;

        const studentId = await this.studentProfileRepo.getStudentIdByUserId(userId);

        const progress = await this.learningProgressService.getModuleProgress(studentId, moduleId);

            return res.status(200).json({
                success: true, 
                data: progress 
            });

        } catch (err) {
        next(err);
        }
    };


// GET submodule progress
    getSubmoduleProgress = async (req, res, next) => {
        try {
        const {submoduleId } = req.params;

        const {userId} = req.user;

        const studentId = await this.studentProfileRepo.getStudentIdByUserId(userId);

        const progress = await this.learningProgressService.getSubmoduleProgress(studentId, submoduleId);

            return res.status(200).json({
                success: true, 
                data: progress 
            });

        } catch (err) {
        next(err);
        }
    };


    markSubmoduleComplete = async (req, res, next) => {
        try {

            const { submoduleId } = req.body;
            const { userId } = req.user;

            if (!submoduleId) {
                throw new BadRequestError("submoduleId is required");
            };

            const studentId = await this.studentProfileRepo.getStudentIdByUserId(userId);

            if (!studentId) {
                throw new RecordNotFoundError("Student profile not found");
            };

            const result = await this.learningProgressService.markSubModuleComplete(
                studentId,
                submoduleId
            );

            return res.status(200).json({
                success: true,
                message: result.message,
                data: result.data
            });

        } catch (err) {
            next(err);
        };
    };

};