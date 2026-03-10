import QuizQuestion from "../models/quizQuestion.model.js";
import { handleSequelizeError } from "../../../common/error/sequeliseError.error.js";
import { RecordNotFoundError } from "../../../common/error/domainError.error.js";

export class QuizQuestionRepository {

  async createQuizQuestion(data) {
    try {
      const question = await QuizQuestion.create(data);
      return this.mapToQuizQuestionEntity(question);
    } catch (error) {
      handleSequelizeError(error);
    }
  };


  async updateQuizQuestion(id, data) {
    try {
      const [affectedRows] = await QuizQuestion.update(data, { where: { id } });

      if (affectedRows === 0) {
        throw new RecordNotFoundError("QuizQuestion not found");
      }

      const updatedQuestion = await QuizQuestion.findByPk(id);
      return this.mapToQuizQuestionEntity(updatedQuestion);
    } catch (error) {
      handleSequelizeError(error);
    }
  };


  async deleteQuizQuestion(id) {
    try {
      const deletedRows = await QuizQuestion.destroy({ where: { id } });

      if (!deletedRows) throw new RecordNotFoundError("QuizQuestion not found");
      return true;
    } catch (error) {
      handleSequelizeError(error);
    }
  };


  async getQuizQuestionById(id) {
    try {
      const question = await QuizQuestion.findByPk(id);
      return question ? this.mapToQuizQuestionEntity(question) : null;
    } catch (error) {
      handleSequelizeError(error);
    }
  };


  async getAllQuizQuestions() {
    try {
      const questions = await QuizQuestion.findAll();
      return questions.map(question => this.mapToQuizQuestionEntity(question));
    } catch (error) {
      handleSequelizeError(error);
    }
  };


  // GET ALL BY SUBMODULE
  async getQuizQuestionsBySubmodule(submoduleId) {
    try {
      const questions = await QuizQuestion.findAll({
        where: { submoduleId },
        order: [["createdAt", "ASC"]],
      });
      return questions.map(question => this.mapToQuizQuestionEntity(question));
    } catch (error) {
      handleSequelizeError(error);
    }
  };
  

  // HELPER
  mapToQuizQuestionEntity(question) {
    if (!question) return null;

    return {
      id: question.id,
      submoduleId: question.submoduleId,
      question: question.question,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    };
  }
}