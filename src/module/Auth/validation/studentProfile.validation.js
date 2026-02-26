import { z } from "zod";
const uuidSchema = z.string().uuid("Invalid UUID format");

export const updateStudentProfileSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name too long").optional(),

  location: z
    .string()
    .min(2, "Location must be at least 2 characters")
    .max(100, "Location too long")
    .optional(),

  phoneNumber: z.string().regex(/^(?:\+234|234|0)(70|80|81|90|91)\d{8}$/,"Invalid nigerian phone number")
    .transform((value) => {
      if (value.startsWith("0")) {
        return `+234${value.slice(1)}`;
      }
      if (value.startsWith("234")) {
        return `+${value}`;
      }
      return value;
    })
    .optional(),

  dailyGoal: z
    .string()
    .optional(),

  classLevelId: uuidSchema.optional()
});