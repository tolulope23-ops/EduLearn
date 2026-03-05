import Course from '../models/course.model.js';
import { handleSequelizeError } from "../../../common/error/sequeliseError.error.js";
import { RecordNotFoundError } from "../../../common/error/domainError.error.js";
import { Op } from 'sequelize';


export class CourseRepository{

// CREATE QUERY OPERATION
    async createCourse(data) {
        try {
            const course = await Course.create(data);
            return this.mapToCourseEntity(course);
        } catch (error) {
            handleSequelizeError(error);
        };
    };

// UPDATE QUERY OPERATION
    async updateCourse(id, data) {
        try {
            const [affectedRows] = await Course.update(data, { where: { id } });

        if (affectedRows === 0) {
            throw new RecordNotFoundError("Course not found");
        }

            const updatedCourse = await Course.findByPk(id);
            return this.mapToCourseEntity(updatedCourse);
        } catch (error) {
            handleSequelizeError(error);
        };
    };


  // READ QUERY OPERATIONS
    async getCourseById(id) {
        try {
            const course = await Course.findByPk(id);
            return course ? this.mapToCourseEntity(course) : null;
        } catch (error) {
            handleSequelizeError(error);
        }
    };

    async getAllCourses() {
        try {
            const courses = await Course.findAll();
            return courses.map(course => this.mapToCourseEntity(course));
        } catch (error) {
            handleSequelizeError(error);
        }
    };

    async getCourseByName(courseName) {
        try {
            const course = await Course.findOne({
            where: {
                name: {
                [Op.iLike]: courseName, // case-insensitive
                },
            },
            });

            return course ? this.mapToCourseEntity(course) : null;
        } catch (error) {
            handleSequelizeError(error);
        }
    };

// HELPER: Map Sequelize instance to domain entity
    mapToCourseEntity(course) {
        if (!course) return null;

        return {
        id: course.id,
        name: course.name,
        createdAt: course.createdAt,
        updatedAt: course.updatedAt,
        };
    };

};