import { z } from "zod";

export const createQuizOptionSchema = z.object({
  questionId: z
    .string()
    .uuid("Invalid questionId"),

  option: z
    .string()
    .trim()
    .min(1, "Option text is required")
    .max(500, "Option text is too long"),

  isCorrect: z
    .boolean()
    .optional(),
});

export const updateQuizOptionSchema = createQuizOptionSchema.partial();