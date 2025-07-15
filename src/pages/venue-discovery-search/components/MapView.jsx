import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import { ensureArray, safeMap } from '../../../utils/arrayUtils';

const MapView = ({ venues = [], onVenueSelect, selectedVenue }) => {
  const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.0060 }); // Default to NYC
  const [mapZoom, setMapZoom] = useState(12);

  // Safe venues processing
  const safeVenues = ensureArray(venues);

  // Update map center based on venues
  useEffect(() => {
    if (safeVenues.length > 0) {
      // Calculate center based on first venue or average of all venues
      const firstVenue = safeVenues[0];
      if (firstVenue?.latitude && firstVenue?.longitude) {
        setMapCenter({
          lat: firstVenue.latitude,
          lng: firstVenue.longitude
        });
      }
    }
  }, [safeVenues]);

  // Mock map implementation - in a real app, you'd use Google Maps, Mapbox, etc.
  const MapMarker = ({ venue, isSelected }) => {
    const handleClick = () => {
      if (onVenueSelect) {
        onVenueSelect(venue);
      }
    };

    return (
      <div
        onClick={handleClick}
        className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer ${
          isSelected ? 'z-20' : 'z-10'
        }`}
        style={{
          left: `${50 + (venue?.longitude || 0) * 100}%`,
          top: `${50 + (venue?.latitude || 0) * 100}%`
        }}
      >
        {/* Marker Pin */}
        <div
          className={`relative w-8 h-8 rounded-full flex items-center justify-center text-white ${
            isSelected ? 'bg-primary scale-110' : 'bg-secondary-600'
          } transition-all duration-200 shadow-lg`}
        >
          <Icon name="MapPin" size={16} />
        </div>

        {/* Venue Card Popup */}
        {isSelected && (
          <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-64 bg-surface rounded-lg shadow-xl border border-border p-4 z-30">
            <div className="flex items-start space-x-3">
              <Image
                src={venue?.image || '/assets/images/no_image.png'}
                alt={venue?.name || 'Venue'}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-text-primary text-sm mb-1">
                  {venue?.name || 'Unnamed Venue'}
                </h3>
                <p className="text-text-secondary text-xs mb-1">
                  {venue?.location || 'Location not specified'}
                </p>
                <p className="text-primary font-medium text-sm">
                  ${venue?.pricePerHour || 0}/hour
                </p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <Icon name="Star" size={12} className="text-warning" />
                  <span className="text-text-secondary text-xs">
                    {venue?.rating || 0} ({venue?.reviewCount || 0})
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="Users" size={12} className="text-text-muted" />
                  <span className="text-text-secondary text-xs">
                    {venue?.capacity || 0} guests
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative w-full h-full bg-secondary-100 rounded-lg overflow-hidden">
      {/* Map Container */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-100 to-green-100">
        {/* Mock Map Background */}
        <div className="w-full h-full relative overflow-hidden">
          {/* Grid Pattern to simulate map */}
          <div className="absolute inset-0 opacity-20">
            <div className="grid grid-cols-10 grid-rows-10 h-full">
              {Array.from({ length: 100 }).map((_, i) => (
                <div key={i} className="border border-gray-300" />
              ))}
            </div>
          </div>

          {/* Map Markers */}
          {safeMap(safeVenues, (venue, index) => (
            <MapMarker
              key={venue?.id || index}
              venue={venue}
              isSelected={selectedVenue?.id === venue?.id}
            />
          ))}

          {/* Map Controls */}
          <div className="absolute top-4 right-4 bg-surface rounded-lg shadow-lg border border-border">
            <button
              onClick={() => setMapZoom(Math.min(mapZoom + 1, 20))}
              className="block w-10 h-10 flex items-center justify-center hover:bg-secondary-100 transition-colors duration-200"
            >
              <Icon name="Plus" size={16} />
            </button>
            <div className="border-t border-border"></div>
            <button
              onClick={() => setMapZoom(Math.max(mapZoom - 1, 1))}
              className="block w-10 h-10 flex items-center justify-center hover:bg-secondary-100 transition-colors duration-200"
            >
              <Icon name="Minus" size={16} />
            </button>
          </div>

          {/* Map Legend */}
          <div className="absolute bottom-4 left-4 bg-surface rounded-lg shadow-lg border border-border p-4">
            <h4 className="font-semibold text-text-primary text-sm mb-3">Map Legend</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-secondary-600 rounded-full"></div>
                <span className="text-text-secondary text-xs">Available Venues</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-primary rounded-full"></div>
                <span className="text-text-secondary text-xs">Selected Venue</span>
              </div>
            </div>
          </div>

          {/* No Venues Message */}
          {safeVenues.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Icon name="MapPin" size={48} className="text-text-muted mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  No venues to display
                </h3>
                <p className="text-text-secondary">
                  Try adjusting your search criteria to find venues in this area.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Map Info Panel */}
      <div className="absolute top-4 left-4 bg-surface rounded-lg shadow-lg border border-border p-4">
        <div className="flex items-center space-x-2 mb-2">
          <Icon name="MapPin" size={16} className="text-primary" />
          <span className="font-medium text-text-primary text-sm">
            {safeVenues.length} venue{safeVenues.length !== 1 ? 's' : ''} found
          </span>
        </div>
        <p className="text-text-secondary text-xs">
          Click on markers to view venue details
        </p>
      </div>
    </div>
  );
};

export default MapView;