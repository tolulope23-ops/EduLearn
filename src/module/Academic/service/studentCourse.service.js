import { CourseRepository } from "../repository/course.repository";
import { StudentCourseRepository } from "../repository/studentCourses.repository";

export class StudentCourseService{
    /**
     * @param {CourseRepository} courseRepo
     * @param {StudentCourseRepository} studentCourseRepo
     */

    constructor(courseRepo, studentCourseRepo){
        this.courseRepo = courseRepo;
        this.studentCourseRepo = studentCourseRepo;
    }

    async assignCourseNameToIds(courseNames){
        if (!Array.isArray(courseNames) || courseNames.length === 0) {
            throw new Error("courseNames not selected");
        }

        const coursesDb = await this.courseRepo.getCoursesByNames(courseNames);
        
    //Return array of course IDs
        return coursesDb.map(course => course.id);
    };


    async assignCourseToStudent(courseNames, studentId){
        const courseIds = await this.assignCourseNameToIds(courseNames);

        // Prepare array for bulk insert
        const courseArray = courseIds.map(courseId => ({
            studentId, courseId
        }));

        //Save to DB
        return await this.studentCourseRepo.bulkCreateStudentCourses(courseArray);
    };
}