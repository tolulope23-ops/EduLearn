import { z } from "zod";

export const submoduleProgressSchema = z.object({
  studentId: z
    .string()
    .uuid("Invalid studentId"),

  submoduleId: z
    .string()
    .uuid("Invalid submoduleId"),

  completed: z
    .boolean()
    .optional(),

  score: z
    .number()
    .int("Score must be an integer")
    .min(0, "Score cannot be less than 0")
    .max(100, "Score cannot exceed 100")
    .optional(),

  downloaded: z
    .boolean()
    .optional(),
});


export const updateSubmoduleSchema = z.object({
  studentId: z
    .string()
    .uuid("Invalid studentId"),

  submoduleId: z
    .string()
    .uuid("Invalid submoduleId"),

  completed: z.boolean().optional(),

  score: z
    .number()
    .int()
    .min(0)
    .max(100)
    .optional(),

  downloaded: z.boolean().optional()
});