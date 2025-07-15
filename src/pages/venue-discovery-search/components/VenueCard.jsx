import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const VenueCard = ({ venue, onToggleFavorite, onQuickView }) => {
  const [isFavorite, setIsFavorite] = useState(venue?.isFavorite || false);
  const navigate = useNavigate();

  const handleToggleFavorite = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    if (onToggleFavorite) {
      onToggleFavorite(venue?.id, !isFavorite);
    }
  };

  const handleQuickView = (e) => {
    e.stopPropagation();
    if (onQuickView) {
      onQuickView(venue);
    }
  };

  const handleCardClick = () => {
    navigate(`/venue-details-booking?id=${venue?.id}`);
  };

  // Safe amenities parsing and handling
  const getAmenities = (amenities) => {
    if (!amenities) return [];
    
    // If it's already an array, return it
    if (Array.isArray(amenities)) return amenities;
    
    // If it's a string, try to parse it as JSON
    if (typeof amenities === 'string') {
      try {
        const parsed = JSON.parse(amenities);
        return Array.isArray(parsed) ? parsed : [];
      } catch (error) {
        // If JSON parsing fails, split by comma
        return amenities.split(',').map(item => item.trim()).filter(item => item);
      }
    }
    
    return [];
  };

  const renderStars = (rating) => {
    const stars = [];
    const safeRating = rating || 0;
    const fullStars = Math.floor(safeRating);
    const hasHalfStar = safeRating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Icon key={i} name="Star" size={14} className="text-warning fill-current" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Icon key="half" name="Star" size={14} className="text-warning fill-current opacity-50" />
      );
    }

    const emptyStars = 5 - Math.ceil(safeRating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Icon key={`empty-${i}`} name="Star" size={14} className="text-secondary-300" />
      );
    }

    return stars;
  };

  // Ensure venue object exists before rendering
  if (!venue) {
    return null;
  }

  // Safe amenities handling
  const amenities = getAmenities(venue.amenities);
  const previewAmenities = amenities.slice(0, 3);

  return (
    <div 
      className="bg-surface border border-border rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer hover-lift"
      onClick={handleCardClick}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden rounded-t-lg h-48">
        <Image
          src={venue?.image || '/assets/images/no_image.png'}
          alt={venue?.name || 'Venue'}
          className="w-full h-full object-cover"
        />
        
        {/* Favorite Button */}
        <button
          onClick={handleToggleFavorite}
          className="absolute top-3 right-3 w-8 h-8 bg-surface bg-opacity-90 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all duration-200"
        >
          <Icon 
            name="Heart" 
            size={16} 
            className={isFavorite ? "text-error fill-current" : "text-text-muted"} 
          />
        </button>

        {/* Quick View Button */}
        <button
          onClick={handleQuickView}
          className="absolute top-3 left-3 px-2 py-1 bg-surface bg-opacity-90 rounded text-xs font-medium text-text-primary hover:bg-opacity-100 transition-all duration-200"
        >
          Quick View
        </button>

        {/* Availability Badge */}
        {venue?.availableToday && (
          <div className="absolute bottom-3 left-3 px-2 py-1 bg-success text-white rounded text-xs font-medium">
            Available Today
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Venue Name and Type */}
        <div className="mb-2">
          <h3 className="text-lg font-semibold text-text-primary mb-1 line-clamp-1">
            {venue?.name || 'Unnamed Venue'}
          </h3>
          <p className="text-sm text-text-muted">{venue?.type || 'Venue'}</p>
        </div>

        {/* Location */}
        <div className="flex items-center space-x-1 mb-2">
          <Icon name="MapPin" size={14} className="text-text-muted" />
          <span className="text-sm text-text-secondary">{venue?.location || 'Location not specified'}</span>
          {venue?.distance && (
            <span className="text-sm text-text-muted">• {venue.distance} mi</span>
          )}
        </div>

        {/* Capacity */}
        <div className="flex items-center space-x-1 mb-3">
          <Icon name="Users" size={14} className="text-text-muted" />
          <span className="text-sm text-text-secondary">
            Up to {venue?.capacity || 0} guests
          </span>
        </div>

        {/* Rating and Reviews */}
        <div className="flex items-center space-x-2 mb-3">
          <div className="flex items-center space-x-1">
            {renderStars(venue?.rating || 0)}
          </div>
          <span className="text-sm font-medium text-text-primary">
            {venue?.rating || 0}
          </span>
          <span className="text-sm text-text-muted">
            ({venue?.reviewCount || 0} reviews)
          </span>
        </div>

        {/* Amenities Preview */}
        <div className="flex flex-wrap gap-1 mb-3">
          {previewAmenities.length > 0 ? (
            <>
              {previewAmenities.map((amenity, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-secondary-100 text-secondary-700 text-xs rounded"
                >
                  {amenity}
                </span>
              ))}
              {amenities.length > 3 && (
                <span className="px-2 py-1 bg-secondary-100 text-secondary-700 text-xs rounded">
                  +{amenities.length - 3} more
                </span>
              )}
            </>
          ) : (
            <span className="px-2 py-1 bg-secondary-100 text-secondary-700 text-xs rounded">
              No amenities listed
            </span>
          )}
        </div>

        {/* Price and CTA */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-text-primary">
              ${venue?.pricePerHour || 0}
            </span>
            <span className="text-sm text-text-muted">/hour</span>
            {venue?.originalPrice && venue?.originalPrice > (venue?.pricePerHour || 0) && (
              <span className="text-sm text-text-muted line-through ml-2">
                ${venue.originalPrice}
              </span>
            )}
          </div>
          
          <Button
            variant="primary"
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
            className="text-sm px-4"
          >
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VenueCard;