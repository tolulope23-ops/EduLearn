import { z } from "zod";

export const createQuizQuestionSchema = z.object({
  submoduleId: z
    .string()
    .uuid("Invalid submoduleId"),

  question: z
    .string()
    .trim()
    .min(5, "Question must be at least 5 characters long")
    .max(2000, "Question is too long"),
});

export const updateQuizQuestionSchema = createQuizQuestionSchema.partial();