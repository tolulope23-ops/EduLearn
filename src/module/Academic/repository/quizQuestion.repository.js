import QuizQuestion from "../models/quizQuestion.model.js";
import { handleSequelizeError } from "../../../common/error/sequeliseError.error.js";
import { RecordNotFoundError } from "../../../common/error/domainError.error.js";
import SubModule from "../models/subModule.model.js";
import QuizOption from "../models/quizOption.model.js";

export class QuizQuestionRepository {

// Bulk Create Question
  async bulkCreateQuizQuestions(questionsArray) {
    try {
      //Sequelize bulkCreate
      const questions = await QuizQuestion.bulkCreate(questionsArray);

      // Map to entity format
      return questions.map(q => this.mapToQuizQuestionEntity(q));
    } catch (error) {
      handleSequelizeError(error);
    }
  };


  async updateQuizQuestion(id, data) {
    try {

      const question = await QuizQuestion.findByPk(id);

      if (!question) {
        throw new RecordNotFoundError("Quiz Question not found");
      }

      await question.update(data);

      return this.mapToQuizQuestionEntity(question);

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
    // return this.mapToQuizQuestionEntity(questions);
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
      submodule: question.submodule ?? null,
      options: question.options ?? [],
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    };
  }
}