const { AuthCredential } = require("../models");
const { handleSequelizeError } = require("../error/sequelizeErrors.error");

export class UserAuthRepository {

  // CREATE QUERY OPERATION
  async createUserCredential(data) {
    try {
      const userAuth = await AuthCredential.create(data);
      return this.mapUserCredentialEntity(userAuth);
    } catch (error) {
      handleSequelizeError(error);
    };
  };

  // UPDATE lastLogin
  async updateUserLastLogin(userId) {
    try {
      await AuthCredential.update(
        { lastLogin: new Date() },
        { where: { userId } }
      );

      const updatedUserAuth = await AuthCredential.findOne({ where: { userId } });
      return this.mapUserCredentialEntity(updatedUserAuth);
    } catch (error) {
      handleSequelizeError(error);
    }
  };

  // READ QUERY OPERATION
  async getUserCredentialByUserId(userId) {
    try {
      const userAuth = await AuthCredential.findOne({ where: { userId } });
      return userAuth ? this.mapUserCredentialEntity(userAuth) : null;
    } catch (error) {
      handleSequelizeError(error);
    }
  };

  async getUserCredentialByIdentifier(identifier) {
    try {
      const userAuth = await AuthCredential.findOne({ where: { identifier } });
      return userAuth ? this.mapUserCredentialEntity(userAuth) : null;
    } catch (error) {
      handleSequelizeError(error);
    }
  };

  // Increment failedAttempts
  async incrementFailedAttempts(userId) {
    try {
      const userAuth = await AuthCredential.findOne({ where: { userId } });
      if (!userAuth) return null;

      userAuth.failedAttempts += 1;
      await userAuth.save();

      return this.mapUserCredentialEntity(userAuth);
    } catch (error) {
      handleSequelizeError(error);
    }
  };

  // Reset failedAttempts
  async resetFailedAttempts(userId) {
    try {
      const userAuth = await AuthCredential.findOne({ where: { userId } });
      if (!userAuth) return null;

      userAuth.failedAttempts = 0;
      await userAuth.save();

      return this.mapUserCredentialEntity(userAuth);
    } catch (error) {
      handleSequelizeError(error);
    }
  };

  // Lock user access
  async lockUserAccess(userId, until) {
    try {
      const userAuth = await AuthCredential.findOne({ where: { userId } });
      if (!userAuth) return null;

      userAuth.lockedUntil = until;
      await userAuth.save();

      return this.mapUserCredentialEntity(userAuth);
    } catch (error) {
      handleSequelizeError(error);
    }
  };

  // Helper: map Sequelize instance to plain object
  mapUserCredentialEntity(userAuth) {
    if (!userAuth) return null;

    return {
      id: userAuth.id,
      userId: userAuth.userId,
      type: userAuth.type,
      identifier: userAuth.identifier,
      secretHash: userAuth.secretHash,
      failedAttempts: userAuth.failedAttempts,
      lockedUntil: userAuth.lockedUntil ?? undefined,
      lastLogin: userAuth.lastLogin,
      createdAt: userAuth.createdAt,
      updatedAt: userAuth.updatedAt,
    };
  }
};
