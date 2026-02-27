import z from 'zod';

export const signupSchema = z.object({
 fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name too long"),
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

  email: z.string()
  .trim()
  .toLowerCase()
  .email("Invalid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/(?=.*[A-Z])/, "Password must contain an uppercase letter")
    .regex(/(?=.*[a-z])/, "Password must contain a lowercase letter")
    .regex(/(?=.*[0-9])/, "Password must contain a number")
    .regex(/(?=.*[\W])/, "Password must contain a special character"),
  
  location: z
    .string()
    .min(2, "Location must be at least 2 characters")
    .max(100, "Location too long"),
});


export const loginSchema = z.object({
  email: z.string()
  .trim()
  .toLowerCase()
  .email("Invalid email address"),

  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/(?=.*[A-Z])/, "Password must contain an uppercase letter")
    .regex(/(?=.*[a-z])/, "Password must contain a lowercase letter")
    .regex(/(?=.*[0-9])/, "Password must contain a number")
    .regex(/(?=.*[\W])/, "Password must contain a special character")
});


export const forgotPasswordSchema = z.object({
  email: z.string()
  .trim()
  .toLowerCase()
  .email("Invalid email address")
});


export const resetPasswordSchema = z.object({
token: z.string(),
newPassword: z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/(?=.*[A-Z])/, "Must contain an uppercase letter")
  .regex(/(?=.*[a-z])/, "Must contain a lowercase letter")
  .regex(/(?=.*[0-9])/, "Must contain a number")
  .regex(/(?=.*[\W])/, "Must contain a special character")
});

// ---------- Role Validation ----------
export const roleSchema = z.object({
  id: z.string().uuid().optional(),
  roleName: z.enum(['STUDENT', 'TEACHER']),
  description: z.string().optional(),
});

// ---------- Permission Validation ----------
export const permissionSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1),
  description: z.string().optional(),
});

