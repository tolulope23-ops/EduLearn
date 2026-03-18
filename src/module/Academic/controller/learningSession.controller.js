import { LearningSession } from "../service/learningSession.service.js";

export class LearningSessionController {

    /**
     * @param {LearningSession} learningSessionService
     */

    constructor(learningSessionService) {
        this.learningSessionService = learningSessionService;
    };


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
        } catch (err) {
            next(err);
        };
    };
};
