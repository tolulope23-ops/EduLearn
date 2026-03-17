import { z } from "zod";

export const createLessonSchema = z.object({
   course: z
    .string()
    .trim()
    .min(1, "Course cannot be empty")
    .max(100, "Course name too long"),

  classLevel: z
    .string()
    .trim()
    .min(1, "Class level cannot be empty")
    .max(100, "Class level name too long"),
    
  title: z
    .string()
    .trim()
    .min(3, "Lesson title must be at least 3 characters")
    .max(200, "Lesson title too long"),

  description: z
    .string()
    .trim()
    .max(1000, "Description too long")
    .optional(),

  sequenceNumber: z
    .number({
      required_error: "Sequence number is required",
      invalid_type_error: "Sequence number must be a number",
    })
    .int("Sequence number must be an integer")
    .positive("Sequence number must be greater than 0"),
});


export const updateLessonSchema = z.object({
   course: z
    .string()
    .trim()
    .min(1, "Course cannot be empty")
    .max(100, "Course name too long").optional(),

  classLevel: z
    .string()
    .trim()
    .min(1, "Class level cannot be empty")
    .max(100, "Class level name too long").optional(),

  title: z
    .string()
    .trim()
    .min(3)
    .max(200)
    .optional(),

  description: z
    .string()
    .trim()
    .max(1000)
    .optional(),

  sequenceNumber: z
    .number()
    .int()
    .positive()
    .optional(),
});