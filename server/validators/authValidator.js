import { z } from "zod";

// REGISTER VALIDATION
export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must contain at least 2 characters.")
    .max(50, "Name cannot exceed 50 characters."),

  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, "Username must contain at least 3 characters.")
    .max(20, "Username cannot exceed 20 characters.")
    .regex(/^[a-z0-9_]+$/, "Username can only contain letters, numbers and underscores."),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please enter a valid email address."),

  password: z
    .string()
    .min(8, "Password must contain at least 8 characters.")
    .max(128, "Password cannot exceed 128 characters."),
}).strict();

// LOGIN VALIDATION
export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please enter a valid email address."),

  password: z
    .string()
    .min(1, "Password is required.")
    .max(128),
}).strict();

// PROFILE UPDATE VALIDATION
export const updateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must contain at least 2 characters.")
    .max(50, "Name cannot exceed 50 characters.")
    .optional(),

  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, "Username must contain at least 3 characters.")
    .max(20, "Username cannot exceed 20 characters.")
    .regex(/^[a-z0-9_]+$/, "Invalid username format.")
    .optional(),

  avatar: z
    .string()
    .trim()
    .max(500, "Avatar URL is too long.")
    .refine(
      (value) =>
        value === "" || z.string().url().safeParse(value).success,
      "Please provide a valid avatar URL."
    )
    .optional(),
})
.strict()
.refine(
  (data) => Object.keys(data).length > 0,
  "At least one profile field must be provided."
);

// CHANGE PASSWORD VALIDATION
export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, "Current password is required.")
      .max(128),

    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters.")
      .max(128, "New password cannot exceed 128 characters."),
  })
  .strict()
  .refine(
    (data) => data.currentPassword !== data.newPassword,
    {
      message: "New password must be different from current password.",
      path: ["newPassword"],
    }
  );