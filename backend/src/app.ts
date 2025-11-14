import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import authRoutes from './routes/auth';
import todoRoutes from './routes/todo';
import { errorHandler } from './utils/errorHandler';
import { logErrorToDb } from './utils/logger';

const app = express();

// ✅ Correct CORS Setup
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true, // REQUIRED for cookies / JWT in headers
  })
);

// Extra preflight support (important for Axios + credentials)
app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    process.env.FRONTEND_URL || "http://localhost:5173"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.use(express.json());

// Mongo connection
mongoose
  .connect(process.env.MONGODB_URI || "")
  .then(() => console.log("Mongo connected"))
  .catch((err) => {
    console.error("Mongo connection error", err);
    logErrorToDb(err).catch(() => {});
  });

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);

// 404 handler
app.use((req, res) => res.status(404).json({ message: "Not Found" }));

// Global error handler
app.use(errorHandler);

export default app;
