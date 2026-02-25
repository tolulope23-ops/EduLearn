import {Role, RolePermission, Permission} from '../models/index.js';
import { handleSequelizeError } from '../../../common/error/sequeliseError.error.js';
import { RecordNotFoundError } from '../../../common/error/domainError.error.js';

export class UserRolePermissionRepository {

  // CREATE: assign a permission to a role
  async assignPermissionToRole(roleId, permissionId) {
    try {
      const rolePermission = await RolePermission.create({
        roleId,
        permissionId,
      });

      return this.mapToRolePermissionEntity(rolePermission);
    } catch (error) {
      handleSequelizeError(error);
    }
  }

  // READ: get all permissions for a role
  async getPermissionsByRole(roleId) {
    try {
      const rolePermissions = await RolePermission.findAll({
        where: { roleId },
        include: [
          { model: Role, as: "role" },
          { model: Permission, as: "permission" },
        ],
      });

      return rolePermissions.map(rp => this.mapToRolePermissionEntity(rp));
    } catch (error) {
      handleSequelizeError(error);
    }
  }

  // DELETE: remove a permission from a role
  async removePermissionFromRole(roleId, permissionId) {
    try {
      const affectedRows = await RolePermission.destroy({
        where: { roleId, permissionId },
      });

      if (affectedRows === 0) {
        throw new RecordNotFoundError("Role permission not found");
      }
    } catch (error) {
      handleSequelizeError(error);
    }
  }

  // HELPER: map Sequelize instance to plain object
  mapToRolePermissionEntity(rolePermission) {
    if (!rolePermission) return null;

    return {
      id: rolePermission.id,
      roleId: rolePermission.roleId,
      permissionId: rolePermission.permissionId,
    };
  }
}