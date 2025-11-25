import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide event title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide event description']
  },
  category: {
    type: String,
    enum: ['technical', 'cultural', 'sports', 'workshop', 'seminar', 'hackathon', 'other'],
    default: 'other'
  },
  date: {
    type: Date,
    required: [true, 'Please provide event date']
  },
  time: String,
  duration: String,
  location: String,
  venue: String,
  imageUrl: String,
  capacity: Number,
  registeredCount: {
    type: Number,
    default: 0
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  price: {
    type: Number,
    default: 0
  },
  paymentMethods: [{
    type: String,
    enum: ['credit_card', 'debit_card', 'upi', 'net_banking', 'wallet']
  }],
  paymentDeadline: Date,
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Club'
  },
  registrations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Registration'
  }],
  tags: [String],
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date
}, { timestamps: true });

export default mongoose.model('Event', eventSchema);
