import { RecordNotFoundError } from "../../../common/error/domainError.error.js";
import { CourseRepository } from "../repository/course.repository.js";
import { LessonRepository } from "../repository/lesson.repository.js";
import { EnrollmentService } from "./enrollment.services.js";
import { LessonService } from "./lesson.service.js";
import { ModuleService } from "./module.service.js";
import { ModuleProgressService } from "./moduleProgress.service.js";
import { QuizService } from "./quiz.service.js";
import { SubModuleService } from "./subModule.service.js";
import { SubmoduleProgressService } from "./subModuleProgress.service.js";

export class LearningService {
  /**
   * @param {LessonService} lessonService
   * @param {ModuleService} moduleService
   * @param {SubModuleService} submoduleService
   * @param {ModuleProgressService} moduleProgressService
   * @param {SubmoduleProgressService} submoduleProgressService
   * @param {QuizService} quizService
   * @param {EnrollmentService} enrollmentService
   * @param {CourseRepository} CourseRepo
   * @param {LessonRepository} lessonRepo
   */
  constructor(
    
    lessonService,
    moduleService,
    submoduleService,
    moduleProgressService,
    submoduleProgressService,
    quizService,
    enrollmentService,
    CourseRepo,
    lessonRepo
  ) {
    this.lessonService = lessonService;
    this.moduleService = moduleService;
    this.submoduleService = submoduleService;
    this.moduleProgressService = moduleProgressService;
    this.submoduleProgressService = submoduleProgressService;
    this.quizService = quizService;
    this.enrollmentService = enrollmentService;
    this.CourseRepo = CourseRepo;
    this.lessonRepo = lessonRepo;
  };



// Fetch all lessons for a student using their userId
    async getLessonsForStudent(userId) {

        return await this.lessonService.getLessonsForStudent(userId);
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


// Get a student's progress on a module
    async getModuleProgress(studentId, moduleId) {
        return this.moduleProgressService.getModuleProgress(studentId, moduleId);
    };


// Get a student's progress on a submodule
    async getSubmoduleProgress(studentId, submoduleId) {
        return this.submoduleProgressService.getSubmoduleProgress(studentId, submoduleId);
    };


    /* Navigation methods */

//Next Lesson
    async getNextLesson(courseName, classLevelName, currentSequenceNumber) {

        const nextSequence = currentSequenceNumber + 1;

        return this.lessonService.getLessonBySequence(courseName, classLevelName, nextSequence);
    };


//Next Module
    async getNextModule(lessonId, currentSequenceNumber) {

        const nextSequence = currentSequenceNumber + 1;

        const module = await this.moduleService.getModuleBySequence(lessonId, nextSequence);

        if (!module)
            return { message: 'No more modules in this lesson'};

        return module;
    };


//Next SubModule
    async getNextSubmodule(moduleId, currentSequenceNumber) {

        const nextSequence = currentSequenceNumber + 1;

        const submodule = await this.submoduleService.getSubmoduleBySequence(moduleId, nextSequence);

        if (!submodule) 
            return { message: 'No more submodules in this module'};

        return submodule;
    };


    async getNextIncompleteSubmodule(studentId, lessonId) {

        //Get modules in lesson
        const modules = await this.moduleService.getModulesByLesson(lessonId);

        if (!modules || modules.length === 0)
            throw new RecordNotFoundError("No modules found for this lesson");

        for (const module of modules) {

            //Get submodules for module
            const submodules = await this.submoduleService.getSubmodulesByModule(module.id);

            for (const submodule of submodules) {

                //Check progress
                const progress = await this.submoduleProgressService.getSubmoduleProgress(
                    studentId,
                    submodule.id
                );

                //If not completed → return it
                if (!progress || !progress.completed) {
                    return {
                        lessonId,
                        moduleId: module.id,
                        submoduleId: submodule.id
                    };
                };
            };
        };

        //Everything completed
        
        return {
            message: "Lesson fully completed"
        };
    };


// Mark submodule as completed for a student
    async markSubModuleComplete(studentId, submoduleId) {
        await this.submoduleProgressService.markSubmoduleCompleted(studentId, submoduleId);

        //Find module, this submodule belongs to
        const submodule = await this.submoduleService.getSubmoduleById(submoduleId);

        if(!submodule)
            throw new RecordNotFoundError(`Submodule not found`);

        const moduleId = submodule.moduleId;

        //Get all submodules in the module
        const submodules = await this.submoduleService.getSubmodulesByModule(moduleId);

        //Check progress for each submodules
        const progressList = await Promise.all(
            submodules.map(submodule => 
                this.getSubmoduleProgress(studentId, submodule.id)
            )
        );
        
        //Count completed submodules
        const completedCount = progressList.filter(p => p && p.completed).length;
        const totalCount = submodules.length; 

        //Calculate progress percentage
        const moduleProgress = Math.floor((completedCount / totalCount) * 100);

        //Update module progress
        const progress = await this.moduleProgressService.updateModuleProgress(studentId, moduleId,
            {   
                progress: moduleProgress,
                completed: moduleProgress === 100, 
                completionDate: moduleProgress === 100 ? new Date() : null
            }
        );

        return {message: "Submodule marked completed, Module Progress: ", data: progress};
    };


    async submitQuiz(studentId, submoduleId, answers) {

        //Grade the quiz
        const result = await this.quizService.gradeQuiz(answers);

        const passed = result.percentage >= 70;

        //Get submodule to know module
        const submodule = await this.submoduleService.getSubmoduleById(submoduleId);

        if (!submodule)
            throw new RecordNotFoundError("Submodule not found");

        const moduleId = submodule.moduleId;

        //Increment attempt count for student first attempt
        const module = await this.getModuleProgress(studentId, moduleId);
        if (module.attemptCount === 0){
            await this.moduleProgressService.incrementAttemptCount(studentId, moduleId)
        };

        //If passed mark submodule complete
        if (passed) {
            await this.markSubModuleComplete(studentId, submoduleId);
        }else if(module.attemptCount >= 3){
            await this.markSubModuleComplete(studentId, submoduleId);
        };

        //Return result
        return {
            message: 'Quiz Submitted Successfully',
            passed: passed,
            percentage: result.percentage,
            CorrectAnswer: result.correctAnswers,
            attemptCount: module.attemptCount
        };
    };

//Sync progress between FE and BE
    async syncOfflineProgress(studentId, progressUpdates) {

        const results = [];

        for (const update of progressUpdates) {

            // Get existing progress if any
            let existing = null;

            try {
                existing = await this.submoduleProgressService.getSubmoduleProgress(studentId, update.submoduleId);
            } catch {
                // Init if not exists
                existing = await this.submoduleProgressService.initSubmoduleProgress(studentId, update.submoduleId);
            }

            // Merge logic: keep latest or highest values
            const merged = {
                completed: existing.completed || update.completed,
                score: Math.max(existing.score || 0, update.score || 0),
                attemptCount: Math.max(existing.attemptCount || 0, update.attemptCount || 0),
                downloaded: existing.downloaded || update.downloaded,
                downloadedAt: update.downloaded ? new Date(update.downloadedAt) : existing.downloadedAt,
            };

            const updated = await this.submoduleProgressService.updateSubmoduleProgress(
                studentId,
                update.submoduleId,
                merged
            );

            results.push(updated);
        };

        return results;
    };



    // async canAccessSubmodule(studentId, submoduleId) {

    //     //Get submodule
    //     const submodule = await this.submoduleService.getSubmoduleById(submoduleId);

    //     if (!submodule) {
    //         throw new RecordNotFoundError("Submodule not found");
    //     };

    //     //First submodule is always accessible
    //     if (submodule.sequenceNumber === 1) {
    //         return true;
    //     };

    //     //Get previous submodule
    //     const previousSubmodule =
    //         await this.submoduleService.getSubmoduleBySequence(
    //             submodule.moduleId,
    //             submodule.sequenceNumber - 1
    //         );

    //     if (!previousSubmodule) {
    //         return true;
    //     }

    //     //Check progress
    //     const progress =
    //         await this.submoduleProgressService.getSubmoduleProgress(
    //             studentId,
    //             previousSubmodule.id
    //         );

    //     //Access only if previous completed
    //     return progress && progress.completed;
    // };
};