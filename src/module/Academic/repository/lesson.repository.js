import Lesson from "../models/lesson.model.js";
import { handleSequelizeError } from "../../../common/error/sequeliseError.error.js";
import { RecordNotFoundError } from "../../../common/error/domainError.error.js";

export class LessonRepository {

  // CREATE QUERY OPERATIONS
  async createLesson(data) {
    try {
      const lesson = await Lesson.create(data);
      return this.mapToLessonEntity(lesson);
    } catch (error) {
      handleSequelizeError(error);
    }
  };

  // UPDATE QUERY OPERATIONS
  async updateLesson(id, data) {
    try {
      const [affectedRows] = await Lesson.update(data, { where: { id } });

      if (affectedRows === 0) {
        throw new RecordNotFoundError("Lesson not found");
      }

      const updatedLesson = await Lesson.findByPk(id);
      return this.mapToLessonEntity(updatedLesson);
    } catch (error) {
      handleSequelizeError(error);
    }
  };

  // DELETE
  async deleteLesson(id) {
    try {
      const deletedRows = await Lesson.destroy({ where: { id } });

      if (deletedRows === 0) {
        throw new RecordNotFoundError("Lesson not found");
      }

      return true;
    } catch (error) {
      handleSequelizeError(error);
    }
  };

 // READ QUERY OPERATIONS
  async getLessonById(id) {
    try {
      const lesson = await Lesson.findByPk(id);
      return lesson ? this.mapToLessonEntity(lesson) : null;
    } catch (error) {
      handleSequelizeError(error);
    }
  }

  async getAllLessons() {
    try {
      const lessons = await Lesson.findAll();
      return lessons.map(lesson => this.mapToLessonEntity(lesson));
    } catch (error) {
      handleSequelizeError(error);
    }
  }

  // GET LESSON BY COURSE
  async getLessonsByCourse(courseId) {
    try {
      const lessons = await Lesson.findAll({
        where: {courseId},
        order: [["sequenceNumber", "ASC"]]
      });

      return lessons.map(lesson => this.mapToLessonEntity(lesson));
    } catch (error) {
      handleSequelizeError(error);
    }
  };

  // GET BY COURSE + CLASS LEVEL
  async getLessonsByCourseAndClassLevel(courseId, classLevelId) {
    try {
      const lessons = await Lesson.findAll({
        where: { courseId, classLevelId },
        order: [["sequenceNumber", "ASC"]],
      });

      return lessons.map(lesson => this.mapToLessonEntity(lesson));
    } catch (error) {
      handleSequelizeError(error);
    }
  }

  // GET BY SEQUENCE (important for navigation)
  async getLessonBySequence(courseId, classLevelId, sequenceNumber) {
    try {
      const lesson = await Lesson.findOne({
        where: { courseId, classLevelId, sequenceNumber },
      });

      return lesson ? this.mapToLessonEntity(lesson) : null;
    } catch (error) {
      handleSequelizeError(error);
    }
  };

// HELPER: Map Sequelize instance to domain entity
  mapToLessonEntity(lesson) {
    if (!lesson) return null;

    return {
      id: lesson.id,
      courseId: lesson.courseId,
      classLevelId: lesson.classLevelId,
      title: lesson.title,
      description: lesson.description ?? undefined,
      sequenceNumber: lesson.sequenceNumber,
      createdAt: lesson.createdAt,
      updatedAt: lesson.updatedAt,
    };
  }
}