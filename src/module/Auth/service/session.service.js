import { UserSessionRepository } from "../repository/authSession.repository.js";

export class UserSessionService {
  /**
   * @param {UserSessionRepository} sessionRepo
   */
  constructor(sessionRepo) {
    this.sessionRepo = sessionRepo;
  }

//    Create a new user session
  async createSession(userId, data) {
    try {
      return await this.sessionRepo.createSession({
        userId,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
      });
    } catch (error) {
      throw error;
    }
  };

  /**
   * Get all active sessions for a user
   */
  async getUserActiveSessions(userId) {
    try {
      return await this.sessionRepo.getActiveSessions(userId);
    } catch (error) {
      throw error;
    }
  };

  /**
   * Revoke a single session
   */

  async revokeSession(sessionId) {
    try {
      return await this.sessionRepo.revokeSession(sessionId);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Revoke all sessions for a user
   */
  async revokeAllUsersSessions(userId) {
    try {
      return await this.sessionRepo.revokeAllUsersSessions(userId);
    } catch (error) {
      throw error;
    }
  };
};