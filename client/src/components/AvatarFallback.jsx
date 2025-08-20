import React from 'react';

const AvatarFallback = ({ name, className = '' }) => {
  const initial = name ? name.charAt(0).toUpperCase() : '?';
  return (
    <div
      className={`flex items-center justify-center rounded-full bg-primary-600 text-white font-medium text-2xl ${className}`}
    >
      {initial}
    </div>
  );
};

export default AvatarFallback;