import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import FavoriteVenueCard from './FavoriteVenueCard';

const FavoritesSection = ({ favoriteVenues = [], onQuickBook, onRemoveFavorite, onViewDetails }) => {
  const [sortBy, setSortBy] = useState('recent');

  const sortOptions = [
    { value: 'recent', label: 'Recently Added' },
    { value: 'name', label: 'Name A-Z' },
    { value: 'price', label: 'Price Low-High' },
    { value: 'rating', label: 'Rating High-Low' }
  ];

  const sortVenues = () => {
    // Safe array initialization
    const safeVenues = Array.isArray(favoriteVenues) ? favoriteVenues : [];
    let sorted = [...safeVenues];

    switch (sortBy) {
      case 'name':
        sorted.sort((a, b) => (a?.name || '').localeCompare(b?.name || ''));
        break;
      case 'price':
        sorted.sort((a, b) => (a?.pricePerHour || 0) - (b?.pricePerHour || 0));
        break;
      case 'rating':
        sorted.sort((a, b) => (b?.rating || 0) - (a?.rating || 0));
        break;
      case 'recent':
      default:
        sorted.sort((a, b) => {
          const dateA = a?.addedToFavorites ? new Date(a.addedToFavorites) : new Date(0);
          const dateB = b?.addedToFavorites ? new Date(b.addedToFavorites) : new Date(0);
          return dateB - dateA;
        });
        break;
    }

    return sorted;
  };

  const sortedVenues = sortVenues();

  return (
    <div>
      {/* Sort Controls */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-text-primary">
          Your Favorite Venues ({sortedVenues.length})
        </h2>
        
        <div className="flex items-center space-x-2">
          <Icon name="ArrowUpDown" size={16} className="text-text-muted" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-border rounded-md bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Favorites List */}
      {sortedVenues.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedVenues.map((venue) => (
            <FavoriteVenueCard
              key={venue?.id || Math.random()}
              venue={venue}
              onQuickBook={onQuickBook}
              onRemoveFavorite={onRemoveFavorite}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Heart" size={32} color="var(--color-text-muted)" />
          </div>
          <h3 className="text-lg font-medium text-text-primary mb-2">
            No favorite venues yet
          </h3>
          <p className="text-text-secondary mb-4">
            Start adding venues to your favorites to see them here.
          </p>
          <Button
            variant="primary"
            iconName="Search"
            iconSize={16}
            onClick={() => window.location.href = '/venue-discovery-search'}
          >
            Discover Venues
          </Button>
        </div>
      )}
    </div>
  );
};

export default FavoritesSection;