import {AuthSession, RefreshToken} from '../models/index.js'
// import AuthSe
import { handleSequelizeError } from "../../../common/error/sequeliseError.error.js";
import { RecordNotFoundError } from "../../../common/error/domainError.error.js";
import { Op } from "sequelize";

export class UserRefreshTokenRepository {

  // CREATE QUERY OPERATION
  async createRefreshToken(data) {
    try {
      const token = await RefreshToken.create(data);
      return this.mapToRefreshTokenEntity(token);
    } catch (error) {
      handleSequelizeError(error);
    }
  }

  // READ QUERY OPERATION
  async findValidRefreshToken(tokenHash) {
    try {
      const token = await RefreshToken.findOne({
        where: {
          tokenHash,
          expiresAt: { [Op.gt]: new Date() },
          revokedAt: null,
        },
        include: [
          {
            model: AuthSession,
            as: "session",
            where: { revokedAt: null },
          },
        ],
      });

      return token ? this.mapToRefreshTokenEntity(token) : null;
    } catch (error) {
      handleSequelizeError(error);
    }
  }

  // REVOKE TOKEN BY ID
  async revokeRefreshToken(id) {
    try {
      const [affectedRows] = await RefreshToken.update(
        { revokedAt: new Date() },
        { where: { id } }
      );

      if (affectedRows === 0) {
        throw new RecordNotFoundError("Refresh token not found");
      }

      const token = await RefreshToken.findByPk(id);
      return this.mapToRefreshTokenEntity(token);
    } catch (error) {
      handleSequelizeError(error);
    }
  }

  // REVOKE ALL TOKENS FOR A SESSION
  async revokeRefreshTokenBySessionId(sessionId) {
    try {
      await RefreshToken.update(
        { revokedAt: new Date() },
        {
          where: {
            sessionId,
            revokedAt: null,
          },
        });
      return true;
    } catch (error) {
      handleSequelizeError(error);
    }
  };

  // REVOKE ALL TOKENS FOR A USER
  async revokeAllRefreshToken(id) {
    try {
      await RefreshToken.update(
        { revokedAt: new Date() },
        {
          where: {
            id,
            revokedAt: null,
          },
        }
      );
    } catch (error) {
      handleSequelizeError(error);
    }
  };

  // HELPER: Map Sequelize instance to domain entity
  mapToRefreshTokenEntity(token) {
    if (!token) return null;

    return {
      id: token.id,
      sessionId: token.sessionId,
      tokenHash: token.tokenHash,
      expiresAt: token.expiresAt,
      revokedAt: token.revokedAt ?? undefined,
      createdAt: token.createdAt,
      updatedAt: token.updatedAt,
    };
  }
}