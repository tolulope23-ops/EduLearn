import { LearningSyncService } from "../service/learningSync.service.js";

export class LearningSyncController {
  /**
   * @param {LearningSyncService} learningSyncService
   */
    constructor(learningSyncService) {
        this.learningSyncService = learningSyncService;
    };

    syncProgress = async (req, res, next) => {

        try {
            const { userId } = req.user;

            const { progress } = req.body;

            const result = await this.learningSyncService.syncProgress(
                userId,
                progress
            );

            return res.status(200).json({
                success: true,
                ...result
            });
        } catch (error) {
            next(error);
        };
    };
};
