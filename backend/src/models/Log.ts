import mongoose from 'mongoose';
const LogSchema = new mongoose.Schema({
  message: String,
  stack: String,
  meta: mongoose.Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now }
});
export default mongoose.model('Log', LogSchema);
