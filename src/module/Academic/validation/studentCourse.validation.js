import { z } from "zod";

const allowedCourses = [
  "MATHEMATICS",
  "ENGLISH",
  "SCIENCE",
  "ICT",
];

export const studentCourseSchema = z.object({
  courseNames: z
    .array(
      z
        .string()
        .transform((val) => val.toUpperCase())
        .refine((val) => allowedCourses.includes(val), {
          message: "Invalid course selected",
        })
    )
    .min(1, "At least one course must be selected")
    .max(4, "You can select at most four courses")
    .refine((courses) => new Set(courses).size === courses.length, {
      message: "Duplicate courses are not allowed",
    }),
});