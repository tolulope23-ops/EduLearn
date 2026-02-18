import UserRole from "../models/userRole.model.js";
import Role from "../models/role.model.js";
import User from "../models/user.model.js";

import handleSequelizeError from "../../../common/error/sequeliseError.error.js";

export class UserRoleRepository {

  // CREATE QUERY OPERATION
  async assignRoleToUser(data) {
    try {
      const user_role = await UserRole.create(data);
      return this.mapToUserRoleEntity(user_role);
    } catch (error) {
      handleSequelizeError(error);
    };
  };

  // READ QUERY OPERATIONS
  async getRolesByUser(userId) {
    try {
      const roles = await UserRole.findAll({
        where: { userId },
        include: [
          { model: User, as: "user" },
          { model: Role, as: "role" },
        ],
      });

      return roles.length > 0 ? roles.map(this.mapToUserRoleEntity) : null;
    } catch (error) {
      handleSequelizeError(error);
    }
  }

  async getAllRoles() {
    try {
      const roles = await UserRole.findAll({
        include: [
          { model: User, as: "user" },
          { model: Role, as: "role" },
        ],
      });
      return roles.map((role) => this.mapToUserRoleEntity(role));
    } catch (error) {
      handleSequelizeError(error);
    }
  }

  async getUsersByRole(roleId) {
    try {
      const users = await UserRole.findAll({
        where: { roleId },
        include: [
          { model: User, as: "user" },
          { model: Role, as: "role" },
        ],
      });

      return users.map((user) => this.mapToUserRoleEntity(user));
    } catch (error) {
      handleSequelizeError(error);
    }
  }

  async removeRoleFromUser(userId, roleId) {
    try {
      await UserRole.destroy({
        where: { userId, roleId },
      });
    } catch (error) {
      handleSequelizeError(error);
    }
  }

  // HELPER: Map Sequelize instance to domain entity
  mapToUserRoleEntity(user_role) {
    if (!user_role) return null;

    return {
      id: user_role.id,
      userId: user_role.userId,
      roleId: user_role.roleId,
    };
  };
};