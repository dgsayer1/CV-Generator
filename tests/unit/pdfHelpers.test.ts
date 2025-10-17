import { describe, it, expect } from 'vitest';
import {
  hexToRGB,
  splitTextForWidth,
  calculateYPosition,
  shouldAddNewPage,
  calculateLineCount,
  trimWhitespace,
  normalizeLineBreaks
} from '../../src/pdfHelpers';

describe('hexToRGB', () => {
  it('converts valid hex colors to RGB', () => {
    expect(hexToRGB('#667eea')).toEqual({ r: 102, g: 126, b: 234 });
    expect(hexToRGB('#ffffff')).toEqual({ r: 255, g: 255, b: 255 });
    expect(hexToRGB('#000000')).toEqual({ r: 0, g: 0, b: 0 });
  });

  it('handles hex colors without # prefix', () => {
    expect(hexToRGB('667eea')).toEqual({ r: 102, g: 126, b: 234 });
  });

  it('handles uppercase hex colors', () => {
    expect(hexToRGB('#667EEA')).toEqual({ r: 102, g: 126, b: 234 });
  });

  it('throws error for invalid hex format', () => {
    expect(() => hexToRGB('#xyz')).toThrow('Invalid hex color');
    expect(() => hexToRGB('invalid')).toThrow('Invalid hex color');
    expect(() => hexToRGB('#12')).toThrow('Invalid hex color');
  });
});

describe('splitTextForWidth', () => {
  it('splits text that exceeds max width', () => {
    const text = 'This is a long sentence that should be split';
    const result = splitTextForWidth(text, 20, 2);
    expect(result.length).toBeGreaterThan(1);
    expect(result[0]).toBe('This is a');
  });

  it('keeps short text on single line', () => {
    const text = 'Short text';
    const result = splitTextForWidth(text, 100, 2);
    expect(result).toEqual(['Short text']);
  });

  it('handles empty string', () => {
    const result = splitTextForWidth('', 100, 2);
    expect(result).toEqual([]);
  });

  it('splits by word boundaries', () => {
    const text = 'word1 word2 word3';
    const result = splitTextForWidth(text, 15, 2);
    expect(result[0]).toContain('word1');
    expect(result.every(line => !line.endsWith(' '))).toBe(true);
  });

  it('handles single word exceeding width', () => {
    const text = 'superlongwordthatexceedswidth';
    const result = splitTextForWidth(text, 20, 2);
    expect(result).toEqual(['superlongwordthatexceedswidth']);
  });
});

describe('calculateYPosition', () => {
  it('calculates new Y position correctly', () => {
    expect(calculateYPosition(10, 5, 3)).toBe(25);
    expect(calculateYPosition(0, 10, 1)).toBe(10);
    expect(calculateYPosition(100, 3.5, 2)).toBe(107);
  });

  it('handles zero lines', () => {
    expect(calculateYPosition(10, 5, 0)).toBe(10);
  });

  it('handles decimal line heights', () => {
    expect(calculateYPosition(10, 3.5, 2)).toBe(17);
  });
});

describe('shouldAddNewPage', () => {
  it('returns true when Y exceeds threshold', () => {
    expect(shouldAddNewPage(260, 250)).toBe(true);
    expect(shouldAddNewPage(251, 250)).toBe(true);
  });

  it('returns false when Y is below threshold', () => {
    expect(shouldAddNewPage(240, 250)).toBe(false);
    expect(shouldAddNewPage(250, 250)).toBe(false);
  });

  it('uses default threshold of 250', () => {
    expect(shouldAddNewPage(260)).toBe(true);
    expect(shouldAddNewPage(240)).toBe(false);
  });

  it('handles edge case at exact threshold', () => {
    expect(shouldAddNewPage(250, 250)).toBe(false);
  });
});

describe('calculateLineCount', () => {
  it('calculates line count for text', () => {
    expect(calculateLineCount('hello', 5)).toBe(1);
    expect(calculateLineCount('hello world', 5)).toBe(3);
    expect(calculateLineCount('a'.repeat(100), 25)).toBe(4);
  });

  it('handles empty string', () => {
    expect(calculateLineCount('', 10)).toBe(0);
  });

  it('rounds up for partial lines', () => {
    expect(calculateLineCount('hello', 10)).toBe(1);
    expect(calculateLineCount('hello world', 10)).toBe(2);
  });

  it('handles exact multiples', () => {
    expect(calculateLineCount('a'.repeat(50), 25)).toBe(2);
  });
});

describe('trimWhitespace', () => {
  it('trims whitespace from strings', () => {
    expect(trimWhitespace('  hello  ')).toBe('hello');
    expect(trimWhitespace('\n\tworld\n\t')).toBe('world');
  });

  it('handles null and undefined', () => {
    expect(trimWhitespace(null)).toBe('');
    expect(trimWhitespace(undefined)).toBe('');
  });

  it('handles empty string', () => {
    expect(trimWhitespace('')).toBe('');
    expect(trimWhitespace('   ')).toBe('');
  });

  it('preserves internal whitespace', () => {
    expect(trimWhitespace('  hello world  ')).toBe('hello world');
  });
});

describe('normalizeLineBreaks', () => {
  it('converts Windows line breaks to Unix', () => {
    expect(normalizeLineBreaks('line1\r\nline2\r\nline3')).toBe('line1\nline2\nline3');
  });

  it('converts Mac line breaks to Unix', () => {
    expect(normalizeLineBreaks('line1\rline2\rline3')).toBe('line1\nline2\nline3');
  });

  it('preserves Unix line breaks', () => {
    expect(normalizeLineBreaks('line1\nline2\nline3')).toBe('line1\nline2\nline3');
  });

  it('handles mixed line breaks', () => {
    expect(normalizeLineBreaks('line1\r\nline2\nline3\rline4')).toBe('line1\nline2\nline3\nline4');
  });

  it('handles empty string', () => {
    expect(normalizeLineBreaks('')).toBe('');
  });

  it('handles string without line breaks', () => {
    expect(normalizeLineBreaks('single line')).toBe('single line');
  });
});
