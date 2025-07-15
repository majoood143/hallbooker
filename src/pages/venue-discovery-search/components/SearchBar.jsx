import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const SearchBar = ({ onSearch, initialValues = {} }) => {
  const [searchData, setSearchData] = useState({
    location: initialValues.location || '',
    checkIn: initialValues.checkIn || '',
    checkOut: initialValues.checkOut || '',
    guests: initialValues.guests || ''
  });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState([]);

  // Mock location suggestions
  const mockLocations = [
    "New York, NY",
    "Los Angeles, CA", 
    "Chicago, IL",
    "Houston, TX",
    "Phoenix, AZ",
    "Philadelphia, PA",
    "San Antonio, TX",
    "San Diego, CA",
    "Dallas, TX",
    "San Jose, CA"
  ];

  useEffect(() => {
    if (searchData.location.length > 2) {
      const filtered = mockLocations.filter(location =>
        location.toLowerCase().includes(searchData.location.toLowerCase())
      );
      setLocationSuggestions(filtered.slice(0, 5));
      setShowSuggestions(true);
    } else {
      setLocationSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchData.location]);

  const handleInputChange = (field, value) => {
    setSearchData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLocationSelect = (location) => {
    setSearchData(prev => ({
      ...prev,
      location
    }));
    setShowSuggestions(false);
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchData);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="bg-surface border border-border rounded-lg shadow-md p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Location Input */}
        <div className="relative">
          <label className="block text-sm font-medium text-text-primary mb-1">
            Location
          </label>
          <div className="relative">
            <Icon 
              name="MapPin" 
              size={18} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" 
            />
            <Input
              type="text"
              placeholder="Where are you looking?"
              value={searchData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-10"
            />
            {showSuggestions && Array.isArray(locationSuggestions) && locationSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-surface border border-border rounded-md shadow-lg z-50 mt-1">
                {locationSuggestions.map((location, index) => (
                  <button
                    key={index}
                    onClick={() => handleLocationSelect(location)}
                    className="w-full text-left px-3 py-2 hover:bg-secondary-50 transition-colors duration-200 first:rounded-t-md last:rounded-b-md"
                  >
                    <div className="flex items-center space-x-2">
                      <Icon name="MapPin" size={14} className="text-text-muted" />
                      <span className="text-sm text-text-primary">{location}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Check-in Date */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">
            Check-in Date
          </label>
          <div className="relative">
            <Icon 
              name="Calendar" 
              size={18} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" 
            />
            <Input
              type="date"
              value={searchData.checkIn}
              onChange={(e) => handleInputChange('checkIn', e.target.value)}
              className="pl-10"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>

        {/* Check-out Date */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">
            Check-out Date
          </label>
          <div className="relative">
            <Icon 
              name="Calendar" 
              size={18} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" 
            />
            <Input
              type="date"
              value={searchData.checkOut}
              onChange={(e) => handleInputChange('checkOut', e.target.value)}
              className="pl-10"
              min={searchData.checkIn || new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>

        {/* Guests */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">
            Guests
          </label>
          <div className="relative">
            <Icon 
              name="Users" 
              size={18} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" 
            />
            <Input
              type="number"
              placeholder="Number of guests"
              value={searchData.guests}
              onChange={(e) => handleInputChange('guests', e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-10"
              min="1"
              max="1000"
            />
          </div>
        </div>
      </div>

      {/* Search Button */}
      <div className="mt-4 flex justify-center">
        <Button
          variant="primary"
          onClick={handleSearch}
          iconName="Search"
          iconPosition="left"
          className="px-8"
        >
          Search Venues
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;