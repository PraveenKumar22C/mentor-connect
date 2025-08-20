import Booking from '../models/Booking.js';
import Mentor from '../models/Mentor.js';

export const createBooking = async (req, res) => {
  try {
    const bookingData = req.body;

    const mentor = await Mentor.findById(bookingData.mentorId);
    if (!mentor || !mentor.available || !mentor.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Mentor not available for booking'
      });
    }

    const existingBooking = await Booking.findOne({
      mentorId: bookingData.mentorId,
      sessionDate: new Date(bookingData.sessionDate),
      'timeSlot.name': bookingData.timeSlot.name,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: 'This time slot is already booked'
      });
    }

    const mentorPricing = mentor.pricing.find(p => p.duration === bookingData.duration);
    if (!mentorPricing || mentorPricing.price !== bookingData.price) {
      return res.status(400).json({
        success: false,
        message: 'Invalid pricing information'
      });
    }

    const booking = new Booking(bookingData);
    await booking.save();

    await booking.populate('mentorId', 'name title specialization profileImage');

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(400).json({
      success: false,
      message: 'Error creating booking',
      error: error.message
    });
  }
};

export const getBookings = async (req, res) => {
  try {
    const {
      mentorId,
      studentEmail,
      status,
      sessionDate,
      page = 1,
      limit = 10
    } = req.query;

    const filter = {};

    if (mentorId) filter.mentorId = mentorId;
    if (studentEmail) filter.studentEmail = studentEmail;
    if (status) filter.status = status;
    if (sessionDate) {
      const date = new Date(sessionDate);
      filter.sessionDate = {
        $gte: new Date(date.setHours(0, 0, 0, 0)),
        $lt: new Date(date.setHours(23, 59, 59, 999))
      };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [bookings, totalCount] = await Promise.all([
      Booking.find(filter)
        .populate('mentorId', 'name title specialization profileImage')
        .sort({ sessionDate: 1, createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Booking.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: bookings,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / parseInt(limit)),
        totalCount,
        hasNextPage: skip + bookings.length < totalCount,
        hasPrevPage: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings',
      error: error.message
    });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id)
      .populate('mentorId', 'name title specialization profileImage pricing timeSlots');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching booking',
      error: error.message
    });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, meetingLink, cancelReason } = req.body;

    const updateData = { status };
    
    if (meetingLink) updateData.meetingLink = meetingLink;
    if (status === 'cancelled') {
      updateData.cancelledAt = new Date();
      if (cancelReason) updateData.cancelReason = cancelReason;
    }

    const booking = await Booking.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('mentorId', 'name title specialization');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (status === 'completed') {
      await Mentor.findByIdAndUpdate(
        booking.mentorId._id,
        { $inc: { totalSessions: 1 } }
      );
    }

    res.json({
      success: true,
      message: 'Booking status updated successfully',
      data: booking
    });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating booking status',
      error: error.message
    });
  }
};

export const getAvailableSlots = async (req, res) => {
  try {
    const { mentorId, date } = req.query;

    if (!mentorId || !date) {
      return res.status(400).json({
        success: false,
        message: 'Mentor ID and date are required'
      });
    }

    const mentor = await Mentor.findById(mentorId);
    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: 'Mentor not found'
      });
    }

    const existingBookings = await Booking.find({
      mentorId,
      sessionDate: new Date(date),
      status: { $in: ['pending', 'confirmed'] }
    });

    const availableSlots = mentor.timeSlots.filter(slot => {
      const isBooked = existingBookings.some(booking => 
        booking.timeSlot.name === slot.name
      );
      return slot.available && !isBooked;
    });

    res.json({
      success: true,
      data: availableSlots
    });
  } catch (error) {
    console.error('Error fetching available slots:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching available slots',
      error: error.message
    });
  }
};