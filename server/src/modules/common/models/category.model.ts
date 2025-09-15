import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ICategory extends Document {
  userId: Types.ObjectId;
  name: string;
  limit?: number; // spending limit
  carbonScore?: number; // eco score baseline
}

const categorySchema = new Schema<ICategory>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true },
  limit: { type: Number },
  carbonScore: { type: Number, default: 50 },
}, { timestamps: true });

export const CategoryModel = mongoose.model<ICategory>('Category', categorySchema);
