import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  transactionId: {
    type: String,
    unique: true,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'INR'
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'debit_card', 'upi', 'net_banking', 'wallet'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  description: String,
  relatedTo: {
    type: String,
    enum: ['ticket', 'registration', 'membership', 'other']
  },
  relatedId: mongoose.Schema.Types.ObjectId,
  gateway: {
    name: String,
    gatewayTransactionId: String,
    gatewayResponse: mongoose.Schema.Types.Mixed
  },
  metadata: mongoose.Schema.Types.Mixed,
  paidAt: Date,
  refundedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date
}, { timestamps: true });

export default mongoose.model('Payment', paymentSchema);
