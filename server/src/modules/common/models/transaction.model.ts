import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ITransaction extends Document {
  userId: Types.ObjectId;
  merchant: string;
  amount: number;
  currency: string;
  category: string;
  timestamp: Date;
  isAnomaly: boolean;
  anomalyReason?: string;
  carbonScore: number;
  status: 'pending' | 'verified' | 'flagged';
  raw?: any; // original parsed data (e.g., SMS)
}

const txSchema = new Schema<ITransaction>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  merchant: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true, default: 'INR' },
  category: { type: String, required: true },
  timestamp: { type: Date, required: true, default: Date.now },
  isAnomaly: { type: Boolean, default: false },
  anomalyReason: { type: String },
  carbonScore: { type: Number, default: 50 },
  status: { type: String, enum: ['pending', 'verified', 'flagged'], default: 'pending' },
  raw: { type: Schema.Types.Mixed },
}, { timestamps: true });

export const TransactionModel = mongoose.model<ITransaction>('Transaction', txSchema);
