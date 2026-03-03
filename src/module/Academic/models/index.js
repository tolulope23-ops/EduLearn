import ClassLevel from './classLevel.model.js';
import Course from './course.model.js';
import Lesson from './lesson.model.js';
import Module from './module.model.js';
import Submodule from './submodule.model.js';
import ModuleProgress from './moduleProgress.model.js';
import SubmoduleProgress from './subModuleProgress.model.js';
import StudentProfile from '../../Auth/models/studentProfile.model.js';
import StudentCourses from './studentCourse.model.js';
import QuizQuestion from './quizQuestion.model.js';
import QuizOption from './quizOption.model.js';

// Import associations to initialize relationships
import './associations.js';

export {
  ClassLevel,
  Course,
  Lesson,
  Module,
  Submodule,
  ModuleProgress,
  SubmoduleProgress,
  StudentProfile,
  StudentCourses,
  QuizQuestion,
  QuizOption,
};