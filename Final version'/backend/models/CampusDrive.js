import mongoose from 'mongoose';

const campusDriveSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide drive title'],
    trim: true
  },
  company: {
    type: String,
    required: [true, 'Please provide company name']
  },
  description: String,
  imageUrl: String,
  date: {
    type: Date,
    required: true
  },
  location: String,
  positions: [{
    title: String,
    count: Number,
    salary: String,
    eligibility: String
  }],
  registeredStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  selectedStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  postedBy: {
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

export default mongoose.model('CampusDrive', campusDriveSchema);
