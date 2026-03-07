import { z } from "zod";

export const createSubmoduleSchema = z
  .object({
    moduleId: z
      .string()
      .uuid("Invalid moduleId"),

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
      .optional(),

    downloadable: z
      .boolean()
      .optional(),

    contentSize: z
      .number()
      .int()
      .positive("Content size must be positive")
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
  })

  .superRefine((data, ctx) => {

    // VIDEO requires URL
    if (data.type === "video" && !data.contentUrl) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Video submodule requires a contentUrl",
        path: ["contentUrl"],
      });
    }

    // DOCUMENT requires either text or url
    if (
      data.type === "document" &&
      !data.contentText &&
      !data.contentUrl
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Document requires contentText or contentUrl",
        path: ["contentText"],
      });
    }

    // QUIZ requires contentText (instructions / question reference)
    if (data.type === "quiz" && !data.contentText) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Quiz requires contentText",
        path: ["contentText"],
      });
    }
  });

export const updateSubmoduleSchema = createSubmoduleSchema.partial();