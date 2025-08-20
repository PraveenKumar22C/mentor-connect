import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  }
});

const educationSchema = new mongoose.Schema({
  degree: {
    type: String,
    required: true,
    trim: true
  },
  institution: {
    type: String,
    required: true,
    trim: true
  },
  startYear: {
    type: Number,
    required: true
  },
  endYear: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    trim: true
  }
});

const timeSlotSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  day: {
    type: String,
    required: true,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  available: {
    type: Boolean,
    default: true
  }
});

const pricingSchema = new mongoose.Schema({
  duration: {
    type: Number,
    required: true,
    enum: [15, 30, 60]
  },
  price: {
    type: Number,
    required: true
  }
});

const packageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  sessions: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  duration: {
    type: Number,
    required: true,
    min: 30
  },
  features: [{
    type: String,
    trim: true
  }]
});

const mentorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  specialization: {
    type: String,
    required: true,
    trim: true
  },
  experience: {
    type: Number,
    required: true,
    min: 0
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  available: {
    type: Boolean,
    default: true
  },
  profileImage: {
    type: String,
    default: 'https://res.cloudinary.com/drgkykl62/image/upload/v1735113234/mentor-booking/default-avatar.jpg'
  },
  bio: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  languages: [{
    type: String,
    trim: true
  }],
  education: [educationSchema],
  achievements: [achievementSchema],
  timeSlots: [timeSlotSchema],
  pricing: [pricingSchema],
  packages: [packageSchema],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalSessions: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

mentorSchema.index({ specialization: 1, location: 1, available: 1 });
mentorSchema.index({ rating: -1 });
mentorSchema.index({ name: 'text', specialization: 'text', location: 'text' });

const Mentor = mongoose.model('Mentor', mentorSchema);

export default Mentor;