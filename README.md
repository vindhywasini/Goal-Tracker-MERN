
# Todo List Application

A full-stack **Todo List** app built using **React (with TypeScript)** on the frontend, **Node.js (with TypeScript)** on the backend, and **MongoDB** for the database. This app includes user authentication, JWT-based sessions, and CRUD functionality for managing todos. Additionally, the app supports **dark mode and calendar event planning**.

## Features

### Backend:
- User Authentication (JWT auth)
  - Signup
  - Signin
  - Forgot Password 

- Todo Management
  - Create Todo
  - Update Todo (including changing status and priority)
  - Delete Todo
  - Mark Todo as completed or pending
- JWT Authentication

### Frontend:
- User Login/Signup
- Dark Mode support
- Todo List Management
  - Create Todo
  - Update Todo (Edit title, status, priority)
  - Delete Todo
  - Mark Todo as completed or pending
- Calendar Event Planning
  - Add, Delete, Edit events
- React Query for API data fetching
- Form validation using React Hook Form and Zod schemas



## Usage

1. User Authentication:

Go to /signup to create a new user.
After signing up, you can login on /signin with the credentials you created.
You will be redirected to the /todos page where you can manage your todos.

2. Todo Management:

Add new todos using the input field.
Change the priority or status of todos.
Mark todos as completed using the checkbox.
Delete a todo by clicking the Delete button.

3. Calendar Planner:

Add events by selecting a date and providing a description.
Delete events using the Delete button.


## Technologies Used

Frontend:

React.js
TypeScript
React Router
React Query
Zod for validation
Zustand for state management

Backend:

Node.js
TypeScript
Express.js
JWT for Authentication
MongoDB with Mongoose
