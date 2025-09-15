import mongoose from 'mongoose';

export async function connectDb() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/qeads';
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, {
    // options can be added here
  });
  console.log('MongoDB connected');
}
