import type { StyleConfig } from './styleConfig';

/**
 * Modern CV Style
 *
 * Features:
 * - Vibrant colored header with theme color
 * - Rounded corners on boxes and badges
 * - Light gray box backgrounds
 * - Outlined badges for dates/years
 * - Two-column layouts for skills, education, certifications
 * - Balanced white space with 15mm margins
 */
export const modernStyle: StyleConfig = {
  // Color Palette
  colors: {
    // Primary text for names, titles, and headings
    textDark: [45, 55, 72],

    // Secondary text for job titles and company names
    textGrey: [102, 102, 102],

    // Tertiary text for dates and metadata
    lightGrey: [85, 85, 85],

    // Italic text for roles and emphasis
    italicGrey: [136, 136, 136],

    // Header background uses dynamic theme color
    headerBackground: null,

    // Light background for experience/education boxes
    boxBackground: [249, 250, 251],

    // Subtle borders for boxes
    boxBorder: [229, 231, 235],

    // White background for skill/cert pills
    pillBackground: [255, 255, 255],

    // Light borders for pills
    pillBorder: [229, 231, 235],
  },

  // Typography Scale
  // Sizes in points (pt) - balanced hierarchy for readability
  typography: {
    // Name in header - largest text on page
    nameSize: 24,

    // Professional title below name
    headerTitleSize: 10,

    // Contact information in header
    headerContactSize: 9,

    // Section headings (Skills, Experience, etc.)
    sectionTitleSize: 12,

    // Job titles and degree names
    jobTitleSize: 10.5,

    // Date badges and year labels
    badgeSize: 9,

    // Standard body text for descriptions
    bodySize: 9,

    // Bullet points and responsibilities
    responsibilitySize: 8.5,

    // Minor details (locations, GPA)
    smallSize: 8,

    // Smallest text (footnotes, certifications)
    tinySize: 7.5,
  },

  // Layout & Spacing
  // All measurements in millimeters (mm) for print consistency
  layout: {
    // Page margins on all sides
    pageMargins: 15,

    // Height reserved for colored header section
    headerHeight: 42,

    // Vertical space between major sections
    sectionSpacing: 9,

    // Inner padding for experience/education boxes
    boxPadding: 4,

    // Top margin for summary section (below header)
    summaryTopMargin: 52,

    // Space between summary and skills section
    skillsSpacing: 10,

    // Space between skills and work experience
    workExperienceSpacing: 5,

    // Y-position threshold to trigger new page before education
    educationPageThreshold: 180,

    // Top spacing for references section
    referencesTopSpacing: 10,

    // Vertical gap between consecutive boxes
    boxSpacing: 5,
  },

  // Visual Styling
  visual: {
    // Corner radius for experience/education boxes
    borderRadius: 2,

    // Corner radius for date badges
    badgeBorderRadius: 1.5,

    // Corner radius for skill/cert pills
    pillBorderRadius: 1,

    // Line width for box borders and dividers
    thinLineWidth: 0.3,

    // Line width for section title underlines
    thickLineWidth: 0.5,

    // Enable colored header background
    useColoredHeader: true,

    // Badge rendering style (outlined = border only, filled = solid background)
    badgeStyle: 'outlined',
  },
};
