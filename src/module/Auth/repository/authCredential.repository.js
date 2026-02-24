import {AuthCredential} from "../models/index.js";
import { handleSequelizeError } from "../../../common/error/sequeliseError.error.js";
import { RecordNotFoundError } from "../../../common/error/domainError.error.js";

export class UserAuthRepository {

  // CREATE QUERY OPERATION
  async createUserCredential(data) {
    try {
      const userAuth = await AuthCredential.create(data);
      return this.mapUserCredentialEntity(userAuth);
    } catch (error) {
      handleSequelizeError(error);
    }
  }

  // UPDATE lastLogin
  async updateUserLastLogin(userId) {
    try {
      const [affectedRows] = await AuthCredential.update(
        { lastLogin: new Date() },
        { where: { userId } }
      );

      if (affectedRows === 0) {
        throw new RecordNotFoundError("Auth credential not found");
      }

      const updatedUserAuth = await AuthCredential.findOne({ where: { userId } });
      return this.mapUserCredentialEntity(updatedUserAuth);
    } catch (error) {
      handleSequelizeError(error);
    }
  }

  // READ QUERY OPERATION
  async getUserCredentialByUserId(userId) {
    try {
      const userAuth = await AuthCredential.findOne({ where: { userId } });
      return userAuth ? this.mapUserCredentialEntity(userAuth) : null;
    } catch (error) {
      handleSequelizeError(error);
    }
  }

  // Increment failedAttempts
  async incrementFailedAttempts(userId) {
    try {
      const userAuth = await AuthCredential.findOne({ where: { userId } });
      if (!userAuth) {
        throw new RecordNotFoundError("Auth credential not found");
      }

      userAuth.failedAttempts += 1;
      await userAuth.save();

      return this.mapUserCredentialEntity(userAuth);
    } catch (error) {
      handleSequelizeError(error);
    }
  }

  // Reset failedAttempts
  async resetFailedAttempts(userId) {
    try {
      const userAuth = await AuthCredential.findOne({ where: { userId } });
      if (!userAuth) {
        throw new RecordNotFoundError("Auth credential not found");
      }

      userAuth.failedAttempts = 0;
      await userAuth.save();

      return this.mapUserCredentialEntity(userAuth);
    } catch (error) {
      handleSequelizeError(error);
    }
  }

  // Update user password (secret hash)
  async updateUserPassword(userId, newPassword) {
    try {
      const [affectedRows] = await AuthCredential.update(
        { secretHash: newPassword },
        { where: { userId } }
      );

      if (affectedRows === 0) {
        throw new RecordNotFoundError("Auth credential not found");
      }

      const updatedUserAuth = await AuthCredential.findOne({ where: { userId } });
      return this.mapUserCredentialEntity(updatedUserAuth);
    } catch (error) {
      handleSequelizeError(error);
    }
  }

  // Lock user access
  async lockUserAccess(userId, until) {
    try {
      const userAuth = await AuthCredential.findOne({ where: { userId } });
      if (!userAuth) {
        throw new RecordNotFoundError("Auth credential not found");
      }

      userAuth.lockedUntil = until;
      await userAuth.save();

      return this.mapUserCredentialEntity(userAuth);
    } catch (error) {
      handleSequelizeError(error);
    }
  }

  // Helper: map Sequelize instance to plain object
  mapUserCredentialEntity(userAuth) {
    if (!userAuth) return null;

    return {
      id: userAuth.id,
      userId: userAuth.userId,
      type: userAuth.type,
      secretHash: userAuth.secretHash,
      failedAttempts: userAuth.failedAttempts,
      lockedUntil: userAuth.lockedUntil ?? undefined,
      lastLogin: userAuth.lastLogin,
      createdAt: userAuth.createdAt,
      updatedAt: userAuth.updatedAt,
    };
  };
};