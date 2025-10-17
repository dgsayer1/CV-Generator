import type { FormValidators, ValidationResult, CVData } from './types';

export const validators: FormValidators = {
  email: (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value.trim());
  },

  phone: (value: string): boolean => {
    const phoneRegex = /^[\d\s\-+()]{7,20}$/;
    return phoneRegex.test(value.trim());
  },

  required: (value: string): boolean => {
    return value.trim().length > 0;
  },

  maxLength: (value: string, max: number): boolean => {
    return value.trim().length <= max;
  }
};

export function validateCVData(data: CVData): ValidationResult {
  const errors: string[] = [];

  if (!validators.required(data.personal.name)) {
    errors.push('Name is required');
  }

  if (!validators.required(data.personal.title)) {
    errors.push('Professional title is required');
  }

  if (!validators.email(data.personal.email)) {
    errors.push('Valid email is required');
  }

  if (!validators.phone(data.personal.phone)) {
    errors.push('Valid phone number is required');
  }

  if (!validators.required(data.personal.location)) {
    errors.push('Location is required');
  }

  if (!validators.maxLength(data.personal.name, 100)) {
    errors.push('Name must be 100 characters or less');
  }

  if (!validators.maxLength(data.personal.title, 100)) {
    errors.push('Title must be 100 characters or less');
  }

  if (!validators.maxLength(data.personal.summary, 2000)) {
    errors.push('Summary must be 2000 characters or less');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function parseSkills(skillsText: string): string[] {
  return skillsText
    .split(',')
    .map(skill => skill.trim())
    .filter(skill => skill.length > 0);
}
