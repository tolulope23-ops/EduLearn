import StudentCourses from "../models/studentCourse.model.js";
import { handleSequelizeError } from "../../../common/error/sequeliseError.error.js";
import { RecordNotFoundError } from "../../../common/error/domainError.error.js";


export class StudentCourseRepository{
//CREATE QUERY OPERATION
    async bulkCreateStudentCourses(courseArray){
        try {
            const courses = await StudentCourses.bulkCreate(courseArray);
            return courses.map(course => this.mapToEntity(course));
        } catch (error) {
            handleSequelizeError(error);
        }
    };

    // COUNT courses selected by student
    async countStudentCourses(studentId) {
        try {
            return await StudentCourses.count({
                where: { studentId },
            });
        } catch (error) {
            handleSequelizeError(error);
        };
    };

      // GET all courses for a student
    async getCoursesByStudent(studentId) {
        try {
            const records = await StudentCourses.findAll({
                where: { studentId },
            });

            return records.map(record => this.mapToEntity(record));
        } catch (error) {
            handleSequelizeError(error);
        };
    };

      // DELETE a selected course
    async removeStudentCourse(studentId, courseId) {
        try {
            const deleted = await StudentCourses.destroy({
                where: { studentId, courseId },
            });

        if (!deleted) {
            throw new RecordNotFoundError("Student course not found");
        }

            return true;
        } catch (error) {
            handleSequelizeError(error);
        }
    };

// HELPER: Map Sequelize instance to domain entity
    mapToEntity(course) {
        if (!course) return null;

        return {
        id: course.id,
        studentId: course.studentId,
        courseId: course.courseId,
        createdAt: course.createdAt,
        updatedAt: course.updatedAt,
        };
    };

}
