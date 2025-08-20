import React, { useState, useEffect } from 'react'
import { X, Calendar, Clock, User, Mail, Phone, MessageSquare } from 'lucide-react'
import { formatCurrency } from '../utils/currency'
import { getNext7Days, formatFullDate, formatTime } from '../utils/date'
import api from '../utils/api'
import toast from 'react-hot-toast'

const BookingModal = ({ isOpen, onClose, mentor }) => {
  const [selectedDuration, setSelectedDuration] = useState(30)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null)
  const [availableSlots, setAvailableSlots] = useState([])
  const [formData, setFormData] = useState({
    studentName: '',
    studentEmail: '',
    studentPhone: '',
    notes: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentDateIndex, setCurrentDateIndex] = useState(0)

  const dates = getNext7Days()
  const visibleDates = dates.slice(currentDateIndex, currentDateIndex + 3)

  useEffect(() => {
    if (dates.length > 0 && !selectedDate) {
      setSelectedDate(dates[0].date)
    }
  }, [dates])

  useEffect(() => {
    if (selectedDate && mentor) {
      fetchAvailableSlots()
    }
  }, [selectedDate, mentor])

  const fetchAvailableSlots = async () => {
    try {
      const response = await api.get('/bookings/available-slots', {
        params: {
          mentorId: mentor._id,
          date: selectedDate.toISOString().split('T')[0]
        }
      })
      if (response.data.success) {
        setAvailableSlots(response.data.data)
        setSelectedTimeSlot(null)
      }
    } catch (error) {
      console.error('Error fetching available slots:', error)
      toast.error('Failed to fetch available time slots')
    }
  }

  const handleDateNavigation = (direction) => {
    if (direction === 'prev' && currentDateIndex > 0) {
      setCurrentDateIndex(currentDateIndex - 1)
    } else if (direction === 'next' && currentDateIndex < dates.length - 3) {
      setCurrentDateIndex(currentDateIndex + 1)
    }
  }

  const getSelectedPrice = () => {
    const pricing = mentor?.pricing?.find(p => p.duration === selectedDuration)
    return pricing ? pricing.price : 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!selectedDate || !selectedTimeSlot) {
      toast.error('Please select a date and time slot')
      return
    }

    if (!formData.studentName || !formData.studentEmail || !formData.studentPhone) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)

    try {
      const bookingData = {
        mentorId: mentor._id,
        studentName: formData.studentName,
        studentEmail: formData.studentEmail,
        studentPhone: formData.studentPhone,
        sessionDate: selectedDate,
        timeSlot: selectedTimeSlot,
        duration: selectedDuration,
        price: getSelectedPrice(),
        notes: formData.notes
      }

      const response = await api.post('/bookings', bookingData)
      
      if (response.data.success) {
        toast.success('Booking created successfully!')
        onClose()
        window.location.href = `/booking-success?id=${response.data.data._id}`
      }
    } catch (error) {
      console.error('Error creating booking:', error)
      toast.error(error.response?.data?.message || 'Failed to create booking')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen || !mentor) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Book a Session
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              How long do you want to have a conversation?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {mentor.pricing?.map((pricing) => (
                <label
                  key={pricing.duration}
                  className={`relative flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    selectedDuration === pricing.duration
                      ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <input
                    type="radio"
                    name="duration"
                    value={pricing.duration}
                    checked={selectedDuration === pricing.duration}
                    onChange={(e) => setSelectedDuration(parseInt(e.target.value))}
                    className="sr-only"
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {pricing.duration} mins
                    </div>
                    <div className="text-sm text-primary-600 dark:text-primary-400">
                      {formatCurrency(pricing.price)}/session
                    </div>
                  </div>
                  {selectedDuration === pricing.duration && (
                    <div className="w-4 h-4 bg-primary-600 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  )}
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Pick a date
            </h3>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => handleDateNavigation('prev')}
                disabled={currentDateIndex === 0}
                className="p-2 rounded-md border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                ←
              </button>
              
              <div className="flex-1 grid grid-cols-3 gap-2">
                {visibleDates.map((dateObj) => (
                  <button
                    key={dateObj.date.toISOString()}
                    type="button"
                    onClick={() => setSelectedDate(dateObj.date)}
                    className={`p-3 text-center border-2 rounded-lg transition-colors ${
                      selectedDate?.toDateString() === dateObj.date.toDateString()
                        ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-600'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {dateObj.formatted}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {dateObj.shortDay}
                    </div>
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => handleDateNavigation('next')}
                disabled={currentDateIndex >= dates.length - 3}
                className="p-2 rounded-md border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                →
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Pick a time slot
            </h3>
            <div className="space-y-2">
              {availableSlots.length > 0 ? (
                availableSlots.map((slot) => (
                  <label
                    key={slot.name}
                    className={`flex items-center justify-between p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                      selectedTimeSlot?.name === slot.name
                        ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <input
                      type="radio"
                      name="timeSlot"
                      value={slot.name}
                      checked={selectedTimeSlot?.name === slot.name}
                      onChange={() => setSelectedTimeSlot(slot)}
                      className="sr-only"
                    />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {slot.name}
                    </span>
                    {selectedTimeSlot?.name === slot.name && (
                      <div className="w-4 h-4 bg-primary-600 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    )}
                  </label>
                ))
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                  No available time slots for this date
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Your Information
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={formData.studentName}
                    onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={formData.studentEmail}
                    onChange={(e) => setFormData({ ...formData, studentEmail: e.target.value })}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Phone Number *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="tel"
                  required
                  value={formData.studentPhone}
                  onChange={(e) => setFormData({ ...formData, studentPhone: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Additional Notes (Optional)
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Any specific topics or questions you'd like to discuss?"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                Booking Summary
              </h4>
              <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span>{selectedDuration} minutes</span>
                </div>
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span>{selectedDate ? formatFullDate(selectedDate) : 'Not selected'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Time:</span>
                  <span>{selectedTimeSlot ? selectedTimeSlot.name : 'Not selected'}</span>
                </div>
                <div className="flex justify-between font-medium text-gray-900 dark:text-white">
                  <span>Total:</span>
                  <span>{formatCurrency(getSelectedPrice())}</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !selectedDate || !selectedTimeSlot}
              className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Booking...</span>
                </>
              ) : (
                <>
                  <Calendar className="w-4 h-4" />
                  <span>Book Session - {formatCurrency(getSelectedPrice())}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BookingModal