import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Clock, AlertTriangle, XCircle } from 'lucide-react';
import ReviewFilters from './components/ReviewFilters';
import ReviewsList from './components/ReviewsList';
import ReviewDetailsModal from './components/ReviewDetailsModal';
import reviewModerationService from '../../utils/reviewModerationService';
import { useAuth } from '../../contexts/AuthContext';

const PendingReviewsManagement = () => {
  const { user, userProfile } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReview, setSelectedReview] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filters, setFilters] = useState({
    reviewType: '',
    ratingLevel: '',
    flaggedSeverity: '',
    submissionDate: '',
    moderationStatus: 'pending'
  });

  // Load pending reviews on component mount
  useEffect(() => {
    if (userProfile?.role === 'admin') {
      loadPendingReviews();
    }
  }, [userProfile]);

  const loadPendingReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await reviewModerationService.getPendingReviews();
      
      if (result?.success) {
        setReviews(result.data || []);
      } else {
        setError(result?.error || 'Failed to load pending reviews');
      }
    } catch (err) {
      setError('Failed to load pending reviews. Please try again.');
      console.log('Load pending reviews error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter and search reviews
  const filteredReviews = useMemo(() => {
    let filtered = [...reviews];

    // Search filter
    if (searchTerm?.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(review => 
        review?.comment?.toLowerCase()?.includes(term) ||
        review?.venue_name?.toLowerCase()?.includes(term) ||
        review?.customer_name?.toLowerCase()?.includes(term)
      );
    }

    // Review type filter
    if (filters?.reviewType) {
      filtered = filtered.filter(review => review?.review_type === filters.reviewType);
    }

    // Rating level filter
    if (filters?.ratingLevel) {
      const [min, max] = filters.ratingLevel.split('-').map(Number);
      filtered = filtered.filter(review => 
        review?.rating >= min && review?.rating <= (max || min)
      );
    }

    // Flagged severity filter
    if (filters?.flaggedSeverity) {
      filtered = filtered.filter(review => review?.flagged_severity === filters.flaggedSeverity);
    }

    // Submission date filter
    if (filters?.submissionDate) {
      const today = new Date();
      const filterDate = new Date();
      
      switch (filters.submissionDate) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          filterDate.setDate(today.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(today.getMonth() - 1);
          break;
        default:
          filterDate = null;
      }
      
      if (filterDate) {
        filtered = filtered.filter(review => 
          new Date(review?.created_at) >= filterDate
        );
      }
    }

    // Moderation status filter
    if (filters?.moderationStatus) {
      filtered = filtered.filter(review => review?.moderation_status === filters.moderationStatus);
    }

    return filtered;
  }, [reviews, searchTerm, filters]);

  // Calculate queue metrics
  const queueMetrics = useMemo(() => {
    const total = reviews?.length || 0;
    const pending = reviews?.filter(r => r?.moderation_status === 'pending')?.length || 0;
    const flagged = reviews?.filter(r => r?.is_flagged)?.length || 0;
    const aging = reviews?.filter(r => {
      const daysSinceSubmission = Math.floor(
        (new Date() - new Date(r?.created_at)) / (1000 * 60 * 60 * 24)
      );
      return daysSinceSubmission > 2;
    })?.length || 0;

    return { total, pending, flagged, aging };
  }, [reviews]);

  const handleReviewAction = async (action, reviewId, actionData = {}) => {
    try {
      let result;
      
      switch (action) {
        case 'approve':
          result = await reviewModerationService.approveReview(reviewId, actionData.message);
          break;
        case 'reject':
          result = await reviewModerationService.rejectReview(reviewId, actionData.reason, actionData.message);
          break;
        case 'flag':
          result = await reviewModerationService.flagReview(reviewId, actionData.severity, actionData.reason);
          break;
        case 'request_clarification':
          result = await reviewModerationService.requestClarification(reviewId, actionData.message);
          break;
        case 'escalate':
          result = await reviewModerationService.escalateReview(reviewId, actionData.reason);
          break;
        default:
          return;
      }

      if (result?.success) {
        await loadPendingReviews();
      } else {
        setError(result?.error || `Failed to ${action} review`);
      }
    } catch (err) {
      setError(`Failed to ${action} review. Please try again.`);
      console.log(`${action} review error:`, err);
    }
  };

  const openReviewDetails = (review) => {
    setSelectedReview(review);
    setShowDetailsModal(true);
  };

  // Check admin access
  if (userProfile?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Pending Reviews Management</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Centralized review moderation workflows requiring administrative oversight
                </p>
              </div>
              
              {/* Queue Metrics Dashboard */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-blue-50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">{queueMetrics.total}</div>
                  <div className="text-xs text-blue-500">Total Reviews</div>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-yellow-600">{queueMetrics.pending}</div>
                  <div className="text-xs text-yellow-500">Pending</div>
                </div>
                <div className="bg-red-50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-red-600">{queueMetrics.flagged}</div>
                  <div className="text-xs text-red-500">Flagged</div>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-orange-600">{queueMetrics.aging}</div>
                  <div className="text-xs text-orange-500">Aging (&gt;2d)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Priority Alerts */}
        {queueMetrics.aging > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-orange-400 mr-2" />
              <div>
                <h3 className="text-sm font-medium text-orange-800">SLA Alert</h3>
                <p className="text-sm text-orange-700 mt-1">
                  {queueMetrics.aging} reviews are approaching moderation SLA deadlines (>2 days old)
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search reviews by content, venue, or reviewer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setFilters({
                  reviewType: '',
                  ratingLevel: '',
                  flaggedSeverity: '',
                  submissionDate: '',
                  moderationStatus: 'pending'
                })}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Filter className="mr-2 w-4 h-4" />
                Reset Filters
              </button>
              
              <button
                onClick={loadPendingReviews}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Clock className="mr-2 w-4 h-4" />
                Refresh Queue
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          <ReviewFilters
            filters={filters}
            onFiltersChange={setFilters}
          />
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <XCircle className="w-5 h-5 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
                <button
                  onClick={() => setError(null)}
                  className="text-sm text-red-600 hover:text-red-500 underline mt-2"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reviews List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <ReviewsList
            reviews={filteredReviews}
            loading={loading}
            onReviewAction={handleReviewAction}
            onViewDetails={openReviewDetails}
          />
        </div>

        {/* Review Details Modal */}
        {showDetailsModal && selectedReview && (
          <ReviewDetailsModal
            review={selectedReview}
            onClose={() => setShowDetailsModal(false)}
            onAction={handleReviewAction}
          />
        )}
      </div>
    </div>
  );
};

export default PendingReviewsManagement;