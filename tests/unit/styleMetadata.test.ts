import { describe, it, expect } from 'vitest';
import {
  type StyleMetadata,
  styleMetadata,
  getStyleMetadata,
  getAllStyleMetadata
} from '../../src/styles/styleMetadata';
import type { CVStyle } from '../../src/types';

describe('Style Metadata', () => {
  describe('styleMetadata Record', () => {
    it('contains metadata for all CVStyle types', () => {
      expect(styleMetadata).toHaveProperty('modern');
      expect(styleMetadata).toHaveProperty('minimalist');
      expect(styleMetadata).toHaveProperty('professional');
      expect(styleMetadata).toHaveProperty('tech');
    });

    it('has complete metadata for modern style', () => {
      const modern = styleMetadata.modern;
      expect(modern.id).toBe('modern');
      expect(modern.displayName).toBeDefined();
      expect(modern.description).toBeDefined();
      expect(modern.thumbnail).toBeDefined();
      expect(modern.tags).toBeDefined();
      expect(modern.recommendedFor).toBeDefined();
    });

    it('has complete metadata for minimalist style', () => {
      const minimalist = styleMetadata.minimalist;
      expect(minimalist.id).toBe('minimalist');
      expect(minimalist.displayName).toBeDefined();
      expect(minimalist.description).toBeDefined();
      expect(minimalist.thumbnail).toBeDefined();
      expect(minimalist.tags).toBeDefined();
      expect(minimalist.recommendedFor).toBeDefined();
    });

    it('all styles have non-empty displayName', () => {
      Object.values(styleMetadata).forEach(metadata => {
        expect(metadata.displayName).toBeTruthy();
        expect(metadata.displayName.length).toBeGreaterThan(0);
        expect(typeof metadata.displayName).toBe('string');
      });
    });

    it('all styles have meaningful description', () => {
      Object.values(styleMetadata).forEach(metadata => {
        expect(metadata.description).toBeTruthy();
        expect(metadata.description.length).toBeGreaterThan(10);
        expect(typeof metadata.description).toBe('string');
      });
    });

    it('all styles have correctly formatted thumbnail paths', () => {
      Object.values(styleMetadata).forEach(metadata => {
        expect(metadata.thumbnail).toMatch(/^\/thumbnails\/[a-z]+\.svg$/);
        expect(metadata.thumbnail).toBeTruthy();
      });
    });

    it('all styles have non-empty tags array', () => {
      Object.values(styleMetadata).forEach(metadata => {
        expect(Array.isArray(metadata.tags)).toBe(true);
        expect(metadata.tags.length).toBeGreaterThan(0);
        metadata.tags.forEach(tag => {
          expect(typeof tag).toBe('string');
          expect(tag.length).toBeGreaterThan(0);
        });
      });
    });

    it('all styles have non-empty recommendedFor array', () => {
      Object.values(styleMetadata).forEach(metadata => {
        expect(Array.isArray(metadata.recommendedFor)).toBe(true);
        expect(metadata.recommendedFor.length).toBeGreaterThan(0);
        metadata.recommendedFor.forEach(role => {
          expect(typeof role).toBe('string');
          expect(role.length).toBeGreaterThan(0);
        });
      });
    });

    it('style IDs match their keys in the record', () => {
      Object.entries(styleMetadata).forEach(([key, metadata]) => {
        expect(metadata.id).toBe(key);
      });
    });

    it('modern style has expected structure', () => {
      const modern = styleMetadata.modern;
      expect(modern.id).toBe('modern');
      expect(modern.displayName).toBe('Modern');
      expect(modern.thumbnail).toBe('/thumbnails/modern.svg');
      expect(modern.tags).toContain('colorful');
      expect(modern.tags).toContain('rounded');
      expect(modern.tags).toContain('contemporary');
    });

    it('minimalist style has expected structure', () => {
      const minimalist = styleMetadata.minimalist;
      expect(minimalist.id).toBe('minimalist');
      expect(minimalist.displayName).toBe('Minimalist Modern');
      expect(minimalist.thumbnail).toBe('/thumbnails/minimalist.svg');
      expect(minimalist.tags).toContain('clean');
      expect(minimalist.tags).toContain('minimal');
      expect(minimalist.tags).toContain('sharp');
    });
  });

  describe('getStyleMetadata', () => {
    it('returns correct metadata for modern style', () => {
      const metadata = getStyleMetadata('modern');
      expect(metadata).toBeDefined();
      expect(metadata.id).toBe('modern');
      expect(metadata.displayName).toBe('Modern');
    });

    it('returns correct metadata for minimalist style', () => {
      const metadata = getStyleMetadata('minimalist');
      expect(metadata).toBeDefined();
      expect(metadata.id).toBe('minimalist');
      expect(metadata.displayName).toBe('Minimalist Modern');
    });

    it('returns complete StyleMetadata object', () => {
      const metadata = getStyleMetadata('modern');
      expect(metadata).toHaveProperty('id');
      expect(metadata).toHaveProperty('displayName');
      expect(metadata).toHaveProperty('description');
      expect(metadata).toHaveProperty('thumbnail');
      expect(metadata).toHaveProperty('tags');
      expect(metadata).toHaveProperty('recommendedFor');
    });

    it('returns object with correct types', () => {
      const metadata = getStyleMetadata('modern');
      expect(typeof metadata.id).toBe('string');
      expect(typeof metadata.displayName).toBe('string');
      expect(typeof metadata.description).toBe('string');
      expect(typeof metadata.thumbnail).toBe('string');
      expect(Array.isArray(metadata.tags)).toBe(true);
      expect(Array.isArray(metadata.recommendedFor)).toBe(true);
    });

    it('returns same reference as direct access', () => {
      const directAccess = styleMetadata.modern;
      const viaFunction = getStyleMetadata('modern');
      expect(viaFunction).toBe(directAccess);
    });
  });

  describe('getAllStyleMetadata', () => {
    it('returns array of all metadata', () => {
      const allMetadata = getAllStyleMetadata();
      expect(Array.isArray(allMetadata)).toBe(true);
      expect(allMetadata.length).toBe(4);
    });

    it('returned array contains modern metadata', () => {
      const allMetadata = getAllStyleMetadata();
      const modernExists = allMetadata.some(m => m.id === 'modern');
      expect(modernExists).toBe(true);
    });

    it('returned array contains minimalist metadata', () => {
      const allMetadata = getAllStyleMetadata();
      const minimalistExists = allMetadata.some(m => m.id === 'minimalist');
      expect(minimalistExists).toBe(true);
    });

    it('all items in array have complete metadata', () => {
      const allMetadata = getAllStyleMetadata();
      allMetadata.forEach(metadata => {
        expect(metadata).toHaveProperty('id');
        expect(metadata).toHaveProperty('displayName');
        expect(metadata).toHaveProperty('description');
        expect(metadata).toHaveProperty('thumbnail');
        expect(metadata).toHaveProperty('tags');
        expect(metadata).toHaveProperty('recommendedFor');
      });
    });

    it('returns metadata in consistent order', () => {
      const first = getAllStyleMetadata();
      const second = getAllStyleMetadata();
      expect(first.map(m => m.id)).toEqual(second.map(m => m.id));
    });

    it('all thumbnails have valid path format', () => {
      const allMetadata = getAllStyleMetadata();
      allMetadata.forEach(metadata => {
        expect(metadata.thumbnail).toMatch(/^\/thumbnails\/[a-z]+\.svg$/);
      });
    });

    it('all items have unique IDs', () => {
      const allMetadata = getAllStyleMetadata();
      const ids = allMetadata.map(m => m.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('all items have unique displayNames', () => {
      const allMetadata = getAllStyleMetadata();
      const names = allMetadata.map(m => m.displayName);
      const uniqueNames = new Set(names);
      expect(uniqueNames.size).toBe(names.length);
    });

    it('all items have at least 3 tags', () => {
      const allMetadata = getAllStyleMetadata();
      allMetadata.forEach(metadata => {
        expect(metadata.tags.length).toBeGreaterThanOrEqual(3);
      });
    });

    it('all items have at least 3 recommended roles', () => {
      const allMetadata = getAllStyleMetadata();
      allMetadata.forEach(metadata => {
        expect(metadata.recommendedFor.length).toBeGreaterThanOrEqual(3);
      });
    });
  });

  describe('Metadata Content Validation', () => {
    it('modern style has descriptive tags', () => {
      const modern = styleMetadata.modern;
      expect(modern.tags.length).toBeGreaterThan(0);
      modern.tags.forEach(tag => {
        expect(tag).toBeTruthy();
        expect(tag.length).toBeGreaterThan(2);
      });
    });

    it('minimalist style has descriptive tags', () => {
      const minimalist = styleMetadata.minimalist;
      expect(minimalist.tags.length).toBeGreaterThan(0);
      minimalist.tags.forEach(tag => {
        expect(tag).toBeTruthy();
        expect(tag.length).toBeGreaterThan(2);
      });
    });

    it('modern style has relevant job recommendations', () => {
      const modern = styleMetadata.modern;
      expect(modern.recommendedFor).toContain('Software Engineer');
      expect(modern.recommendedFor).toContain('Designer');
      expect(modern.recommendedFor).toContain('Marketing Manager');
    });

    it('minimalist style has relevant job recommendations', () => {
      const minimalist = styleMetadata.minimalist;
      expect(minimalist.recommendedFor).toContain('Product Manager');
      expect(minimalist.recommendedFor).toContain('Architect');
      expect(minimalist.recommendedFor).toContain('Consultant');
    });

    it('styles have distinct tags', () => {
      const modernTags = styleMetadata.modern.tags;
      const minimalistTags = styleMetadata.minimalist.tags;
      expect(modernTags).not.toEqual(minimalistTags);
    });

    it('styles have distinct recommendations', () => {
      const modernRecs = styleMetadata.modern.recommendedFor;
      const minimalistRecs = styleMetadata.minimalist.recommendedFor;
      expect(modernRecs).not.toEqual(minimalistRecs);
    });

    it('descriptions are sufficiently detailed', () => {
      Object.values(styleMetadata).forEach(metadata => {
        expect(metadata.description.length).toBeGreaterThan(50);
        expect(metadata.description).toMatch(/[.!?]$/);
      });
    });

    it('thumbnail paths correspond to style IDs', () => {
      Object.entries(styleMetadata).forEach(([key, metadata]) => {
        expect(metadata.thumbnail).toBe(`/thumbnails/${key}.svg`);
      });
    });
  });

  describe('Type Safety', () => {
    it('getStyleMetadata accepts valid CVStyle values', () => {
      const styles: CVStyle[] = ['modern', 'minimalist', 'professional', 'tech'];
      styles.forEach(style => {
        const metadata = getStyleMetadata(style);
        expect(metadata).toBeDefined();
        expect(metadata.id).toBe(style);
      });
    });

    it('returns StyleMetadata with correct shape', () => {
      const metadata = getStyleMetadata('modern');
      const keys = Object.keys(metadata);
      expect(keys).toEqual([
        'id',
        'displayName',
        'description',
        'thumbnail',
        'tags',
        'recommendedFor'
      ]);
    });
  });
});
