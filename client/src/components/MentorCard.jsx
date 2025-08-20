import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Star, Calendar, Languages } from 'lucide-react';
import { formatCurrency } from '../utils/currency';
import AvatarFallback from './AvatarFallback';

const MentorCard = ({ mentor }) => {
  const [imageError, setImageError] = useState(false);

  const getLowestPrice = () => {
    if (!mentor.pricing || mentor.pricing.length === 0) return null;
    return Math.min(...mentor.pricing.map(p => p.price));
  };

  const lowestPrice = getLowestPrice();

  return (
    <Link to={`/mentor/${mentor._id}`} className="block">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden card-hover border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              {imageError || !mentor.profileImage ? (
                <AvatarFallback
                  name={mentor.name}
                  className="w-16 h-16 border-2 border-gray-200 dark:border-gray-600"
                />
              ) : (
                <img
                  src={mentor.profileImage}
                  alt={mentor.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                  onError={() => setImageError(true)}
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                {mentor.name}
              </h3>
              <p className="text-sm text-primary-600 dark:text-primary-400 font-medium">
                {mentor.title}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {mentor.specialization}
              </p>
            </div>
            <div className="flex-shrink-0">
              <div
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  mentor.available
                    ? 'bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                {mentor.available ? 'Available' : 'Busy'}
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 pb-4">
          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
            <div className="flex items-center space-x-1">
              <MapPin className="w-4 h-4" />
              <span>{mentor.location}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{mentor.experience} years</span>
            </div>
          </div>

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {mentor.rating.toFixed(1)}
                </span>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                ({mentor.totalSessions} sessions)
              </span>
            </div>
            {lowestPrice && (
              <div className="text-right">
                <span className="text-sm text-gray-500 dark:text-gray-400">Starting from</span>
                <div className="text-lg font-semibold text-primary-600 dark:text-primary-400">
                  {formatCurrency(lowestPrice)}
                </div>
              </div>
            )}
          </div>

          {mentor.languages && mentor.languages.length > 0 && (
            <div className="flex items-center space-x-1 mb-3">
              <Languages className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {mentor.languages.slice(0, 3).join(', ')}
                {mentor.languages.length > 3 && ` +${mentor.languages.length - 3} more`}
              </span>
            </div>
          )}

          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
            {mentor.bio}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
              <Calendar className="w-4 h-4" />
              <span>{mentor.timeSlots?.length || 0} time slots</span>
            </div>
            <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              View Profile
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MentorCard;