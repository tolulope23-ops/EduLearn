import { RecordNotFoundError } from "../../../common/error/domainError.error.js";
import { StudentProfileRepository } from "../../Auth/repository/studentProfile.repository.js";
import { StudentCourseRepository } from "../repository/studentCourses.repository.js";

export class EnrollmentService {
    /**
     * @param {StudentProfileRepository} studentProfileRepo 
     * @param {StudentCourseRepository} studentCoursesRepo
     */

    constructor(studentProfileRepo, studentCoursesRepo){
        this.studentProfileRepo = studentProfileRepo;
        this.studentCoursesRepo = studentCoursesRepo;
    }

    async getStudentEnrollment(userId){

        const profile = await this.studentProfileRepo.getProfileByUserId(userId);

        if(!profile)
            throw new RecordNotFoundError("Student profile not found");

        if(!profile.classLevelId)
            throw new RecordNotFoundError("Student class level not found");

        const studentId = profile.id;
        const classLevelId = profile.classLevelId;

        const studentCourses = await this.studentCoursesRepo.getCoursesByStudent(studentId);

        if(!studentCourses || studentCourses.length === 0)
            throw new RecordNotFoundError("Student not enrolled in any course");

        const courseIds = studentCourses.map(c => c.courseId);

        return {
            studentId,
            classLevelId,
            courseIds
        };
    };

};