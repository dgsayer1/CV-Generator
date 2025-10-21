import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { saveData, loadData, clearData } from '../../src/persistence';
import type { CVData, CVStyle } from '../../src/types';

const STORAGE_KEY = 'cv-generator-data';
const CURRENT_VERSION = '1.0';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: vi.fn((index: number) => Object.keys(store)[index] || null)
  };
})();

describe('Persistence', () => {
  const mockCVData: CVData = {
    personal: {
      name: 'John Doe',
      title: 'Software Engineer',
      phone: '+1234567890',
      email: 'john@example.com',
      location: 'San Francisco, CA',
      summary: 'Experienced software engineer'
    },
    skills: {
      'Languages': ['TypeScript', 'Python'],
      'Frameworks': ['React', 'Node.js']
    },
    jobs: [
      {
        title: 'Senior Developer',
        dates: 'Jan 2020 - Present',
        company: 'Tech Corp',
        location: 'San Francisco',
        responsibilities: ['Built features', 'Led team']
      }
    ],
    education: [
      {
        degree: 'BS Computer Science',
        years: '2015-2019',
        institution: 'University of Tech'
      }
    ],
    certifications: ['AWS Certified', 'Scrum Master'],
    references: [
      { name: 'Jane Smith', title: 'Manager', company: 'Tech Corp' },
      { name: 'Bob Johnson', title: 'Director', company: 'Other Corp' }
    ],
    cvStyle: 'modern',
    themeColor: '#667eea',
    fontFamily: 'helvetica'
  };

  beforeEach(() => {
    vi.stubGlobal('localStorage', localStorageMock);
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('saveData', () => {
    it('stores data in localStorage with correct key', () => {
      saveData(mockCVData, 'modern');
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        STORAGE_KEY,
        expect.any(String)
      );
    });

    it('stores data with current version', () => {
      saveData(mockCVData, 'modern');
      const stored = localStorageMock.getItem(STORAGE_KEY);
      const parsed = JSON.parse(stored!);
      expect(parsed.version).toBe(CURRENT_VERSION);
    });

    it('stores cvData correctly', () => {
      saveData(mockCVData, 'modern');
      const stored = localStorageMock.getItem(STORAGE_KEY);
      const parsed = JSON.parse(stored!);
      expect(parsed.cvData).toEqual(mockCVData);
    });

    it('stores selectedStyle correctly', () => {
      saveData(mockCVData, 'minimalist');
      const stored = localStorageMock.getItem(STORAGE_KEY);
      const parsed = JSON.parse(stored!);
      expect(parsed.selectedStyle).toBe('minimalist');
    });

    it('stores complete persisted data structure', () => {
      saveData(mockCVData, 'modern');
      const stored = localStorageMock.getItem(STORAGE_KEY);
      const parsed = JSON.parse(stored!);
      expect(parsed).toHaveProperty('version');
      expect(parsed).toHaveProperty('selectedStyle');
      expect(parsed).toHaveProperty('cvData');
    });

    it('handles different CVStyle values', () => {
      const styles: CVStyle[] = ['modern', 'minimalist'];
      styles.forEach(style => {
        localStorageMock.clear();
        saveData(mockCVData, style);
        const stored = localStorageMock.getItem(STORAGE_KEY);
        const parsed = JSON.parse(stored!);
        expect(parsed.selectedStyle).toBe(style);
      });
    });

    it('overwrites existing data', () => {
      saveData(mockCVData, 'modern');
      const modifiedData = { ...mockCVData, personal: { ...mockCVData.personal, name: 'Jane Doe' } };
      saveData(modifiedData, 'minimalist');

      const stored = localStorageMock.getItem(STORAGE_KEY);
      const parsed = JSON.parse(stored!);
      expect(parsed.cvData.personal.name).toBe('Jane Doe');
      expect(parsed.selectedStyle).toBe('minimalist');
    });

    it('handles localStorage.setItem error gracefully', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      localStorageMock.setItem.mockImplementationOnce(() => {
        throw new Error('QuotaExceededError');
      });

      expect(() => saveData(mockCVData, 'modern')).not.toThrow();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to save data to localStorage:',
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });

    it('serializes complex data structures correctly', () => {
      saveData(mockCVData, 'modern');
      const stored = localStorageMock.getItem(STORAGE_KEY);
      const parsed = JSON.parse(stored!);

      expect(parsed.cvData.skills).toEqual(mockCVData.skills);
      expect(parsed.cvData.jobs).toEqual(mockCVData.jobs);
      expect(parsed.cvData.education).toEqual(mockCVData.education);
      expect(parsed.cvData.certifications).toEqual(mockCVData.certifications);
      expect(parsed.cvData.references).toEqual(mockCVData.references);
    });
  });

  describe('loadData', () => {
    it('returns null when no data exists in localStorage', () => {
      const result = loadData();
      expect(result).toBeNull();
    });

    it('returns null when localStorage is empty', () => {
      localStorageMock.clear();
      const result = loadData();
      expect(result).toBeNull();
    });

    it('returns stored data when valid data exists', () => {
      saveData(mockCVData, 'modern');
      const result = loadData();

      expect(result).not.toBeNull();
      expect(result!.cvData).toEqual(mockCVData);
      expect(result!.selectedStyle).toBe('modern');
    });

    it('returns correct structure with cvData and selectedStyle', () => {
      saveData(mockCVData, 'minimalist');
      const result = loadData();

      expect(result).toHaveProperty('cvData');
      expect(result).toHaveProperty('selectedStyle');
      expect(Object.keys(result!)).toEqual(['cvData', 'selectedStyle']);
    });

    it('handles corrupted JSON gracefully', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      localStorageMock.setItem(STORAGE_KEY, 'invalid json {{{');

      const result = loadData();
      expect(result).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to load data from localStorage:',
        expect.any(Error)
      );
      expect(localStorageMock.removeItem).toHaveBeenCalledWith(STORAGE_KEY);

      consoleErrorSpy.mockRestore();
    });

    it('clears data and returns null for version mismatch', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const oldVersionData = {
        version: '0.9',
        selectedStyle: 'modern',
        cvData: mockCVData
      };
      localStorageMock.setItem(STORAGE_KEY, JSON.stringify(oldVersionData));

      const result = loadData();
      expect(result).toBeNull();
      expect(consoleWarnSpy).toHaveBeenCalledWith('Data version mismatch. Clearing old data.');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith(STORAGE_KEY);

      consoleWarnSpy.mockRestore();
    });

    it('validates version is exactly "1.0"', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const futureVersionData = {
        version: '2.0',
        selectedStyle: 'modern',
        cvData: mockCVData
      };
      localStorageMock.setItem(STORAGE_KEY, JSON.stringify(futureVersionData));

      const result = loadData();
      expect(result).toBeNull();
      expect(consoleWarnSpy).toHaveBeenCalled();

      consoleWarnSpy.mockRestore();
    });

    it('loads modern style correctly', () => {
      saveData(mockCVData, 'modern');
      const result = loadData();
      expect(result!.selectedStyle).toBe('modern');
    });

    it('loads minimalist style correctly', () => {
      saveData(mockCVData, 'minimalist');
      const result = loadData();
      expect(result!.selectedStyle).toBe('minimalist');
    });

    it('preserves all cvData fields', () => {
      saveData(mockCVData, 'modern');
      const result = loadData();

      expect(result!.cvData.personal).toEqual(mockCVData.personal);
      expect(result!.cvData.skills).toEqual(mockCVData.skills);
      expect(result!.cvData.jobs).toEqual(mockCVData.jobs);
      expect(result!.cvData.education).toEqual(mockCVData.education);
      expect(result!.cvData.certifications).toEqual(mockCVData.certifications);
      expect(result!.cvData.references).toEqual(mockCVData.references);
      expect(result!.cvData.cvStyle).toEqual(mockCVData.cvStyle);
      expect(result!.cvData.themeColor).toEqual(mockCVData.themeColor);
      expect(result!.cvData.fontFamily).toEqual(mockCVData.fontFamily);
    });

    it('handles localStorage.getItem error gracefully', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      localStorageMock.getItem.mockImplementationOnce(() => {
        throw new Error('Storage access denied');
      });

      const result = loadData();
      expect(result).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to load data from localStorage:',
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });

    it('calls clearData when JSON parsing fails', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      localStorageMock.setItem(STORAGE_KEY, '{invalid}');

      loadData();
      expect(localStorageMock.removeItem).toHaveBeenCalledWith(STORAGE_KEY);

      consoleErrorSpy.mockRestore();
    });
  });

  describe('clearData', () => {
    it('removes data from localStorage', () => {
      saveData(mockCVData, 'modern');
      clearData();
      expect(localStorageMock.removeItem).toHaveBeenCalledWith(STORAGE_KEY);
    });

    it('removes data using correct key', () => {
      saveData(mockCVData, 'modern');
      clearData();
      const stored = localStorageMock.getItem(STORAGE_KEY);
      expect(stored).toBeNull();
    });

    it('works when no data exists', () => {
      expect(() => clearData()).not.toThrow();
      expect(localStorageMock.removeItem).toHaveBeenCalledWith(STORAGE_KEY);
    });

    it('makes loadData return null after clearing', () => {
      saveData(mockCVData, 'modern');
      clearData();
      const result = loadData();
      expect(result).toBeNull();
    });

    it('handles localStorage.removeItem error gracefully', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      localStorageMock.removeItem.mockImplementationOnce(() => {
        throw new Error('Storage access denied');
      });

      expect(() => clearData()).not.toThrow();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to clear localStorage:',
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });

    it('can be called multiple times safely', () => {
      saveData(mockCVData, 'modern');
      clearData();
      clearData();
      clearData();
      expect(localStorageMock.removeItem).toHaveBeenCalledTimes(3);
    });
  });

  describe('Data Persistence Flow', () => {
    it('supports save-load-clear cycle', () => {
      saveData(mockCVData, 'modern');
      const loaded = loadData();
      expect(loaded).not.toBeNull();

      clearData();
      const afterClear = loadData();
      expect(afterClear).toBeNull();
    });

    it('supports multiple save-load cycles', () => {
      saveData(mockCVData, 'modern');
      const first = loadData();
      expect(first!.selectedStyle).toBe('modern');

      saveData(mockCVData, 'minimalist');
      const second = loadData();
      expect(second!.selectedStyle).toBe('minimalist');
    });

    it('preserves data integrity across save-load', () => {
      const originalData = JSON.parse(JSON.stringify(mockCVData));
      saveData(mockCVData, 'modern');
      const loaded = loadData();

      expect(loaded!.cvData).toEqual(originalData);
    });
  });

  describe('Version Management', () => {
    it('uses version "1.0"', () => {
      saveData(mockCVData, 'modern');
      const stored = localStorageMock.getItem(STORAGE_KEY);
      const parsed = JSON.parse(stored!);
      expect(parsed.version).toBe('1.0');
    });

    it('rejects data with no version field', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const noVersionData = {
        selectedStyle: 'modern',
        cvData: mockCVData
      };
      localStorageMock.setItem(STORAGE_KEY, JSON.stringify(noVersionData));

      const result = loadData();
      expect(result).toBeNull();

      consoleWarnSpy.mockRestore();
    });

    it('rejects data with empty version', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const emptyVersionData = {
        version: '',
        selectedStyle: 'modern',
        cvData: mockCVData
      };
      localStorageMock.setItem(STORAGE_KEY, JSON.stringify(emptyVersionData));

      const result = loadData();
      expect(result).toBeNull();

      consoleWarnSpy.mockRestore();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty cvData object', () => {
      const emptyCVData = {
        personal: { name: '', title: '', phone: '', email: '', location: '', summary: '' },
        skills: {},
        jobs: [],
        education: [],
        certifications: [],
        references: [
          { name: '', title: '', company: '' },
          { name: '', title: '', company: '' }
        ],
        cvStyle: 'modern' as CVStyle,
        themeColor: '',
        fontFamily: 'helvetica' as const
      };

      saveData(emptyCVData, 'modern');
      const result = loadData();
      expect(result!.cvData).toEqual(emptyCVData);
    });

    it('handles large data structures', () => {
      const largeData = {
        ...mockCVData,
        jobs: Array(50).fill(mockCVData.jobs[0]),
        certifications: Array(100).fill('Certification'),
        skills: {
          'Category1': Array(20).fill('Skill'),
          'Category2': Array(20).fill('Skill'),
          'Category3': Array(20).fill('Skill')
        }
      };

      saveData(largeData, 'modern');
      const result = loadData();
      expect(result!.cvData.jobs.length).toBe(50);
      expect(result!.cvData.certifications.length).toBe(100);
    });

    it('handles special characters in data', () => {
      const specialCharData = {
        ...mockCVData,
        personal: {
          ...mockCVData.personal,
          name: 'José García-López',
          summary: 'Expert in "AI" & <ML> with 10+ years\' experience'
        }
      };

      saveData(specialCharData, 'modern');
      const result = loadData();
      expect(result!.cvData.personal.name).toBe('José García-López');
      expect(result!.cvData.personal.summary).toBe('Expert in "AI" & <ML> with 10+ years\' experience');
    });
  });
});
