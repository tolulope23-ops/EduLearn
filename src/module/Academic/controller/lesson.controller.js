import { LessonService } from "../service/lesson.service.js";

export class LessonController {
  /**
   * @param {LessonService} lessonService
   */
  constructor(lessonService) {
    this.lessonService = lessonService;
  };

// Create lesson
  createLesson = async (req, res, next) => {
    try {
      const { course, classLevel, title, description, sequenceNumber } = req.body;

      const lesson = await this.lessonService.createLesson({
        courseName: course,
        classLevelName: classLevel,
        title,
        description,
        sequenceNumber
      });

      return res.status(201).json({
        message: lesson.message,
        data: lesson.data
      });

    } catch (error) {
      next(error);
    }
  };

// Get lesson by ID
  getLesson = async (req, res, next) => {
    try {
      const { lessonId } = req.params;

      const lesson = await this.lessonService.getLesson(lessonId);

      return res.status(200).json({
        message: lesson.message,
        data: lesson.data
      });

    } catch (error) {
      next(error);
    };
  };

// Get lesson by sequence
  getLessonBySequence = async (req, res, next) => {
    try {
      const { courseName, classLevelName, sequenceNumber } = req.query;

      const lesson = await this.lessonService.getLessonBySequence(
        courseName,
        classLevelName,
        Number(sequenceNumber)
      );

      return res.status(200).json({
        message: lesson.message,
        data: lesson.data
      });

    } catch (error) {
      next(error);
    }
  };


// Update lesson
  updateLesson = async(req, res, next) => {
    try {
      const { lessonId } = req.params;

      const updatedLesson = await this.lessonService.updateLesson(
        lessonId,
        req.body
      );

      return res.status(200).json({
        message: updatedLesson.message,
        data: updatedLesson.data
      });

    } catch (error) {
      next(error);
    }
  }

// Delete lesson
  deleteLesson = async(req, res, next) => {
    try {
      const { lessonId } = req.params;

      await this.lessonService.deleteLesson(lessonId);

      return res.status(200).json({
        message: "Lesson deleted successfully"
      });

    } catch (error) {
      next(error);
    };
  };
};