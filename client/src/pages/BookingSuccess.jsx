import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { CheckCircle, Calendar, Clock, User, Mail, Phone, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../utils/currency';
import { formatFullDate, formatTime } from '../utils/date';
import LoadingSpinner from '../components/LoadingSpinner';
import AvatarFallback from '../components/AvatarFallback';
import api from '../utils/api';
import toast from 'react-hot-toast';

const BookingSuccess = () => {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('id');
  const [imageError, setImageError] = useState(false);

  const { data: bookingData, isLoading, error } = useQuery(
    ['booking', bookingId],
    async () => {
      const response = await api.get(`/bookings/${bookingId}`);
      return response.data;
    },
    {
      enabled: !!bookingId,
      onError: (error) => {
        toast.error('Failed to load booking details');
        console.error('Error fetching booking:', error);
      },
    }
  );

  useEffect(() => {
    if (bookingData?.success) {
      toast.success('Booking confirmed successfully!');
    }
  }, [bookingData]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (error || !bookingData?.success) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Booking Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The booking you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/mentors"
            className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
          >
            Back to Mentors
          </Link>
        </div>
      </div>
    );
  }

  const booking = bookingData.data;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-success-100 dark:bg-success-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-success-600 dark:text-success-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Your mentorship session has been successfully booked
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="bg-primary-50 dark:bg-primary-900/20 p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-4">
              {imageError || !booking.mentorId.profileImage ? (
                <AvatarFallback
                  name={booking.mentorId.name}
                  className="w-16 h-16 border-2 border-white dark:border-gray-600"
                />
              ) : (
                <img
                  src={booking.mentorId.profileImage}
                  alt={booking.mentorId.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-white dark:border-gray-600"
                  onError={() => setImageError(true)}
                />
              )}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {booking.mentorId.name}
                </h2>
                <p className="text-primary-600 dark:text-primary-400 font-medium">
                  {booking.mentorId.title}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {booking.mentorId.specialization}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Session Details
                </h3>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-primary-600" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formatFullDate(new Date(booking.sessionDate))}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Session Date
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-primary-600" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {booking.timeSlot.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {booking.duration} minutes session
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-primary-600 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">₹</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formatCurrency(booking.price)}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Total Amount
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Your Details
                </h3>
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-primary-600" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {booking.studentName}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Full Name
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-primary-600" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {booking.studentEmail}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Email Address
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-primary-600" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {booking.studentPhone}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Phone Number
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {booking.notes && (
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Additional Notes
                </h3>
                <p className="text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  {booking.notes}
                </p>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Booking Status
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Booking ID: {booking._id}
                  </p>
                </div>
                <div
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    booking.status === 'confirmed'
                      ? 'bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200'
                      : booking.status === 'pending'
                      ? 'bg-warning-100 text-warning-800 dark:bg-warning-900 dark:text-warning-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">
            What happens next?
          </h3>
          <ul className="space-y-2 text-blue-800 dark:text-blue-200">
            <li className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
              <span>You'll receive a confirmation email with session details</span>
            </li>
            <li className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
              <span>The mentor will contact you before the session with meeting details</span>
            </li>
            <li className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
              <span>Join the session at the scheduled time and enjoy your mentorship!</span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/mentors"
            className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors space-x-2"
          >
            <span>Book Another Session</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium rounded-lg transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;