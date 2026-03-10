import { StudentProfileRepository } from "../Auth/repository/studentProfile.repository";
import { ClassLevelRepository } from "./repository/classLevel.repository";
import { CourseRepository } from "./repository/course.repository";
import { LessonRepository } from "./repository/lesson.repository";
import { ModuleRepository } from "./repository/module.repository";
import { ModuleProgressRepository } from "./repository/moduleProgress.repository";
import { QuizOptionRepository } from "./repository/quizOption.repository";
import { QuizQuestionRepository } from "./repository/quizQuestion.repository";
import { StudentCourseRepository } from "./repository/studentCourses.repository";
import { SubModuleRepository } from "./repository/subModule.repository";
import { SubmoduleProgressRepository } from "./repository/submoduleProgress.repository";
import { EnrollmentService } from "./service/enrollment.services";
import { LearningService } from "./service/learning.service";
import { LessonService } from "./service/lesson.service";
import { ModuleService } from "./service/module.service";
import { ModuleProgressService } from "./service/moduleProgress.service";
import { QuizService } from "./service/quiz.service";
import { StudentCourseService } from "./service/studentCourse.service";
import { SubModuleService } from "./service/subModule.service";
import { SubmoduleProgressService } from "./service/subModuleProgress.service";

const courseRepoInstance = new CourseRepository();
const studentCourseRepoInstance = new StudentCourseRepository();
const lessonRepoInstance = new LessonRepository();
const classLevelRepoInstance =  new ClassLevelRepository();
const moduleRepoInstance =  new ModuleRepository();
const moduleProgressRepoInstance = ModuleProgressRepository();
const subModuleRepoInstance = new SubModuleRepository();
const subModuleProgressRepoInstance = new SubmoduleProgressRepository();
const quizQuestionRepo = new QuizQuestionRepository();
const quizOptionRepo = new QuizOptionRepository(); 
const studentProfileRepoInstance =  new StudentProfileRepository();
const enrollmentServiceInstance =  new EnrollmentService(studentProfileRepoInstance, studentCourseRepoInstance);




export const studentCourseServiceInstance = new StudentCourseService(courseRepoInstance, studentCourseRepoInstance);
export const lessonServiceInstance = new LessonService(lessonRepoInstance, courseRepoInstance, classLevelRepoInstance, enrollmentServiceInstance);
export const moduleServiceInstance =  new ModuleService(lessonRepoInstance, moduleRepoInstance);
export const subModuleServiceInstance = new SubModuleService(subModuleRepoInstance, moduleRepoInstance);
export const moduleProgressServiceInstance = new ModuleProgressService(moduleProgressRepoInstance);
export const subModuleProgressServiceInstance = new SubmoduleProgressService(subModuleProgressRepoInstance);
export const quizServiceInstance = new QuizService(quizQuestionRepo, quizOptionRepo);
export const learningServiceInstance =  new LearningService(
    learningServiceInstance,
    moduleServiceInstance, 
    subModuleServiceInstance, 
    moduleProgressServiceInstance, 
    subModuleProgressServiceInstance, 
    quizServiceInstance, 
    enrollmentServiceInstance, 
    courseRepoInstance
);