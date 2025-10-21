import { describe, it, expect } from 'vitest';
import { getStyleConfig, type StyleConfig } from '../../src/styles/styleConfig';
import { modernStyle } from '../../src/styles/modernStyle';
import { getMinimalistConfig } from '../../src/styles/minimalistStyle';
import { getProfessionalConfig } from '../../src/styles/professionalStyle';

describe('Style Config Factory', () => {
  describe('getStyleConfig', () => {
    it('returns modern style config when variant is "modern"', () => {
      const config = getStyleConfig('modern');
      expect(config).toBeDefined();
      expect(config).toBe(modernStyle);
    });

    it('returns minimalist style config when variant is "minimalist"', () => {
      const config = getStyleConfig('minimalist');
      expect(config).toBeDefined();
      expect(config).toEqual(getMinimalistConfig());
    });

    it('returns professional style config when variant is "professional"', () => {
      const config = getStyleConfig('professional');
      expect(config).toBeDefined();
      expect(config).toEqual(getProfessionalConfig());
    });

    it('returns modern style as default for unknown variants', () => {
      const config = getStyleConfig('unknown' as any);
      expect(config).toBe(modernStyle);
    });

    it('returns config with all required properties', () => {
      const config = getStyleConfig('modern');
      expect(config).toHaveProperty('colors');
      expect(config).toHaveProperty('typography');
      expect(config).toHaveProperty('layout');
      expect(config).toHaveProperty('visual');
    });
  });

  describe('Config Structure Validation', () => {
    const configs: Array<[string, StyleConfig]> = [
      ['modern', getStyleConfig('modern')],
      ['minimalist', getStyleConfig('minimalist')],
      ['professional', getStyleConfig('professional')],
    ];

    it.each(configs)('%s config has all required color properties', (name, config) => {
      expect(config.colors).toHaveProperty('textDark');
      expect(config.colors).toHaveProperty('textGrey');
      expect(config.colors).toHaveProperty('lightGrey');
      expect(config.colors).toHaveProperty('italicGrey');
      expect(config.colors).toHaveProperty('headerBackground');
      expect(config.colors).toHaveProperty('boxBackground');
      expect(config.colors).toHaveProperty('boxBorder');
      expect(config.colors).toHaveProperty('pillBackground');
      expect(config.colors).toHaveProperty('pillBorder');
    });

    it.each(configs)('%s config has all required typography properties', (name, config) => {
      expect(config.typography).toHaveProperty('nameSize');
      expect(config.typography).toHaveProperty('headerTitleSize');
      expect(config.typography).toHaveProperty('headerContactSize');
      expect(config.typography).toHaveProperty('sectionTitleSize');
      expect(config.typography).toHaveProperty('jobTitleSize');
      expect(config.typography).toHaveProperty('badgeSize');
      expect(config.typography).toHaveProperty('bodySize');
      expect(config.typography).toHaveProperty('responsibilitySize');
      expect(config.typography).toHaveProperty('smallSize');
      expect(config.typography).toHaveProperty('tinySize');
    });

    it.each(configs)('%s config has all required layout properties', (name, config) => {
      expect(config.layout).toHaveProperty('pageMargins');
      expect(config.layout).toHaveProperty('headerHeight');
      expect(config.layout).toHaveProperty('sectionSpacing');
      expect(config.layout).toHaveProperty('boxPadding');
      expect(config.layout).toHaveProperty('summaryTopMargin');
      expect(config.layout).toHaveProperty('skillsSpacing');
      expect(config.layout).toHaveProperty('workExperienceSpacing');
      expect(config.layout).toHaveProperty('educationPageThreshold');
      expect(config.layout).toHaveProperty('referencesTopSpacing');
      expect(config.layout).toHaveProperty('boxSpacing');
    });

    it.each(configs)('%s config has all required visual properties', (name, config) => {
      expect(config.visual).toHaveProperty('borderRadius');
      expect(config.visual).toHaveProperty('badgeBorderRadius');
      expect(config.visual).toHaveProperty('pillBorderRadius');
      expect(config.visual).toHaveProperty('thinLineWidth');
      expect(config.visual).toHaveProperty('thickLineWidth');
      expect(config.visual).toHaveProperty('useColoredHeader');
      expect(config.visual).toHaveProperty('badgeStyle');
    });

    it.each(configs)('%s config has valid RGB tuples for colors', (name, config) => {
      const validateRGB = (rgb: any) => {
        expect(Array.isArray(rgb)).toBe(true);
        expect(rgb.length).toBe(3);
        rgb.forEach((value: any) => {
          expect(typeof value).toBe('number');
          expect(value).toBeGreaterThanOrEqual(0);
          expect(value).toBeLessThanOrEqual(255);
        });
      };

      validateRGB(config.colors.textDark);
      validateRGB(config.colors.textGrey);
      validateRGB(config.colors.lightGrey);
      validateRGB(config.colors.italicGrey);
      validateRGB(config.colors.boxBackground);
      validateRGB(config.colors.boxBorder);
      validateRGB(config.colors.pillBackground);
      validateRGB(config.colors.pillBorder);
    });

    it.each(configs)('%s config has positive typography values', (name, config) => {
      Object.values(config.typography).forEach((value) => {
        expect(typeof value).toBe('number');
        expect(value).toBeGreaterThan(0);
      });
    });

    it.each(configs)('%s config has positive layout values', (name, config) => {
      Object.values(config.layout).forEach((value) => {
        expect(typeof value).toBe('number');
        expect(value).toBeGreaterThan(0);
      });
    });

    it.each(configs)('%s config has valid badge style', (name, config) => {
      expect(['filled', 'outlined']).toContain(config.visual.badgeStyle);
    });
  });
});

describe('Modern Style Config', () => {
  const config = modernStyle;

  describe('Visual Features', () => {
    it('has colored header enabled', () => {
      expect(config.visual.useColoredHeader).toBe(true);
    });

    it('uses outlined badge style', () => {
      expect(config.visual.badgeStyle).toBe('outlined');
    });

    it('has rounded corners with 2mm border radius', () => {
      expect(config.visual.borderRadius).toBe(2);
    });

    it('has rounded badge corners', () => {
      expect(config.visual.badgeBorderRadius).toBe(1.5);
    });

    it('has rounded pill corners', () => {
      expect(config.visual.pillBorderRadius).toBe(1);
    });
  });

  describe('Layout', () => {
    it('has 15mm page margins', () => {
      expect(config.layout.pageMargins).toBe(15);
    });

    it('has 42mm header height', () => {
      expect(config.layout.headerHeight).toBe(42);
    });

    it('has 4mm box padding', () => {
      expect(config.layout.boxPadding).toBe(4);
    });
  });

  describe('Typography', () => {
    it('has 24pt name size', () => {
      expect(config.typography.nameSize).toBe(24);
    });

    it('has 12pt section title size', () => {
      expect(config.typography.sectionTitleSize).toBe(12);
    });

    it('has 10.5pt job title size', () => {
      expect(config.typography.jobTitleSize).toBe(10.5);
    });
  });

  describe('Colors', () => {
    it('has null header background (uses dynamic theme color)', () => {
      expect(config.colors.headerBackground).toBeNull();
    });

    it('has light gray box background', () => {
      expect(config.colors.boxBackground).toEqual([249, 250, 251]);
    });

    it('has subtle box borders', () => {
      expect(config.colors.boxBorder).toEqual([229, 231, 235]);
    });
  });
});

describe('Minimalist Style Config', () => {
  const config = getMinimalistConfig();

  describe('Visual Features', () => {
    it('has colored header disabled', () => {
      expect(config.visual.useColoredHeader).toBe(false);
    });

    it('uses outlined badge style', () => {
      expect(config.visual.badgeStyle).toBe('outlined');
    });

    it('has sharp corners with 0mm border radius', () => {
      expect(config.visual.borderRadius).toBe(0);
    });

    it('has sharp badge corners', () => {
      expect(config.visual.badgeBorderRadius).toBe(0);
    });

    it('has sharp pill corners', () => {
      expect(config.visual.pillBorderRadius).toBe(0);
    });

    it('has thinner borders than modern style', () => {
      expect(config.visual.thinLineWidth).toBe(0.2);
      expect(config.visual.thinLineWidth).toBeLessThan(modernStyle.visual.thinLineWidth);
    });
  });

  describe('Layout', () => {
    it('has 18mm page margins (more white space than modern)', () => {
      expect(config.layout.pageMargins).toBe(18);
      expect(config.layout.pageMargins).toBeGreaterThan(modernStyle.layout.pageMargins);
    });

    it('has same header height as modern', () => {
      expect(config.layout.headerHeight).toBe(42);
      expect(config.layout.headerHeight).toBe(modernStyle.layout.headerHeight);
    });

    it('has less box padding than modern', () => {
      expect(config.layout.boxPadding).toBe(3);
      expect(config.layout.boxPadding).toBeLessThan(modernStyle.layout.boxPadding);
    });

    it('has more section spacing than modern', () => {
      expect(config.layout.sectionSpacing).toBe(10);
      expect(config.layout.sectionSpacing).toBeGreaterThan(modernStyle.layout.sectionSpacing);
    });
  });

  describe('Typography', () => {
    it('has 22pt name size (smaller than modern)', () => {
      expect(config.typography.nameSize).toBe(22);
      expect(config.typography.nameSize).toBeLessThan(modernStyle.typography.nameSize);
    });

    it('has 11pt section title size (smaller than modern)', () => {
      expect(config.typography.sectionTitleSize).toBe(11);
      expect(config.typography.sectionTitleSize).toBeLessThan(modernStyle.typography.sectionTitleSize);
    });

    it('has same job title size as modern', () => {
      expect(config.typography.jobTitleSize).toBe(10.5);
      expect(config.typography.jobTitleSize).toBe(modernStyle.typography.jobTitleSize);
    });
  });

  describe('Colors', () => {
    it('has null header background (white header)', () => {
      expect(config.colors.headerBackground).toBeNull();
    });

    it('has very light box background (almost white)', () => {
      expect(config.colors.boxBackground).toEqual([252, 252, 252]);
    });

    it('has darker borders than modern for definition', () => {
      expect(config.colors.boxBorder).toEqual([200, 200, 200]);
      // Modern has lighter borders [229, 231, 235]
      expect(config.colors.boxBorder[0]).toBeLessThan(modernStyle.colors.boxBorder[0]);
    });

    it('has pure white pill background', () => {
      expect(config.colors.pillBackground).toEqual([255, 255, 255]);
    });
  });
});

describe('Professional Style Config', () => {
  const config = getProfessionalConfig();

  describe('Visual Features', () => {
    it('has colored header disabled (white header)', () => {
      expect(config.visual.useColoredHeader).toBe(false);
    });

    it('uses filled badge style', () => {
      expect(config.visual.badgeStyle).toBe('filled');
    });

    it('has sharp corners with 0mm border radius', () => {
      expect(config.visual.borderRadius).toBe(0);
    });

    it('has sharp badge corners', () => {
      expect(config.visual.badgeBorderRadius).toBe(0);
    });

    it('has sharp pill corners', () => {
      expect(config.visual.pillBorderRadius).toBe(0);
    });

    it('has thicker borders than minimalist for professional appearance', () => {
      expect(config.visual.thinLineWidth).toBe(0.4);
      expect(config.visual.thinLineWidth).toBeGreaterThan(getMinimalistConfig().visual.thinLineWidth);
    });
  });

  describe('Layout', () => {
    it('has 20mm page margins (most generous of all styles)', () => {
      expect(config.layout.pageMargins).toBe(20);
      expect(config.layout.pageMargins).toBeGreaterThan(modernStyle.layout.pageMargins);
      expect(config.layout.pageMargins).toBeGreaterThan(getMinimalistConfig().layout.pageMargins);
    });

    it('has 45mm header height (ample space)', () => {
      expect(config.layout.headerHeight).toBe(45);
    });

    it('has 4.5mm box padding', () => {
      expect(config.layout.boxPadding).toBe(4.5);
    });

    it('has 11mm section spacing (clear separation)', () => {
      expect(config.layout.sectionSpacing).toBe(11);
    });
  });

  describe('Typography', () => {
    it('has 22pt name size (same as minimalist)', () => {
      expect(config.typography.nameSize).toBe(22);
    });

    it('has 11pt section title size', () => {
      expect(config.typography.sectionTitleSize).toBe(11);
    });

    it('has 10.5pt job title size', () => {
      expect(config.typography.jobTitleSize).toBe(10.5);
    });
  });

  describe('Colors', () => {
    it('has null header background (white header)', () => {
      expect(config.colors.headerBackground).toBeNull();
    });

    it('has very light slate box background', () => {
      expect(config.colors.boxBackground).toEqual([248, 250, 252]);
    });

    it('has navy blue pill borders for professional accent', () => {
      expect(config.colors.pillBorder).toEqual([30, 58, 138]);
    });

    it('has darker text than modern for professional appearance', () => {
      expect(config.colors.textDark).toEqual([30, 41, 59]);
      // Should be darker (lower RGB values)
      expect(config.colors.textDark[0]).toBeLessThan(modernStyle.colors.textDark[0]);
    });
  });
});

describe('Style Differentiation', () => {
  const modern = getStyleConfig('modern');
  const minimalist = getStyleConfig('minimalist');
  const professional = getStyleConfig('professional');

  it('all configs are different objects', () => {
    expect(modern).not.toBe(minimalist);
    expect(modern).not.toBe(professional);
    expect(minimalist).not.toBe(professional);
  });

  it('has different colored header settings', () => {
    expect(modern.visual.useColoredHeader).toBe(true);
    expect(minimalist.visual.useColoredHeader).toBe(false);
    expect(professional.visual.useColoredHeader).toBe(false);
  });

  it('has different badge styles', () => {
    expect(modern.visual.badgeStyle).toBe('outlined');
    expect(minimalist.visual.badgeStyle).toBe('outlined');
    expect(professional.visual.badgeStyle).toBe('filled');
  });

  it('has different border radius (rounded vs sharp)', () => {
    expect(modern.visual.borderRadius).toBe(2);
    expect(minimalist.visual.borderRadius).toBe(0);
    expect(professional.visual.borderRadius).toBe(0);
  });

  it('has different page margins (professional most generous)', () => {
    expect(modern.layout.pageMargins).toBe(15);
    expect(minimalist.layout.pageMargins).toBe(18);
    expect(professional.layout.pageMargins).toBe(20);
    expect(professional.layout.pageMargins).toBeGreaterThan(minimalist.layout.pageMargins);
    expect(minimalist.layout.pageMargins).toBeGreaterThan(modern.layout.pageMargins);
  });

  it('has different name sizes', () => {
    expect(modern.typography.nameSize).toBe(24);
    expect(minimalist.typography.nameSize).toBe(22);
    expect(professional.typography.nameSize).toBe(22);
  });

  it('has different box backgrounds', () => {
    expect(modern.colors.boxBackground).toEqual([249, 250, 251]);
    expect(minimalist.colors.boxBackground).toEqual([252, 252, 252]);
    expect(professional.colors.boxBackground).toEqual([248, 250, 252]);
  });

  it('has different border widths', () => {
    expect(modern.visual.thinLineWidth).toBe(0.3);
    expect(minimalist.visual.thinLineWidth).toBe(0.2);
    expect(professional.visual.thinLineWidth).toBe(0.4);
  });

  it('has different box padding', () => {
    expect(modern.layout.boxPadding).toBe(4);
    expect(minimalist.layout.boxPadding).toBe(3);
    expect(professional.layout.boxPadding).toBe(4.5);
  });
});
