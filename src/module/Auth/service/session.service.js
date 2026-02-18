import { UserSessionRepository } from "../repository/authSession.repository.js";

export class UserSessionService{
    /**
     * @param {UserSessionRepository} sessionRepo
     */

    constructor(sessionRepo){
        this.sessionRepo = sessionRepo;
    };

    async createSession(userId, data) {
        return await this.sessionRepo.createSession({
            userId,
            ipAddress: data.ipAddress,
            userAgent: data.userAgent,
        });
    };
};