import { z } from "zod";

export const createModuleSchema = z.object({
  lessonId: z
    .string()
    .uuid("Invalid lessonId"),

  title: z
    .string()
    .trim()
    .min(3, "Module title must be at least 3 characters")
    .max(200, "Module title is too long"),

  description: z
    .string()
    .trim()
    .max(1500, "Description too long")
    .optional(),

  sequenceNumber: z
    .number({
      required_error: "Sequence number is required",
      invalid_type_error: "Sequence number must be a number",
    })
    .int("Sequence number must be an integer")
    .positive("Sequence number must be greater than 0"),
});


export const updateModuleSchema = z.object({
  lessonId: z
    .string()
    .uuid("Invalid lessonId")
    .optional(),

  title: z
    .string()
    .trim()
    .min(3, "Module title must be at least 3 characters")
    .max(200, "Module title too long")
    .optional(),

  description: z
    .string()
    .trim()
    .max(1500, "Description too long")
    .optional(),

  sequenceNumber: z
    .number()
    .int()
    .positive("Sequence number must be greater than 0")
    .optional(),
});