// src/pages/Todos.tsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { todoSchema, Todo } from "../schemas";
import { z } from "zod";
import { createTodo, fetchTodos, deleteTodo, toggleTodo } from "../todoService";

export default function Todos() {
  const queryClient = useQueryClient();

  const { data: todos, isLoading } = useQuery<Todo[]>({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  });

  const addTodoMutation = useMutation({
    mutationFn: createTodo,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
  });

  const toggleMutation = useMutation({
    mutationFn: toggleTodo,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
  });

  const { register, handleSubmit, reset } = useForm<
    z.infer<typeof todoSchema>
  >({
    resolver: zodResolver(todoSchema),
  });

  const onSubmit = (data: z.infer<typeof todoSchema>) => {
    addTodoMutation.mutate(data);
    reset();
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Todos</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register("title")} placeholder="Todo title" />
        <button type="submit">Add</button>
      </form>

      <ul>
        {todos?.map((todo) => (
          <li key={todo._id} style={{ marginTop: "10px" }}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleMutation.mutate(todo._id)}
            />
            {todo.title}
            <button
              style={{ marginLeft: "15px", color: "red" }}
              onClick={() => deleteMutation.mutate(todo._id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
