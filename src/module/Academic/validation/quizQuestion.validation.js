import { z } from "zod";

// Single question schema
export const quizQuestionItemSchema = z.object({
  submoduleId: z.string().uuid("Invalid submoduleId"),
  questionText: z
    .string()
    .trim()
    .min(5, "Question must be at least 5 characters long")
    .max(2000, "Question is too long"),
});

// Schema for array of questions
export const createBulkQuizQuestionsSchema = z.array(quizQuestionItemSchema).nonempty("Questions array cannot be empty");

export const updateBulkQuizQuestionsSchema = z.array(quizQuestionItemSchema.partial())
  .nonempty("Questions array cannot be empty");