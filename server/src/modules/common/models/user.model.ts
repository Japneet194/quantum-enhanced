import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  currency?: string; // default INR
  preferences?: {
    notifications?: boolean;
    carbonInsights?: boolean;
  };
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true },
  currency: { type: String, default: 'INR' },
  preferences: {
    notifications: { type: Boolean, default: true },
    carbonInsights: { type: Boolean, default: true },
  },
}, { timestamps: true });

export const UserModel = mongoose.model<IUser>('User', userSchema);
