import type { StyleConfig } from './styleConfig';

/**
 * Professional CV Style
 *
 * Features:
 * - Traditional corporate aesthetic for conservative industries
 * - Sharp, clean lines with no rounded corners
 * - Navy blue and gray color palette
 * - Filled badges for dates (more formal appearance)
 * - Generous margins and spacing for readability
 * - White header (no colored background)
 * - Serif-friendly typography (works with Times or Georgia)
 * - Suitable for finance, legal, healthcare, and executive roles
 */
export function getProfessionalConfig(): StyleConfig {
  return {
    colors: {
      // Darker text for professional appearance
      textDark: [30, 41, 59],      // Slate 800
      textGrey: [71, 85, 105],     // Slate 600
      lightGrey: [100, 116, 139],  // Slate 500
      italicGrey: [148, 163, 184], // Slate 400
      // No colored header (white background)
      headerBackground: null,
      // Very light gray boxes (subtle)
      boxBackground: [248, 250, 252],  // Slate 50
      // Darker borders for definition
      boxBorder: [203, 213, 225],      // Slate 300
      // White pill backgrounds
      pillBackground: [255, 255, 255],
      // Navy blue pill borders for professional accent
      pillBorder: [30, 58, 138],       // Blue 900
    },
    typography: {
      // Conservative, traditional sizing
      nameSize: 22,
      headerTitleSize: 10.5,
      headerContactSize: 9,
      sectionTitleSize: 11,
      jobTitleSize: 10.5,
      badgeSize: 8.5,
      bodySize: 9.5,
      responsibilitySize: 9,
      smallSize: 8.5,
      tinySize: 8,
    },
    layout: {
      pageMargins: 20,  // generous margins for formal appearance
      headerHeight: 45,  // ample space for header
      sectionSpacing: 11,  // clear separation between sections
      boxPadding: 4.5,  // comfortable padding
      summaryTopMargin: 50,
      skillsSpacing: 8,
      workExperienceSpacing: 6,
      educationPageThreshold: 175,
      referencesTopSpacing: 12,
      boxSpacing: 6,
    },
    visual: {
      borderRadius: 0,  // sharp corners for traditional look
      badgeBorderRadius: 0,  // sharp badge corners
      pillBorderRadius: 0,  // sharp pill corners
      thinLineWidth: 0.4,  // slightly thicker borders
      thickLineWidth: 0.8,  // prominent section dividers
      useColoredHeader: false,  // white header
      badgeStyle: 'filled',  // filled badges for formal appearance
    },
  };
}
