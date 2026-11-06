import { z } from "zod";

const exampleSchema = z.object({
  input: z.string().min(1, "Example input is required"),
  output: z.string().min(1, "Example output is required"),
  explanation: z.string().optional().default(""),
});

const testCaseSchema = z.object({
  input: z.string(),
  expectedOutput: z.string(),
  isHidden: z.boolean().optional().default(false),
});

const problemSchema = z.object({
  title: z.string().trim().min(3).max(120),

  description: z.string().min(10),

  difficulty: z.enum(["Easy", "Medium", "Hard"]),

  tags: z.array(z.string().trim().min(1)).default([]),

  constraints: z.array(z.string()).default([]),

  examples: z.array(exampleSchema).min(1),

  starterCode: z.record(z.string(), z.string()).default({}),

  testCases: z.array(testCaseSchema).default([]),

  status: z.enum(["Draft", "Published"]).default("Draft"),
});

export const createProblemSchema = problemSchema;

export const updateProblemSchema = problemSchema.partial();