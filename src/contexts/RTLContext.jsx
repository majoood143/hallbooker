import React, { createContext, useContext, useEffect, useState } from 'react';

const RTLContext = createContext();

export function RTLProvider({ children }) {
  const [isRTL, setIsRTL] = useState(false);
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    // Check for saved language preference
    const savedLanguage = localStorage.getItem('language');
    const savedRTL = localStorage.getItem('isRTL');
    
    if (savedLanguage) {
      setLanguage(savedLanguage);
      setIsRTL(savedRTL === 'true');
    }
  }, []);

  useEffect(() => {
    // Update HTML attributes when RTL changes
    const htmlElement = document.documentElement;
    const bodyElement = document.body;
    
    if (isRTL) {
      htmlElement.setAttribute('dir', 'rtl');
      htmlElement.setAttribute('lang', 'ar');
      bodyElement.classList.add('rtl');
    } else {
      htmlElement.setAttribute('dir', 'ltr');
      htmlElement.setAttribute('lang', 'en');
      bodyElement.classList.remove('rtl');
    }
  }, [isRTL]);

  const toggleRTL = () => {
    const newIsRTL = !isRTL;
    const newLanguage = newIsRTL ? 'ar' : 'en';
    
    setIsRTL(newIsRTL);
    setLanguage(newLanguage);
    
    // Save to localStorage
    localStorage.setItem('isRTL', newIsRTL.toString());
    localStorage.setItem('language', newLanguage);
  };

  const setRTLMode = (rtlMode) => {
    const newLanguage = rtlMode ? 'ar' : 'en';
    
    setIsRTL(rtlMode);
    setLanguage(newLanguage);
    
    // Save to localStorage
    localStorage.setItem('isRTL', rtlMode.toString());
    localStorage.setItem('language', newLanguage);
  };

  const value = {
    isRTL,
    language,
    toggleRTL,
    setRTLMode,
    direction: isRTL ? 'rtl' : 'ltr'
  };

  return (
    <RTLContext.Provider value={value}>
      {children}
    </RTLContext.Provider>
  );
}

export const useRTL = () => {
  const context = useContext(RTLContext);
  if (!context) {
    throw new Error('useRTL must be used within an RTLProvider');
  }
  return context;
};

export default RTLContext;