import { z } from "zod";

export const submitQuizSchema = z.object({
  submoduleId: z
    .string()
    .uuid("Invalid submoduleId"),
    
  answers: z.array(
    z.object({
      questionId: z.string().uuid("Invalid questionId"),
      optionId: z.string().uuid("Invalid optionId")
    })
  ).nonempty("Answers cannot be empty") // must submit at least one answer
});


export const retakeQuizSchema = z.object({
  submoduleId: z.string().uuid("Invalid submoduleId")
});



// export const quizQuestionSchema = z.object({
//   submoduleId: z.string().uuid("Invalid submoduleId"),
//   questionText: z
//     .string()
//     .min(3, "Question must be at least 3 characters")
//     .max(500, "Question cannot exceed 500 characters"),
//   sequenceNumber: z.number().int().optional() // optional ordering
// });

// Validation for adding quiz options

// export const quizOptionSchema = z.object({
//   questionId: z.string().uuid("Invalid questionId"),
//   optionText: z
//     .string()
//     .min(1, "Option text cannot be empty")
//     .max(200, "Option text too long"),
//   isCorrect: z.boolean()
// });