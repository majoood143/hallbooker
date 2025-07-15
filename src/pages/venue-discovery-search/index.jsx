import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import RoleBasedNavigation from '../../components/ui/RoleBasedNavigation';
import BookingStatusIndicator from '../../components/ui/BookingStatusIndicator';
import SearchContextPreserver from '../../components/ui/SearchContextPreserver';
import QuickActionMenu from '../../components/ui/QuickActionMenu';

// Import all components
import SearchBar from './components/SearchBar';
import FilterChips from './components/FilterChips';
import AdvancedFilters from './components/AdvancedFilters';
import VenueCard from './components/VenueCard';
import SortDropdown from './components/SortDropdown';
import MapView from './components/MapView';
import QuickViewModal from './components/QuickViewModal';
import LoadingSkeleton from './components/LoadingSkeleton';

// Import services
import venueService from '../../utils/venueService';
import { ensureArray, safeMap } from '../../utils/arrayUtils';

const VenueDiscoverySearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, userProfile, loading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [quickViewVenue, setQuickViewVenue] = useState(null);
  const [selectedMapVenue, setSelectedMapVenue] = useState(null);
  const [currentSort, setCurrentSort] = useState('relevance');

  // Search and filter states
  const [searchData, setSearchData] = useState({
    location: searchParams.get('location') || '',
    checkIn: searchParams.get('date') || '',
    checkOut: '',
    guests: searchParams.get('guests') || ''
  });

  const [activeFilters, setActiveFilters] = useState({
    priceRange: {},
    capacity: {},
    amenities: [],
    venueType: [],
    location: {}
  });

  const [venues, setVenues] = useState([]);
  const [totalResults, setTotalResults] = useState(0);

  // Load venues from Supabase
  const loadVenues = async (filters = {}) => {
    setIsLoading(true);
    try {
      const result = await venueService.getVenues({
        ...filters,
        sortBy: currentSort
      });
      
      if (result?.success) {
        // Ensure data is always an array using utility function
        const venuesData = ensureArray(result.data);
        setVenues(venuesData);
        setTotalResults(venuesData.length);
      } else {
        console.log('Failed to load venues:', result?.error);
        // Always set empty array on failure
        setVenues([]);
        setTotalResults(0);
      }
    } catch (error) {
      console.log('Error loading venues:', error);
      setVenues([]);
      setTotalResults(0);
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize venues and handle URL parameters
  useEffect(() => {
    // Parse URL parameters for filters
    const urlFilters = {};
    if (searchParams.get('location')) {
      urlFilters.location = searchParams.get('location');
    }
    if (searchParams.get('guests')) {
      urlFilters.minCapacity = parseInt(searchParams.get('guests'));
    }
    if (searchParams.get('priceRange')) {
      const [min, max] = searchParams.get('priceRange').split('-');
      urlFilters.minPrice = parseInt(min);
      urlFilters.maxPrice = parseInt(max);
    }
    if (searchParams.get('amenities')) {
      urlFilters.amenities = searchParams.get('amenities').split(',');
    }

    setActiveFilters(prev => ({ ...prev, ...urlFilters }));
    loadVenues(urlFilters);
  }, [searchParams, currentSort]);

  const handleSearch = (newSearchData) => {
    setSearchData(newSearchData);
    
    // Update URL parameters
    const newParams = new URLSearchParams();
    if (newSearchData.location) newParams.set('location', newSearchData.location);
    if (newSearchData.checkIn) newParams.set('date', newSearchData.checkIn);
    if (newSearchData.guests) newParams.set('guests', newSearchData.guests);
    setSearchParams(newParams);

    // Apply search filters
    const searchFilters = {
      location: newSearchData.location,
      minCapacity: newSearchData.guests ? parseInt(newSearchData.guests) : undefined
    };

    loadVenues(searchFilters);
  };

  const handleApplyFilters = (filters) => {
    setActiveFilters(filters);

    // Convert filters to API format
    const apiFilters = {};
    
    if (filters.priceRange.min || filters.priceRange.max) {
      apiFilters.minPrice = filters.priceRange.min;
      apiFilters.maxPrice = filters.priceRange.max;
    }

    if (filters.capacity.min || filters.capacity.max) {
      apiFilters.minCapacity = filters.capacity.min;
      apiFilters.maxCapacity = filters.capacity.max;
    }

    if (filters.amenities.length > 0) {
      apiFilters.amenities = filters.amenities;
    }

    if (filters.venueType.length > 0) {
      apiFilters.venueType = filters.venueType;
    }

    if (searchData.location) {
      apiFilters.location = searchData.location;
    }

    loadVenues(apiFilters);
  };

  const handleRemoveFilter = (filterKey) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterKey]: Array.isArray(prev[filterKey]) ? [] : {}
    }));
  };

  const handleClearAllFilters = () => {
    setActiveFilters({
      priceRange: {},
      capacity: {},
      amenities: [],
      venueType: [],
      location: {}
    });
    loadVenues();
  };

  const handleSortChange = (sortValue) => {
    setCurrentSort(sortValue);
    // loadVenues will be called by useEffect when currentSort changes
  };

  const handleToggleFavorite = async (venueId, currentlyFavorited) => {
    if (!user) {
      return;
    }

    try {
      const result = await venueService.toggleFavorite(venueId, user.id);
      if (result?.success) {
        // Update local state with safe array operations
        setVenues(prev => safeMap(prev, venue =>
          venue?.id === venueId 
            ? { ...venue, isFavorite: result.isFavorite }
            : venue
        ));
      }
    } catch (error) {
      console.log('Error toggling favorite:', error);
    }
  };

  const handleQuickView = (venue) => {
    setQuickViewVenue(venue);
  };

  const handleMapVenueSelect = (venue) => {
    setSelectedMapVenue(venue);
  };

  const handleQuickAction = (action, selectedVenues) => {
    console.log('Quick action:', action, selectedVenues);
    // Handle quick actions based on user role and action type
  };

  const searchContextData = {
    query: searchData.location,
    location: searchData.location,
    date: searchData.checkIn,
    guests: searchData.guests,
    totalResults: totalResults,
    ...activeFilters
  };

  // Show loading state while auth is initializing
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <RoleBasedNavigation 
        user={userProfile || { role: 'customer' }}
        onNavigate={(path) => console.log('Navigate to:', path)}
      />

      {/* Search Context Preserver */}
      <SearchContextPreserver 
        searchParams={searchContextData}
        onBackToSearch={(context) => console.log('Back to search:', context)}
      />

      <div className="container-padding section-spacing">
        {/* Search Bar */}
        <SearchBar 
          onSearch={handleSearch}
          initialValues={searchData}
        />

        {/* Active Filters */}
        <FilterChips
          activeFilters={activeFilters}
          onRemoveFilter={handleRemoveFilter}
          onClearAll={handleClearAllFilters}
        />

        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-text-primary">
              {totalResults > 0 ? `${totalResults} venues found` : 'Find Your Perfect Venue'}
            </h1>
            
            {searchData.location && (
              <span className="text-text-muted">in {searchData.location}</span>
            )}
          </div>

          <div className="flex items-center space-x-3">
            {/* View Toggle */}
            <div className="flex items-center bg-secondary-100 rounded-lg p-1">
              <button
                onClick={() => setShowMap(false)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${
                  !showMap 
                    ? 'bg-surface text-text-primary shadow-sm' 
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                <Icon name="Grid3X3" size={16} className="mr-1" />
                Grid
              </button>
              <button
                onClick={() => setShowMap(true)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${
                  showMap 
                    ? 'bg-surface text-text-primary shadow-sm' 
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                <Icon name="Map" size={16} className="mr-1" />
                Map
              </button>
            </div>

            {/* Sort Dropdown */}
            <SortDropdown
              currentSort={currentSort}
              onSortChange={handleSortChange}
            />

            {/* Filters Button */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(true)}
              iconName="Filter"
              iconPosition="left"
            >
              Filters
            </Button>
          </div>
        </div>

        {/* Main Content */}
        {showMap ? (
          <div className="h-[600px] rounded-lg overflow-hidden">
            <MapView
              venues={ensureArray(venues)}
              onVenueSelect={handleMapVenueSelect}
              selectedVenue={selectedMapVenue}
            />
          </div>
        ) : (
          <div>
            {isLoading ? (
              <LoadingSkeleton count={8} />
            ) : ensureArray(venues).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {safeMap(venues, (venue) => (
                  <VenueCard
                    key={venue?.id || Math.random()}
                    venue={{
                      ...venue,
                      // Map Supabase data to expected format
                      image: venue?.images?.[0] || '/assets/images/no_image.png',
                      gallery: ensureArray(venue?.images),
                      availableToday: true,
                      isFavorite: ensureArray(venue?.favorite_venues).length > 0,
                      distance: 0,
                      type: venue?.venue_type,
                      location: venue?.location,
                      pricePerHour: venue?.price_per_hour,
                      reviewCount: venue?.review_count || 0,
                      amenities: venue?.amenities
                    }}
                    onToggleFavorite={handleToggleFavorite}
                    onQuickView={handleQuickView}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Icon name="Search" size={48} className="text-text-muted mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-text-primary mb-2">
                  No venues found
                </h3>
                <p className="text-text-secondary mb-6">
                  Try adjusting your search criteria or filters to find more venues.
                </p>
                <Button
                  variant="primary"
                  onClick={handleClearAllFilters}
                  iconName="RotateCcw"
                  iconPosition="left"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Load More Button */}
        {!isLoading && ensureArray(venues).length > 0 && venues.length < totalResults && (
          <div className="text-center mt-8">
            <Button
              variant="outline"
              onClick={() => console.log('Load more venues')}
              iconName="ChevronDown"
              iconPosition="right"
            >
              Load More Venues
            </Button>
          </div>
        )}
      </div>

      {/* Advanced Filters Modal */}
      <AdvancedFilters
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        filters={activeFilters}
        onApplyFilters={handleApplyFilters}
      />

      {/* Quick View Modal */}
      <QuickViewModal
        venue={quickViewVenue}
        isOpen={!!quickViewVenue}
        onClose={() => setQuickViewVenue(null)}
      />

      {/* Booking Status Indicator */}
      <BookingStatusIndicator
        userRole={userProfile?.role || 'customer'}
        onStatusClick={(status) => console.log('Booking status clicked:', status)}
      />

      {/* Quick Action Menu */}
      <QuickActionMenu
        userRole={userProfile?.role || 'customer'}
        currentScreen="venue-discovery-search"
        selectedVenues={[]}
        onActionClick={handleQuickAction}
      />
    </div>
  );
};

export default VenueDiscoverySearch;