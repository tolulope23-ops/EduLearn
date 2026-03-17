import { z } from "zod";

export const quizOptionSchema = z.object({
  questionId: z
    .string()
    .uuid("Invalid questionId"),

  optionText: z
    .string()
    .trim()
    .min(1, "Option text is required")
    .max(500, "Option text is too long"),

  isCorrect: z
    .boolean()
    .optional(),
});


// Schema for array of options
export const createQuizOptionSchema = z.array(quizOptionSchema).nonempty("Questions array cannot be empty");

export const updateQuizOptionSchema = z.array(quizOptionSchema.partial())
  .nonempty("Questions array cannot be empty");
