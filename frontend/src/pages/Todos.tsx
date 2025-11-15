// src/pages/Todos.tsx
import React, { useState } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  todoFormSchema,
  TodoFormInput,
  Todo,
  PRIORITIES,
  STATUSES,
  Status,
} from "../schemas";
import {
  fetchTodos,
  createTodo,
  deleteTodo,
  toggleTodo,
  updateTodoStatus,
} from "../todoService";

type CalendarEvent = {
  id: string;
  date: string;
  description: string;
};

const makeId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const Todos: React.FC = () => {
  const queryClient = useQueryClient();

  // -------- React Query: Todos --------
  const {
    data: todos = [],
    isLoading,
    error,
  } = useQuery<Todo[]>({
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

  const updateStatusMutation = useMutation({
    mutationFn: updateTodoStatus,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
  });

  // -------- Form for new todo --------
  const { register, handleSubmit, reset } = useForm<TodoFormInput>({
    resolver: zodResolver(todoFormSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "low",
      status: "pending",
    },
  });

  const onSubmit = (data: TodoFormInput) => {
    addTodoMutation.mutate(data);
    reset({
      title: "",
      description: "",
      priority: "low",
      status: "pending",
    });
  };

  // -------- Counters --------
  const completedCount = todos.filter((t) => t.status === "completed").length;
  const pendingCount = todos.filter((t) => t.status === "pending").length;
  const inProgressCount = todos.filter((t) => t.status === "in-progress")
    .length;

  // -------- Local calendar planner (front-end only) --------
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [eventDescription, setEventDescription] = useState("");

  const addDateEvent = () => {
    if (!selectedDate) {
      alert("Please select a date!");
      return;
    }
    if (!eventDescription.trim()) {
      alert("Please enter an event description!");
      return;
    }
    setCalendarEvents((prev) => [
      {
        id: makeId(),
        date: selectedDate,
        description: eventDescription.trim(),
      },
      ...prev,
    ]);
    setSelectedDate("");
    setEventDescription("");
  };

  const deleteEvent = (id: string) => {
    setCalendarEvents((prev) => prev.filter((e) => e.id !== id));
  };

  if (isLoading) return <p style={{ padding: 20 }}>Loading...</p>;
  if (error)
    return (
      <p style={{ padding: 20, color: "red" }}>
        Failed to load todos. Check console/network.
      </p>
    );

  return (
    <div id="content-container">
      {/* GOAL / TODO TRACKING */}
      <section id="goal-tracking">
        <h2>Todos</h2>
        <p style={{ marginBottom: 8, fontSize: "0.9rem", opacity: 0.8 }}>
          Enter What Todo using the input below:
        </p>

        {/* Add Goal / Todo */}
        <form
          className="goal-input-section"
          onSubmit={handleSubmit(onSubmit)}
        >
          <input
            placeholder="Enter your goal..."
            {...register("title")}
            style={{ minWidth: 0 }}
          />
          <select {...register("priority")}>
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p.charAt(0).toUpperCase() + p.slice(1)} Priority
              </option>
            ))}
          </select>
          <button type="submit">Add Goal</button>
        </form>

        {/* Todo List */}
        <ul id="goal-list">
          {todos.map((todo) => (
            <li key={todo._id} className={`goal-item ${todo.priority}`}>
              <div className="goal-main">
                <span className="goal-title">{todo.title}</span>
                <span
                  className={`priority-pill priority-${todo.priority}`}
                >
                  {todo.priority}
                </span>
              </div>

              <div className="goal-meta">
                <select
                  className="status-select"
                  value={todo.status}
                  onChange={(e) =>
                    updateStatusMutation.mutate({
                      id: todo._id,
                      status: e.target.value as Status,
                    })
                  }
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s === "in-progress"
                        ? "In Progress"
                        : s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>

                <label className="completed-toggle">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleMutation.mutate(todo._id)}
                  />
                  <span>Completed</span>
                </label>

                <button
                  className="delete-btn"
                  onClick={() => deleteMutation.mutate(todo._id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>

        {/* Counters */}
        <div id="goal-counter">
          <p>
            <strong>Completed:</strong>{" "}
            <span id="completed-count">{completedCount}</span> |{" "}
            <strong>Pending:</strong>{" "}
            <span id="pending-count">{pendingCount}</span> |{" "}
            <strong>In Progress:</strong>{" "}
            <span id="in-progress-count">{inProgressCount}</span>
          </p>
        </div>
      </section>

      {/* CALENDAR PLANNER */}
      <section id="calendar-planner-container">
        <div id="calendar-planner">
          <h2>Calendar Planner</h2>
          <div id="date-picker-container">
            <input
              type="date"
              id="date-picker"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
            <input
              type="text"
              id="event-description"
              placeholder="Enter event description..."
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
            />
            <button type="button" onClick={addDateEvent}>
              Add Event
            </button>
          </div>

          <ul id="date-event-list">
            {calendarEvents.map((event) => (
              <li key={event.id}>
                <span>
                  {event.date}: {event.description}
                </span>
                <button
                  className="delete-btn"
                  onClick={() => deleteEvent(event.id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default Todos;
