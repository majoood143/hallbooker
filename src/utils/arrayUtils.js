/**
 * Utility functions for safe array operations
 */

// Safely converts any value to an array
export const ensureArray = (value) => {
  if (Array.isArray(value)) {
    return value;
  }
  
  if (value === null || value === undefined) {
    return [];
  }
  
  // If it's a string that looks like JSON array, try to parse it
  if (typeof value === 'string' && value.startsWith('[')) {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }
  
  // If it's an object with a data property that might be an array
  if (typeof value === 'object' && value.data) {
    return ensureArray(value.data);
  }
  
  return [];
};

// Safely maps over an array with default empty result
export const safeMap = (array, mapFunction, defaultValue = []) => {
  const safeArray = ensureArray(array);
  
  try {
    return safeArray.map(mapFunction);
  } catch (error) {
    console.warn('Error in safeMap:', error);
    return defaultValue;
  }
};

// Safely filters an array
export const safeFilter = (array, filterFunction, defaultValue = []) => {
  const safeArray = ensureArray(array);
  
  try {
    return safeArray.filter(filterFunction);
  } catch (error) {
    console.warn('Error in safeFilter:', error);
    return defaultValue;
  }
};

// Safely gets array length
export const safeLength = (array) => {
  const safeArray = ensureArray(array);
  return safeArray.length;
};

// Safely gets array item by index
export const safeGet = (array, index, defaultValue = null) => {
  const safeArray = ensureArray(array);
  return safeArray[index] || defaultValue;
};

// Safely sorts an array
export const safeSort = (array, sortFunction, defaultValue = []) => {
  const safeArray = ensureArray(array);
  
  try {
    return [...safeArray].sort(sortFunction);
  } catch (error) {
    console.warn('Error in safeSort:', error);
    return defaultValue;
  }
};

// Safely finds an item in array
export const safeFind = (array, findFunction, defaultValue = null) => {
  const safeArray = ensureArray(array);
  
  try {
    return safeArray.find(findFunction) || defaultValue;
  } catch (error) {
    console.warn('Error in safeFind:', error);
    return defaultValue;
  }
};

// Safely reduces an array
export const safeReduce = (array, reduceFunction, initialValue) => {
  const safeArray = ensureArray(array);
  
  try {
    return safeArray.reduce(reduceFunction, initialValue);
  } catch (error) {
    console.warn('Error in safeReduce:', error);
    return initialValue;
  }
};

// Safe array join with fallback
export const safeJoin = (array, separator = ',', defaultValue = '') => {
  const safeArray = ensureArray(array);
  
  try {
    return safeArray.join(separator);
  } catch (error) {
    console.warn('Error in safeJoin:', error);
    return defaultValue;
  }
};

// Safe array slice with fallback
export const safeSlice = (array, start = 0, end = null, defaultValue = []) => {
  const safeArray = ensureArray(array);
  
  try {
    return end === null ? safeArray.slice(start) : safeArray.slice(start, end);
  } catch (error) {
    console.warn('Error in safeSlice:', error);
    return defaultValue;
  }
};

export default {
  ensureArray,
  safeMap,
  safeFilter,
  safeLength,
  safeGet,
  safeSort,
  safeFind,
  safeReduce,
  safeJoin,
  safeSlice
};