import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const FavoriteVenueCard = ({ venue, onQuickBook, onRemoveFavorite, onViewDetails }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* Venue Image */}
      <div className="relative h-48 overflow-hidden">
        <Image 
          src={venue.image} 
          alt={venue.name}
          className="w-full h-full object-cover"
        />
        <button
          onClick={() => onRemoveFavorite(venue)}
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors duration-200"
        >
          <Icon name="Heart" size={16} color="var(--color-error)" />
        </button>
        {venue.isAvailable && (
          <div className="absolute top-3 left-3 bg-success text-white px-2 py-1 rounded-full text-xs font-medium">
            Available
          </div>
        )}
      </div>

      {/* Venue Details */}
      <div className="p-4">
        <div className="mb-3">
          <h3 className="font-semibold text-text-primary mb-1 truncate">
            {venue.name}
          </h3>
          <p className="text-sm text-text-secondary flex items-center">
            <Icon name="MapPin" size={14} className="mr-1" />
            {venue.location}
          </p>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-text-secondary">
            <Icon name="Users" size={14} className="mr-2" />
            Up to {venue.capacity} guests
          </div>
          <div className="flex items-center text-sm text-text-secondary">
            <Icon name="Star" size={14} className="mr-2" />
            {venue.rating} ({venue.reviewCount} reviews)
          </div>
          <div className="flex items-center text-sm font-medium text-text-primary">
            <Icon name="DollarSign" size={14} className="mr-2" />
            {formatPrice(venue.pricePerHour)}/hour
          </div>
        </div>

        {/* Amenities */}
        {venue.amenities && venue.amenities.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {venue.amenities.slice(0, 3).map((amenity, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-secondary-100 text-secondary-700"
                >
                  {amenity}
                </span>
              ))}
              {venue.amenities.length > 3 && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-secondary-100 text-secondary-700">
                  +{venue.amenities.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="primary"
            onClick={() => onQuickBook(venue)}
            className="flex-1 text-sm"
            disabled={!venue.isAvailable}
          >
            {venue.isAvailable ? 'Quick Book' : 'Unavailable'}
          </Button>
          <Button
            variant="outline"
            iconName="Eye"
            iconSize={16}
            onClick={() => onViewDetails(venue)}
            className="text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default FavoriteVenueCard;