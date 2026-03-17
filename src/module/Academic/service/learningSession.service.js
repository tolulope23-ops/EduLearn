import { CourseRepository } from "../repository/course.repository.js";
import { LessonRepository } from "../repository/lesson.repository.js";
import { EnrollmentService } from "./enrollment.services.js";
import { ModuleService } from "./module.service.js";
import { SubModuleService } from "./subModule.service.js";
import { SubmoduleProgressService } from "./subModuleProgress.service.js";

export class LearningSession{
    /**
     * @param {EnrollmentService} enrollmentService
     * @param {CourseRepository} CourseRepo
     * @param {LessonRepository} lessonRepo
     * @param {ModuleService} moduleService
     * @param {SubModuleService} submoduleService
     * @param {SubmoduleProgressService} submoduleProgressService
     */

    constructor(enrollmentService, CourseRepo, lessonRepo, moduleService, submoduleService, submoduleProgressService){
        this.enrollmentService = enrollmentService;
        this.CourseRepo = CourseRepo;
        this.lessonRepo = lessonRepo;
        this.moduleService = moduleService;
        this.submoduleService = submoduleService;
        this.submoduleProgressService = submoduleProgressService
    };


//Start learning logic for new user(student)
    async startLearning(userId){

        //Get student enrollment
        const enrollment = await this.enrollmentService.getStudentEnrollment(userId)
        
        const { studentId, classLevelId, courseIds } = enrollment;

        //Get Science course first
        const scienceCourse = await this.CourseRepo.getCourseByName("SCIENCE");

        let selectedCourseId;

        if(scienceCourse && courseIds.includes(scienceCourse.id))
            selectedCourseId = scienceCourse.id;
        else{
            selectedCourseId = courseIds[0];
        };

        //Get student first lesson
        const lesson = await this.lessonRepo.getLessonsByCourseAndClassLevel(
            [selectedCourseId], classLevelId
        );

        if(!lesson || lesson.length === 0)
            throw new RecordNotFoundError("No lessons found");

        const firstLesson = lesson[0];


        //Get first module
        const modules = await this.moduleService.getModulesByLesson(firstLesson.id);

        if(!modules || modules.length === 0)
        throw new RecordNotFoundError("No modules found");

        const firstModule = modules[0];

        //Get first subModule
        const submodules = await this.submoduleService.getSubmodulesByModule(firstModule.id);

        if(!submodules || submodules.length === 0)
            throw new RecordNotFoundError("No submodules found");

        const firstSubModule = submodules[0];


        return {
            courseId: selectedCourseId,
            lessonId: firstLesson.id,
            moduleId: firstModule.id,
            submoduleId: firstSubModule.id
        };
    };
    
//Resume learning logic for existing user(student)
    async resumeLesson(studentId, courseId) {

        // Verify student enrollment
        const enrollment = await this.enrollmentService.getStudentEnrollmentByStudentId(studentId);

        if (!enrollment.courseIds.includes(courseId))
            throw new RecordNotFoundError("Student not enrolled in this course");

        //Fetch Lesson
        const lessons = await this.lessonRepo.getLessonsByCourseAndClassLevel(
            [courseId],
            enrollment.classLevelId
        );

        if (!lessons || lessons.length === 0) {
            throw new RecordNotFoundError("No lessons found for this course");
        };

        // Fetch all modules for these lessons
        const lessonIds = lessons.map(lesson => lesson.id);

        const modules = await this.moduleService.getModulesByLesson(lessonIds);

        if (!modules || modules.length === 0) {
            throw new RecordNotFoundError("No modules found for lessons");
        };

        // Fetch all submodules for these modules
        const moduleIds = modules.map(module => module.id);

        const submodules = await this.submoduleService.getSubmodulesByModule(moduleIds);

        if (!submodules || submodules.length === 0) {
            throw new RecordNotFoundError("No submodules found");
        };

        // Fetch all progress records for the student
        const submoduleIds = submodules.map(sub => sub.id);

        const progressRecords =
            await this.submoduleProgressService.getSubmoduleProgress(
                studentId,
                submoduleIds
            );


        // Convert progress to lookup map for faster access
        const progressMap = new Map();

        for (const progress of progressRecords) {
            progressMap.set(progress.submoduleId, progress);
        };

        // Loop through lessons → modules → submodules (in memory)
        for (const lesson of lessons) {

            const lessonModules = modules.filter(m => m.lessonId === lesson.id);

            for (const module of lessonModules) {

                const moduleSubmodules = submodules.filter(
                    s => s.moduleId === module.id
                );

                for (const submodule of moduleSubmodules) {

                    const progress = progressMap.get(submodule.id);

                    if (!progress || !progress.completed) {

                        return {
                            lessonId: lesson.id,
                            moduleId: module.id,
                            submoduleId: submodule.id
                        };

                    }
                }
            }
        }

        // If everything is completed return the last submodule
        const lastLesson = lessons[lessons.length - 1];

        const lastModule = modules
            .filter(m => m.lessonId === lastLesson.id)
            .slice(-1)[0];

        const lastSubmodule = submodules
            .filter(s => s.moduleId === lastModule.id)
            .slice(-1)[0];

        return {
            lessonId: lastLesson.id,
            moduleId: lastModule.id,
            submoduleId: lastSubmodule.id,
            message: "All lessons completed"
        };
    };
}