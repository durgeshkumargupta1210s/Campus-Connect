import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  ticketNumber: {
    type: String,
    unique: true,
    required: true
  },
  type: {
    type: String,
    enum: ['free', 'paid', 'vip', 'standard'],
    default: 'standard'
  },
  price: Number,
  quantity: {
    type: Number,
    default: 1
  },
  status: {
    type: String,
    enum: ['valid', 'used', 'cancelled', 'expired'],
    default: 'valid'
  },
  qrCode: String,
  checkedInAt: Date,
  purchasedAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date
}, { timestamps: true });

export default mongoose.model('Ticket', ticketSchema);
