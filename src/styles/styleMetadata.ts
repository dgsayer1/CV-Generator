import type { CVStyle } from '../types';

export interface StyleMetadata {
  id: CVStyle;
  displayName: string;
  description: string;
  thumbnail: string;
  tags: string[];
  recommendedFor: string[];
}

export const styleMetadata: Record<CVStyle, StyleMetadata> = {
  modern: {
    id: 'modern',
    displayName: 'Modern',
    description: 'Clean and contemporary design with colorful header and rounded corners. Perfect for tech and creative roles.',
    thumbnail: '/thumbnails/modern.svg',
    tags: ['colorful', 'rounded', 'contemporary'],
    recommendedFor: ['Software Engineer', 'Designer', 'Marketing Manager']
  },
  minimalist: {
    id: 'minimalist',
    displayName: 'Minimalist Modern',
    description: 'Sleek minimalist design with sharp lines and maximum white space. Ideal for design-conscious professionals.',
    thumbnail: '/thumbnails/minimalist.svg',
    tags: ['clean', 'minimal', 'sharp'],
    recommendedFor: ['Product Manager', 'Architect', 'Consultant']
  },
  professional: {
    id: 'professional',
    displayName: 'Professional',
    description: 'Traditional corporate design with conservative styling and generous spacing. Best for finance, legal, and executive roles.',
    thumbnail: '/thumbnails/professional.svg',
    tags: ['formal', 'traditional', 'corporate'],
    recommendedFor: ['Financial Analyst', 'Attorney', 'Healthcare Professional']
  },
  tech: {
    id: 'tech',
    displayName: 'Tech/Startup',
    description: 'Unique sidebar layout with contact and skills on the left, experience on the right. Modern design for tech roles.',
    thumbnail: '/thumbnails/tech.svg',
    tags: ['sidebar', 'modern', 'tech'],
    recommendedFor: ['Software Developer', 'Product Manager', 'Data Scientist']
  }
};

export function getStyleMetadata(id: CVStyle): StyleMetadata {
  return styleMetadata[id];
}

export function getAllStyleMetadata(): StyleMetadata[] {
  return Object.values(styleMetadata);
}
