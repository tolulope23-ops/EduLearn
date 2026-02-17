import { User } from "../models";
const  handleSequelizeError  = require("../../../common/error/sequeliseError.error"); // create a helper similar to Prisma one

export class UserRepository {

  // CREATE QUERY OPERATION
  
  async createUser(data) {
    try {
      const user = await User.create(data);
      return this.mapToUserEntity(user);
    } catch (error) {
      handleSequelizeError(error);
    };
  };

  // READ QUERY OPERATIONS

  async getUserByEmail(email) {
    try {
      const user = await User.findOne({ where: { email } });
      return user ? this.mapToUserEntity(user) : null;
    } catch (error) {
      handleSequelizeError(error);
    };
  };

  async getUserByPhone(phone) {
    try {
      const user = await User.findOne({ where: { phone } });
      return user ? this.mapToUserEntity(user) : null;
    } catch (error) {
      handleSequelizeError(error);
    };
  };

  async getUserById(id) {
    try {
      const user = await User.findByPk(id);
      return user ? this.mapToUserEntity(user) : null;
    } catch (error) {
      handleSequelizeError(error);
    };
  };

  async getUsersByRole(role) {
    try {
      const users = await User.findAll({ where: { role } });
      return users.map((user) => this.mapToUserEntity(user));
    } catch (error) {
      handleSequelizeError(error);
    };
  };

  async getUsersAccountStatus(accountStatus) {
    try {
      const users = await User.findAll({ where: { accountStatus } });
      return users.map((user) => this.mapToUserEntity(user));
    } catch (error) {
      handleSequelizeError(error);
    };
  };

  // UPDATE QUERY OPERATIONS
  async updateUserAccountStatus(id, accountStatus) {
    try {
      const user = await User.update(
        { accountStatus },
        { where: { id } }
      );

      return this.mapToUserEntity(user);
    } catch (error) {
      handleSequelizeError(error);
    }
  };

  async markEmailVerified(userId) {
    try {
      await User.update(
        { isEmailVerified: true, emailVerifiedAt: new Date() },
        { where: { id: userId } }
      );
    } catch (error) {
      handleSequelizeError(error);
    };
  };

  // HELPER: Map Sequelize instance to domain entity
  mapToUserEntity(user) {
    if (!user) return null;

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      accountStatus: user.accountStatus,
      isEmailVerified: user.isEmailVerified,
      emailVerifiedAt: user.emailVerifiedAt ?? undefined,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
};
