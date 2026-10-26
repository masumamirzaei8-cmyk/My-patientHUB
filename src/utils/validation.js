/**
 * Validation utilities for MyPatientHUB
 */

/**
 * Validate email address
 * Requirements:
 * - At least 8 characters long
 * - Must contain @ symbol
 * - Must end with gmail.com
 * 
 * @param {string} email - Email to validate
 * @returns {Object} Validation result with valid boolean and message
 */
export const validateEmail = (email) => {
  if (!email || email.trim() === '') {
    return { valid: false, message: 'Email is required' };
  }

  if (email.length < 8) {
    return { valid: false, message: 'Email must be at least 8 characters long' };
  }

  if (!email.includes('@')) {
    return { valid: false, message: 'Email must contain @ symbol' };
  }

  if (!email.endsWith('gmail.com')) {
    return { valid: false, message: 'Email must end with gmail.com' };
  }

  // Additional email format validation
  const emailRegex = /^[^\s@]+@[^\s@]*gmail\.com$/;
  if (!emailRegex.test(email)) {
    return { valid: false, message: 'Please enter a valid email address' };
  }

  return { valid: true, message: '' };
};

/**
 * Validate password
 * Requirements:
 * - Must be exactly 4 characters (demo requirement)
 * 
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with valid boolean and message
 */
export const validatePassword = (password) => {
  if (!password || password === '') {
    return { valid: false, message: 'Password is required' };
  }

  if (password.length !== 4) {
    return { valid: false, message: 'Password must be exactly 4 characters' };
  }

  return { valid: true, message: '' };
};

/**
 * Validate required field
 * 
 * @param {string} value - Field value
 * @param {string} fieldName - Field name for error message
 * @returns {Object} Validation result with valid boolean and message
 */
export const validateRequired = (value, fieldName) => {
  if (!value || value.trim() === '') {
    return { valid: false, message: `${fieldName} is required` };
  }
  return { valid: true, message: '' };
};

/**
 * Validate phone number (optional)
 * 
 * @param {string} phone - Phone number to validate
 * @returns {Object} Validation result with valid boolean and message
 */
export const validatePhone = (phone) => {
  if (!phone || phone.trim() === '') {
    return { valid: true, message: '' }; // Phone is optional
  }

  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  if (!phoneRegex.test(phone)) {
    return { valid: false, message: 'Please enter a valid phone number' };
  }

  return { valid: true, message: '' };
};
