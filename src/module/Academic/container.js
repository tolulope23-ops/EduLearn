import { CourseRepository } from "./repository/course.repository";
import { StudentCourseRepository } from "./repository/studentCourses.repository";
import { StudentCourseService } from "./service/studentCourse.service";

const courseRepoInstance = new CourseRepository;
const studentCourseRepoInstance = new StudentCourseRepository;

export const studentCourseServiceInstance = new StudentCourseService(courseRepoInstance, studentCourseRepoInstance);