import mongoose from 'mongoose';

const opportunitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide opportunity title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide opportunity description']
  },
  type: {
    type: String,
    enum: ['internship', 'placement', 'campus_drive', 'workshop', 'hackathon', 'other'],
    required: true
  },
  company: {
    type: String,
    required: [true, 'Please provide company name']
  },
  companyLogo: String,
  position: String,
  salary: String,
  deadline: Date,
  date: Date,
  location: String,
  requirements: [String],
  benefits: [String],
  applicantCount: {
    type: Number,
    default: 0
  },
  applications: [{
    userId: mongoose.Schema.Types.ObjectId,
    status: {
      type: String,
      enum: ['applied', 'shortlisted', 'rejected', 'selected'],
      default: 'applied'
    },
    appliedAt: {
      type: Date,
      default: Date.now
    }
  }],
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'closed', 'cancelled'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date
}, { timestamps: true });

export default mongoose.model('Opportunity', opportunitySchema);
