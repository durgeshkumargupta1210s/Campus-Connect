import 'dotenv/config';
import mongoose from 'mongoose';

console.log('Testing MongoDB connection...');
console.log('MONGODB_URI:', process.env.MONGODB_URI);

try {
  const conn = await mongoose.connect(`${process.env.MONGODB_URI}/CampusConnect`);
  console.log('✓ Database connected successfully');
  await mongoose.disconnect();
} catch (error) {
  console.error('✗ Database connection failed:', error.message);
  process.exit(1);
}
