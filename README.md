# Fullstack Todo App (React + TS frontend, Node + TS backend)

This repo contains a complete todo application scaffold meeting the assignment requirements:
- JWT auth (signup/signin)
- Forgot / Reset password (token returned for testing)
- Todos CRUD (create, update, list, delete, toggle completed)
- Errors logged into MongoDB `logs` collection
- Frontend uses React + TypeScript, React Router, Zustand, React Query, zod, react-hook-form

To run:
- Fill `backend/.env` with MONGODB_URI and JWT_SECRET
- Start backend:
  cd backend
  npm install
  npm run dev
- Start frontend:
  cd frontend
  npm install
  npm run dev

Only change environment variables as required.

