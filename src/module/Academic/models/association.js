import ClassLevel from './classLevel.model.js';
import Course from './course.model.js';
import Lesson from './lesson.model.js';
import Module from './module.model.js';
import Submodule from './submodule.model.js';
import ModuleProgress from './moduleProgress.model.js';
import SubmoduleProgress from './submoduleProgress.model.js';
import StudentProfile from '../../Auth/models/studentProfile.model.js';


ClassLevel.hasMany(StudentProfile, {foreignKey: 'classLevelId', as: 'students'});
StudentProfile.belongsTo(ClassLevel, {foreignKey: 'classLevelId', as: 'classLevel'});

Course.hasMany(Lesson, {foreignKey: 'courseId', as: 'lessons'});
Lesson.belongsTo(Course, {foreignKey: 'courseId', as: 'course'});

Lesson.hasMany(Module, {foreignKey: 'lessonId', as: 'modules'});
Module.belongsTo(Lesson, {foreignKey: 'lessonId', as: 'lesson'});

Module.hasMany(Submodule, {foreignKey: 'moduleId', as: 'submodules'});
Submodule.belongsTo(Module, {foreignKey: 'moduleId', as: 'module'});

StudentProfile.belongsToMany(Module, {through: ModuleProgress, foreignKey: 'studentId', otherKey: 'moduleId', as: 'moduleProgress'});
Module.belongsToMany(StudentProfile, {through: ModuleProgress, foreignKey: 'moduleId', otherKey: 'studentId', as: 'students'});

ModuleProgress.belongsTo(StudentProfile, { foreignKey: 'studentId', as: 'student'});
ModuleProgress.belongsTo(Module, {foreignKey: 'moduleId', as: 'module'});

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

SubmoduleProgress.belongsTo(StudentProfile, {foreignKey: 'studentId',as: 'student'});
SubmoduleProgress.belongsTo(Submodule, {foreignKey: 'submoduleId',as: 'submodule'});