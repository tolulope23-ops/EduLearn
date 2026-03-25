import { QuizQuestionRepository } from "../repository/quizQuestion.repository.js";
import { QuizOptionRepository } from "../repository/quizOption.repository.js";
import { RecordNotFoundError } from "../../../common/error/domainError.error.js";
import { SubModuleRepository } from "../repository/subModule.repository.js";
import { SubModuleService } from "./subModule.service.js";
import { ModuleProgressService } from "./moduleProgress.service.js";
import { LearningProgress } from "./learningProgress.service.js";
import { StudentProfileRepository } from "../../Auth/repository/studentProfile.repository.js";
import { SubmoduleProgressService } from "./subModuleProgress.service.js";


export class QuizService {
  /**
   * @param {QuizQuestionRepository} questionRepo
   * @param {QuizOptionRepository} optionRepo
   * @param {SubModuleRepository} submoduleRepo
   * @param {SubModuleService} submoduleService
   * @param {ModuleProgressService} moduleProgressService
   * @param {SubmoduleProgressService} submoduleProgressService
   * @param {LearningProgress} learningProgressService
   * @param {StudentProfileRepository} studentProfileRepo
   */

  constructor(questionRepo, optionRepo, submoduleRepo, submoduleService, moduleProgressService, submoduleProgressService, learningProgressService, studentProfileRepo) {
    this.questionRepo = questionRepo;
    this.optionRepo = optionRepo;
    this.submoduleRepo = submoduleRepo;
    this.submoduleService = submoduleService;
    this.moduleProgressService = moduleProgressService;
    this.submoduleProgressService = submoduleProgressService
    this.learningProgressService = learningProgressService;
    this.studentProfileRepo = studentProfileRepo;
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

//Updates quiz option 
    updateQuizOption = async (id, updateData) => {
        return await this.optionRepo.updateQuizOption(id, updateData);
    };

// Deletes quiz option
    deleteQuizOption = async (id) => {
        return await this.optionRepo.deleteQuizOption(id);
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
    async getQuizBySubmodule() {
        const questions = await this.questionRepo.getAllQuizQuestions();

        if (!questions || questions.length === 0) {
            throw new RecordNotFoundError("No quiz found for this submodule");
        };

        // collect all questionIds
        const questionIds = questions.map(q => q.id);

        // fetch ALL options at once
        const allOptions = await this.optionRepo.getOptionsByQuestionIds(questionIds);

        // group options by questionId
        const optionsMap = {};

        for (const opt of allOptions) {
            if (!optionsMap[opt.questionId]) {
                optionsMap[opt.questionId] = [];
            }

            optionsMap[opt.questionId].push({
                optionId: opt.id,
                text: opt.option
            });
        }

        // map questions with grouped options
        const quiz = questions.map(q => ({
            questionId: q.id,
            question: q.question,
            options: optionsMap[q.id] || []
        }));

        return quiz;
    };


// Fetch single question with options (student-facing) 
    async getQuizQuestionWithOptions(questionId) {
        const question = await this.questionRepo.getQuizQuestionById(questionId);

        if (!question) 
            throw new RecordNotFoundError("Quiz question not found");
        
        const questionEntity = question;
        
        const options = await this.optionRepo.getOptionsByQuestionIds([questionId]);

        const correctOptions = await this.getCorrectOption([questionId]);

        const correctAnswer = correctOptions[questionId];

        return {
            questionId: questionEntity.id,
            question: questionEntity.question,
            options: options.map(opt => ({
                optionId: opt.id,
                text: opt.option
            })),
            answer: correctAnswer ? {
                optionId: correctAnswer.id,
                text: correctAnswer.option
            } : null
        };
}

//Fetch correct option from questions
    async getCorrectOption(questionIds) {

        const correctOptions = await this.optionRepo.getCorrectOptionsByQuestionIds([questionIds]);

        const correctOptionsMap = {};

        for (const opt of correctOptions) {
            correctOptionsMap[opt.questionId] = opt;
        };
        
        return correctOptionsMap;
    };
    

// Fetch single quiz question and its options for a given submodule(doc, video).
    async getQuizQuestionForSubmodule(submoduleId) {

        //Fetch submodule details to know its type (doc or video)
        const submodule = await this.submoduleRepo.getSubmoduleById(submoduleId);
         

        if (!submodule) {
            throw new RecordNotFoundError("Submodule not found");
        };

        //Fetch all quiz questions linked to this submodule
        const question = await this.questionRepo.getQuizQuestionsBySubmodule(submoduleId);
        

        if (!question || question.length === 0) {
            throw new RecordNotFoundError(`No quiz question found for this ${submodule.type}`);
        };

        const submoduleQuestion = question[0];
        
        const options = await this.optionRepo.getOptionsByQuestionIds([submoduleQuestion.id]);
        

        // Get correct answer for the question
        const correctAnswerMap = await this.getCorrectOption([submoduleQuestion.id]);

        const correctOption = correctAnswerMap[submoduleQuestion.id];
        
    
        return {
            question: submoduleQuestion.question,
            options: options.map(opt => opt.option),
            correctAnswer: correctOption?.option
        };
    };


//Grade quiz from correct options
    async gradeQuiz(answers) {

        // Extract all question IDs from submitted answers
        const questionIds = answers.map(a => a.questionId);

        // Fetch all correct options at once
        const correctOptionsList = await this.optionRepo.getCorrectOptionsByQuestionIds(questionIds);

        // Map correct options by questionId for fast lookup
        const correctOptionsMap = {};

        for (const opt of correctOptionsList) {
            correctOptionsMap[opt.questionId] = opt;
        };

        // Grade quiz without any DB calls inside the loop
        let correctAnswers = 0;

        let wrongQuestions = [];

        for (const answer of answers) {
            const correctOption = correctOptionsMap[answer.questionId];

            if (!correctOption) {
                throw new RecordNotFoundError(
                    `Correct option not found for question ${answer.questionId}`
                );
            };

            if (correctOption.id === answer.optionId) {
                correctAnswers++;
            } else {
                wrongQuestions.push({
                    questionId: answer.questionId,
                    correctOptionId: correctOption.id
                });
            }
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


    async submitQuiz(userId, submoduleId, answers) {

        const studentId = await this.studentProfileRepo.getStudentIdByUserId(userId);

        // Grade quiz
        const result = await this.gradeQuiz(answers);
        const passed = result.percentage >= 70;

        // Get submodule
        const submodule = await this.submoduleService.getSubmoduleById(submoduleId);
        if (!submodule) throw new RecordNotFoundError("Submodule not found");

        const moduleId = submodule.moduleId;

        // Ensure module progress exists
        let moduleProgress;
        try {
            moduleProgress = await this.moduleProgressService.getModuleProgress(studentId, moduleId);
        } catch(error){
            moduleProgress = await this.moduleProgressService.initModuleProgress(studentId, moduleId);
        };

        // Block if max attempts reached
        if (moduleProgress.attemptCount >= 3) {
            throw new Error("Maximum attempts reached. You cannot take this assessment again.");
        };

        // Increment attempt FIRST
        await this.moduleProgressService.incrementAttemptCount(studentId, moduleId);

        // Get updated attempt count from DB
        moduleProgress = await this.moduleProgressService.getModuleProgress(studentId, moduleId);


        // Save score 
        await this.submoduleProgressService.updateSubmoduleProgress(studentId, submoduleId, {
            score: result.percentage,
            completed: passed
        });

        //Mark submodule complete if passed or their attemptCount > 3
        if (passed || moduleProgress.attemptCount >= 3) {
            await this.learningProgressService.markSubModuleComplete(studentId, submoduleId);
        };

        return {
            message: "Quiz submitted successfully",
            passed,
            percentage: result.percentage,
            correctAnswers: result.correctAnswers,
            wrongAnswers: result.wrongQuestions,
            attemptCount: moduleProgress.attemptCount
        };
    };


    async retakeQuiz(userId, submoduleId) {
        const studentId = await this.studentProfileRepo.getStudentIdByUserId(userId);

        const submodule = await this.submoduleService.getSubmoduleById(submoduleId);

        if (!submodule) throw new RecordNotFoundError("Submodule not found");

        const moduleId = submodule.moduleId;

        const moduleProgress = await this.moduleProgressService.getModuleProgress(studentId, moduleId);

        if (moduleProgress.attemptCount >= 3) {
            throw new Error("Maximum attempts reached. You cannot retake this assessment.");
        }

        return {
            message: "Retake allowed",
            attemptCount: moduleProgress.attemptCount
        };
    };
};