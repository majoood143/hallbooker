import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ServiceSelectionStep = ({ selectedServices, onServicesChange, onNext, onBack }) => {
  const [expandedService, setExpandedService] = useState(null);

  const availableServices = [
    {
      id: 'catering',
      name: 'Catering Service',
      description: 'Professional catering with customizable menu options',
      price: 25,
      unit: 'per person',
      image: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=400',
      features: ['Professional chefs', 'Customizable menu', 'Service staff', 'Setup & cleanup'],
      popular: true
    },
    {
      id: 'decoration',
      name: 'Event Decoration',
      description: 'Complete venue decoration with theme customization',
      price: 500,
      unit: 'package',
      image: 'https://images.pexels.com/photos/1616113/pexels-photo-1616113.jpeg?w=400',
      features: ['Theme design', 'Floral arrangements', 'Lighting setup', 'Table decorations']
    },
    {
      id: 'photography',
      name: 'Photography & Videography',
      description: 'Professional event photography and videography services',
      price: 800,
      unit: 'package',
      image: 'https://images.pixabay.com/photo/2016/11/19/15/32/camera-1840_640.jpg',
      features: ['Professional photographer', 'HD videography', 'Edited photos', 'Same-day highlights']
    },
    {
      id: 'sound-system',
      name: 'Sound System & DJ',
      description: 'Professional sound system with optional DJ services',
      price: 300,
      unit: 'package',
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
      features: ['Professional sound system', 'Wireless microphones', 'DJ services', 'Music playlist']
    },
    {
      id: 'security',
      name: 'Security Service',
      description: 'Professional security personnel for event safety',
      price: 150,
      unit: 'per guard',
      image: 'https://images.pexels.com/photos/8728380/pexels-photo-8728380.jpeg?w=400',
      features: ['Licensed security guards', 'Event monitoring', 'Crowd control', '24/7 availability']
    },
    {
      id: 'transportation',
      name: 'Guest Transportation',
      description: 'Shuttle service for guest transportation',
      price: 200,
      unit: 'per vehicle',
      image: 'https://images.pixabay.com/photo/2016/04/01/12/11/bus-1300990_640.jpg',
      features: ['Professional drivers', 'Multiple pickup points', 'Comfortable vehicles', 'Flexible scheduling']
    }
  ];

  const isServiceSelected = (serviceId) => {
    return selectedServices.some(service => service.id === serviceId);
  };

  const getSelectedServiceQuantity = (serviceId) => {
    const service = selectedServices.find(service => service.id === serviceId);
    return service ? service.quantity : 1;
  };

  const toggleService = (service) => {
    if (isServiceSelected(service.id)) {
      // Remove service
      const updatedServices = selectedServices.filter(s => s.id !== service.id);
      onServicesChange(updatedServices);
    } else {
      // Add service
      const newService = {
        ...service,
        quantity: 1,
        totalPrice: service.price
      };
      onServicesChange([...selectedServices, newService]);
    }
  };

  const updateServiceQuantity = (serviceId, quantity) => {
    const updatedServices = selectedServices.map(service => {
      if (service.id === serviceId) {
        return {
          ...service,
          quantity: Math.max(1, quantity),
          totalPrice: service.price * Math.max(1, quantity)
        };
      }
      return service;
    });
    onServicesChange(updatedServices);
  };

  const toggleExpanded = (serviceId) => {
    setExpandedService(expandedService === serviceId ? null : serviceId);
  };

  const getTotalServicesPrice = () => {
    return selectedServices.reduce((total, service) => total + service.totalPrice, 0);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-text-primary mb-2">
          Additional Services
        </h2>
        <p className="text-text-secondary">
          Enhance your event with our professional services
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {availableServices.map((service) => {
          const isSelected = isServiceSelected(service.id);
          const quantity = getSelectedServiceQuantity(service.id);
          const isExpanded = expandedService === service.id;

          return (
            <div
              key={service.id}
              className={`bg-surface border-2 rounded-lg overflow-hidden transition-all duration-200 ${
                isSelected 
                  ? 'border-primary shadow-md' 
                  : 'border-border hover:border-secondary-300'
              }`}
            >
              {/* Service Header */}
              <div className="relative">
                <div className="h-48 overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {service.popular && (
                  <div className="absolute top-3 left-3">
                    <span className="bg-accent text-white text-xs font-medium px-2 py-1 rounded-full">
                      Popular
                    </span>
                  </div>
                )}
                {isSelected && (
                  <div className="absolute top-3 right-3">
                    <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
                      <Icon name="Check" size={16} color="white" />
                    </div>
                  </div>
                )}
              </div>

              {/* Service Content */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-text-primary">
                    {service.name}
                  </h3>
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary">
                      ${service.price}
                    </div>
                    <div className="text-sm text-text-muted">
                      {service.unit}
                    </div>
                  </div>
                </div>

                <p className="text-text-secondary text-sm mb-3">
                  {service.description}
                </p>

                {/* Features Preview */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {service.features.slice(0, 2).map((feature, index) => (
                      <span
                        key={index}
                        className="text-xs bg-secondary-100 text-secondary-700 px-2 py-1 rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                    {service.features.length > 2 && (
                      <button
                        onClick={() => toggleExpanded(service.id)}
                        className="text-xs text-primary hover:text-primary-700 px-2 py-1"
                      >
                        +{service.features.length - 2} more
                      </button>
                    )}
                  </div>
                </div>

                {/* Expanded Features */}
                {isExpanded && (
                  <div className="mb-4 animate-slide-down">
                    <div className="bg-secondary-50 rounded-lg p-3">
                      <h4 className="text-sm font-medium text-text-primary mb-2">
                        Included Features:
                      </h4>
                      <ul className="space-y-1">
                        {service.features.map((feature, index) => (
                          <li key={index} className="flex items-center text-sm text-text-secondary">
                            <Icon name="Check" size={14} color="var(--color-success)" className="mr-2" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Service Actions */}
                <div className="flex items-center justify-between">
                  <Button
                    variant={isSelected ? "success" : "outline"}
                    iconName={isSelected ? "Check" : "Plus"}
                    onClick={() => toggleService(service)}
                    className="flex-1 mr-2"
                  >
                    {isSelected ? "Selected" : "Add Service"}
                  </Button>

                  {isSelected && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateServiceQuantity(service.id, quantity - 1)}
                        className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-secondary-50"
                        disabled={quantity <= 1}
                      >
                        <Icon name="Minus" size={14} />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">
                        {quantity}
                      </span>
                      <button
                        onClick={() => updateServiceQuantity(service.id, quantity + 1)}
                        className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-secondary-50"
                      >
                        <Icon name="Plus" size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Services Summary */}
      {selectedServices.length > 0 && (
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-text-primary mb-3">
            Selected Services ({selectedServices.length})
          </h3>
          <div className="space-y-2">
            {selectedServices.map((service) => (
              <div key={service.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-sm text-text-primary">
                    {service.name}
                  </span>
                  {service.quantity > 1 && (
                    <span className="text-sm text-text-muted ml-2">
                      × {service.quantity}
                    </span>
                  )}
                </div>
                <span className="text-sm font-medium text-text-primary">
                  ${service.totalPrice}
                </span>
              </div>
            ))}
            <div className="border-t border-primary-200 pt-2 mt-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-text-primary">
                  Services Total
                </span>
                <span className="text-lg font-bold text-primary">
                  ${getTotalServicesPrice()}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
        <Button
          variant="outline"
          iconName="ArrowLeft"
          iconPosition="left"
          onClick={onBack}
        >
          Back to Details
        </Button>

        <Button
          variant="primary"
          iconName="ArrowRight"
          iconPosition="right"
          onClick={onNext}
        >
          Continue to Payment
        </Button>
      </div>
    </div>
  );
};

export default ServiceSelectionStep;