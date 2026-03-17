import express from "express";
import { quizControllerInstance } from "../container.js";
import validateRequest from "../../../common/middleware/validation.middleware.js";
import { createBulkQuizQuestionsSchema, updateBulkQuizQuestionsSchema } from "../validation/quizQuestion.validation.js";
import { createQuizOptionSchema, updateQuizOptionSchema } from "../validation/quizOption.validation.js";

const router = express.Router();


// Admin Routes
router.post("/question/create", validateRequest(createBulkQuizQuestionsSchema), quizControllerInstance.createQuizQuestion); // create a quiz question
router.post("/options/create", validateRequest(createQuizOptionSchema), quizControllerInstance.addQuizOptions);      // add options for a question
router.get("/:submoduleId/quiz", quizControllerInstance.getQuizQuestionForSubmodule); // fetch question for doc/video

router.put("/:questionId", validateRequest(updateBulkQuizQuestionsSchema), quizControllerInstance.updateQuizQuestion);   // update a quiz question
router.delete("/:questionId", quizControllerInstance.deleteQuizQuestion); // delete a quiz question

router.put("/:optionId", validateRequest(updateQuizOptionSchema), quizControllerInstance.updateQuizOption); // Update a quiz option
router.delete("/:optionId", quizControllerInstance.deleteQuizOption);// Delete a quiz option


// Student-facing Routes
router.get("/submodule/:submoduleId", quizControllerInstance.getQuizBySubmodule); // fetch all questions with options for a submodule
router.get("/question/:questionId", quizControllerInstance.getQuizQuestionWithOptions); // fetch single question with options
router.post("/submit", quizControllerInstance.submitQuiz); // submit quiz answers

export default router;