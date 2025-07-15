import React from 'react';
import Icon from '../../../components/AppIcon';

const VenueInfo = ({ venue }) => {
  const amenityIcons = {
    'WiFi': 'Wifi',
    'Parking': 'Car',
    'Air Conditioning': 'Wind',
    'Sound System': 'Volume2',
    'Projector': 'Monitor',
    'Kitchen': 'ChefHat',
    'Bar': 'Wine',
    'Dance Floor': 'Music',
    'Stage': 'Theater',
    'Catering': 'UtensilsCrossed',
    'Security': 'Shield',
    'Wheelchair Access': 'Accessibility'
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  return (
    <div className="space-y-6">
      {/* Venue Header */}
      <div>
        <h1 className="text-3xl font-semibold text-text-primary mb-2">
          {venue.name}
        </h1>
        <div className="flex items-center space-x-4 text-text-secondary">
          <div className="flex items-center space-x-1">
            <Icon name="MapPin" size={16} />
            <span className="text-sm">{venue.location}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Users" size={16} />
            <span className="text-sm">Up to {venue.capacity} guests</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Star" size={16} color="var(--color-accent)" />
            <span className="text-sm font-medium">{venue.rating}</span>
            <span className="text-sm">({venue.reviewCount} reviews)</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <h2 className="text-xl font-medium text-text-primary mb-3">About this venue</h2>
        <p className="text-text-secondary leading-relaxed">
          {venue.description}
        </p>
      </div>

      {/* Venue Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Capacity & Space */}
        <div className="bg-surface-secondary rounded-lg p-4">
          <h3 className="text-lg font-medium text-text-primary mb-3">Space Details</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-text-secondary">Maximum Capacity</span>
              <span className="font-medium text-text-primary">{venue.capacity} guests</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Floor Area</span>
              <span className="font-medium text-text-primary">{venue.floorArea} sq ft</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Ceiling Height</span>
              <span className="font-medium text-text-primary">{venue.ceilingHeight} ft</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Setup Style</span>
              <span className="font-medium text-text-primary">{venue.setupStyle}</span>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-surface-secondary rounded-lg p-4">
          <h3 className="text-lg font-medium text-text-primary mb-3">Pricing</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-text-secondary">Base Rate (per hour)</span>
              <span className="font-medium text-text-primary">{formatPrice(venue.basePrice)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Minimum Hours</span>
              <span className="font-medium text-text-primary">{venue.minimumHours} hours</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Security Deposit</span>
              <span className="font-medium text-text-primary">{formatPrice(venue.securityDeposit)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Cleaning Fee</span>
              <span className="font-medium text-text-primary">{formatPrice(venue.cleaningFee)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Amenities */}
      <div>
        <h2 className="text-xl font-medium text-text-primary mb-4">Amenities & Features</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {venue.amenities.map((amenity, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-surface-secondary rounded-lg">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <Icon 
                  name={amenityIcons[amenity] || 'Check'} 
                  size={16} 
                  color="var(--color-primary)" 
                />
              </div>
              <span className="text-sm font-medium text-text-primary">{amenity}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Location Map */}
      <div>
        <h2 className="text-xl font-medium text-text-primary mb-4">Location</h2>
        <div className="bg-surface-secondary rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Icon name="MapPin" size={16} color="var(--color-primary)" />
            <span className="font-medium text-text-primary">{venue.fullAddress}</span>
          </div>
          <div className="aspect-video rounded-lg overflow-hidden">
            <iframe
              width="100%"
              height="100%"
              loading="lazy"
              title={venue.name}
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps?q=${venue.coordinates.lat},${venue.coordinates.lng}&z=14&output=embed`}
            />
          </div>
          <div className="mt-3 text-sm text-text-secondary">
            <p>Easily accessible by public transport and car. Parking available on-site.</p>
          </div>
        </div>
      </div>

      {/* Rules & Policies */}
      <div>
        <h2 className="text-xl font-medium text-text-primary mb-4">Venue Rules & Policies</h2>
        <div className="bg-surface-secondary rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-text-primary mb-2">Allowed</h4>
              <ul className="space-y-1">
                {venue.allowedActivities.map((activity, index) => (
                  <li key={index} className="flex items-center space-x-2 text-sm text-text-secondary">
                    <Icon name="Check" size={14} color="var(--color-success)" />
                    <span>{activity}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-text-primary mb-2">Restrictions</h4>
              <ul className="space-y-1">
                {venue.restrictions.map((restriction, index) => (
                  <li key={index} className="flex items-center space-x-2 text-sm text-text-secondary">
                    <Icon name="X" size={14} color="var(--color-error)" />
                    <span>{restriction}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueInfo;