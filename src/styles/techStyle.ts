import type { StyleConfig } from './styleConfig';

/**
 * Tech/Startup CV Style
 *
 * Features:
 * - Sidebar layout: Left column (contact, skills) + Right column (experience, education)
 * - Vibrant teal accents throughout
 * - Modern sans-serif typography
 * - Compact header without colored background
 * - Clean, startup-inspired design
 * - Horizontal skill pills in sidebar
 */
export const techStyle: StyleConfig = {
  // Color Palette
  colors: {
    // Primary text - dark slate
    textDark: [30, 41, 59],

    // Secondary text - medium grey
    textGrey: [100, 116, 139],

    // Tertiary text for dates
    lightGrey: [71, 85, 105],

    // Italic text
    italicGrey: [148, 163, 184],

    // White background for skill pills
    pillBackground: [255, 255, 255],

    // Note: Header, sidebar, and border colors use theme color from picker
    // boxBackground and pillBorder are dynamically generated as faded versions
  },

  // Typography Scale
  typography: {
    // Name in header
    nameSize: 26,

    // Professional title
    headerTitleSize: 11,

    // Contact info
    headerContactSize: 9.5,

    // Section headings
    sectionTitleSize: 13,

    // Job titles
    jobTitleSize: 11,

    // Date badges
    badgeSize: 9,

    // Body text
    bodySize: 9.5,

    // Responsibilities
    responsibilitySize: 9,

    // Small details
    smallSize: 8.5,

    // Tiny text
    tinySize: 8,
  },

  // Layout & Spacing (Sidebar layout)
  layout: {
    // Page margins
    pageMargins: 12,

    // Header height (teal banner across top)
    headerHeight: 40,

    // Sidebar width (left column)
    sidebarWidth: 60,

    // Sidebar starts at this Y position (below header)
    sidebarStartY: 50,

    // Main content starts at this X position (sidebar width + gap)
    mainContentX: 80,

    // Section spacing
    sectionSpacing: 7,

    // Box padding
    boxPadding: 4,

    // Summary top margin (main content area)
    summaryTopMargin: 50,

    // Skills spacing (in sidebar)
    skillsSpacing: 8,

    // Work experience spacing
    workExperienceSpacing: 5,

    // Education page threshold
    educationPageThreshold: 200,

    // References top spacing
    referencesTopSpacing: 8,

    // Box spacing
    boxSpacing: 5,
  },

  // Visual Styling
  visual: {
    // Border radius for boxes
    borderRadius: 2,

    // Badge border radius
    badgeBorderRadius: 1.5,

    // Pill border radius
    pillBorderRadius: 2,

    // Thin line width
    thinLineWidth: 0.5,

    // Thick line width
    thickLineWidth: 0.8,

    // Teal header banner
    useColoredHeader: true,

    // Outlined badges
    badgeStyle: 'outlined',
  },
};
