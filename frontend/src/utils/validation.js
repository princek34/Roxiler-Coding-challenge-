// Form validation utilities matching strict challenge specifications

export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]{8,16}$/;

export const validateName = (name) => {
  if (!name || typeof name !== 'string') {
    return 'Name is required.';
  }
  const trimmed = name.trim();
  if (trimmed.length < 20) {
    return `Name must be at least 20 characters (currently ${trimmed.length}).`;
  }
  if (trimmed.length > 60) {
    return `Name must be at most 60 characters (currently ${trimmed.length}).`;
  }
  return null;
};

export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return 'Email is required.';
  }
  const trimmed = email.trim();
  if (!EMAIL_REGEX.test(trimmed)) {
    return 'Please enter a valid email address.';
  }
  return null;
};

export const validateAddress = (address) => {
  if (!address || typeof address !== 'string' || !address.trim()) {
    return 'Address is required.';
  }
  const trimmed = address.trim();
  if (trimmed.length > 400) {
    return `Address must not exceed 400 characters (currently ${trimmed.length}).`;
  }
  return null;
};

export const validatePassword = (password) => {
  if (!password) {
    return 'Password is required.';
  }
  if (password.length < 8 || password.length > 16) {
    return 'Password must be between 8 and 16 characters long.';
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter (A-Z).';
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password)) {
    return 'Password must contain at least one special character (e.g. !@#$%^&*).';
  }
  return null;
};

export const getPasswordChecks = (password = '') => {
  return {
    length: password.length >= 8 && password.length <= 16,
    hasUppercase: /[A-Z]/.test(password),
    hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password),
  };
};
