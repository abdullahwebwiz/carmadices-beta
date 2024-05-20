import { parsePhoneNumberFromString } from 'libphonenumber-js';

interface ValidationResult {
    firstName?: string;
    email?: string;
    phone?: string;
  }

  export const validateInput = (firstName: string, email: string, password: string, phone: string): ValidationResult => {
    let errors: ValidationResult = {};

    // Validate firstName
    const nameRegex = /^[a-zA-Z]*$/; // Regex to allow only alphabets
    if (!firstName || !nameRegex.test(firstName)) {
        errors.firstName = 'Name is invalid';
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        errors.email = 'Invalid email';
    }

    // Validate phone
    const phoneNumber = parsePhoneNumberFromString(phone, 'US');
    if (!phoneNumber || !phoneNumber.isValid()) {
        errors.phone = 'Invalid phone number';
    }

    return errors;
};