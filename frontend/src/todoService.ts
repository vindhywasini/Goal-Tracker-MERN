// src/todoService.ts
import { z } from "zod";
import API from "./api";
import { todoSchema, todoApiSchema, Todo } from "./schemas";

// schema for arrays of todos
const todosResponseSchema = z.array(todoApiSchema);

// ----------- Fetch Todos -----------
export const fetchTodos = async (): Promise<Todo[]> => {
  const res = await API.get("/todos"); // -> /api/todos
  return todosResponseSchema.parse(res.data.todos);
};

// ----------- Create Todo -----------
export const createTodo = async (
  data: z.infer<typeof todoSchema>
): Promise<Todo> => {
  const res = await API.post("/todos", data); // -> /api/todos
  return todoApiSchema.parse(res.data.todo);
};

// ----------- Toggle Todo -----------
export const toggleTodo = async (id: string): Promise<Todo> => {
  const res = await API.patch(`/todos/${id}/toggle`); // -> /api/todos/:id/toggle
  return todoApiSchema.parse(res.data.todo);
};

// ----------- Delete Todo -----------
export const deleteTodo = async (id: string): Promise<string> => {
  const res = await API.delete(`/todos/${id}`); // -> /api/todos/:id
  return res.data.message as string;
};
