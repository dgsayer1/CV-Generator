import { describe, it, expect } from 'vitest';
import { validators, validateCVData, parseSkills } from '../../src/validation';
import type { CVData } from '../../src/types';

describe('validators', () => {
  describe('email validation', () => {
    it('accepts valid email addresses', () => {
      expect(validators.email('test@example.com')).toBe(true);
      expect(validators.email('user.name@domain.co.uk')).toBe(true);
      expect(validators.email('test+filter@gmail.com')).toBe(true);
    });

    it('rejects invalid email addresses', () => {
      expect(validators.email('invalid')).toBe(false);
      expect(validators.email('test@')).toBe(false);
      expect(validators.email('@domain.com')).toBe(false);
      expect(validators.email('test@domain')).toBe(false);
      expect(validators.email('')).toBe(false);
    });

    it('trims whitespace before validation', () => {
      expect(validators.email('  test@example.com  ')).toBe(true);
    });
  });

  describe('phone validation', () => {
    it('accepts valid phone formats', () => {
      expect(validators.phone('07722 524 190')).toBe(true);
      expect(validators.phone('0772252419')).toBe(true);
      expect(validators.phone('+44 7722 524 190')).toBe(true);
      expect(validators.phone('(020) 1234-5678')).toBe(true);
    });

    it('rejects invalid phone formats', () => {
      expect(validators.phone('123')).toBe(false);
      expect(validators.phone('abc')).toBe(false);
      expect(validators.phone('')).toBe(false);
      expect(validators.phone('12345678901234567890123456789')).toBe(false);
    });

    it('trims whitespace before validation', () => {
      expect(validators.phone('  07722 524 190  ')).toBe(true);
    });
  });

  describe('required validation', () => {
    it('accepts non-empty strings', () => {
      expect(validators.required('hello')).toBe(true);
      expect(validators.required('   test   ')).toBe(true);
    });

    it('rejects empty strings and whitespace', () => {
      expect(validators.required('')).toBe(false);
      expect(validators.required('   ')).toBe(false);
      expect(validators.required('\t\n')).toBe(false);
    });
  });

  describe('maxLength validation', () => {
    it('accepts strings within limit', () => {
      expect(validators.maxLength('hello', 10)).toBe(true);
      expect(validators.maxLength('test', 4)).toBe(true);
      expect(validators.maxLength('', 5)).toBe(true);
    });

    it('rejects strings exceeding limit', () => {
      expect(validators.maxLength('hello world', 5)).toBe(false);
      expect(validators.maxLength('test', 3)).toBe(false);
    });

    it('trims whitespace before checking length', () => {
      expect(validators.maxLength('  test  ', 4)).toBe(true);
      expect(validators.maxLength('  test  ', 3)).toBe(false);
    });
  });
});

describe('parseSkills', () => {
  it('parses comma-separated skills', () => {
    const result = parseSkills('JavaScript, TypeScript, Python');
    expect(result).toEqual(['JavaScript', 'TypeScript', 'Python']);
  });

  it('trims whitespace from skills', () => {
    const result = parseSkills('  JavaScript  ,  TypeScript  ,  Python  ');
    expect(result).toEqual(['JavaScript', 'TypeScript', 'Python']);
  });

  it('filters out empty skills', () => {
    const result = parseSkills('JavaScript,  ,TypeScript,,Python');
    expect(result).toEqual(['JavaScript', 'TypeScript', 'Python']);
  });

  it('handles empty string', () => {
    const result = parseSkills('');
    expect(result).toEqual([]);
  });

  it('handles single skill', () => {
    const result = parseSkills('JavaScript');
    expect(result).toEqual(['JavaScript']);
  });
});

describe('validateCVData', () => {
  const validCVData: CVData = {
    personal: {
      name: 'John Doe',
      title: 'Software Engineer',
      phone: '07722 524 190',
      email: 'john@example.com',
      location: 'London, UK',
      summary: 'Experienced developer'
    },
    skills: {
      automation: ['Playwright'],
      programming: ['TypeScript'],
      performance: ['K6'],
      leadership: ['Team Management']
    },
    jobs: [],
    education: [],
    certifications: [],
    references: [
      { name: 'Ref 1', title: 'Manager' },
      { name: 'Ref 2', title: 'Director' }
    ]
  };

  it('validates correct CV data', () => {
    const result = validateCVData(validCVData);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('detects missing required fields', () => {
    const invalidData = {
      ...validCVData,
      personal: { ...validCVData.personal, name: '' }
    };
    const result = validateCVData(invalidData);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Name is required');
  });

  it('detects invalid email', () => {
    const invalidData = {
      ...validCVData,
      personal: { ...validCVData.personal, email: 'invalid-email' }
    };
    const result = validateCVData(invalidData);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Valid email is required');
  });

  it('detects invalid phone', () => {
    const invalidData = {
      ...validCVData,
      personal: { ...validCVData.personal, phone: '123' }
    };
    const result = validateCVData(invalidData);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Valid phone number is required');
  });

  it('detects field length violations', () => {
    const invalidData = {
      ...validCVData,
      personal: { ...validCVData.personal, name: 'a'.repeat(101) }
    };
    const result = validateCVData(invalidData);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Name must be 100 characters or less');
  });

  it('detects title length violations', () => {
    const invalidData = {
      ...validCVData,
      personal: { ...validCVData.personal, title: 'a'.repeat(101) }
    };
    const result = validateCVData(invalidData);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Title must be 100 characters or less');
  });

  it('detects summary length violations', () => {
    const invalidData = {
      ...validCVData,
      personal: { ...validCVData.personal, summary: 'a'.repeat(2001) }
    };
    const result = validateCVData(invalidData);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Summary must be 2000 characters or less');
  });

  it('accumulates multiple errors', () => {
    const invalidData = {
      ...validCVData,
      personal: {
        name: '',
        title: '',
        phone: '123',
        email: 'bad',
        location: '',
        summary: ''
      }
    };
    const result = validateCVData(invalidData);
    expect(result.isValid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(1);
  });
});
