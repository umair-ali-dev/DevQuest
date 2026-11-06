import { z } from "zod";

export const executeCodeSchema = z.object({
  language: z.enum(["javascript", "python", "java"]),
  sourceCode: z
    .string()
    .min(1, "Code cannot be empty.")
    .max(20000, "Code must not exceed 20,000 characters."),
  stdin: z
    .string()
    .max(10000, "Input must not exceed 10,000 characters.")
    .optional()
    .default(""),
});