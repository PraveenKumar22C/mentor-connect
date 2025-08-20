import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import { 
  MapPin, Clock, Star, Calendar, Languages, GraduationCap, 
  Award, User, Mail, Phone, MessageSquare 
} from 'lucide-react'
import BookingModal from '../components/BookingModal'
import LoadingSpinner from '../components/LoadingSpinner'
import { formatCurrency } from '../utils/currency'
import api from '../utils/api'
import toast from 'react-hot-toast'

const MentorProfile = () => {
  const { id } = useParams()
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)

  const { data: mentorData, isLoading, error } = useQuery(
    ['mentor', id],
    async () => {
      const response = await api.get(`/mentors/${id}`)
      return response.data
    },
    {
      enabled: !!id,
      onError: (error) => {
        toast.error('Failed to load mentor profile')
        console.error('Error fetching mentor:', error)
      }
    }
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    )
  }

  if (error || !mentorData?.success) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Mentor Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The mentor profile you're looking for doesn't exist or has been removed.
          </p>
          <a
            href="/mentors"
            className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
          >
            Back to Mentors
          </a>
        </div>
      </div>
    )
  }

  const mentor = mentorData.data

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6">
                <img
                  src={mentor.profileImage}
                  alt={mentor.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-gray-200 dark:border-gray-600"
                  onError={(e) => {
                    e.target.src = 'https://res.cloudinary.com/drgkykl62/image/upload/v1735113234/mentor-booking/default-avatar.jpg'
                  }}
                />
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {mentor.name}
                  </h1>
                  <p className="text-lg text-primary-600 dark:text-primary-400 font-medium mb-2">
                    {mentor.title}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {mentor.specialization}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{mentor.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{mentor.experience} years experience</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span>{mentor.rating.toFixed(1)} ({mentor.totalSessions} sessions)</span>
                    </div>
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      mentor.available 
                        ? 'bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {mentor.available ? 'Available' : 'Busy'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                About
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
                {mentor.bio}
              </p>
            </div>

            {mentor.languages && mentor.languages.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Languages className="w-5 h-5 text-primary-600" />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Languages
                  </h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {mentor.languages.map((language, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                    >
                      {language}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {mentor.education && mentor.education.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <GraduationCap className="w-5 h-5 text-primary-600" />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Education
                  </h2>
                </div>
                <div className="space-y-4">
                  {mentor.education.map((edu, index) => (
                    <div key={index} className="border-l-4 border-primary-200 dark:border-primary-800 pl-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {edu.degree}
                      </h3>
                      <p className="text-primary-600 dark:text-primary-400 font-medium">
                        {edu.institution}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {edu.startYear} - {edu.endYear}
                      </p>
                      {edu.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {edu.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {mentor.achievements && mentor.achievements.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Award className="w-5 h-5 text-primary-600" />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Achievements
                  </h2>
                </div>
                <div className="space-y-3">
                  {mentor.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {achievement.title}
                        </h3>
                        {achievement.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {achievement.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Book a Session
                </h3>

                <div className="space-y-3 mb-6">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    Session Duration & Pricing
                  </h4>
                  {mentor.pricing && mentor.pricing.map((pricing) => (
                    <div
                      key={pricing.duration}
                      className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg"
                    >
                      <div>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {pricing.duration} mins
                        </span>
                      </div>
                      <div className="text-primary-600 dark:text-primary-400 font-semibold">
                        {formatCurrency(pricing.price)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                    Available Time Slots
                  </h4>
                  <div className="space-y-2">
                    {mentor.timeSlots && mentor.timeSlots.filter(slot => slot.available).map((slot, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {slot.name}
                        </span>
                        <div className="w-2 h-2 bg-success-500 rounded-full" />
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setIsBookingModalOpen(true)}
                  disabled={!mentor.available}
                  className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>
                    {mentor.available ? 'Book a Session' : 'Currently Unavailable'}
                  </span>
                </button>

                {mentor.pricing && mentor.pricing.length > 0 && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
                    Starting from {formatCurrency(Math.min(...mentor.pricing.map(p => p.price)))}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        mentor={mentor}
      />
    </div>
  )
}

export default MentorProfile