import { RecordNotFoundError } from "../../../common/error/domainError.error";
import { ClassLevelRepository } from "../repository/classLevel.repository";
import { CourseRepository } from "../repository/course.repository";
import { LessonRepository } from "../repository/lesson.repository";
import { EnrollmentService } from "./enrollment.services";

export class LessonService{
    /**
     * @param {LessonRepository} lessonRepo
     * @param {CourseRepository} courseRepo
     * @param {ClassLevelRepository} classLevelRepo
     * @param { EnrollmentService} enrollmentService
     */

    constructor(lessonRepo, courseRepo, classLevelRepo, enrollmentService){
        this.lessonRepo = lessonRepo;
        this.courseRepo = courseRepo;
        this.classLevelRepo = classLevelRepo;
        this.enrollmentService = enrollmentService;
    };


    async createLesson({courseName, classLevelName, title, description, sequenceNumber}){
        const course = await this.courseRepo.getCourseByName(courseName);
        if (!course) throw new RecordNotFoundError(`Course "${courseName}" not found`);

        const classLevel  = await this.classLevelRepo.getClassLevelByName(classLevelName);
        if (!classLevel) throw new RecordNotFoundError(`Class level "${classLevelName}" not found`);

        const courseId = course.id;
        const classLevelId = classLevel.id;

        const data = {
            courseId,
            classLevelId,
            title,
            description,
            sequenceNumber
        };

        await this.lessonRepo.createLesson(data);
    };


    async getLesson(lessonId){
        const lesson = await this.lessonRepo.getLessonById(lessonId);

        if (!lesson) 
            throw new RecordNotFoundError(`Lesson not found`);

        return lesson;
    };


    async getLessonBySequence(courseName, classLevelName, sequenceNumber) {
        const course = await this.courseRepo.getCourseByName(courseName);

        if (!course) 
            throw new RecordNotFoundError(`Course "${courseName}" not found`);

        const classLevel = await this.classLevelRepo.getClassLevelByName(classLevelName);

        if (!classLevel) 
            throw new RecordNotFoundError(`Class level "${classLevelName}" not found`);

        const lesson = await this.lessonRepo.getLessonBySequence(
            course.id,
            classLevel.id,
            sequenceNumber
        );

        if (!lesson) throw new RecordNotFoundError("Lesson not found");

        return lesson;
    };


    async getLessonsForStudent(userId) {
        const enrollment = await this.enrollmentService.getStudentEnrollment(userId);

        const lessons = await this.lessonRepo.getLessonsByCourseAndClassLevel(
            enrollment.courseIds, enrollment.classLevelId
        );

        return lessons;
    };


    async updateLesson(lessonId, updateData) {

        const updatePayload = { ...updateData };

        //Updates lesson data that includes classLevel and courseName convert to their id
        if (updateData.classLevel){
            const classlevel = await this.classLevelRepo.getClassLevelByName(updateData.classLevel);
            if (!classlevel) {
                throw new RecordNotFoundError("Class level not found");
            };

            updatePayload.classLevelId = classlevel.id;
            delete updatePayload.classLevel;
        };

        if (updateData.course){
            const courseName = await this.courseRepo.getCourseByName(updateData.course);
            if (!courseName) {
                throw new RecordNotFoundError("Course not found");
            };

            updatePayload.courseId = courseName.id;
            delete updatePayload.course;
        };

        const lesson = await this.lessonRepo.getLessonById(lessonId);

        if (!lesson)
            throw new RecordNotFoundError("Lesson not found");

        return await this.lessonRepo.updateLesson(lessonId, updatePayload);
    };

    async deleteLesson(lessonId) {

        const lesson = await this.lessonRepo.getLessonById(lessonId);

        if (!lesson)
            throw new RecordNotFoundError("Lesson not found");

        return await this.lessonRepo.deleteLesson(lessonId);
    };
};