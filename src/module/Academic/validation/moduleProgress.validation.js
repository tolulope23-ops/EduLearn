import { z } from "zod";

export const moduleProgressSchema = z.object({
  studentId: z
    .string()
    .uuid("Invalid studentId"),

  moduleId: z
    .string()
    .uuid("Invalid moduleId"),

  completed: z
    .boolean()
    .optional(),

  score: z
    .number()
    .int("Score must be an integer")
    .min(0, "Score cannot be less than 0")
    .max(100, "Score cannot exceed 100")
    .optional(),
});

export const completeModuleSchema = z.object({
  studentId: z
    .string()
    .uuid("Invalid studentId"),

  moduleId: z
    .string()
    .uuid("Invalid moduleId"),

  score: z
    .number()
    .int()
    .min(0)
    .max(100)
    .optional(),

  completed: z.literal(true),
});