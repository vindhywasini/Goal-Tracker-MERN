import express, { Response, NextFunction } from 'express';
import Todo from '../models/Todo';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = express.Router();

// All routes below require auth
router.use(requireAuth);

// CREATE TODO
router.post(
  '/',
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { title, description, priority } = req.body;
      if (!title) {
        return res.status(400).json({ message: 'title required' });
      }

      const todo = await Todo.create({
        user: req.user!._id,
        title,
        description,
        priority: priority || 'low',
        status: 'pending',
        completed: false,
      });

      res.status(201).json({ todo });
    } catch (err) {
      next(err);
    }
  }
);

// LIST TODOS
router.get(
  '/',
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const todos = await Todo.find({ user: req.user!._id }).sort({
        createdAt: -1,
      });
      res.json({ todos });
    } catch (err) {
      next(err);
    }
  }
);

// FULL / PARTIAL UPDATE TODO (status, title, etc.)
router.put(
  '/:id',
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const update: any = { ...req.body };

      // keep completed in sync with status if provided
      if (typeof update.status === 'string') {
        update.completed = update.status === 'completed';
      }

      const todo = await Todo.findOneAndUpdate(
        { _id: id, user: req.user!._id },
        update,
        { new: true }
      );
      if (!todo) {
        return res.status(404).json({ message: 'Not found' });
      }
      res.json({ todo });
    } catch (err) {
      next(err);
    }
  }
);

// TOGGLE COMPLETED
router.patch(
  '/:id/toggle',
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const todo = await Todo.findOne({ _id: id, user: req.user!._id });
      if (!todo) {
        return res.status(404).json({ message: 'Not found' });
      }

      todo.completed = !todo.completed;
      todo.status = todo.completed ? 'completed' : 'pending';
      await todo.save();

      res.json({ todo });
    } catch (err) {
      next(err);
    }
  }
);

// DELETE TODO
router.delete(
  '/:id',
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const todo = await Todo.findOneAndDelete({
        _id: id,
        user: req.user!._id,
      });
      if (!todo) {
        return res.status(404).json({ message: 'Not found' });
      }
      res.json({ message: 'Deleted' });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
