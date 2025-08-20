import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const sortOptions = [
  { value: "rating-desc", label: "Highest Rated" },
  { value: "rating-asc", label: "Lowest Rated" },
  { value: "experience-desc", label: "Most Experienced" },
  { value: "experience-asc", label: "Least Experienced" },
  { value: "totalSessions-desc", label: "Most Sessions" },
  { value: "totalSessions-asc", label: "Fewest Sessions" },
];

export default function SortDropdown({
  sortBy,
  sortOrder,
  setSortBy,
  setSortOrder,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedValue = `${sortBy}-${sortOrder}`;
  const selectedOption = sortOptions.find(
    (opt) => opt.value === selectedValue
  )?.label;

  const handleSelect = (value) => {
    const [newSortBy, newSortOrder] = value.split("-");
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center justify-between w-56 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 
                   rounded-lg text-sm font-medium text-gray-900 dark:text-white 
                   shadow-sm hover:shadow-md focus:ring-2 focus:ring-primary-500 transition-all duration-200"
      >
        {selectedOption || "Sort by"}
        <ChevronDown
          className={`w-4 h-4 ml-2 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -5 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 
                       dark:border-gray-700 rounded-xl shadow-lg overflow-hidden z-20"
          >
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors duration-150 cursor-pointer
                 ${
                   option.value === selectedValue
                     ? "bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 font-medium"
                     : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                 }`}
              >
                {option.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
