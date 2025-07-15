import React from 'react';
import { Eye, Check, X, MessageSquare, ArrowUp, Star, Clock, AlertTriangle } from 'lucide-react';

const ReviewsList = ({ reviews, loading, onReviewAction, onViewDetails }) => {
  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return formatDate(dateString);
  };

  const getStatusBadge = (review) => {
    if (review?.is_flagged) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Flagged
        </span>
      );
    }

    switch (review?.moderation_status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <Check className="w-3 h-3 mr-1" />
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <X className="w-3 h-3 mr-1" />
            Rejected
          </span>
        );
      case 'escalated':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            <ArrowUp className="w-3 h-3 mr-1" />
            Escalated
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Unknown
          </span>
        );
    }
  };

  const getPriorityIndicator = (review) => {
    const daysSinceSubmission = Math.floor(
      (new Date() - new Date(review?.created_at)) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceSubmission > 2) {
      return <div className="w-1 bg-red-500 rounded-full mr-3"></div>;
    } else if (review?.is_flagged) {
      return <div className="w-1 bg-orange-500 rounded-full mr-3"></div>;
    } else if (review?.rating <= 2) {
      return <div className="w-1 bg-yellow-500 rounded-full mr-3"></div>;
    }
    
    return <div className="w-1 bg-gray-200 rounded-full mr-3"></div>;
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center">
        {[...Array(5)]?.map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-1 text-sm text-gray-600">({rating})</span>
      </div>
    );
  };

  const highlightFlaggedTerms = (text, flaggedTerms = []) => {
    if (!flaggedTerms?.length || !text) return text;

    let highlightedText = text;
    flaggedTerms?.forEach(term => {
      const regex = new RegExp(`(${term})`, 'gi');
      highlightedText = highlightedText.replace(
        regex,
        '<mark class="bg-red-200 text-red-800 px-1 rounded">$1</mark>'
      );
    });

    return <span dangerouslySetInnerHTML={{ __html: highlightedText }} />;
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          {[...Array(5)]?.map((_, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!reviews?.length) {
    return (
      <div className="p-8 text-center">
        <div className="text-gray-500">
          <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No pending reviews</h3>
          <p className="text-gray-500">All reviews have been processed or no reviews match your filters.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {reviews?.map((review) => (
        <div key={review?.id} className="p-6 hover:bg-gray-50">
          <div className="flex items-start">
            {/* Priority Indicator */}
            {getPriorityIndicator(review)}
            
            <div className="flex-1 min-w-0">
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <h3 className="text-sm font-medium text-gray-900">
                    {review?.venue_name || 'Unknown Venue'}
                  </h3>
                  {getStatusBadge(review)}
                  {review?.review_type && (
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {review.review_type?.replace(/_/g, ' ')?.replace(/\b\w/g, l => l?.toUpperCase())}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">
                    {formatTimeAgo(review?.created_at)}
                  </span>
                </div>
              </div>

              {/* Review Content */}
              <div className="mb-3">
                <div className="flex items-center mb-2">
                  {renderStars(review?.rating || 0)}
                  <span className="ml-3 text-sm text-gray-600">
                    by {review?.customer_name || 'Anonymous'}
                  </span>
                </div>
                
                <div className="text-sm text-gray-700 leading-relaxed">
                  {review?.comment ? (
                    highlightFlaggedTerms(
                      review.comment?.length > 200 
                        ? `${review.comment.substring(0, 200)}...` 
                        : review.comment,
                      review?.flagged_terms
                    )
                  ) : (
                    <span className="text-gray-500 italic">No comment provided</span>
                  )}
                </div>

                {/* Flagged Content Analysis */}
                {review?.is_flagged && review?.flagged_reason && (
                  <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                    <div className="flex items-center">
                      <AlertTriangle className="w-4 h-4 text-red-500 mr-2" />
                      <span className="text-sm font-medium text-red-800">Flagged Content</span>
                    </div>
                    <p className="text-sm text-red-700 mt-1">{review.flagged_reason}</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => onViewDetails?.(review)}
                    className="inline-flex items-center text-sm text-blue-600 hover:text-blue-900"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View Details
                  </button>

                  {review?.reported_concerns && (
                    <span className="text-sm text-gray-500">
                      {review.reported_concerns?.length} concerns reported
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onReviewAction?.('approve', review?.id)}
                    className="inline-flex items-center px-3 py-1 border border-green-300 rounded text-sm text-green-700 bg-green-50 hover:bg-green-100"
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Approve
                  </button>
                  
                  <button
                    onClick={() => onReviewAction?.('reject', review?.id, { 
                      reason: 'Content violation',
                      message: 'Review does not meet community guidelines'
                    })}
                    className="inline-flex items-center px-3 py-1 border border-red-300 rounded text-sm text-red-700 bg-red-50 hover:bg-red-100"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Reject
                  </button>
                  
                  <button
                    onClick={() => onReviewAction?.('request_clarification', review?.id, {
                      message: 'Please provide more specific details about your experience'
                    })}
                    className="inline-flex items-center px-3 py-1 border border-blue-300 rounded text-sm text-blue-700 bg-blue-50 hover:bg-blue-100"
                  >
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Clarify
                  </button>
                  
                  <button
                    onClick={() => onReviewAction?.('escalate', review?.id, {
                      reason: 'Requires senior moderator review'
                    })}
                    className="inline-flex items-center px-3 py-1 border border-purple-300 rounded text-sm text-purple-700 bg-purple-50 hover:bg-purple-100"
                  >
                    <ArrowUp className="w-4 h-4 mr-1" />
                    Escalate
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewsList;