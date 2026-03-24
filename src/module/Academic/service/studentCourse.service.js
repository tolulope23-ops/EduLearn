import { StudentProfileRepository } from "../../Auth/repository/studentProfile.repository.js";
import { CourseRepository } from "../repository/course.repository.js";
import { StudentCourseRepository } from "../repository/studentCourses.repository.js";

export class StudentCourseService{
    /**
     * @param {CourseRepository} courseRepo
     * @param {StudentCourseRepository} studentCourseRepo
     * @param {StudentProfileRepository} studentProfileRepo
     */

    constructor(courseRepo, studentCourseRepo, studentProfileRepo){
        this.courseRepo = courseRepo;
        this.studentCourseRepo = studentCourseRepo;
        this.studentProfileRepo = studentProfileRepo;
    };

    async assignCourseNameToIds(courseNames){
        if (!Array.isArray(courseNames) || courseNames.length === 0) {
            throw new Error("courseNames not selected");
        };

        const coursesDb = await this.courseRepo.getCoursesByNames(courseNames);
        
    //Return array of course IDs
        return coursesDb.map(course => course.id);
    };


    async assignCourseToStudent(courseNames, userId){
        const courseIds = await this.assignCourseNameToIds(courseNames);

        const profile = await this.studentProfileRepo.getProfileByUserId(userId);

        if (!profile) {
            throw new RecordNotFoundError("Student profile not found");
        };

        const studentId = profile.id;

        // Prepare array for bulk insert
        const courseArray = courseIds.map(courseId => ({
            studentId, courseId
        }));

        //Save to DB
        return await this.studentCourseRepo.bulkCreateStudentCourses(courseArray);
    };

    async getAllCoursesForStudent(userId) {

        // Get student profile
        const profile = await this.studentProfileRepo.getProfileByUserId(userId);

        if (!profile) {
            throw new RecordNotFoundError("Student profile not found");
        };

        const studentId = profile.id;

        // Get student-course mappings
        const studentCourses = await this.studentCourseRepo.getCoursesByStudent(studentId);

        if (!studentCourses || studentCourses.length === 0) {
            return [];
        }

        // Extract course IDs
        const courseIds = studentCourses.map(sc => sc.courseId);

        // Fetch full course details
        const courses = await this.courseRepo.getCoursesByIds(courseIds);

        return courses;
    };

};