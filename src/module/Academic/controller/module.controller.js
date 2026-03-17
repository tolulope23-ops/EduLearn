import { ModuleService } from "../service/module.service.js";

export class ModuleController {
  /**
   * @param {ModuleService} moduleService
   */
  constructor(moduleService) {
    this.moduleService = moduleService;
  };

  // Create module
  createModule = async (req, res, next) => {
    try {
      const { lessonId, title, description, sequenceNumber } = req.body;

      const module = await this.moduleService.createModule({
        lessonId,
        title,
        description,
        sequenceNumber
      });

      return res.status(201).json({
        message: module.message,
        data: module.data
      });

    } catch (error) {
      next(error);
    }
  };

// Get module by ID
  getModule = async (req, res, next) => {
    try {
      const { moduleId } = req.params;

      const module = await this.moduleService.getModule(moduleId);

      return res.status(200).json({
        message: module.message,
        data: module.data
      });

    } catch (error) {
      next(error);
    }
  };

// Get modules by lesson
  getModulesByLesson = async (req, res, next) => {
    try {
      const { lessonId } = req.params;

      const modules = await this.moduleService.getModulesByLesson(lessonId);

      return res.status(200).json({
        message: modules.message,
        data: modules.data
      });

    } catch (error) {
      next(error);
    }
  };

  // Get module by sequence
  getModuleBySequence = async (req, res, next) => {
    try {
      const { lessonId, sequenceNumber } = req.query;

      const module = await this.moduleService.getModuleBySequence(
        lessonId,
        Number(sequenceNumber)
      );

      return res.status(200).json({
        message: module.message,
        data: module.data
      });

    } catch (error) {
      next(error);
    }
  };

  // Update module
  updateModule = async (req, res, next) => {
    try {
      const { moduleId } = req.params;

      const updatedModule = await this.moduleService.updateModule(
        moduleId,
        req.body
      );

      return res.status(200).json({
        message: "Module updated successfully",
        data: updatedModule
      });

    } catch (error) {
      next(error);
    }
  };

  // Delete module
  deleteModule = async (req, res, next) => {
    try {
      const { moduleId } = req.params;

      await this.moduleService.deleteModule(moduleId);

      return res.status(200).json({
        message: "Module deleted successfully"
      });

    } catch (error) {
      next(error);
    }
  };
}