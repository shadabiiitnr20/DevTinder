import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async () => {
  try {
    const dbConnection = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${dbConnection.connection.host}`);
  } catch (error) {
    console.log('Error occured while connecting to DB', error.message);
    process.exit(1);
  }
};
