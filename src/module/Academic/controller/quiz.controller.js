import { QuizService } from "../service/quiz.service.js";

export class QuizController {
    /**
     * @param {QuizService} quizService
     */

    constructor(quizService) {
        this.quizService = quizService;
    };

  // Create a quiz question
    createQuizQuestion = async (req, res, next) => {
        try {
            const questionsArray = req.body;
            const newQuestion = await this.quizService.createBulkQuizQuestions(questionsArray);
            res.status(201).json({ 
                success: true, 
                data: newQuestion 
            });
        } catch (err) {
            next(err);
        };
    };


// Update quiz question
    updateQuizQuestion = async (req, res, next) => {
        try {
            const { questionId  } = req.params;
            const updateData = req.body;

            // console.log(questionId);
            // console.log(updateData);
            

            const updatedQuestion = await this.quizService.updateQuizQuestion(questionId, updateData);
            res.status(200).json({ 
                success: true, 
                data: updatedQuestion 
            });
        } catch (err) {
            next(err);
        };
    };

// Delete quiz question
    deleteQuizQuestion = async (req, res, next) => {
        try {
            const { id } = req.params;
            await this.quizService.deleteQuizQuestion(id);
        res.status(200).json({ 
            success: true,
            message: "Quiz question deleted successfully" 
        });
        } catch (err) {
            next(err);
        }
    };
// Update quiz option
    updateQuizOption = async (req, res, next) => {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const updatedOption = await this.quizService.updateQuizOption(id, updateData);
            res.status(200).json({
                success: true, 
                data: updatedOption 
            });
        } catch (err) {
            next(err);
        };
    };

// Delete quiz option
    deleteQuizOption = async (req, res, next) => {
        try {
            const { id } = req.params;
            await this.quizService.deleteQuizOption(id);
            res.status(200).json({ 
                success: true, 
                message: "Quiz option deleted successfully" 
            });
        } catch (err) {
            next(err);
        }
    };

// Add options to a quiz question
    addQuizOptions = async (req, res, next) => {
        try {
            const optionArray = req.body;
            const addedOptions = await this.quizService.addQuizOptions(optionArray);
            res.status(201).json({
                success: true, 
                data: addedOptions
            });
        } catch (err) {
            next(err);
        }
    };

// Get all quiz questions with options
    getQuizBySubmodule = async (req, res, next) => {
        try {
            // const { submoduleId } = req.params;

            const quiz = await this.quizService.getQuizBySubmodule();
            res.status(200).json({ 
                success: true, 
                data: quiz 
            });
        } catch (err) {
            next(err);
        };
    };

// Get a single quiz question with options
    getQuizQuestionWithOptions = async (req, res, next) => {
        try {
            const { questionId } = req.params;
            const quiz = await this.quizService.getQuizQuestionWithOptions(questionId);
            res.status(200).json({ 
                success: true, 
                data: quiz 
            });
        } catch (err) {
            next(err);
        };
    };

// Fetch quiz for a submodule (doc or video)
    getQuizQuestionForSubmodule = async (req, res, next) => {
        try {
                const { submoduleId } = req.params;
                const quiz = await this.quizService.getQuizQuestionForSubmodule(submoduleId);

            res.status(200).json({ 
                success: true, 
                data: quiz 
            });
        } catch (err) {
            next(err);
        }
    };

// Submit quiz answers
    submitQuiz = async (req, res, next) => {
        try {
            const {submoduleId, answers } = req.body;

            const {userId} = req.user;
            
            const result = await this.quizService.submitQuiz(userId, submoduleId, answers);

            res.status(200).json({ 
                success: true, 
                data: result 
            });
        } catch (err) {
            next(err);
        }
    };


    retakeQuiz = async (req, res, next) => {
        try {
            const {userId} = req.user;
            const { submoduleId } = req.body;
            

            const result = await this.quizService.retakeQuiz(
                userId,
                submoduleId,
            );

            return res.status(200).json({
                success: true,
                message: result.message,
                data: result
            });
        } catch (error) {
            next(error);
        }
    }
};