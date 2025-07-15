import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ReviewsSection = ({ reviews, overallRating, totalReviews }) => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showAllReviews, setShowAllReviews] = useState(false);

  const ratingDistribution = {
    5: 45,
    4: 23,
    3: 8,
    2: 3,
    1: 1
  };

  const filterOptions = [
    { value: 'all', label: 'All Reviews' },
    { value: '5', label: '5 Stars' },
    { value: '4', label: '4 Stars' },
    { value: '3', label: '3 Stars' },
    { value: 'photos', label: 'With Photos' },
    { value: 'recent', label: 'Most Recent' }
  ];

  const filteredReviews = reviews.filter(review => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'photos') return review.photos && review.photos.length > 0;
    if (selectedFilter === 'recent') return new Date(review.date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    return review.rating.toString() === selectedFilter;
  });

  const displayedReviews = showAllReviews ? filteredReviews : filteredReviews.slice(0, 3);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Icon
        key={index}
        name="Star"
        size={16}
        color={index < rating ? "var(--color-accent)" : "var(--color-secondary-300)"}
        className={index < rating ? "fill-current" : ""}
      />
    ));
  };

  const getPercentage = (count) => {
    return Math.round((count / totalReviews) * 100);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-text-primary">
          Reviews ({totalReviews})
        </h2>
        <Button variant="outline" iconName="MessageSquare" iconPosition="left">
          Write Review
        </Button>
      </div>

      {/* Rating Overview */}
      <div className="bg-surface-secondary rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Overall Rating */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
              <span className="text-4xl font-bold text-text-primary">{overallRating}</span>
              <div className="flex items-center space-x-1">
                {renderStars(Math.floor(overallRating))}
              </div>
            </div>
            <p className="text-text-secondary">Based on {totalReviews} reviews</p>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map(rating => (
              <div key={rating} className="flex items-center space-x-3">
                <span className="text-sm font-medium text-text-primary w-6">{rating}</span>
                <Icon name="Star" size={14} color="var(--color-accent)" className="fill-current" />
                <div className="flex-1 bg-secondary-200 rounded-full h-2">
                  <div
                    className="bg-accent h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getPercentage(ratingDistribution[rating])}%` }}
                  />
                </div>
                <span className="text-sm text-text-secondary w-8">
                  {ratingDistribution[rating]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter Options */}
      <div className="flex flex-wrap gap-2">
        {filterOptions.map(option => (
          <button
            key={option.value}
            onClick={() => setSelectedFilter(option.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
              selectedFilter === option.value
                ? 'bg-primary text-white' :'bg-surface border border-border text-text-secondary hover:text-text-primary hover:border-secondary-300'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {displayedReviews.map(review => (
          <div key={review.id} className="bg-surface border border-border rounded-lg p-6">
            <div className="flex items-start space-x-4">
              {/* User Avatar */}
              <div className="flex-shrink-0">
                <Image
                  src={review.userAvatar}
                  alt={review.userName}
                  className="w-12 h-12 rounded-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                {/* Review Header */}
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-text-primary">{review.userName}</h4>
                    <p className="text-sm text-text-secondary">{formatDate(review.date)}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    {renderStars(review.rating)}
                  </div>
                </div>

                {/* Event Type */}
                {review.eventType && (
                  <div className="mb-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700">
                      {review.eventType}
                    </span>
                  </div>
                )}

                {/* Review Content */}
                <p className="text-text-secondary leading-relaxed mb-4">
                  {review.content}
                </p>

                {/* Review Photos */}
                {review.photos && review.photos.length > 0 && (
                  <div className="mb-4">
                    <div className="flex space-x-2 overflow-x-auto">
                      {review.photos.map((photo, index) => (
                        <div key={index} className="flex-shrink-0">
                          <Image
                            src={photo}
                            alt={`Review photo ${index + 1}`}
                            className="w-20 h-20 rounded-lg object-cover cursor-pointer hover:opacity-80 transition-opacity duration-200"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Helpful Actions */}
                <div className="flex items-center space-x-4">
                  <button className="flex items-center space-x-1 text-sm text-text-secondary hover:text-text-primary transition-colors duration-200">
                    <Icon name="ThumbsUp" size={14} />
                    <span>Helpful ({review.helpfulCount})</span>
                  </button>
                  <button className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-200">
                    Reply
                  </button>
                </div>

                {/* Venue Owner Response */}
                {review.ownerResponse && (
                  <div className="mt-4 bg-surface-secondary rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <Icon name="Building2" size={14} color="var(--color-primary)" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-sm font-medium text-text-primary">Venue Owner</span>
                          <span className="text-xs text-text-muted">
                            {formatDate(review.ownerResponse.date)}
                          </span>
                        </div>
                        <p className="text-sm text-text-secondary">
                          {review.ownerResponse.content}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Show More Button */}
      {filteredReviews.length > 3 && (
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => setShowAllReviews(!showAllReviews)}
            iconName={showAllReviews ? "ChevronUp" : "ChevronDown"}
            iconPosition="right"
          >
            {showAllReviews 
              ? 'Show Less Reviews' 
              : `Show All ${filteredReviews.length} Reviews`
            }
          </Button>
        </div>
      )}
    </div>
  );
};

export default ReviewsSection;