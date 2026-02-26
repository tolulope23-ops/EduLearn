import ClassLevel from "../models/classLevel.model.js";
import { handleSequelizeError } from "../../../common/error/sequeliseError.error.js";
import { RecordNotFoundError } from "../../../common/error/domainError.error.js";

export class ClassLevelRepository {

  // CREATE QUERY OPERATION
  async createClassLevel(data) {
    try {
      const classLevel = await ClassLevel.create(data);
      return this.mapToClassLevelEntity(classLevel);
    } catch (error) {
      handleSequelizeError(error);
    }
  }

  // UPDATE QUERY OPERATION
  async updateClassLevel(id, data) {
    try {
      const [affectedRows] = await ClassLevel.update(data, { where: { id } });

      if (affectedRows === 0) {
        throw new RecordNotFoundError("ClassLevel not found");
      }

      const updatedClassLevel = await ClassLevel.findByPk(id);
      return this.mapToClassLevelEntity(updatedClassLevel);
    } catch (error) {
      handleSequelizeError(error);
    }
  }

  // READ QUERY OPERATIONS
  async getClassLevelById(id) {
    try {
      const classLevel = await ClassLevel.findByPk(id);
      return classLevel ? this.mapToClassLevelEntity(classLevel) : null;
    } catch (error) {
      handleSequelizeError(error);
    }
  }

  async getClassLevelByName(name) {
    try {
      const classLevel = await ClassLevel.findOne({ where: { name } });
      return classLevel ? this.mapToClassLevelEntity(classLevel) : null;
    } catch (error) {
      handleSequelizeError(error);
    }
  }

  async getAllClassLevels() {
    try {
      const classLevels = await ClassLevel.findAll();
      return classLevels.map(cl => this.mapToClassLevelEntity(cl));
    } catch (error) {
      handleSequelizeError(error);
    }
  }

  // HELPER: Map Sequelize instance to domain entity
  mapToClassLevelEntity(classLevel) {
    if (!classLevel) return null;

    return {
      id: classLevel.id,
      name: classLevel.name,
      description: classLevel.description ?? undefined,
      createdAt: classLevel.createdAt,
      updatedAt: classLevel.updatedAt,
    };
  }
}