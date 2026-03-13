import { QuizQuestionRepository } from "../repository/quizQuestion.repository.js";
import { QuizOptionRepository } from "../repository/quizOption.repository.js";
import { RecordNotFoundError } from "../../../common/error/domainError.error.js";
import { SubModuleRepository } from "../repository/subModule.repository.js";

export class QuizService {
  /**
   * @param {QuizQuestionRepository} questionRepo
   * @param {QuizOptionRepository} optionRepo
   * @param {SubModuleRepository} submoduleRepo
   */

  constructor(questionRepo, optionRepo, submoduleRepo) {
    this.questionRepo = questionRepo;
    this.optionRepo = optionRepo;
    this.submoduleRepo = submoduleRepo;
  };

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


// Fetch all quiz questions with their option for a submodule (student-facing)
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


// Fetch single question with options (student-facing) 
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
    

// Fetch single quiz question and its options for a given submodule(doc, video).
    async getQuizQuestionForSubmodule(submoduleId) {

        //Fetch submodule details to know its type (doc or video)
        const submodule = await this.submoduleRepo.getSubmoduleById(submoduleId);

        if (!submodule) {
            throw new RecordNotFoundError("Submodule not found");
        };

        // 2. Fetch all quiz questions linked to this submodule
        const questions = await this.questionRepo.getQuizQuestionsBySubmodule(submoduleId);

        if (!questions || questions.length === 0) {
            throw new RecordNotFoundError(`No quiz question found for this ${submodule.type}`);
        };

        //Pick a question based on submodule type 
        let submoduleQuestion;

        if (submodule.type === "document") {
            submoduleQuestion = questions[0]; // first question for doc
        } else if (submodule.type === "video") {
            submoduleQuestion = questions[1];
        } else {
            submoduleQuestion = questions[0]; // default fallback
        };

        //Fetch options for that question
        const options = await this.optionRepo.getQuizOptionsByQuestion(submoduleQuestion.id);

        // Get correct answer for the question
        const correctAnswer = await this.getCorrectOption(submoduleQuestion.id);

        return {
            submoduleType: submodule.type,
            question: submoduleQuestion,
            options,
            answer: correctAnswer
        };
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