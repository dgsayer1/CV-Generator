import { describe, it, expect, vi, beforeEach } from 'vitest';
import { loadFromURL, loadFromFile, validateAndTransform, type PartialCVData } from '../../src/jsonLoader';

describe('validateAndTransform', () => {
  it('validates and transforms complete CV data', () => {
    const input = {
      personal: {
        name: 'John Doe',
        title: 'Developer',
        phone: '123',
        email: 'john@example.com',
        location: 'London',
        summary: 'Summary'
      },
      skills: {
        'Programming': ['JavaScript', 'TypeScript']
      },
      jobs: [{
        title: 'Engineer',
        dates: '2020-2023',
        company: 'Corp',
        location: 'City',
        responsibilities: ['Task 1', 'Task 2']
      }],
      education: [{
        degree: 'BSc',
        years: '2015-2019',
        institution: 'University'
      }],
      certifications: ['Cert 1'],
      references: [
        { name: 'Ref 1', title: 'Title 1', company: 'Company 1' },
        { name: 'Ref 2', title: 'Title 2', company: 'Company 2' }
      ],
      themeColor: '#667eea'
    };

    const result = validateAndTransform(input);

    expect(result.personal).toEqual(input.personal);
    expect(result.skills).toEqual(input.skills);
    expect(result.jobs).toEqual(input.jobs);
    expect(result.education).toEqual(input.education);
    expect(result.certifications).toEqual(input.certifications);
    expect(result.references).toEqual(input.references);
    expect(result.themeColor).toBe('#667eea');
  });

  it('handles partial personal info', () => {
    const input = {
      personal: {
        name: 'John',
        email: 'john@example.com'
      }
    };

    const result = validateAndTransform(input);

    expect(result.personal?.name).toBe('John');
    expect(result.personal?.email).toBe('john@example.com');
    expect(result.personal?.title).toBeUndefined();
  });

  it('converts comma-separated skills to arrays', () => {
    const input = {
      skills: {
        'Programming': 'JavaScript, TypeScript, Python'
      }
    };

    const result = validateAndTransform(input);

    expect(result.skills?.['Programming']).toEqual(['JavaScript', 'TypeScript', 'Python']);
  });

  it('handles skills as arrays', () => {
    const input = {
      skills: {
        'Programming': ['JavaScript', 'TypeScript']
      }
    };

    const result = validateAndTransform(input);

    expect(result.skills?.['Programming']).toEqual(['JavaScript', 'TypeScript']);
  });

  it('converts newline-separated responsibilities to arrays', () => {
    const input = {
      jobs: [{
        title: 'Engineer',
        dates: '2020',
        company: 'Corp',
        location: 'City',
        responsibilities: 'Task 1\nTask 2\nTask 3'
      }]
    };

    const result = validateAndTransform(input);

    expect(result.jobs?.[0].responsibilities).toEqual(['Task 1', 'Task 2', 'Task 3']);
  });

  it('handles missing optional fields', () => {
    const input = {
      personal: { name: 'John' }
    };

    const result = validateAndTransform(input);

    expect(result.personal?.name).toBe('John');
    expect(result.skills).toBeUndefined();
    expect(result.jobs).toBeUndefined();
    expect(result.education).toBeUndefined();
  });

  it('handles empty data object', () => {
    const input = {};

    const result = validateAndTransform(input);

    expect(result).toEqual({});
  });

  it('throws error for null data', () => {
    expect(() => validateAndTransform(null)).toThrow('Invalid data format');
  });

  it('throws error for non-object data', () => {
    expect(() => validateAndTransform('string')).toThrow('Invalid data format');
  });

  it('converts all values to strings', () => {
    const input = {
      personal: {
        name: 123,
        title: true
      }
    };

    const result = validateAndTransform(input);

    expect(result.personal?.name).toBe('123');
    expect(result.personal?.title).toBe('true');
  });

  it('filters out empty strings from responsibilities', () => {
    const input = {
      jobs: [{
        title: 'Engineer',
        dates: '2020',
        company: 'Corp',
        location: 'City',
        responsibilities: 'Task 1\n\n\nTask 2\n  \nTask 3'
      }]
    };

    const result = validateAndTransform(input);

    expect(result.jobs?.[0].responsibilities).toEqual(['Task 1', 'Task 2', 'Task 3']);
  });

  it('handles references with only two entries', () => {
    const input = {
      references: [
        { name: 'Ref 1', title: 'Title 1', company: 'Company 1' },
        { name: 'Ref 2', title: 'Title 2', company: 'Company 2' },
        { name: 'Ref 3', title: 'Title 3', company: 'Company 3' }
      ]
    };

    const result = validateAndTransform(input);

    expect(result.references).toHaveLength(2);
    expect(result.references?.[0].name).toBe('Ref 1');
    expect(result.references?.[1].name).toBe('Ref 2');
  });

  it('ignores references with less than 2 entries', () => {
    const input = {
      references: [
        { name: 'Ref 1', title: 'Title 1', company: 'Company 1' }
      ]
    };

    const result = validateAndTransform(input);

    expect(result.references).toBeUndefined();
  });
});

describe('loadFromURL', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches and parses JSON from URL', async () => {
    const mockData = { personal: { name: 'John' } };
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockData
    });

    const result = await loadFromURL('https://example.com/data.json');

    expect(result.personal?.name).toBe('John');
    expect(global.fetch).toHaveBeenCalledWith('https://example.com/data.json');
  });

  it('throws error on fetch failure', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found'
    });

    await expect(loadFromURL('https://example.com/data.json'))
      .rejects.toThrow('Failed to fetch: 404 Not Found');
  });

  it('throws error on invalid JSON', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => { throw new Error('Invalid JSON'); }
    });

    await expect(loadFromURL('https://example.com/data.json'))
      .rejects.toThrow();
  });
});

describe('loadFromFile', () => {
  it('reads and parses JSON from file', async () => {
    const mockData = { personal: { name: 'Jane' } };
    const mockFile = new File([JSON.stringify(mockData)], 'test.json', { type: 'application/json' });

    const result = await loadFromFile(mockFile);

    expect(result.personal?.name).toBe('Jane');
  });

  it('throws error on invalid JSON file', async () => {
    const mockFile = new File(['invalid json'], 'test.json', { type: 'application/json' });

    await expect(loadFromFile(mockFile)).rejects.toThrow('Invalid JSON file');
  });

  it('handles file read errors', async () => {
    const mockFile = {
      name: 'test.json',
      type: 'application/json'
    } as File;

    // Mock FileReader to trigger error
    const originalFileReader = global.FileReader;
    global.FileReader = class {
      readAsText() {
        setTimeout(() => {
          if (this.onerror) {
            this.onerror(new Event('error'));
          }
        }, 0);
      }
      onerror: ((event: Event) => void) | null = null;
      onload: ((event: Event) => void) | null = null;
      result: string | ArrayBuffer | null = null;
    } as any;

    await expect(loadFromFile(mockFile)).rejects.toThrow('Failed to read file');

    global.FileReader = originalFileReader;
  });
});
