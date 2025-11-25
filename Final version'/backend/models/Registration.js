import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['registered', 'attended', 'cancelled', 'no-show'],
    default: 'registered'
  },
  checkInTime: Date,
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String
  },
  registeredAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date
}, { timestamps: true });

// Ensure unique registration per user per event
registrationSchema.index({ event: 1, user: 1 }, { unique: true });

export default mongoose.model('Registration', registrationSchema);
