import express from 'express';
import {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
  getAvailableSlots
} from '../controllers/bookingController.js';

const router = express.Router();

router.get('/', getBookings);
router.get('/available-slots', getAvailableSlots);
router.get('/:id', getBookingById);
router.post('/', createBooking);
router.patch('/:id/status', updateBookingStatus);

export default router;