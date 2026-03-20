import { RecordNotFoundError } from "../../../common/error/domainError.error.js";
import { CourseRepository } from "../repository/course.repository.js";
import { LessonRepository } from "../repository/lesson.repository.js";
import { EnrollmentService } from "./enrollment.service.js";
import { ModuleService } from "./module.service.js";
import { SubModuleService } from "./subModule.service.js";


export class LearningService {
  /**
   * @param {ModuleService} moduleService
   * @param {SubModuleService} submoduleService
   * @param {EnrollmentService} enrollmentService
   * @param {CourseRepository} CourseRepo
   * @param {LessonRepository} lessonRepo
   */
  constructor(
    moduleService,
    submoduleService,
    enrollmentService,
    lessonRepo
  ) {
    this.moduleService = moduleService;
    this.submoduleService = submoduleService;
    this.enrollmentService = enrollmentService;
    this.lessonRepo = lessonRepo;
  };


//Get Lessons for student based on the course choosen using their user id
    async getLessonsForStudent(userId) {
        const enrollment = await this.enrollmentService.getStudentEnrollment(userId);

        const lessons = await this.lessonRepo.getLessonsByCourseAndClassLevel(
            enrollment.courseIds, enrollment.classLevelId
        );

        return lessons;
    };

// Fetch modules of a lesson
    async getModulesForLesson(lessonId) {

        const modules = await this.moduleService.getModulesByLesson(lessonId);

        if (!modules || modules.length === 0) 
            throw new RecordNotFoundError(`No modules found for lesson ${lessonId}`);
        
        return modules;
    };


// Fetch submodules of a module
    async getSubmodulesForModule(moduleId) {

        const submodules = await this.submoduleService.getSubmodulesByModule(moduleId);

        if (!submodules || submodules.length === 0) {
            throw new RecordNotFoundError(`No submodules found for module ${moduleId}`);
        };

        return submodules;
    };
};