import { z } from "zod";

const baseSubmoduleSchema = z.object({
  moduleId: z.string().uuid("Invalid moduleId"),

  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title too long"),

  type: z.enum(["document", "video", "quiz"]),

  contentText: z
    .string()
    .trim()
    .max(10000, "Content text too long")
    .optional(),

contentUrl: z
  .string()
  .url("Invalid content URL")
  .optional().or(z.literal("")),

  downloadable: z.boolean().optional(),

  contentSize: z.string()
    .optional(),

  contentVersion: z
    .number()
    .int()
    .positive()
    .optional(),

  sequenceNumber: z
    .number({
      required_error: "Sequence number is required",
    })
    .int("Sequence number must be an integer")
    .positive("Sequence must be greater than 0"),
});


export const createSubmoduleSchema = baseSubmoduleSchema.superRefine((data, ctx) => {

  if (data.type === "video" && !data.contentUrl) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Video submodule requires a contentUrl",
      path: ["contentUrl"],
    });
  }

  if (data.type === "document" && !data.contentText && !data.contentUrl) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Document requires contentText or contentUrl",
      path: ["contentText"],
    });
  }

  if (data.type === "quiz" && !data.contentText) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Quiz requires contentText",
      path: ["contentText"],
    });
  }
});

export const updateSubmoduleSchema = baseSubmoduleSchema.partial();