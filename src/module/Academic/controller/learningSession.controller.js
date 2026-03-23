import { LearningSession } from "../service/learningSession.service.js";
import { SubmoduleProgressService } from "../service/subModuleProgress.service.js";

export class LearningSessionController {

    /**
     * @param {LearningSession} learningSessionService
     * @param {SubmoduleProgressService} 
     */

    constructor(learningSessionService) {
        this.learningSessionService = learningSessionService;
    };

//Start learning logic for new user(student)
    startLearning = async (req, res, next) => {
        try {
            const { userId } = req.user;

            const session = await this.learningSessionService.startLearning(userId);

            return res.status(200).json({
                success: true,
                data: session 
            });

        } catch (error) {
            next(error); 
        };
    };


    resumeLesson = async (req, res, next) => {
        try {
            const { studentId, courseId } = req.body;

            const session = await this.learningSessionService.resumeLesson(studentId, courseId);

            return res.status(200).json({ data: session });
        } catch (error) {
            next(error);
        };
    };
};
