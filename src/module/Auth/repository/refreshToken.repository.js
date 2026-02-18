import AuthSession from "../models/authSession.model.js";
import RefreshToken from "../models/refreshToken.model.js";
import handleSequelizeError from "../../../common/error/sequeliseError.error.js";

export class UserRefreshTokenRepository {

  // CREATE QUERY OPERATION
  async createToken(data) {
    try {
      const token = await RefreshToken.create(data);
      return this.mapToRefreshTokenEntity(token);
    } catch (error) {
      handleSequelizeError(error);
    }
  };

  // READ QUERY OPERATION
  async findValidRefreshToken(tokenHash) {
    try {
      const token = await RefreshToken.findOne({
        where: {
          tokenHash,
          expiresAt: { [RefreshToken.sequelize.Op.gt]: new Date() },
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
  };

  // REVOKE TOKEN
  async revokeToken(id) {
    try {
      // Update token
      await RefreshToken.update(
        { revokedAt: new Date() },
        { where: { id } }
      );

      // Fetch updated token
      const token = await RefreshToken.findByPk(id);

      return this.mapToRefreshTokenEntity(token);

    } catch (error) {
      handleSequelizeError(error);
    }
  };

  async revokeBySessionId(sessionId) {
  try {
    await RefreshToken.update({ revokedAt: new Date() },
      {
        where: {
          sessionId,
          revokedAt: null
        }
      });

    return true;

  } catch (error) {
    handleSequelizeError(error);
  };
};

 async revokeAllRefreshToken(userId) {
  try {
    await RefreshToken.update({ revokedAt: new Date() },
      {
        where: {
          userId,
          revokedAt: null
        }
      }
    );
  } catch (error) {
    handleSequelizeError(error);
  };
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
};
