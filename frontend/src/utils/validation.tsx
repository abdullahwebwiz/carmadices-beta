interface ValidationResult {
    firstName?: string;
    email?: string;
    password?: string;
    phone?: string;
}

export const validateInput = (
    firstName: string,
    email: string,
    password: string | null,
    phone: string
): ValidationResult => {
    let errors: ValidationResult = {};

    // Validate firstName
    const nameRegex = /^[a-zA-Z\s-]+$/;
    if (!firstName || !nameRegex.test(firstName.trim())) {
        errors.firstName = 'Name is invalid';
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        errors.email = 'Invalid email';
    }

    // Simple phone validation
    // This regex matches basic U.S. phone formats, including optional country code, area code, and formats like 123-456-7890, (123) 456-7890, 123 456 7890, etc.
    const phoneRegex = /^(\+1)?[\s-]?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}$/;
    if (!phone || !phoneRegex.test(phone)) {
        errors.phone = 'Invalid phone number';
    }

    // Validate password only if it's not null and has length less than 8
    if (password !== null && (!password || password.length < 8)) {
        errors.password = 'Password must be at least 8 characters';
    }

    return errors;
};
