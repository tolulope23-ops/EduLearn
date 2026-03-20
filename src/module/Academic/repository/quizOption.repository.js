import QuizOption from "../models/quizOption.model.js";
import { handleSequelizeError } from "../../../common/error/sequeliseError.error.js";
import { RecordNotFoundError } from "../../../common/error/domainError.error.js";
import { Op } from "sequelize";

export class QuizOptionRepository {

  async createQuizOption(data) {
    try {
      const option = await QuizOption.create(data);
      return this.mapToQuizOptionEntity(option);
    } catch (error) {
      handleSequelizeError(error);
    }
  }

  // BULK CREATE (for multiple options at once)
  async bulkCreateQuizOptions(optionsArray) {
    try {
      const options = await QuizOption.bulkCreate(optionsArray);
      return options.map(option => this.mapToQuizOptionEntity(option));
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
      return this.mapToQuizOptionEntity(updatedOption);
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
      return option ? this.mapToQuizOptionEntity(option) : null;
    } catch (error) {
      handleSequelizeError(error);
    }
  }

  // GET ALL OPTIONS
  async getAllQuizOptions() {
    try {
      const options = await QuizOption.findAll();
      return options.map(option => this.mapToQuizOptionEntity(option));
    } catch (error) {
      handleSequelizeError(error);
    }
  };

  // GET ALL OPTIONS FOR A QUESTION
  async getOptionsByQuestionIds(questionIds) {
    try {
      
      if (!Array.isArray(questionIds)) questionIds = [questionIds];

      const options = await QuizOption.findAll({
        where: {
          questionId: {
            [Op.in]: questionIds
          }
        }
      });

      return options.map(opt => this.mapToQuizOptionEntity(opt));
    } catch (error) {
      handleSequelizeError(error);
    }
  };


  async getCorrectOptionsByQuestionIds(questionIds) {
    try {

      if (!Array.isArray(questionIds)) questionIds = [questionIds];

      const options = await QuizOption.findAll({
        where: {
          questionId: {
            [Op.in]: questionIds
          },
          isCorrect: true
        },
        attributes: ["id", "questionId", "isCorrect"]
      });

      return options.map(opt => this.mapToQuizOptionEntity(opt));
    } catch (error) {
      handleSequelizeError(error)
    }  
}


  // HELPER
  mapToQuizOptionEntity(option) {
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