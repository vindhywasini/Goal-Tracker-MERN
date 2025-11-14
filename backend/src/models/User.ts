import mongoose from 'mongoose';
export interface IUser extends mongoose.Document {
  email: string;
  password: string;
  name?: string;
  resetToken?: string | null;
  resetTokenExpiry?: Date | null;
}
const UserSchema = new mongoose.Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String },
  resetToken: { type: String },
  resetTokenExpiry: { type: Date }
}, { timestamps: true });
export default mongoose.model<IUser>('User', UserSchema);
