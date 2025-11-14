import mongoose, { Document, Schema } from 'mongoose';

export type Priority = 'low' | 'medium' | 'high';
export type Status = 'pending' | 'in-progress' | 'completed';

export interface ITodo extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  status: Status;
}

const TodoSchema = new Schema<ITodo>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String },
    completed: { type: Boolean, default: false },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'low',
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export default mongoose.model<ITodo>('Todo', TodoSchema);
