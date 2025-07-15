import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const QuickViewModal = ({ venue, isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen || !venue) return null;

  const handleViewFullDetails = () => {
    navigate(`/venue-details-booking?id=${venue.id}`);
    onClose();
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Icon key={i} name="Star" size={16} className="text-warning fill-current" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Icon key="half" name="Star" size={16} className="text-warning fill-current opacity-50" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Icon key={`empty-${i}`} name="Star" size={16} className="text-secondary-300" />
      );
    }

    return stars;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-surface rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-2xl font-bold text-text-primary">{venue.name}</h2>
          <Button variant="ghost" iconName="X" onClick={onClose} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-video rounded-lg overflow-hidden">
              <Image
                src={venue.image}
                alt={venue.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {venue.gallery && venue.gallery.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {venue.gallery.slice(0, 3).map((image, index) => (
                  <div key={index} className="aspect-square rounded-lg overflow-hidden">
                    <Image
                      src={image}
                      alt={`${venue.name} gallery ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Venue Details */}
          <div className="space-y-6">
            {/* Basic Info */}
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="MapPin" size={18} className="text-text-muted" />
                <span className="text-text-secondary">{venue.location}</span>
              </div>
              
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="Users" size={18} className="text-text-muted" />
                <span className="text-text-secondary">Up to {venue.capacity} guests</span>
              </div>
              
              <div className="flex items-center space-x-2 mb-4">
                <Icon name="Building2" size={18} className="text-text-muted" />
                <span className="text-text-secondary">{venue.type}</span>
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center space-x-1">
                  {renderStars(venue.rating)}
                </div>
                <span className="text-lg font-medium text-text-primary">
                  {venue.rating}
                </span>
                <span className="text-text-muted">
                  ({venue.reviewCount} reviews)
                </span>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-secondary-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl font-bold text-text-primary">
                  ${venue.pricePerHour}
                </span>
                <span className="text-text-muted">/hour</span>
              </div>
              
              {venue.originalPrice && venue.originalPrice > venue.pricePerHour && (
                <div className="flex items-center space-x-2">
                  <span className="text-text-muted line-through">
                    ${venue.originalPrice}
                  </span>
                  <span className="text-success font-medium">
                    Save ${venue.originalPrice - venue.pricePerHour}/hr
                  </span>
                </div>
              )}
            </div>

            {/* Amenities */}
            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-3">Amenities</h3>
              <div className="grid grid-cols-2 gap-2">
                {venue.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Icon name="Check" size={16} className="text-success" />
                    <span className="text-sm text-text-secondary">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            {venue.description && (
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-3">Description</h3>
                <p className="text-text-secondary leading-relaxed">
                  {venue.description}
                </p>
              </div>
            )}

            {/* Availability Status */}
            <div className="flex items-center space-x-2">
              <Icon 
                name={venue.availableToday ? "CheckCircle" : "Clock"} 
                size={18} 
                className={venue.availableToday ? "text-success" : "text-warning"} 
              />
              <span className={`font-medium ${venue.availableToday ? "text-success" : "text-warning"}`}>
                {venue.availableToday ? "Available Today" : "Check Availability"}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <Button
                variant="primary"
                onClick={handleViewFullDetails}
                iconName="Calendar"
                iconPosition="left"
                className="flex-1"
              >
                Book Now
              </Button>
              
              <Button
                variant="outline"
                onClick={handleViewFullDetails}
                iconName="Eye"
                iconPosition="left"
              >
                Full Details
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;