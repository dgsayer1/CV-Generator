import type { StyleConfig } from './styleConfig';

/**
 * Minimalist Modern CV Style
 *
 * Features:
 * - Clean white background throughout (no colored header)
 * - Sharp corners (0mm border radius) for modern minimalism
 * - Single dark accent color (#2d3748 - charcoal gray)
 * - Outlined badges instead of filled
 * - More white space (18mm margins)
 * - Thinner borders (0.2mm)
 * - Sans-serif only aesthetic
 * - Simple underlines instead of boxes where possible
 */
export function getMinimalistConfig(): StyleConfig {
  return {
    colors: {
      // Dark text colors
      textDark: [45, 55, 72],
      textGrey: [102, 102, 102],
      lightGrey: [85, 85, 85],
      italicGrey: [136, 136, 136],
      // No colored header background
      headerBackground: null,
      // Very light box backgrounds (almost white)
      boxBackground: [252, 252, 252],
      // Slightly darker borders for definition
      boxBorder: [200, 200, 200],
      // Pure white pill backgrounds
      pillBackground: [255, 255, 255],
      // Slightly darker pill borders
      pillBorder: [200, 200, 200],
    },
    typography: {
      // Slightly smaller for minimalism
      nameSize: 22,
      headerTitleSize: 10,
      headerContactSize: 9,
      sectionTitleSize: 11,
      jobTitleSize: 10.5,
      badgeSize: 9,
      bodySize: 9,
      responsibilitySize: 8.5,
      smallSize: 8,
      tinySize: 7.5,
    },
    layout: {
      pageMargins: 18,  // more white space than modern's 15
      headerHeight: 42,  // increased to add padding below contact details
      sectionSpacing: 10,  // more space than modern's 9
      boxPadding: 3,  // less padding than modern's 4
      summaryTopMargin: 46,  // reduced to tighten gap below header line
      skillsSpacing: 6,  // reduced from 10 to tighten gap above skills section
      workExperienceSpacing: 5,
      educationPageThreshold: 180,
      referencesTopSpacing: 10,
      boxSpacing: 5,
    },
    visual: {
      borderRadius: 0,  // sharp corners vs modern's 2mm
      badgeBorderRadius: 0,  // sharp badge corners
      pillBorderRadius: 0,  // sharp pill corners
      thinLineWidth: 0.2,  // thinner than modern's 0.3
      thickLineWidth: 0.5,
      useColoredHeader: false,  // white header instead of colored
      badgeStyle: 'outlined',  // outlined vs modern's filled
    },
  };
}
