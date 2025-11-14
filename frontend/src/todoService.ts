// src/todoService.ts
import { z } from "zod";
import API from "./api";
import {
  todoFormSchema,
  todoApiSchema,
  Todo,
  Status,
  TodoFormInput,
} from "./schemas";

const todosResponseSchema = z.array(todoApiSchema);

// -------- Fetch Todos --------
export const fetchTodos = async (): Promise<Todo[]> => {
  const res = await API.get("/todos"); // -> /api/todos
  return todosResponseSchema.parse(res.data.todos);
};

// -------- Create Todo --------
export const createTodo = async (data: TodoFormInput): Promise<Todo> => {
  const parsed = todoFormSchema.parse(data);
  const res = await API.post("/todos", parsed); // -> /api/todos
  return todoApiSchema.parse(res.data.todo);
};

// -------- Toggle Completed --------
export const toggleTodo = async (id: string): Promise<Todo> => {
  const res = await API.patch(`/todos/${id}/toggle`);
  return todoApiSchema.parse(res.data.todo);
};

// -------- Update Status --------
export const updateTodoStatus = async (payload: {
  id: string;
  status: Status;
}): Promise<Todo> => {
  const res = await API.put(`/todos/${payload.id}`, {
    status: payload.status,
  });
  return todoApiSchema.parse(res.data.todo);
};

// -------- Delete Todo --------
export const deleteTodo = async (id: string): Promise<string> => {
  const res = await API.delete(`/todos/${id}`);
  return res.data.message as string;
};
