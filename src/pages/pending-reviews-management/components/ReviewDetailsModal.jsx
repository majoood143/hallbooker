import React, { useState } from 'react';
import { X, Star, AlertTriangle, User, MessageSquare, Check, Flag } from 'lucide-react';

const ReviewDetailsModal = ({ review, onClose, onAction }) => {
  const [actionType, setActionType] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [actionReason, setActionReason] = useState('');

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center">
        {[...Array(5)]?.map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 ${
              i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 text-lg font-semibold text-gray-900">({rating})</span>
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

  const handleAction = (action) => {
    const actionData = {
      message: actionMessage,
      reason: actionReason
    };

    onAction?.(action, review?.id, actionData);
    onClose?.();
  };

  const renderActionForm = () => {
    if (!actionType) return null;

    return (
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900 mb-3">
          {actionType === 'approve' && 'Approve Review'}
          {actionType === 'reject' && 'Reject Review'}
          {actionType === 'flag' && 'Flag Review'}
          {actionType === 'request_clarification' && 'Request Clarification'}
          {actionType === 'escalate' && 'Escalate Review'}
        </h4>

        {(actionType === 'reject' || actionType === 'flag' || actionType === 'escalate') && (
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason
            </label>
            <select
              value={actionReason}
              onChange={(e) => setActionReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a reason</option>
              {actionType === 'reject' && (
                <>
                  <option value="inappropriate_content">Inappropriate Content</option>
                  <option value="spam">Spam</option>
                  <option value="fake_review">Fake Review</option>
                  <option value="personal_attack">Personal Attack</option>
                  <option value="irrelevant">Irrelevant to Venue</option>
                </>
              )}
              {actionType === 'flag' && (
                <>
                  <option value="profanity">Profanity</option>
                  <option value="harassment">Harassment</option>
                  <option value="discrimination">Discrimination</option>
                  <option value="false_information">False Information</option>
                  <option value="privacy_violation">Privacy Violation</option>
                </>
              )}
              {actionType === 'escalate' && (
                <>
                  <option value="complex_issue">Complex Issue</option>
                  <option value="policy_violation">Policy Violation</option>
                  <option value="legal_concern">Legal Concern</option>
                  <option value="senior_review_needed">Senior Review Needed</option>
                </>
              )}
            </select>
          </div>
        )}

        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {actionType === 'approve' && 'Approval Message (Optional)'}
            {actionType === 'reject' && 'Rejection Message'}
            {actionType === 'request_clarification' && 'Clarification Request'}
            {actionType === 'escalate' && 'Escalation Notes'}
            {actionType === 'flag' && 'Additional Notes'}
          </label>
          <textarea
            value={actionMessage}
            onChange={(e) => setActionMessage(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder={
              actionType === 'approve' ? 'Optional message for reviewer...' :
              actionType === 'reject' ? 'Explain why this review is being rejected...' :
              actionType === 'request_clarification' ? 'What specific information do you need?...' :
              actionType === 'escalate' ? 'Provide context for senior moderator...' :
              'Additional notes...'
            }
          />
        </div>

        <div className="flex space-x-3">
          <button
            onClick={() => handleAction(actionType)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Confirm {actionType?.replace(/_/g, ' ')?.replace(/\b\w/g, l => l?.toUpperCase())}
          </button>
          <button
            onClick={() => setActionType('')}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* Header */}
          <div className="bg-white px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Review Details & Moderation
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white px-6 py-4 max-h-96 overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Review Content */}
              <div>
                {/* Review Header */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-semibold text-gray-900">{review?.venue_name}</h4>
                    <span className="text-sm text-gray-500">
                      {formatDate(review?.created_at)}
                    </span>
                  </div>
                  
                  {renderStars(review?.rating || 0)}
                </div>

                {/* Reviewer Information */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center mb-2">
                    <User className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm font-medium text-gray-900">Reviewer Information</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <div>Name: {review?.customer_name || 'Anonymous'}</div>
                    <div>Email: {review?.customer_email || 'N/A'}</div>
                    <div>Previous Reviews: {review?.customer_review_count || 0}</div>
                  </div>
                </div>

                {/* Review Content */}
                <div className="mb-6">
                  <h5 className="text-sm font-medium text-gray-900 mb-3">Review Content</h5>
                  <div className="p-4 border border-gray-200 rounded-lg">
                    {review?.comment ? (
                      <div className="text-sm text-gray-700 leading-relaxed">
                        {highlightFlaggedTerms(review.comment, review?.flagged_terms)}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500 italic">No comment provided</span>
                    )}
                  </div>
                </div>

                {/* Booking Information */}
                {review?.booking_info && (
                  <div className="mb-6">
                    <h5 className="text-sm font-medium text-gray-900 mb-3">Related Booking</h5>
                    <div className="p-4 bg-blue-50 rounded-lg text-sm">
                      <div>Event Date: {formatDate(review.booking_info.event_date)}</div>
                      <div>Booking Status: {review.booking_info.status}</div>
                      <div>Total Amount: ${review.booking_info.total_amount}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - Moderation Info */}
              <div>
                {/* Current Status */}
                <div className="mb-6">
                  <h5 className="text-sm font-medium text-gray-900 mb-3">Moderation Status</h5>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Current Status:</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        review?.moderation_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        review?.moderation_status === 'approved' ? 'bg-green-100 text-green-800' :
                        review?.moderation_status === 'rejected'? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {review?.moderation_status?.replace(/_/g, ' ')?.replace(/\b\w/g, l => l?.toUpperCase())}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Days Since Submission:</span>
                      <span className="text-sm font-medium">
                        {Math.floor((new Date() - new Date(review?.created_at)) / (1000 * 60 * 60 * 24))}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Flagged Content Analysis */}
                {review?.is_flagged && (
                  <div className="mb-6">
                    <h5 className="text-sm font-medium text-gray-900 mb-3">Flagged Content Analysis</h5>
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center mb-2">
                        <AlertTriangle className="w-4 h-4 text-red-500 mr-2" />
                        <span className="text-sm font-medium text-red-800">
                          Severity: {review?.flagged_severity?.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-sm text-red-700 mb-2">
                        Reason: {review?.flagged_reason}
                      </div>
                      {review?.flagged_terms?.length > 0 && (
                        <div className="text-sm text-red-700">
                          Flagged terms: {review.flagged_terms.join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Reported Concerns */}
                {review?.reported_concerns?.length > 0 && (
                  <div className="mb-6">
                    <h5 className="text-sm font-medium text-gray-900 mb-3">Reported Concerns</h5>
                    <div className="space-y-2">
                      {review.reported_concerns.map((concern, index) => (
                        <div key={index} className="p-3 bg-orange-50 border border-orange-200 rounded">
                          <div className="text-sm font-medium text-orange-800">
                            {concern.type?.replace(/_/g, ' ')?.replace(/\b\w/g, l => l?.toUpperCase())}
                          </div>
                          <div className="text-sm text-orange-700">{concern.description}</div>
                          <div className="text-xs text-orange-600 mt-1">
                            Reported {formatDate(concern.reported_at)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Automated Content Analysis */}
                {review?.content_analysis && (
                  <div className="mb-6">
                    <h5 className="text-sm font-medium text-gray-900 mb-3">Automated Analysis</h5>
                    <div className="p-4 bg-gray-50 rounded-lg text-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div>Sentiment: {review.content_analysis.sentiment}</div>
                        <div>Confidence: {review.content_analysis.confidence}%</div>
                        <div>Language: {review.content_analysis.language}</div>
                        <div>Spam Score: {review.content_analysis.spam_score}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Form */}
            {renderActionForm()}
          </div>

          {/* Footer Actions */}
          <div className="bg-gray-50 px-6 py-4">
            {!actionType ? (
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setActionType('approve')}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Approve
                </button>
                
                <button
                  onClick={() => setActionType('reject')}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                >
                  <X className="w-4 h-4 mr-2" />
                  Reject
                </button>
                
                <button
                  onClick={() => setActionType('request_clarification')}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Request Clarification
                </button>
                
                <button
                  onClick={() => setActionType('flag')}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Flag className="w-4 h-4 mr-2" />
                  Flag Content
                </button>
                
                <button
                  onClick={() => setActionType('escalate')}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Escalate
                </button>
                
                <button
                  onClick={onClose}
                  className="ml-auto px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewDetailsModal;