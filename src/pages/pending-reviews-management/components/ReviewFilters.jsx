import React from 'react';
import { Star, AlertTriangle, Clock } from 'lucide-react';

const ReviewFilters = ({ filters, onFiltersChange }) => {
  const reviewTypes = [
    { value: '', label: 'All Types' },
    { value: 'venue_review', label: 'Venue Review' },
    { value: 'service_feedback', label: 'Service Feedback' },
    { value: 'dispute_comment', label: 'Dispute Comment' }
  ];

  const ratingLevels = [
    { value: '', label: 'All Ratings' },
    { value: '1-1', label: '1 Star' },
    { value: '2-2', label: '2 Stars' },
    { value: '3-3', label: '3 Stars' },
    { value: '4-4', label: '4 Stars' },
    { value: '5-5', label: '5 Stars' },
    { value: '1-2', label: '1-2 Stars (Low)' },
    { value: '4-5', label: '4-5 Stars (High)' }
  ];

  const flaggedSeverities = [
    { value: '', label: 'All Severities' },
    { value: 'low', label: 'Low Severity' },
    { value: 'medium', label: 'Medium Severity' },
    { value: 'high', label: 'High Severity' },
    { value: 'critical', label: 'Critical' }
  ];

  const submissionDates = [
    { value: '', label: 'All Dates' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'Last 7 days' },
    { value: 'month', label: 'Last 30 days' }
  ];

  const moderationStatuses = [
    { value: '', label: 'All Statuses' },
    { value: 'pending', label: 'Pending Review' },
    { value: 'flagged', label: 'Flagged Content' },
    { value: 'escalated', label: 'Escalated' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' }
  ];

  const handleFilterChange = (filterKey, value) => {
    onFiltersChange?.({
      ...filters,
      [filterKey]: value
    });
  };

  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {/* Review Type Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Review Type
        </label>
        <select
          value={filters?.reviewType || ''}
          onChange={(e) => handleFilterChange('reviewType', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {reviewTypes?.map(type => (
            <option key={type?.value} value={type?.value}>
              {type?.label}
            </option>
          ))}
        </select>
      </div>

      {/* Rating Level Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Star className="inline w-4 h-4 mr-1" />
          Rating Level
        </label>
        <select
          value={filters?.ratingLevel || ''}
          onChange={(e) => handleFilterChange('ratingLevel', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {ratingLevels?.map(level => (
            <option key={level?.value} value={level?.value}>
              {level?.label}
            </option>
          ))}
        </select>
      </div>

      {/* Flagged Severity Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <AlertTriangle className="inline w-4 h-4 mr-1" />
          Flagged Severity
        </label>
        <select
          value={filters?.flaggedSeverity || ''}
          onChange={(e) => handleFilterChange('flaggedSeverity', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {flaggedSeverities?.map(severity => (
            <option key={severity?.value} value={severity?.value}>
              {severity?.label}
            </option>
          ))}
        </select>
      </div>

      {/* Submission Date Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Clock className="inline w-4 h-4 mr-1" />
          Submission Date
        </label>
        <select
          value={filters?.submissionDate || ''}
          onChange={(e) => handleFilterChange('submissionDate', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {submissionDates?.map(date => (
            <option key={date?.value} value={date?.value}>
              {date?.label}
            </option>
          ))}
        </select>
      </div>

      {/* Moderation Status Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Moderation Status
        </label>
        <select
          value={filters?.moderationStatus || ''}
          onChange={(e) => handleFilterChange('moderationStatus', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {moderationStatuses?.map(status => (
            <option key={status?.value} value={status?.value}>
              {status?.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ReviewFilters;