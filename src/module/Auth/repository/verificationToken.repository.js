import {VerificationToken} from "../models/index.js";
import { handleSequelizeError } from "../../../common/error/sequeliseError.error.js";
import { RecordNotFoundError } from "../../../common/error/domainError.error.js";
import { Op } from "sequelize";

export class UserAuthVerificationRepository {

  // CREATE QUERY OPERATION
  async createVerificationToken(data) {
    try {
      const verify = await VerificationToken.create(data);
      return this.mapUserVerificationTokenEntity(verify);
    } catch (error) {
      handleSequelizeError(error);
    }
  }

  // FIND ACTIVE / VALID TOKEN
  async findValidVerificationToken(tokenHash, type) {
    try {
      const verify = await VerificationToken.findOne({
        where: {
          tokenHash,
          type,
          usedAt: null, // token not used
          expiresAt: { [Op.gt]: new Date() }, // not expired
        },
      });

      return verify ? this.mapUserVerificationTokenEntity(verify) : null;
    } catch (error) {
      handleSequelizeError(error);
    }
  }

  // MARK TOKEN AS USED
  async markVerificationTokenUsed(userId) {
    try {
      const [affectedRows] = await VerificationToken.update(
        { usedAt: new Date() },
        { where: { userId } }
      );

      if (affectedRows === 0) {
        throw new RecordNotFoundError("Verification token not found");
      }

      const updatedToken = await VerificationToken.findOne({ where: { userId } });
      return this.mapUserVerificationTokenEntity(updatedToken);
    } catch (error) {
      handleSequelizeError(error);
    }
  }

  // DELETE TOKEN
  async deleteVerificationToken(id) {
    try {
      const affectedRows = await VerificationToken.destroy({ where: { id } });
      if (affectedRows === 0) {
        throw new RecordNotFoundError("Verification token not found");
      }
    } catch (error) {
      handleSequelizeError(error);
    }
  };

  async deleteVerificationTokenByUser(userId, type) {
    try {
      const affectedRows = await VerificationToken.destroy({ 
        where: {
          userId: userId,
          type: type,
        }
      });
       if (affectedRows === 0) {
        throw new RecordNotFoundError("Verification token not found");
      }
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
  }
}