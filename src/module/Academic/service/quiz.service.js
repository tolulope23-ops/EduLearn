import { QuizQuestionRepository } from "../repository/quizQuestion.repository.js";
import { QuizOptionRepository } from "../repository/quizOption.repository.js";
import { RecordNotFoundError } from "../../../common/error/domainError.error.js";
import { SubModuleRepository } from "../repository/subModule.repository.js";
import { SubModuleService } from "./subModule.service.js";
import { ModuleProgressService } from "./moduleProgress.service.js";
import { LearningProgress } from "./learningProgress.service.js";

export class QuizService {
  /**
   * @param {QuizQuestionRepository} questionRepo
   * @param {QuizOptionRepository} optionRepo
   * @param {SubModuleRepository} submoduleRepo
   * @param {SubModuleService} submoduleService
   * @param {ModuleProgressService} moduleProgressService
   * @param {LearningProgress} learningProgressService
   */

  constructor(questionRepo, optionRepo, submoduleRepo, submoduleService, moduleProgressService, learningProgressService) {
    this.questionRepo = questionRepo;
    this.optionRepo = optionRepo;
    this.submoduleRepo = submoduleRepo;
    this.submoduleService = submoduleService;
    this.moduleProgressService = moduleProgressService;
    this.learningProgressService = learningProgressService;
  };

// Create bulk quiz question (Admin)
    async createBulkQuizQuestions(questionsArray) {
        if (!Array.isArray(questionsArray) || questionsArray.length === 0) {
            throw new Error("Questions array is required");
        }

        // Map each object to match repo field names
        const questions = questionsArray.map(q => ({
            submoduleId: q.submoduleId,
            question: q.questionText,
            sequenceNumber: q.sequenceNumber ?? null
        }));

        // Call repo once with the full array
        const createdQuestions = await this.questionRepo.bulkCreateQuizQuestions(questions);

        return createdQuestions;
    };

// Update quiz question
    updateQuizQuestion = async (questionId, updateData) => {
        return await this.questionRepo.updateQuizQuestion(questionId, updateData);
    };

// Delete quiz question
    deleteQuizQuestion = async (id) => {
        return await this.questionRepo.deleteQuizQuestion(id);
    };

// Update quiz option
    updateQuizOption = async (id, updateData) => {
        return await this.quizOptionRepo.updateQuizOption(id, updateData);
    };

// Delete quiz option
    deleteQuizOption = async (id) => {
        return await this.quizOptionRepo.deleteQuizOption(id);
    };


// Add options to a quiz question (Admin)
    async addQuizOptions(optionArray) {

    // options: [{ option: 'A', isCorrect: true }, { option: 'B', isCorrect: false }]
        const optionsArray = optionArray.map(opt => ({
            questionId: opt.questionId,
            option: opt.optionText,
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
        console.log(submodule);
        

        if (!submodule) {
            throw new RecordNotFoundError("Submodule not found");
        };

        //Fetch all quiz questions linked to this submodule
        const questions = await this.questionRepo.getQuizQuestionsBySubmodule(submoduleId);
        console.log(questions);
        

        if (!questions || questions.length === 0) {
            throw new RecordNotFoundError(`No quiz question found for this ${submodule.type}`);
        };

        //Pick a question based on submodule type 
        let submoduleQuestion;

        if (submodule.type === "document") {
            submoduleQuestion = questions[1]; // first question for doc
        } else if (submodule.type === "video") {
            submoduleQuestion = questions[9];
        } else {
            submoduleQuestion = questions[0]; // default fallback
        };

        //Fetch options for that question
        const options = await this.optionRepo.getQuizOptionsByQuestion(submoduleQuestion.id);


        // Get correct answer for the question
        const correctAnswer = await this.getCorrectOption(submoduleQuestion.id);

        return {
            // submoduleType: submodule.type,
            question: submoduleQuestion.question,
            options: options.map(opt => opt.option),
            answer: correctAnswer.option

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


    async submitQuiz(studentId, submoduleId, answers) {

        //Grade the quiz
        const result = await this.gradeQuiz(answers);

        const passed = result.percentage >= 70;

        //Get submodule to know module
        const submodule = await this.submoduleService.getSubmoduleById(submoduleId);

        if (!submodule)
            throw new RecordNotFoundError("Submodule not found");

        const moduleId = submodule.moduleId;

        //Increment attempt count for student first attempt
        const module = await this.learningProgressService.getModuleProgress(studentId, moduleId);
        if (module.attemptCount === 0){
            await this.moduleProgressService.incrementAttemptCount(studentId, moduleId)
        };

        //If passed mark submodule complete
        if (passed) {
            await this.learningProgressService.markSubModuleComplete(studentId, submoduleId);
        }else if(module.attemptCount >= 3){
            await this.learningProgressService.markSubModuleComplete(studentId, submoduleId);
        };

        //Return result
        return {
            message: 'Quiz Submitted Successfully',
            passed: passed,
            percentage: result.percentage,
            CorrectAnswer: result.correctAnswers,
            attemptCount: module.attemptCount
        };
    };
};