import React, { useState } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const VenueGallery = ({ images, venueName }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <>
      {/* Main Gallery */}
      <div className="relative bg-secondary-100 rounded-lg overflow-hidden">
        <div className="aspect-video relative">
          <Image
            src={images[currentImageIndex]}
            alt={`${venueName} - Image ${currentImageIndex + 1}`}
            className="w-full h-full object-cover cursor-pointer"
            onClick={toggleFullscreen}
          />
          
          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-surface/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-surface transition-colors duration-200"
              >
                <Icon name="ChevronLeft" size={20} color="var(--color-text-primary)" />
              </button>
              
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-surface/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-surface transition-colors duration-200"
              >
                <Icon name="ChevronRight" size={20} color="var(--color-text-primary)" />
              </button>
            </>
          )}

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="absolute top-4 right-4 w-10 h-10 bg-surface/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-surface transition-colors duration-200"
          >
            <Icon name="Maximize2" size={16} color="var(--color-text-primary)" />
          </button>

          {/* Image Counter */}
          <div className="absolute bottom-4 right-4 bg-surface/80 backdrop-blur-sm rounded-full px-3 py-1">
            <span className="text-sm font-medium text-text-primary">
              {currentImageIndex + 1} / {images.length}
            </span>
          </div>
        </div>

        {/* Thumbnail Navigation */}
        {images.length > 1 && (
          <div className="p-4">
            <div className="flex space-x-2 overflow-x-auto">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all duration-200 ${
                    index === currentImageIndex
                      ? 'border-primary' :'border-transparent hover:border-secondary-300'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${venueName} thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-500 bg-surface/95 backdrop-blur-sm">
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <button
              onClick={toggleFullscreen}
              className="absolute top-4 right-4 w-12 h-12 bg-surface/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-surface transition-colors duration-200 z-10"
            >
              <Icon name="X" size={20} color="var(--color-text-primary)" />
            </button>

            <div className="relative max-w-6xl max-h-full">
              <Image
                src={images[currentImageIndex]}
                alt={`${venueName} - Fullscreen view`}
                className="max-w-full max-h-full object-contain"
              />

              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-surface/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-surface transition-colors duration-200"
                  >
                    <Icon name="ChevronLeft" size={24} color="var(--color-text-primary)" />
                  </button>
                  
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-surface/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-surface transition-colors duration-200"
                  >
                    <Icon name="ChevronRight" size={24} color="var(--color-text-primary)" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VenueGallery;