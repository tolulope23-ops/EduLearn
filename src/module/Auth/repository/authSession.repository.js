import {AuthSession} from "../models/index.js";
import { handleSequelizeError } from "../../../common/error/sequeliseError.error.js";
import { RecordNotFoundError } from "../../../common/error/domainError.error.js";

export class UserSessionRepository {

  // CREATE QUERY OPERATION
  async createSession(data) {
    try {
      const session = await AuthSession.create(data);
      return this.mapToAuthSession(session);
    } catch (error) {
      handleSequelizeError(error);
    }
  }

  // READ QUERY OPERATION
  async getSessionById(sessionId) {
    try {
      const session = await AuthSession.findOne({
        where: {
          id: sessionId,
          revokedAt: null, // only active sessions
        },
      });

      return session ? this.mapToAuthSession(session) : null;
    } catch (error) {
      handleSequelizeError(error);
    }
  }

  async getActiveSessions(userId) {
    try {
      const sessions = await AuthSession.findAll({
        where: {
          userId,
          revokedAt: null, // only active sessions
        },
      });

      return sessions.map(session => this.mapToAuthSession(session));
    } catch (error) {
      handleSequelizeError(error);
    }
  }

  // UPDATE QUERY OPERATIONS
  async revokeSession(sessionId) {
    try {
      const [affectedRows] = await AuthSession.update(
        { revokedAt: new Date() },
        { where: { id: sessionId } }
      );

      if (affectedRows === 0) {
        throw new RecordNotFoundError("Session not found");
      }

      const updatedSession = await AuthSession.findByPk(sessionId);
      return this.mapToAuthSession(updatedSession);
    } catch (error) {
      handleSequelizeError(error);
    }
  };

  async revokeAllUsersSessions(userId) {
    try {
      await AuthSession.update(
        { revokedAt: new Date() },
        {
          where: {
            userId,
            revokedAt: null, // only active sessions
          },
        }
      );
    } catch (error) {
      handleSequelizeError(error);
    }
  }

  // HELPER: Map Sequelize instance to domain entity
  mapToAuthSession(session) {
    if (!session) return null;

    return {
      id: session.id,
      userId: session.userId,
      ipAddress: session.ipAddress,
      userAgent: session.userAgent,
      revokedAt: session.revokedAt ?? undefined,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
    };
  }
}