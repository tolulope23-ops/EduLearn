import Permission from "../models/permission.model.js";
import handleSequelizeError from "../../../common/error/sequeliseError.error.js";

export class UserPermissionRepository {

  // CREATE QUERY OPERATION
  async createPermission(data) {
    try {
      const permission = await Permission.create(data);
      return this.mapToPermissionEntity(permission);
    } catch (error) {
      handleSequelizeError(error);
    }
  };

  // UPDATE QUERY OPERATION
  async updatePermission(id, data) {
    try {
      // Update permission
      await Permission.update(data, { where: { id } });

      // Fetch the updated row (works in all DBs)
      const updatedPermission = await Permission.findByPk(id);
      return this.mapToPermissionEntity(updatedPermission);
    } catch (error) {
      handleSequelizeError(error);
    }
  };

  // READ QUERY OPERATIONS
  async getPermissionById(id) {
    try {
      const permission = await Permission.findByPk(id);
      return permission ? this.mapToPermissionEntity(permission) : null;
    } catch (error) {
      handleSequelizeError(error);
    }
  };

  async getPermissionByName(name) {
    try {
      const permission = await Permission.findOne({ where: { name } });
      return permission ? this.mapToPermissionEntity(permission) : null;
    } catch (error) {
      handleSequelizeError(error);
    }
  };

  async getAllPermissions() {
    try {
      const permissions = await Permission.findAll();
      return permissions.map((permission) => this.mapToPermissionEntity(permission));
    } catch (error) {
      handleSequelizeError(error);
    }
  };

  // DELETE QUERY OPERATION
  async deletePermission(id) {
    try {
      await Permission.destroy({ where: { id } });
    } catch (error) {
      handleSequelizeError(error);
    }
  };

  // HELPER: Map Sequelize instance to domain entity
  mapToPermissionEntity(permission) {
    if (!permission) return null;

    return {
      id: permission.id,
      name: permission.name,
      description: permission.description ?? undefined,
      createdAt: permission.createdAt,
      updatedAt: permission.updatedAt,
    };
  };
}

module.exports = PermissionRepository;
