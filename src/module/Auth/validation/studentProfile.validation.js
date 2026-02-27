import { z } from "zod";

const baseStudentProfileSchema = z.object({
  fullName: z.string()
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name too long"),

  location: z.string()
    .trim()
    .min(2, "Location must be at least 2 characters")
    .max(100, "Location too long"),

  phoneNumber: z.string()
    .trim()
    .regex(/^(?:\+234|234|0)(70|80|81|90|91)\d{8}$/, "Invalid Nigerian phone number")
    .transform((value) => {
      if (value.startsWith("0")) return `+234${value.slice(1)}`;
      if (value.startsWith("234")) return `+${value}`;
      return value;
    }),

  dailyGoal: z.string().trim(),

  classLevel: z.string()
    .trim()
    .min(1, "Class level cannot be empty")
});

export const updateStudentProfileSchema = baseStudentProfileSchema.partial();