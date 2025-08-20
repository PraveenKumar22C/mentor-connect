import mongoose from 'mongoose';

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
      enum: ['Morning (9 AM to 1 PM)', 'Afternoon (1 PM to 5 PM)', 'Evening (5 PM to 9 PM)', 'Late Night (9 PM to 1 AM)']
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