import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    console.log('🔄 Attempting to connect to MongoDB...');
    console.log('📍 URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');
    
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not set');
    }

    const mongoURL = `${process.env.MONGODB_URI}/CampusConnect`;
    console.log('📌 Connecting to:', mongoURL.replace(/\/\/.+:/, '//***:'));

    // Connection event handlers
    mongoose.connection.on('connected', () => {
      console.log('✅ Mongoose connected to MongoDB');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ Mongoose connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ Mongoose disconnected from MongoDB');
    });

    // Set connection options
    const options = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      family: 4 // Use IPv4
    };

    await mongoose.connect(mongoURL, options);
    console.log('✅ Database connected successfully!');
    return true;
  } catch (error) {
    console.error('❌ Failed to connect to database:');
    console.error('   Error:', error.message);
    console.error('   Code:', error.code);
    
    // Don't exit on first connection failure - allow server to start anyway
    console.log('⚠️ Server starting without database connection. Database will reconnect automatically.');
    return false;
  }
};

export default connectDB;