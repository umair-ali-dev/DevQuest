import { z } from "zod";

export const createSubmissionSchema = z.object({
  problemId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid problem ID."),

  language: z.enum(["javascript", "python", "java"]),

  sourceCode: z
    .string()
    .min(1, "Source code cannot be empty.")
    .max(20000, "Source code must not exceed 20,000 characters."),
});
