const { VerificationToken } = require("../models"); // Sequelize model
const { handleSequelizeError } = require("../error/sequelizeErrors.error");

export class UserVerificationToken {

  async createVerificationToken(data) {
    try {
      const verify = await VerificationToken.create(data);
      return this.mapUserVerificationTokenEntity(verify);
    } catch (error) {
      handleSequelizeError(error);
    }
  };

  async findValidToken(tokenHash, type) {
    try {
      const verify = await VerificationToken.findOne({
        where: {
          tokenHash,
          type,
          usedAt: null, // token not used
          expiresAt: { [VerificationToken.sequelize.Op.gt]: new Date() }, // not expired
        },
      });

      return verify ? this.mapUserVerificationTokenEntity(verify) : null;
    } catch (error) {
      handleSequelizeError(error);
    }
  };

  async markTokenUsed(userId) {
    try {
      // Update the token first
      await VerificationToken.update(
        { usedAt: new Date() },
        { where: { userId } }
      );

      // Fetch the updated token
      const updatedToken = await VerificationToken.findOne({ where: { userId } });
      return this.mapUserVerificationTokenEntity(updatedToken);
    } catch (error) {
      handleSequelizeError(error);
    }
  };

  // DELETE TOKEN
  async deleteToken(id) {
    try {
      await VerificationToken.destroy({ where: { id } });
    } catch (error) {
      handleSequelizeError(error);
    }
  };

  // HELPER: Map Sequelize instance to domain entity
  mapUserVerificationTokenEntity(verification) {
    if (!verification) return null;

    return {
      id: verification.id,
      userId: verification.userId,
      type: verification.type,
      tokenHash: verification.tokenHash,
      expiresAt: verification.expiresAt,
      usedAt: verification.usedAt ?? undefined,
      createdAt: verification.createdAt,
      updatedAt: verification.updatedAt,
    };
  };
};

module.exports = UserVerificationToken;
