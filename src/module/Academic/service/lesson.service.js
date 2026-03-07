import { RecordNotFoundError } from "../../../common/error/domainError.error";
import { ClassLevelRepository } from "../repository/classLevel.repository";
import { CourseRepository } from "../repository/course.repository";
import { LessonRepository } from "../repository/lesson.repository";

export class LessonService{
    /**
     * @param {LessonRepository} lessonRepo
     * @param {CourseRepository} courseRepo
     * @param {ClassLevelRepository} classLevelRepo
     */

    constructor(lessonRepo, courseRepo, classLevelRepo){
        this.lessonRepo = lessonRepo;
        this.courseRepo = courseRepo;
        this.classLevelRepo = classLevelRepo;
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

    // GET LESSON BY SEQUENCE
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

    async getLessonsByCourseAndClassLevel(courseName, classLevelName) {
        const course = await this.courseRepo.getCourseByName(courseName);
        if (!course)
            throw new RecordNotFoundError(`Course "${courseName}" not found`);

        const classLevel = await this.classLevelRepo.getClassLevelByName(classLevelName);
        if (!classLevel)
            throw new RecordNotFoundError(`Class level "${classLevelName}" not found`);

        return await this.lessonRepo.getLessonsByCourseAndClassLevel(
            course.id,
            classLevel.id
        );
    };

    async updateLesson(lessonId, updateData) {

        const updatePayload = { ...updateData };

        //Updates lesson data that includes classLevel and courseName convert to  their id
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