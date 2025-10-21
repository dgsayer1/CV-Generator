import type { CVStyle } from '../types';
import { modernStyle } from './modernStyle';
import { getMinimalistConfig } from './minimalistStyle';
import { getProfessionalConfig } from './professionalStyle';
import { techStyle } from './techStyle';

type RGB = [number, number, number];

export interface StyleConfig {
  // Colors
  colors: {
    textDark: RGB;
    textGrey: RGB;
    lightGrey: RGB;
    italicGrey: RGB;
    headerBackground?: RGB | null;  // Optional - uses themeColor if not defined
    boxBackground?: RGB;  // Optional - generated from theme color for tech style
    boxBorder?: RGB;  // Optional - generated from theme color for tech style
    pillBackground: RGB;
    pillBorder?: RGB;  // Optional - generated from theme color for tech style
  };

  // Typography
  typography: {
    nameSize: number;
    headerTitleSize: number;
    headerContactSize: number;
    sectionTitleSize: number;
    jobTitleSize: number;
    badgeSize: number;
    bodySize: number;
    responsibilitySize: number;
    smallSize: number;
    tinySize: number;
  };

  // Layout & Spacing
  layout: {
    pageMargins: number;  // mm
    headerHeight: number;  // mm
    sectionSpacing: number;  // mm
    boxPadding: number;  // mm
    summaryTopMargin: number;  // mm from header
    skillsSpacing: number;  // mm between skills and summary
    workExperienceSpacing: number;  // mm between work and skills
    educationPageThreshold: number;  // mm - trigger new page
    referencesTopSpacing: number;  // mm
    boxSpacing: number;  // mm between boxes
    // Sidebar layout (optional - only for tech style)
    sidebarWidth?: number;  // mm - width of left sidebar
    sidebarStartY?: number;  // mm - Y position where sidebar starts
    mainContentX?: number;  // mm - X position where main content starts
  };

  // Visual Style
  visual: {
    borderRadius: number;  // mm (0 for sharp corners)
    badgeBorderRadius: number;  // mm
    pillBorderRadius: number;  // mm
    thinLineWidth: number;  // line width for borders
    thickLineWidth: number;  // line width for section dividers
    useColoredHeader: boolean;  // false for minimalist
    badgeStyle: 'filled' | 'outlined';
  };
}

export function getStyleConfig(variant: CVStyle): StyleConfig {
  switch (variant) {
    case 'modern':
      return modernStyle;
    case 'minimalist':
      return getMinimalistConfig();
    case 'professional':
      return getProfessionalConfig();
    case 'tech':
      return techStyle;
    default:
      return modernStyle;
  }
}
