const { Role } = require("../models"); // import Sequelize Role model
const { handleSequelizeError } = require("../error/sequelizeErrors.error");

export class RoleRepository {

  // CREATE QUERY OPERATION
  async createRole(data) {
    try {
      const role = await Role.create(data);
      return this.mapToRoleEntity(role);
    } catch (error) {
      handleSequelizeError(error);
    }
  };

  // UPDATE QUERY OPERATION
  async updateRole(id, data) {
    try {
      await Role.update(data, { where: { id } });
      const updatedRole = await Role.findByPk(id);
      return this.mapToRoleEntity(updatedRole);
    } catch (error) {
      handleSequelizeError(error);
    }
  };

  // READ QUERY OPERATIONS
  async getRoleById(id) {
    try {
      const role = await Role.findByPk(id);
      return role ? this.mapToRoleEntity(role) : null;
    } catch (error) {
      handleSequelizeError(error);
    }
  };

  async getRoleByName(roleName) {
    try {
      const role = await Role.findOne({ where: { roleName } });
      return role ? this.mapToRoleEntity(role) : null;
    } catch (error) {
      handleSequelizeError(error);
    }
  };

  async getAllRoles() {
    try {
      const roles = await Role.findAll();
      return roles.map((role) => this.mapToRoleEntity(role));
    } catch (error) {
      handleSequelizeError(error);
    }
  };

  // HELPER: Map Sequelize instance to domain entity
  mapToRoleEntity(role) {
    if (!role) return null;

    return {
      id: role.id,
      roleName: role.roleName,
      description: role.description ?? undefined,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    };
  };
};
