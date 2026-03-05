import QuizOption from "../models/quizOption.model.js";
import { handleSequelizeError } from "../../../common/error/sequeliseError.error.js";
import { RecordNotFoundError } from "../../../common/error/domainError.error.js";

export class QuizOptionRepository {

  async createQuizOption(data) {
    try {
      const option = await QuizOption.create(data);
      return this.mapToEntity(option);
    } catch (error) {
      handleSequelizeError(error);
    }
  }

  // BULK CREATE (for multiple options at once)
  async bulkCreateQuizOptions(optionsArray) {
    try {
      const options = await QuizOption.bulkCreate(optionsArray);
      return options.map(this.mapToEntity);
    } catch (error) {
      handleSequelizeError(error);
    }
  }


  async updateQuizOption(id, data) {
    try {
      const [affectedRows] = await QuizOption.update(data, { where: { id } });

      if (affectedRows === 0) {
        throw new RecordNotFoundError("QuizOption not found");
      }

      const updatedOption = await QuizOption.findByPk(id);
      return this.mapToEntity(updatedOption);
    } catch (error) {
      handleSequelizeError(error);
    }
  }

  // DELETE
  async deleteQuizOption(id) {
    try {
      const deletedRows = await QuizOption.destroy({ where: { id } });
      if (!deletedRows) throw new RecordNotFoundError("QuizOption not found");
      return true;
    } catch (error) {
      handleSequelizeError(error);
    }
  }

  // GET BY ID
  async getQuizOptionById(id) {
    try {
      const option = await QuizOption.findByPk(id);
      return option ? this.mapToEntity(option) : null;
    } catch (error) {
      handleSequelizeError(error);
    }
  }

  // GET ALL OPTIONS
  async getAllQuizOptions() {
    try {
      const options = await QuizOption.findAll();
      return options.map(this.mapToEntity);
    } catch (error) {
      handleSequelizeError(error);
    }
  }

  // GET ALL OPTIONS FOR A QUESTION
  async getQuizOptionsByQuestion(questionId) {
    try {
      const options = await QuizOption.findAll({
        where: { questionId },
        order: [["createdAt", "ASC"]],
      });
      return options.map(this.mapToEntity);
    } catch (error) {
      handleSequelizeError(error);
    }
  }

  // HELPER
  mapToEntity(option) {
    if (!option) return null;

    return {
      id: option.id,
      questionId: option.questionId,
      option: option.option,
      isCorrect: option.isCorrect,
      createdAt: option.createdAt,
      updatedAt: option.updatedAt,
    };
  }
}