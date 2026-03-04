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

//  Student ↔ ClassLevel 
ClassLevel.hasMany(StudentProfile, { foreignKey: 'classLevelId', as: 'students' });
StudentProfile.belongsTo(ClassLevel, { foreignKey: 'classLevelId', as: 'classLevel' });

//Student ↔ Courses 
StudentProfile.belongsToMany(Course, { through: StudentCourses, foreignKey: 'studentId', otherKey: 'courseId', as: 'courses' });
Course.belongsToMany(StudentProfile, { through: StudentCourses, foreignKey: 'courseId', otherKey: 'studentId', as: 'students' });

// Course → Lessons
Course.hasMany(Lesson, { foreignKey: 'courseId', as: 'lessons' });
Lesson.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

// ClassLevel → Lessons
ClassLevel.hasMany(Lesson, { foreignKey: 'classLevelId', as: 'lessons' });
Lesson.belongsTo(ClassLevel, { foreignKey: 'classLevelId', as: 'classLevel' });

// Lesson → Modules
Lesson.hasMany(Module, { foreignKey: 'lessonId', as: 'modules' });
Module.belongsTo(Lesson, { foreignKey: 'lessonId', as: 'lesson' });

// Module → Submodules
Module.hasMany(Submodule, { foreignKey: 'moduleId', as: 'submodules' });
Submodule.belongsTo(Module, { foreignKey: 'moduleId', as: 'module' });

// Student ↔ Module (progress)
StudentProfile.belongsToMany(Module, {
  through: ModuleProgress,
  foreignKey: 'studentId',
  otherKey: 'moduleId',
  as: 'moduleProgress'
});
Module.belongsToMany(StudentProfile, {
  through: ModuleProgress,
  foreignKey: 'moduleId',
  otherKey: 'studentId',
  as: 'students'
});

ModuleProgress.belongsTo(StudentProfile, { foreignKey: 'studentId', as: 'student' });
ModuleProgress.belongsTo(Module, { foreignKey: 'moduleId', as: 'module' });

//Student ↔ Submodule (progress)
StudentProfile.belongsToMany(Submodule, {
  through: SubmoduleProgress,
  foreignKey: 'studentId',
  otherKey: 'submoduleId',
  as: 'submoduleProgress',
});

Submodule.belongsToMany(StudentProfile, {
  through: SubmoduleProgress,
  foreignKey: 'submoduleId',
  otherKey: 'studentId',
  as: 'students',
});

SubmoduleProgress.belongsTo(StudentProfile, { foreignKey: 'studentId', as: 'student' });
SubmoduleProgress.belongsTo(Submodule, { foreignKey: 'submoduleId', as: 'submodule' });

// Submodule (quiz) → QuizQuestion
Submodule.hasMany(QuizQuestion, { foreignKey: 'submoduleId', as: 'quizQuestions' });
QuizQuestion.belongsTo(Submodule, { foreignKey: 'submoduleId', as: 'submodule' });

//QuizQuestion → QuizOption
QuizQuestion.hasMany(QuizOption, { foreignKey: 'questionId', as: 'options' });
QuizOption.belongsTo(QuizQuestion, { foreignKey: 'questionId', as: 'question' });