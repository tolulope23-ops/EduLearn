const { RolePermission, Role, Permission } = require("../models"); // import your Sequelize models
const { handleSequelizeError } = require("../error/sequelizeErrors.error"); // your error handler

export class RolePermissionRepository {
  
  // CREATE: assign a permission to a role
  async assignPermissionToRole(roleId, permissionId) {
    try {
      const role_permission = await RolePermission.create({
        roleId,
        permissionId,
      });

      return this.mapToRolePermissionEntity(role_permission);
    } catch (error) {
      handleSequelizeError(error);
    }
  };

  // READ: get all permissions for a role
  async getPermissionsByRole(roleId) {
    try {
      const role_permissions = await RolePermission.findAll({
        where: { roleId },
        include: [
          { model: Role, as: "role" },
          { model: Permission, as: "permission" },
        ],
      });

      return role_permissions.map((rp) => this.mapToRolePermissionEntity(rp));
    } catch (error) {
      handleSequelizeError(error);
    }
  };

  // DELETE: remove a permission from a role
  async removePermissionFromRole(roleId, permissionId) {
    try {
      await RolePermission.destroy({
        where: { roleId, permissionId },
      });
    } catch (error) {
      handleSequelizeError(error);
    }
  };

  // HELPER: map Sequelize instance to plain object
  mapToRolePermissionEntity(role_permission) {
    if (!role_permission) return null;

    return {
      id: role_permission.id,
      roleId: role_permission.roleId,
      permissionId: role_permission.permissionId,
    };
  };
};
