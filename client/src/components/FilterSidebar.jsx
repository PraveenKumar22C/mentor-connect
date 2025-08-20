import React, { useState, useEffect } from 'react'
import { X, Filter, ChevronDown, ChevronUp, Check } from 'lucide-react'
import api from '../utils/api'

const FilterSidebar = ({ isOpen, onClose, filters, onFiltersChange, onApplyFilters }) => {
  const [filterOptions, setFilterOptions] = useState({
    specializations: [],
    locations: [],
    experienceRanges: []
  })
  const [expandedSections, setExpandedSections] = useState({
    specialization: true,
    location: true,
    experience: true,
    availability: true
  })

  useEffect(() => {
    fetchFilterOptions()
  }, [])

  const fetchFilterOptions = async () => {
    try {
      const response = await api.get('/mentors/filters')
      if (response.data.success) {
        setFilterOptions(response.data.data)
      }
    } catch (error) {
      console.error('Error fetching filter options:', error)
    }
  }

  const handleMultiSelectChange = (key, value) => {
    const currentValues = filters[key] || []
    const newValues = currentValues.includes(value)
      ? currentValues.filter(item => item !== value)
      : [...currentValues, value]
    
    onFiltersChange({ ...filters, [key]: newValues })
  }

  const handleFilterChange = (key, value) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const clearFilters = () => {
    onFiltersChange({
      specialization: [],
      location: [],
      experience: '',
      available: '',
      search: filters.search || ''
    })
  }

  const FilterSection = ({ title, sectionKey, children }) => (
    <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="flex items-center justify-between w-full text-left"
      >
        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
          {title}
        </h3>
        {expandedSections[sectionKey] ? (
          <ChevronUp className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        )}
      </button>
      {expandedSections[sectionKey] && (
        <div className="mt-3 space-y-2">
          {children}
        </div>
      )}
    </div>
  )

  const MultiSelectItem = ({ label, value, selectedValues, onChange }) => (
    <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-md transition-colors">
      <div className="relative">
        <input
          type="checkbox"
          checked={selectedValues.includes(value)}
          onChange={() => onChange(value)}
          className="sr-only"
        />
        <div className={`w-4 h-4 border-2 rounded flex items-center justify-center transition-colors ${
          selectedValues.includes(value)
            ? 'border-primary-600 bg-primary-600'
            : 'border-gray-300 dark:border-gray-600'
        }`}>
          {selectedValues.includes(value) && (
            <Check className="w-3 h-3 text-white" />
          )}
        </div>
      </div>
      <span className="text-sm text-gray-700 dark:text-gray-300">
        {label}
      </span>
    </label>
  )

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <div className={`
        fixed lg:static inset-y-0 left-0 z-40 w-80 bg-white dark:bg-gray-800 
        border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-primary-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Filters
            </h2>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-6 overflow-y-auto h-full pb-20">
          <FilterSection title="Specialization" sectionKey="specialization">
            <div className="space-y-1">
              {filterOptions.specializations.map((spec) => (
                <MultiSelectItem
                  key={spec}
                  label={spec}
                  value={spec}
                  selectedValues={filters.specialization || []}
                  onChange={(value) => handleMultiSelectChange('specialization', value)}
                />
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Location" sectionKey="location">
            <div className="space-y-1">
              {filterOptions.locations.map((location) => (
                <MultiSelectItem
                  key={location}
                  label={location}
                  value={location}
                  selectedValues={filters.location || []}
                  onChange={(value) => handleMultiSelectChange('location', value)}
                />
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Experience" sectionKey="experience">
            <div className="space-y-2">
              {filterOptions.experienceRanges.map((range) => (
                <label key={range.value} className="flex items-center">
                  <input
                    type="radio"
                    name="experience"
                    value={range.value}
                    checked={filters.experience === range.value.toString()}
                    onChange={(e) => handleFilterChange('experience', e.target.value)}
                    className="w-4 h-4 text-primary-600 border-gray-300 dark:border-gray-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    {range.label}
                  </span>
                </label>
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Availability" sectionKey="availability">
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="availability"
                  value=""
                  checked={filters.available === ''}
                  onChange={(e) => handleFilterChange('available', e.target.value)}
                  className="w-4 h-4 text-primary-600 border-gray-300 dark:border-gray-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  All
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="availability"
                  value="true"
                  checked={filters.available === 'true'}
                  onChange={(e) => handleFilterChange('available', e.target.value)}
                  className="w-4 h-4 text-primary-600 border-gray-300 dark:border-gray-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Available
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="availability"
                  value="false"
                  checked={filters.available === 'false'}
                  onChange={(e) => handleFilterChange('available', e.target.value)}
                  className="w-4 h-4 text-primary-600 border-gray-300 dark:border-gray-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Busy
                </span>
              </label>
            </div>
          </FilterSection>

          <div className="space-y-3 pt-4">
            <button
              onClick={onApplyFilters}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-md font-medium transition-colors"
            >
              Apply Filters
            </button>
            <button
              onClick={clearFilters}
              className="w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-md font-medium transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default FilterSidebar