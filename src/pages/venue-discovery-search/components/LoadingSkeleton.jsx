import React from 'react';

const LoadingSkeleton = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-surface border border-border rounded-lg shadow-sm animate-pulse">
          {/* Image Skeleton */}
          <div className="h-48 bg-secondary-200 rounded-t-lg" />
          
          {/* Content Skeleton */}
          <div className="p-4 space-y-3">
            {/* Title */}
            <div className="h-6 bg-secondary-200 rounded w-3/4" />
            
            {/* Subtitle */}
            <div className="h-4 bg-secondary-200 rounded w-1/2" />
            
            {/* Location */}
            <div className="h-4 bg-secondary-200 rounded w-2/3" />
            
            {/* Capacity */}
            <div className="h-4 bg-secondary-200 rounded w-1/3" />
            
            {/* Rating */}
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                {Array.from({ length: 5 }).map((_, starIndex) => (
                  <div key={starIndex} className="w-4 h-4 bg-secondary-200 rounded" />
                ))}
              </div>
              <div className="h-4 bg-secondary-200 rounded w-16" />
            </div>
            
            {/* Amenities */}
            <div className="flex space-x-2">
              <div className="h-6 bg-secondary-200 rounded w-16" />
              <div className="h-6 bg-secondary-200 rounded w-20" />
              <div className="h-6 bg-secondary-200 rounded w-12" />
            </div>
            
            {/* Price and Button */}
            <div className="flex items-center justify-between pt-2">
              <div className="h-6 bg-secondary-200 rounded w-20" />
              <div className="h-8 bg-secondary-200 rounded w-24" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;