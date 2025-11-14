// src/schemas.ts
import { z } from "zod";

export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
});

export const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// ---- Todo enums ----
export const PRIORITIES = ["low", "medium", "high"] as const;
export type Priority = (typeof PRIORITIES)[number];

export const STATUSES = ["pending", "in-progress", "completed"] as const;
export type Status = (typeof STATUSES)[number];

// ---- Form schema (used by react-hook-form + zodResolver) ----
export const todoFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  priority: z.enum(PRIORITIES),
  status: z.enum(STATUSES),
});

export type TodoFormInput = z.infer<typeof todoFormSchema>;

// ---- API schema (server responses) ----
export const todoApiSchema = todoFormSchema.extend({
  _id: z.string(),
  user: z.string(),
  completed: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Todo = z.infer<typeof todoApiSchema>;
