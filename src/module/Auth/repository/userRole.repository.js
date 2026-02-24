import {UserRole, Role, User} from "../models/index.js";
import { handleSequelizeError } from "../../../common/error/sequeliseError.error.js";
import { RecordNotFoundError } from "../../../common/error/domainError.error.js";

export class UserRoleRepository {

  // CREATE QUERY OPERATION
  async assignRoleToUser(data) {
    try {
      const userRole = await UserRole.create(data);
      return this.mapToUserRoleEntity(userRole);
    } catch (error) {
      handleSequelizeError(error);
    }
  }

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

      return roles.map(role => this.mapToUserRoleEntity(role));
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

      return users.map(user => this.mapToUserRoleEntity(user));
    } catch (error) {
      handleSequelizeError(error);
    }
  }

  // DELETE QUERY OPERATION
  async removeRoleFromUser(userId, roleId) {
    try {
      const affectedRows = await UserRole.destroy({
        where: { userId, roleId },
      });

      if (affectedRows === 0) {
        throw new RecordNotFoundError("User role not found");
      }
    } catch (error) {
      handleSequelizeError(error);
    }
  }

  // HELPER: Map Sequelize instance to domain entity
  mapToUserRoleEntity(userRole) {
    if (!userRole) return null;

    return {
      id: userRole.id,
      userId: userRole.userId,
      roleId: userRole.roleId,
    };
  }
}