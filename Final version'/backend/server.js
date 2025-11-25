import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import 'express-async-errors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import clubRoutes from './routes/clubRoutes.js';
import opportunityRoutes from './routes/opportunityRoutes.js';
import registrationRoutes from './routes/registrationRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import campusDriveRoutes from './routes/campusDriveRoutes.js';

// Import middleware
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://yourdomain.com' 
    : ['http://localhost:5173', 'http://localhost:8080', 'http://localhost:8081', 'http://localhost:8082', 'http://127.0.0.1:5173', 'http://127.0.0.1:8080', 'http://127.0.0.1:8081', 'http://127.0.0.1:8082'],
  credentials: true
}));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✓ MongoDB connected'))
  .catch(err => {
    console.error('✗ MongoDB connection error:', err);
    process.exit(1);
  });

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'CampusConnect Backend is running' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/clubs', clubRoutes);
app.use('/api/opportunities', opportunityRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/campus-drives', campusDriveRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export default app;
