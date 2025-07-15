import React from 'react';
import { useRTL } from '../../contexts/RTLContext';
import Button from './Button';


const RTLToggle = ({ className = '' }) => {
  const { isRTL, toggleRTL, language } = useRTL();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleRTL}
      className={`flex items-center space-x-2 ${className}`}
      iconName={isRTL ? "AlignRight" : "AlignLeft"}
      iconPosition="left"
    >
      <span className="text-sm font-medium">
        {isRTL ? 'عربي' : 'English'}
      </span>
    </Button>
  );
};

export default RTLToggle;