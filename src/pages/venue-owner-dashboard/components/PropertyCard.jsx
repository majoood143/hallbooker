import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const PropertyCard = ({ property, onEdit, onToggleStatus, onViewBookings }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-success-100 text-success-700 border-success-200';
      case 'inactive':
        return 'bg-error-100 text-error-700 border-error-200';
      case 'maintenance':
        return 'bg-warning-100 text-warning-700 border-warning-200';
      default:
        return 'bg-secondary-100 text-secondary-700 border-secondary-200';
    }
  };

  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="relative">
        <div className="h-48 overflow-hidden">
          <Image 
            src={property.images[0]} 
            alt={property.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute top-3 right-3">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(property.status)}`}>
            {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-text-primary mb-1">{property.name}</h3>
            <div className="flex items-center text-sm text-text-secondary mb-2">
              <Icon name="MapPin" size={14} className="mr-1" />
              <span>{property.location}</span>
            </div>
            <div className="flex items-center space-x-4 text-sm text-text-secondary">
              <div className="flex items-center">
                <Icon name="Users" size={14} className="mr-1" />
                <span>{property.capacity} guests</span>
              </div>
              <div className="flex items-center">
                <Icon name="DollarSign" size={14} className="mr-1" />
                <span>${property.pricePerHour}/hr</span>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
            iconSize={16}
            onClick={() => setIsExpanded(!isExpanded)}
          />
        </div>

        {isExpanded && (
          <div className="border-t border-border pt-3 mb-3 animate-slide-down">
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <p className="text-xs text-text-muted mb-1">This Month</p>
                <p className="text-sm font-medium text-text-primary">{property.monthlyBookings} bookings</p>
              </div>
              <div>
                <p className="text-xs text-text-muted mb-1">Revenue</p>
                <p className="text-sm font-medium text-text-primary">${property.monthlyRevenue}</p>
              </div>
              <div>
                <p className="text-xs text-text-muted mb-1">Rating</p>
                <div className="flex items-center">
                  <Icon name="Star" size={14} className="text-warning-500 mr-1" />
                  <span className="text-sm font-medium text-text-primary">{property.rating}</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-text-muted mb-1">Reviews</p>
                <p className="text-sm font-medium text-text-primary">{property.reviewCount}</p>
              </div>
            </div>
            
            <div className="mb-3">
              <p className="text-xs text-text-muted mb-2">Amenities</p>
              <div className="flex flex-wrap gap-1">
                {property.amenities.slice(0, 4).map((amenity, index) => (
                  <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-secondary-100 text-secondary-700">
                    {amenity}
                  </span>
                ))}
                {property.amenities.length > 4 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-secondary-100 text-secondary-700">
                    +{property.amenities.length - 4} more
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center space-x-2">
          <Button
            variant="primary"
            iconName="Edit"
            iconSize={14}
            onClick={() => onEdit(property)}
            className="flex-1"
          >
            Edit
          </Button>
          <Button
            variant="outline"
            iconName="Calendar"
            iconSize={14}
            onClick={() => onViewBookings(property)}
            className="flex-1"
          >
            Bookings
          </Button>
          <Button
            variant={property.status === 'active' ? 'warning' : 'success'}
            iconName={property.status === 'active' ? 'Pause' : 'Play'}
            iconSize={14}
            onClick={() => onToggleStatus(property)}
          />
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;