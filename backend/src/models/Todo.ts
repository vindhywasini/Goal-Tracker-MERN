import mongoose from 'mongoose';
export interface ITodo extends mongoose.Document {
  user: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  completed: boolean;
}
const TodoSchema = new mongoose.Schema<ITodo>({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  completed: { type: Boolean, default: false }
}, { timestamps: true });
export default mongoose.model<ITodo>('Todo', TodoSchema);
