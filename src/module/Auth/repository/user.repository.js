import {User} from '../models/index.js';
import { handleSequelizeError } from '../../../common/error/sequeliseError.error.js';
import { RecordNotFoundError } from '../../../common/error/domainError.error.js';

export class UserRepository {

  // CREATE
  async createUser(data) {
    try {
      const user = await User.create(data);
      return this.mapToUserEntity(user);
    } catch (error) {
      handleSequelizeError(error);
    }
  };

  // READ
  async getUserByEmail(email) {
    try {
      const user = await User.findOne({ where: { email } });
      return user ? this.mapToUserEntity(user) : null;
    } catch (error) {
      handleSequelizeError(error);
    }
  };
  
  async getUserByPhone(phone) {
    try {
      const user = await User.findOne({ where: { phone } });
      return user ? this.mapToUserEntity(user) : null;
    } catch (error) {
      handleSequelizeError(error);
    }
  };

  async getUserById(id) {
    try {
      const user = await User.findByPk(id);
      return user ? this.mapToUserEntity(user) : null;
    } catch (error) {
      handleSequelizeError(error);
    }
  };

  async getUsersByRole(role) {
    try {
      const users = await User.findAll({ where: { role } });
      return users.map(user => this.mapToUserEntity(user));
    } catch (error) {
      handleSequelizeError(error);
    }
  }

  async getUsersByAccountStatus(accountStatus) {
    try {
      const users = await User.findAll({ where: { accountStatus } });
      return users.map(user => this.mapToUserEntity(user));
    } catch (error) {
      handleSequelizeError(error);
    }
  }

  // UPDATE

  async updateUserAccountStatus(id, accountStatus) {
    try {
      const [affectedRows] = await User.update(
        { accountStatus },
        { where: { id } }
      );

      if (affectedRows === 0) {
        throw new RecordNotFoundError("User not found");
      }

      const updatedUser = await User.findByPk(id);
      return this.mapToUserEntity(updatedUser);

    } catch (error) {
      handleSequelizeError(error);
    }
  }

  async markEmailVerified(userId) {
    try {
      const [affectedRows] = await User.update(
        {
          isEmailVerified: true,
          emailVerifiedAt: new Date(),
        },
        { where: { id: userId } }
      );

      if (affectedRows === 0) {
        throw new RecordNotFoundError("User not found");
      }

    } catch (error) {
      handleSequelizeError(error);
    }
  }

  // MAPPER
  mapToUserEntity(user) {
    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      accountStatus: user.accountStatus,
      isEmailVerified: user.isEmailVerified,
      emailVerifiedAt: user.emailVerifiedAt ?? undefined,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  };
};