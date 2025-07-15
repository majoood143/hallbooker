// RTL utility functions for text handling and direction management

export const isRTLText = (text) => {
  if (!text) return false;
  
  // Arabic Unicode range
  const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  return arabicRegex.test(text);
};

export const getTextDirection = (text) => {
  return isRTLText(text) ? 'rtl' : 'ltr';
};

export const getTextAlignment = (text, isRTLMode = false) => {
  const textIsRTL = isRTLText(text);
  
  if (textIsRTL) {
    return 'right';
  } else if (isRTLMode) {
    return 'right';
  } else {
    return 'left';
  }
};

export const getFlexDirection = (isRTL) => {
  return isRTL ? 'flex-row-reverse' : 'flex-row';
};

export const getMarginDirection = (isRTL, side) => {
  if (side === 'left') {
    return isRTL ? 'mr' : 'ml';
  } else if (side === 'right') {
    return isRTL ? 'ml' : 'mr';
  }
  return side;
};

export const getPaddingDirection = (isRTL, side) => {
  if (side === 'left') {
    return isRTL ? 'pr' : 'pl';
  } else if (side === 'right') {
    return isRTL ? 'pl' : 'pr';
  }
  return side;
};

export const formatNumber = (number, isRTL = false) => {
  if (isRTL) {
    // Format numbers for Arabic locale
    return new Intl.NumberFormat('ar-SA').format(number);
  }
  return new Intl.NumberFormat('en-US').format(number);
};

export const formatDate = (date, isRTL = false) => {
  if (isRTL) {
    return new Intl.DateTimeFormat('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date));
  }
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date));
};

export const getIconDirection = (iconName, isRTL) => {
  // Icons that should be flipped in RTL
  const flipIcons = [
    'ChevronLeft',
    'ChevronRight',
    'ArrowLeft',
    'ArrowRight',
    'TrendingUp',
    'TrendingDown'
  ];
  
  if (flipIcons.includes(iconName) && isRTL) {
    return 'scale-x-[-1]';
  }
  
  return '';
};