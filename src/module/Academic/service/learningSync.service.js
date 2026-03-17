import { SubmoduleProgressService } from "./subModuleProgress.service.js";

export class LearningSync{
    /**
     * @param {SubmoduleProgressService} submoduleProgressService 
     */

    constructor(submoduleProgressService){
        this.submoduleProgressService = submoduleProgressService;
    };

//Sync progress between FE and BE
    async syncOfflineProgress(studentId, progressUpdates) {

        const results = [];

        for (const update of progressUpdates) {

            // Get existing progress if any
            let existing = null;

            try {
                existing = await this.submoduleProgressService.getSubmoduleProgress(studentId, update.submoduleId);
            } catch {
                // Init if not exists
                existing = await this.submoduleProgressService.initSubmoduleProgress(studentId, update.submoduleId);
            };

            // Merge logic: keep latest or highest values
            const merged = {
                completed: existing.completed || update.completed,
                score: Math.max(existing.score || 0, update.score || 0),
                attemptCount: Math.max(existing.attemptCount || 0, update.attemptCount || 0),
                downloaded: existing.downloaded || update.downloaded,
                downloadedAt: update.downloaded ? new Date(update.downloadedAt) : existing.downloadedAt,
            };

            const updated = await this.submoduleProgressService.updateSubmoduleProgress(
                studentId,
                update.submoduleId,
                merged
            );

            results.push(updated);
        };

        return results;
    };

};