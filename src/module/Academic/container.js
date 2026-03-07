import { ClassLevelRepository } from "./repository/classLevel.repository";
import { CourseRepository } from "./repository/course.repository";
import { LessonRepository } from "./repository/lesson.repository";
import { ModuleRepository } from "./repository/module.repository";
import { StudentCourseRepository } from "./repository/studentCourses.repository";
import { SubModuleRepository } from "./repository/subModule.repository";
import { LessonService } from "./service/lesson.service";
import { ModuleService } from "./service/module.service";
import { StudentCourseService } from "./service/studentCourse.service";
import { SubModuleService } from "./service/subModule.service";

const courseRepoInstance = new CourseRepository;
const studentCourseRepoInstance = new StudentCourseRepository;
const lessonRepoInstance = new LessonRepository;
const classLevelRepoInstance =  new ClassLevelRepository;
const moduleRepoInstance =  new ModuleRepository();
const subModuleRepoInstance = new SubModuleRepository();

export const studentCourseServiceInstance = new StudentCourseService(courseRepoInstance, studentCourseRepoInstance);
export const lessonServiceInstance = new LessonService(lessonRepoInstance, courseRepoInstance, classLevelRepoInstance);
export const moduleServiceInstance =  new ModuleService(lessonRepoInstance, moduleRepoInstance);
export const subModuleServiceInstance = new SubModuleService(subModuleRepoInstance, moduleRepoInstance);