import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IAnalytics extends Document {
  userId: Types.ObjectId;
  period: 'daily' | 'weekly' | 'monthly';
  patterns: Record<string, any>; // store baseline patterns, means, stddev etc.
}

const analyticsSchema = new Schema<IAnalytics>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  period: { type: String, enum: ['daily', 'weekly', 'monthly'], required: true },
  patterns: { type: Schema.Types.Mixed, default: {} },
}, { timestamps: true });

export const AnalyticsModel = mongoose.model<IAnalytics>('Analytics', analyticsSchema);
