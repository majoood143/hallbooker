import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const SearchContextPreserver = ({ searchParams, onBackToSearch }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract search context from URL params or props
  const searchContext = {
    query: searchParams?.query || '',
    location: searchParams?.location || '',
    date: searchParams?.date || '',
    guests: searchParams?.guests || '',
    priceRange: searchParams?.priceRange || '',
    amenities: searchParams?.amenities || [],
    totalResults: searchParams?.totalResults || 0
  };

  const hasSearchContext = searchContext.query || searchContext.location || searchContext.date;

  const handleBackToSearch = () => {
    // Preserve search parameters in URL
    const searchUrl = new URL('/venue-discovery-search', window.location.origin);
    
    if (searchContext.query) searchUrl.searchParams.set('query', searchContext.query);
    if (searchContext.location) searchUrl.searchParams.set('location', searchContext.location);
    if (searchContext.date) searchUrl.searchParams.set('date', searchContext.date);
    if (searchContext.guests) searchUrl.searchParams.set('guests', searchContext.guests);
    if (searchContext.priceRange) searchUrl.searchParams.set('priceRange', searchContext.priceRange);
    if (searchContext.amenities.length > 0) {
      searchUrl.searchParams.set('amenities', searchContext.amenities.join(','));
    }

    navigate(searchUrl.pathname + searchUrl.search);
    
    if (onBackToSearch) {
      onBackToSearch(searchContext);
    }
  };

  const formatSearchSummary = () => {
    const parts = [];
    
    if (searchContext.query) {
      parts.push(`"${searchContext.query}"`);
    }
    
    if (searchContext.location) {
      parts.push(`in ${searchContext.location}`);
    }
    
    if (searchContext.date) {
      const date = new Date(searchContext.date);
      parts.push(`on ${date.toLocaleDateString()}`);
    }
    
    if (searchContext.guests) {
      parts.push(`for ${searchContext.guests} guests`);
    }

    return parts.join(' ');
  };

  // Only show on venue details page or when there's search context
  if (!hasSearchContext || location.pathname === '/venue-discovery-search') {
    return null;
  }

  return (
    <div className="bg-surface border-b border-border">
      <div className="container-padding py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              iconName="ArrowLeft"
              iconSize={16}
              onClick={handleBackToSearch}
              className="text-text-secondary hover:text-text-primary"
            />
            
            <div className="hidden sm:block">
              <nav className="flex items-center space-x-2 text-sm">
                <button
                  onClick={handleBackToSearch}
                  className="text-primary hover:text-primary-700 font-medium transition-colors duration-200"
                >
                  Search Results
                </button>
                <Icon name="ChevronRight" size={14} color="var(--color-text-muted)" />
                <span className="text-text-secondary">Venue Details</span>
              </nav>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {searchContext.totalResults > 0 && (
              <span className="text-sm text-text-muted">
                {searchContext.totalResults} venues found
              </span>
            )}
            
            <Button
              variant="outline"
              iconName="Search"
              iconSize={14}
              onClick={handleBackToSearch}
              className="text-sm"
            >
              Modify Search
            </Button>
          </div>
        </div>

        {/* Mobile Search Summary */}
        <div className="sm:hidden mt-2">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-text-secondary truncate">
                {formatSearchSummary()}
              </p>
              {searchContext.totalResults > 0 && (
                <p className="text-xs text-text-muted">
                  {searchContext.totalResults} venues found
                </p>
              )}
            </div>
            
            <Button
              variant="ghost"
              iconName="Search"
              iconSize={16}
              onClick={handleBackToSearch}
              className="ml-2 flex-shrink-0"
            />
          </div>
        </div>

        {/* Desktop Search Summary */}
        <div className="hidden sm:block mt-2">
          {formatSearchSummary() && (
            <div className="flex items-center space-x-2">
              <Icon name="Search" size={14} color="var(--color-text-muted)" />
              <span className="text-sm text-text-secondary">
                {formatSearchSummary()}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchContextPreserver;