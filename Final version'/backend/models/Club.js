import mongoose from 'mongoose';

const clubSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide club name'],
    unique: true,
    trim: true
  },
  description: String,
  imageUrl: String,
  category: {
    type: String,
    enum: ['technical', 'cultural', 'sports', 'academic', 'professional', 'other'],
    default: 'other'
  },
  head: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  events: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  }],
  email: String,
  phone: String,
  location: String,
  website: String,
  socialLinks: {
    instagram: String,
    linkedin: String,
    twitter: String,
    facebook: String
  },
  memberCount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date
}, { timestamps: true });

export default mongoose.model('Club', clubSchema);
