import z from 'zod';

export const signupSchema = z.object({
  email: z.string().email("Invalid Email address").optional(),
  // phone: z.string().regex(/^(?:\+234|234|0)(70|80|81|90|91)\d{8}$/,
  //     "Invalid nigerian phone number"
  //   )
  //   .transform((value) => {
  //     if (value.startsWith("0")) {
  //       return `+234${value.slice(1)}`;
  //     }
  //     if (value.startsWith("234")) {
  //       return `+${value}`;
  //     }
  //     return value;
  //   })
  //   .optional(),

  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/(?=.*[A-Z])/, "Password must contain an uppercase letter")
    .regex(/(?=.*[a-z])/, "Password must contain a lowercase letter")
    .regex(/(?=.*[0-9])/, "Password must contain a number")
    .regex(/(?=.*[\W])/, "Password must contain a special character")
});
//
export const loginSchema = z.object({
  email: z.string().email("Invalid Email address"),
  password: z.string().min(8, "Password is required"),
  confirmPassword: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/(?=.*[A-Z])/, "Password must contain an uppercase letter")
    .regex(/(?=.*[a-z])/, "Password must contain a lowercase letter")
    .regex(/(?=.*[0-9])/, "Password must contain a number")
    .regex(/(?=.*[\W])/, "Password must contain a special character")
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const resetPasswordSchema = z.object({
newPassword: z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/(?=.*[A-Z])/, "Must contain an uppercase letter")
  .regex(/(?=.*[a-z])/, "Must contain a lowercase letter")
  .regex(/(?=.*[0-9])/, "Must contain a number")
  .regex(/(?=.*[\W])/, "Must contain a special character")
});
