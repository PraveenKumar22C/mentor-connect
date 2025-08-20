import React, { useState, useEffect, useCallback } from "react";
import { useQuery } from "react-query";
import { Search, Filter, SlidersHorizontal, Plus, X } from "lucide-react";
import { debounce } from "lodash";
import { Link } from "react-router-dom";
import MentorCard from "../components/MentorCard";
import FilterSidebar from "../components/FilterSidebar";
import LoadingSpinner from "../components/LoadingSpinner";
import api from "../utils/api";
import toast from "react-hot-toast";
import SortDropdown from "../components/SortDropdown";

const MentorList = () => {
  const [filters, setFilters] = useState({
    specialization: [],
    location: [],
    experience: "",
    available: "",
    search: "",
  });
  const [appliedFilters, setAppliedFilters] = useState(filters);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState("rating");
  const [sortOrder, setSortOrder] = useState("desc");

  const debouncedApplySearch = useCallback(
    debounce((searchTerm) => {
      setAppliedFilters((prev) => ({ ...prev, search: searchTerm }));
    }, 300),
    []
  );

  const handleSearchChange = (e) => {
    const searchTerm = e.target.value;
    setFilters((prev) => ({ ...prev, search: searchTerm }));
    debouncedApplySearch(searchTerm);
  };

  const {
    data: mentorsData,
    isLoading,
    error,
    refetch,
  } = useQuery(
    ["mentors", appliedFilters, sortBy, sortOrder],
    async () => {
      const params = new URLSearchParams();

      Object.entries(appliedFilters).forEach(([key, value]) => {
        if (value && value.length > 0) {
          if (Array.isArray(value)) {
            value.forEach((v) => params.append(key, v));
          } else {
            params.append(key, value);
          }
        }
      });

      params.append("sortBy", sortBy);
      params.append("sortOrder", sortOrder);

      const response = await api.get(`/mentors?${params.toString()}`);
      return response.data;
    },
    {
      onError: (error) => {
        toast.error("Failed to fetch mentors");
        console.error("Error fetching mentors:", error);
      },
      keepPreviousData: true,
    }
  );

  const handleApplyFilters = () => {
    setAppliedFilters(filters);
    setIsFilterOpen(false);
  };

  const removeFilter = (filterType, value) => {
    const newFilters = { ...filters };
    if (Array.isArray(newFilters[filterType])) {
      newFilters[filterType] = newFilters[filterType].filter(
        (item) => item !== value
      );
    } else {
      newFilters[filterType] = "";
    }
    setFilters(newFilters);
    setAppliedFilters(newFilters);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (appliedFilters.specialization?.length > 0)
      count += appliedFilters.specialization.length;
    if (appliedFilters.location?.length > 0)
      count += appliedFilters.location.length;
    if (appliedFilters.experience) count += 1;
    if (appliedFilters.available) count += 1;
    if (appliedFilters.search) count += 1;
    return count;
  };

  const mentors = mentorsData?.data || [];
  const totalCount = mentorsData?.pagination?.totalCount || 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Find Your Perfect Mentor
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Connect with experienced professionals and accelerate your
                growth
              </p>
            </div>
            <Link
              to="/mentors/add"
              className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors duration-200"
            >
              <Plus className="w-4 h-4" />
              <span>Add Mentor</span>
            </Link>
          </div>
        </div>

        <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <form className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search mentors by name, specialization, or location..."
                value={filters.search}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <button
              type="button"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center space-x-2 px-4 py-3 border-2 rounded-lg font-medium transition-colors duration-200 ${
                isFilterOpen || getActiveFiltersCount() > 0
                  ? "border-primary-600 bg-primary-50 text-primary-600 dark:bg-primary-900/20"
                  : "border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
              {getActiveFiltersCount() > 0 && (
                <span className="bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getActiveFiltersCount()}
                </span>
              )}
            </button>
          </form>

          {getActiveFiltersCount() > 0 && (
            <div className="flex flex-wrap gap-2">
              {appliedFilters.search && (
                <span className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200 rounded-full text-sm">
                  Search: {appliedFilters.search}
                  <button
                    onClick={() =>
                      removeFilter("search", appliedFilters.search)
                    }
                    className="ml-1 p-0.5 hover:bg-primary-200 dark:hover:bg-primary-800 rounded-full"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {appliedFilters.specialization?.map((spec) => (
                <span
                  key={spec}
                  className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200 rounded-full text-sm"
                >
                  {spec}
                  <button
                    onClick={() => removeFilter("specialization", spec)}
                    className="ml-1 p-0.5 hover:bg-primary-200 dark:hover:bg-primary-800 rounded-full"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {appliedFilters.location?.map((loc) => (
                <span
                  key={loc}
                  className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-sm"
                >
                  {loc}
                  <button
                    onClick={() => removeFilter("location", loc)}
                    className="ml-1 p-0.5 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {appliedFilters.experience && (
                <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-sm">
                  Experience: {appliedFilters.experience}+ years
                  <button
                    onClick={() =>
                      removeFilter("experience", appliedFilters.experience)
                    }
                    className="ml-1 p-0.5 hover:bg-green-200 dark:hover:bg-green-800 rounded-full"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {appliedFilters.available && (
                <span className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded-full text-sm">
                  {appliedFilters.available === "true" ? "Available" : "Busy"}
                  <button
                    onClick={() =>
                      removeFilter("available", appliedFilters.available)
                    }
                    className="ml-1 p-0.5 hover:bg-yellow-200 dark:hover:bg-yellow-800 rounded-full"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-8">
          {isFilterOpen && (
            <div className="w-80 flex-shrink-0">
              <FilterSidebar
                isOpen={true}
                onClose={() => setIsFilterOpen(false)}
                filters={filters}
                onFiltersChange={setFilters}
                onApplyFilters={handleApplyFilters}
              />
            </div>
          )}

          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {totalCount} mentors found
              </span>

              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Sort by:
                </span>
                <div className="relative">
                  <SortDropdown
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    setSortBy={setSortBy}
                    setSortOrder={setSortOrder}
                  />
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600 dark:text-red-400 mb dni-4">
                  Failed to load mentors. Please try again.
                </p>
                <button
                  onClick={() => refetch()}
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200"
                >
                  Retry
                </button>
              </div>
            ) : mentors.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No mentors found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Try adjusting your search criteria or filters
                </p>
                <button
                  onClick={() => {
                    setFilters({
                      specialization: [],
                      location: [],
                      experience: "",
                      available: "",
                      search: "",
                    });
                    setAppliedFilters({
                      specialization: [],
                      location: [],
                      experience: "",
                      available: "",
                      search: "",
                    });
                  }}
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {mentors.map((mentor) => (
                  <MentorCard key={mentor._id} mentor={mentor} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorList;
