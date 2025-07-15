import React from 'react';
import Icon from '../../../components/AppIcon';

const BookingProgressIndicator = ({ currentStep, totalSteps, steps }) => {
  const getStepStatus = (stepIndex) => {
    if (stepIndex < currentStep) return 'completed';
    if (stepIndex === currentStep) return 'current';
    return 'upcoming';
  };

  const getStepIcon = (step, status) => {
    if (status === 'completed') return 'CheckCircle';
    return step.icon;
  };

  const getStepColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-success bg-success-100 border-success-200';
      case 'current':
        return 'text-primary bg-primary-100 border-primary-200';
      default:
        return 'text-text-muted bg-secondary-100 border-secondary-200';
    }
  };

  return (
    <div className="bg-surface border-b border-border">
      <div className="container-padding py-4">
        {/* Mobile Progress Bar */}
        <div className="md:hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-text-primary">
              Step {currentStep + 1} of {totalSteps}
            </span>
            <span className="text-sm text-text-secondary">
              {Math.round(((currentStep + 1) / totalSteps) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-secondary-200 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
            />
          </div>
          <div className="mt-2">
            <h3 className="text-lg font-semibold text-text-primary">
              {steps[currentStep]?.title}
            </h3>
            <p className="text-sm text-text-secondary">
              {steps[currentStep]?.description}
            </p>
          </div>
        </div>

        {/* Desktop Step Indicator */}
        <div className="hidden md:block">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const status = getStepStatus(index);
              const isLast = index === steps.length - 1;
              
              return (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${getStepColor(status)}`}>
                      <Icon 
                        name={getStepIcon(step, status)} 
                        size={20} 
                      />
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-text-primary">
                        {step.title}
                      </div>
                      <div className="text-xs text-text-secondary">
                        {step.description}
                      </div>
                    </div>
                  </div>
                  
                  {!isLast && (
                    <div className="flex-1 mx-4">
                      <div className={`h-0.5 ${
                        status === 'completed' ? 'bg-success' : 'bg-secondary-200'
                      }`} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingProgressIndicator;