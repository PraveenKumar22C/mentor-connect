import mongoose from 'mongoose';
import Mentor from './Mentor.js';

const bookingSchema = new mongoose.Schema({
  mentorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mentor',
    required: true
  },
  studentName: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100
  },
  studentEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  studentPhone: {
    type: String,
    required: true,
    trim: true,
    match: [/^\+?[\d\s-()]+$/, 'Please enter a valid phone number']
  },
  sessionDate: {
    type: Date,
    required: true
  },
  timeSlot: {
    name: {
      type: String,
      required: true,
      validate: {
        validator: async function(value) {
          const mentor = await Mentor.findById(this.mentorId);
          if (!mentor) return false;
          return mentor.timeSlots.some(slot => slot.name === value && slot.available);
        },
        message: 'Invalid time slot or slot not available for this mentor'
      }
    },
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    }
  },
  duration: {
    type: Number,
    required: true,
    enum: [15, 30, 60]
  },
  price: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  meetingLink: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true,
    maxlength: 500
  },
  cancelledAt: {
    type: Date
  },
  cancelReason: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

bookingSchema.index({ mentorId: 1, sessionDate: 1 });
bookingSchema.index({ studentEmail: 1 });
bookingSchema.index({ status: 1 });

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;