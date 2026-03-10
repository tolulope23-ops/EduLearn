import { QuizQuestionRepository } from "../repository/quizQuestion.repository.js";
import { QuizOptionRepository } from "../repository/quizOption.repository.js";
import { RecordNotFoundError } from "../../../common/error/domainError.error.js";

export class QuizService {
  /**
   * @param {QuizQuestionRepository} questionRepo
   * @param {QuizOptionRepository} optionRepo
   */

  constructor(questionRepo, optionRepo) {
    this.questionRepo = questionRepo;
    this.optionRepo = optionRepo;
  }

// Create a quiz question (Admin)
    async createQuizQuestion(submoduleId, question) {
        return await this.questionRepo.createQuizQuestion({
            submoduleId,
            question: question,
        });
    };

// Add options to a quiz question (Admin)
    async addQuizOptions(questionId, options) {

    // options: [{ option: 'A', isCorrect: true }, { option: 'B', isCorrect: false }]
        const optionsArray = options.map(opt => ({
            questionId,
            option: opt.option,
            isCorrect: opt.isCorrect,
        }));

        return await this.optionRepo.bulkCreateQuizOptions(optionsArray);
    };


// Fetch quiz questions and option for a submodule (student-facing)
    async getQuizBySubmodule(submoduleId) {
        const questions = await this.questionRepo.getQuizQuestionsBySubmodule(submoduleId);

        if (!questions || questions.length === 0) {
            throw new RecordNotFoundError("No quiz found for this submodule");
        };

        // Fetch options for each question
        const quizWithOptions = await Promise.all(
            questions.map(async (q) => {
                const options = await this.optionRepo.getQuizOptionsByQuestion(q.id);
                return { ...q, options };
            })
        );

        return quizWithOptions;
    };


// Fetch a single question with options (student-facing) 
    async getQuizQuestionWithOptions(questionId) {
        const question = await this.questionRepo.getQuizQuestionById(questionId);
        if (!question) 
            throw new RecordNotFoundError("Quiz question not found");

        const options = await this.optionRepo.getQuizOptionsByQuestion(questionId);
        
        return { ...question, options };
    };

//Fetch correct option from questions
    async getCorrectOption(questionId) {

        const options = await this.optionRepo.getQuizOptionsByQuestion(questionId);

        const correctOption = options.find(opt => opt.isCorrect === true);

        if (!correctOption)
            throw new RecordNotFoundError(`Correct option not found for question ${questionId}`);

        return correctOption;
    };

//Grade quiz from correct options
    async gradeQuiz(answers) {

        let correctAnswers = 0;

        let wrongQuestions = [];

        for (const answer of answers) {

            const correctOption = await this.getCorrectOption(answer.questionId);

            if (correctOption.id === answer.optionId) {
                correctAnswers++;
            } else {
                wrongQuestions.push({
                    questionId: answer.questionId,
                    correctOptionId: correctOption.id
                });
            };
        };

        const totalQuestions = answers.length;
        const wrongAnswers = totalQuestions - correctAnswers;

        const percentage = Math.floor((correctAnswers / totalQuestions) * 100);

        return {
            totalQuestions,
            correctAnswers,
            wrongAnswers,
            percentage,
            wrongQuestions
        };
    };
};