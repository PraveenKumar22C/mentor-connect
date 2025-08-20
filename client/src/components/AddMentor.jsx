import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { X, User, FileText, Briefcase, MapPin, Clock, DollarSign, Languages, BookOpen, Image, Plus, Trash2, UserPlus, Calendar, Package, Star, CheckCircle2 } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const AddMentor = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    specialization: '',
    location: '',
    experience: '',
    bio: '',
    languages: '',
    available: true,
  });
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [timeSlots, setTimeSlots] = useState([{ day: 'Monday', startTime: '00:00', endTime: '01:00' }]);
  const [packages, setPackages] = useState([
    { name: 'Basic', sessions: 1, price: 50, duration: 60, features: ['1-on-1 Session', 'Email Support'] },
    { name: 'Standard', sessions: 3, price: 135, duration: 60, features: ['3 Sessions', 'Email Support', 'Resource Materials'] },
    { name: 'Premium', sessions: 5, price: 200, duration: 60, features: ['5 Sessions', 'Priority Support', 'Custom Plan', 'Follow-up Sessions'] }
  ]);
  const [pricing, setPricing] = useState([
    { duration: 15, price: 0 },
    { duration: 30, price: 0 },
    { duration: 60, price: 0 }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const mutation = useMutation(
    async (data) => {
      const form = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'timeSlots' || key === 'packages' || key === 'pricing') {
          form.append(key, JSON.stringify(value));
        } else if (key !== 'profileImage') {
          form.append(key, value);
        }
      });
      if (profileImage) {
        form.append('profileImage', profileImage);
      }
      const response = await api.post('/mentors', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },
    {
      onSuccess: () => {
        toast.success('Mentor added successfully!');
        queryClient.invalidateQueries(['mentors']);
        navigate('/mentors');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to add mentor');
        setIsSubmitting(false);
      },
      onMutate: () => {
        setIsSubmitting(true);
      },
      onSettled: () => {
        setIsSubmitting(false);
      },
    }
  );

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleTimeSlotChange = (index, field, value) => {
    const newTimeSlots = [...timeSlots];
    newTimeSlots[index][field] = value;
    setTimeSlots(newTimeSlots);
  };

  const addTimeSlot = () => {
    setTimeSlots([...timeSlots, { day: 'Monday', startTime: '00:00', endTime: '01:00' }]);
  };

  const removeTimeSlot = (index) => {
    setTimeSlots(timeSlots.filter((_, i) => i !== index));
  };

  const handlePackageChange = (index, field, value) => {
    const newPackages = [...packages];
    newPackages[index][field] = field === 'price' || field === 'sessions' || field === 'duration' ? parseFloat(value) || 0 : value;
    setPackages(newPackages);
  };

  const addPackageFeature = (packageIndex) => {
    const newPackages = [...packages];
    newPackages[packageIndex].features.push('');
    setPackages(newPackages);
  };

  const removePackageFeature = (packageIndex, featureIndex) => {
    const newPackages = [...packages];
    newPackages[packageIndex].features.splice(featureIndex, 1);
    setPackages(newPackages);
  };

  const updatePackageFeature = (packageIndex, featureIndex, value) => {
    const newPackages = [...packages];
    newPackages[packageIndex].features[featureIndex] = value;
    setPackages(newPackages);
  };

  const handlePricingChange = (index, value) => {
    const newPricing = [...pricing];
    newPricing[index].price = parseFloat(value) || 0;
    setPricing(newPricing);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    mutation.mutate({ ...formData, timeSlots, packages, pricing });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl text-white">
                <UserPlus className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Add New Mentor
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">Create a new mentor profile</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/mentors')}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200"
              aria-label="Close form"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/40 border border-gray-100/50 overflow-hidden">
          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Profile Image Section */}
            <div className="text-center">
              <div className="relative inline-block">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-10 h-10 text-gray-400" />
                  )}
                </div>
                <label className="absolute -bottom-2 -right-2 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full cursor-pointer shadow-lg transition-all duration-200 hover:scale-105">
                  <Image className="w-4 h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-sm text-gray-500 mt-3">Upload profile photo</p>
            </div>

            {/* Personal Information */}
            <div className="bg-gray-50/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-500" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                    placeholder="Enter full name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Professional Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                    placeholder="e.g., Senior Consultant"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Specialization</label>
                  <input
                    type="text"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                    placeholder="e.g., Cardiology"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                      placeholder="e.g., Mumbai, India"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Details */}
            <div className="bg-blue-50/30 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                <Briefcase className="w-5 h-5 mr-2 text-blue-500" />
                Professional Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Experience (Years)</label>
                  <input
                    type="number"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                    placeholder="10"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Languages</label>
                  <div className="relative">
                    <Languages className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="languages"
                      value={formData.languages}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                      placeholder="English, Hindi"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Pricing (per session)</label>
                {pricing.map((price, index) => (
                  <div key={index} className="flex items-center space-x-4 mb-2">
                    <label className="text-sm text-gray-600">{price.duration} mins:</label>
                    <div className="relative flex-1">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        value={price.price}
                        onChange={(e) => handlePricingChange(index, e.target.value)}
                        required
                        min="0"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                        placeholder={`Price for ${price.duration} mins`}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-2 mt-6">
                <label className="block text-sm font-medium text-gray-700">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  required
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 resize-none"
                  placeholder="Describe the mentor's background, expertise, and achievements..."
                />
              </div>
            </div>

            {/* Packages */}
            <div className="bg-purple-50/30 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                <Package className="w-5 h-5 mr-2 text-purple-500" />
                Mentoring Packages
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {packages.map((pkg, index) => (
                  <div
                    key={index}
                    className={`relative bg-white rounded-xl border-2 p-6 transition-all duration-300 hover:shadow-lg ${
                      pkg.name === 'Standard' ? 'border-purple-300 ring-2 ring-purple-100' : 'border-gray-200 hover:border-purple-200'
                    }`}
                  >
                    {pkg.name === 'Standard' && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center">
                          <Star className="w-3 h-3 mr-1" />
                          POPULAR
                        </span>
                      </div>
                    )}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={pkg.name}
                          onChange={(e) => handlePackageChange(index, 'name', e.target.value)}
                          className="w-full text-xl font-bold bg-transparent border-none focus:ring-0 p-0 text-gray-800"
                          placeholder="Package Name"
                        />
                      </div>
                      <div className="flex items-baseline space-x-2">
                        <span className="text-3xl font-bold text-gray-900">$</span>
                        <input
                          type="number"
                          value={pkg.price}
                          onChange={(e) => handlePackageChange(index, 'price', e.target.value)}
                          className="text-3xl font-bold bg-transparent border-none focus:ring-0 p-0 w-20 text-gray-900"
                          min="0"
                        />
                        <span className="text-gray-500">/ package</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="block text-xs font-medium text-gray-600">Sessions</label>
                          <input
                            type="number"
                            value={pkg.sessions}
                            onChange={(e) => handlePackageChange(index, 'sessions', e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            min="1"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-xs font-medium text-gray-600">Duration (min)</label>
                          <input
                            type="number"
                            value={pkg.duration}
                            onChange={(e) => handlePackageChange(index, 'duration', e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            min="30"
                            step="15"
                          />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="block text-xs font-medium text-gray-600">Features</label>
                        {pkg.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center space-x-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <input
                              type="text"
                              value={feature}
                              onChange={(e) => updatePackageFeature(index, featureIndex, e.target.value)}
                              className="flex-1 text-sm bg-transparent border-none focus:ring-0 p-0 text-gray-700"
                              placeholder="Feature description"
                            />
                            {pkg.features.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removePackageFeature(index, featureIndex)}
                                className="text-red-400 hover:text-red-600 p-1"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => addPackageFeature(index)}
                          className="flex items-center space-x-1 text-purple-500 hover:text-purple-600 text-xs font-medium"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add Feature</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className="bg-green-50/30 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-green-500" />
                Availability & Time Slots
              </h3>
              <div className="flex items-center mb-6">
                <input
                  type="checkbox"
                  name="available"
                  checked={formData.available}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <label className="ml-3 text-sm font-medium text-gray-700">Currently accepting new mentees</label>
              </div>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">Weekly Schedule</label>
                  <button
                    type="button"
                    onClick={addTimeSlot}
                    className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Time Slot</span>
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {timeSlots.map((slot, index) => (
                    <div
                      key={index}
                      className="relative bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                            <Clock className="w-4 h-4 text-green-600" />
                          </div>
                          <span className="text-sm font-semibold text-gray-800">Time Slot {index + 1}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeTimeSlot(index)}
                          className="text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 p-2 rounded-full transition-all duration-200 transform hover:scale-110"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-medium text-gray-600">Day of Week</label>
                          <div className="relative">
                            <select
                              value={slot.day}
                              onChange={(e) => handleTimeSlotChange(index, 'day', e.target.value)}
                              required
                              className="appearance-none w-full px-3 py-2.5 pl-10 pr-8 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm font-medium text-gray-800 transition-all duration-300 hover:border-green-400 cursor-pointer bg-gradient-to-r from-white to-green-50/50"
                            >
                              <option value="" disabled>Select Day</option>
                              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                                <option key={day} value={day} className="bg-white hover:bg-green-50 transition-colors duration-200">
                                  {day}
                                </option>
                              ))}
                            </select>
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                              </svg>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="block text-xs font-medium text-gray-600">Start Time</label>
                            <div className="relative">
                              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <input
                                type="time"
                                value={slot.startTime}
                                onChange={(e) => handleTimeSlotChange(index, 'startTime', e.target.value)}
                                required
                                className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm transition-all duration-200 hover:border-green-300 cursor-pointer"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="block text-xs font-medium text-gray-600">End Time</label>
                            <div className="relative">
                              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <input
                                type="time"
                                value={slot.endTime}
                                onChange={(e) => handleTimeSlotChange(index, 'endTime', e.target.value)}
                                required
                                className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm transition-all duration-200 hover:border-green-300 cursor-pointer"
                              />
                            </div>
                          </div>
                        </div>
                        {slot.day && slot.startTime && slot.endTime && (
                          <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200/50 transition-all duration-200">
                            <div className="flex items-center space-x-2 text-sm text-green-700">
                              <CheckCircle2 className="w-4 h-4" />
                              <span className="font-medium">
                                {slot.day}: {slot.startTime} - {slot.endTime}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {timeSlots.length === 0 && (
                  <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 transition-all duration-200">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm font-medium">No time slots added yet</p>
                    <p className="text-gray-400 text-xs mt-1">Click "Add Time Slot" to get started</p>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Adding Mentor...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Add Mentor</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate('/mentors')}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-semibold transition-all duration-200 hover:shadow-md"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddMentor;