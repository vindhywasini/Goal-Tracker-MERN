// src/schemas.ts
import { z } from 'zod';

export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
});

export const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// ✅ Used for forms (input)
export const todoSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  completed: z.boolean().optional(),
});

// ✅ Used for API responses
export const todoApiSchema = todoSchema.extend({
  _id: z.string(),
  user: z.string(),
  completed: z.boolean(), // required on response
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Todo = z.infer<typeof todoApiSchema>;
