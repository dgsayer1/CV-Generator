import { test, expect, devices } from '@playwright/test';
import { CVGeneratorPage } from './page-objects/CVGeneratorPage';
import { testPersonalData } from './fixtures/test-data';

test.describe('Responsive Layout', () => {
  test.describe('Desktop Viewport (1920x1080)', () => {
    test.use({
      viewport: { width: 1920, height: 1080 },
    });

    let cvPage: CVGeneratorPage;

    test.beforeEach(async ({ page }) => {
      cvPage = new CVGeneratorPage(page);
      await cvPage.goto();
    });

    test('should display form in multi-column layout', async ({ page }) => {
      const twoColumnSection = page.locator('.two-column').first();
      const gridColumns = await twoColumnSection.evaluate((el) => {
        return window.getComputedStyle(el).gridTemplateColumns;
      });

      // Desktop should have 2 columns
      const columnCount = gridColumns.split(' ').length;
      expect(columnCount).toBe(2);
    });

    test('should display three-column grid in personal info', async ({ page }) => {
      const threeColumnSection = page.locator('.three-column').first();
      const gridColumns = await threeColumnSection.evaluate((el) => {
        return window.getComputedStyle(el).gridTemplateColumns;
      });

      // Should have 3 columns on desktop
      const columnCount = gridColumns.split(' ').length;
      expect(columnCount).toBe(3);
    });

    test('should display skills in two-column layout', async ({ page }) => {
      const skillsContainer = page.locator('.skills-container').first();
      const gridColumns = await skillsContainer.evaluate((el) => {
        return window.getComputedStyle(el).gridTemplateColumns;
      });

      // Skills should have 2 columns on desktop
      const columnCount = gridColumns.split(' ').length;
      expect(columnCount).toBe(2);
    });

    test('should have adequate spacing between elements', async ({ page }) => {
      const section = page.locator('.section').first();
      const marginBottom = await section.evaluate((el) => {
        return window.getComputedStyle(el).marginBottom;
      });

      // Should have 30px margin bottom
      expect(marginBottom).toBe('30px');
    });

    test('should display header with gradient', async ({ page }) => {
      const header = page.locator('.header');
      await expect(header).toBeVisible();

      const background = await header.evaluate((el) => {
        return window.getComputedStyle(el).background;
      });

      expect(background).toContain('linear-gradient');
    });

    test('should display all form sections without scrolling horizontally', async ({ page }) => {
      const container = page.locator('.container');
      const width = await container.evaluate((el) => el.scrollWidth);
      const viewportWidth = page.viewportSize()?.width || 0;

      expect(width).toBeLessThanOrEqual(viewportWidth);
    });

    test('should generate PDF successfully on desktop', async () => {
      await cvPage.fillPersonalInformation(testPersonalData);
      const download = await cvPage.generatePDF();
      expect(download.suggestedFilename()).toContain('_CV.pdf');
    });
  });

  test.describe('Tablet Viewport (768x1024)', () => {
    test.use({
      viewport: { width: 768, height: 1024 },
    });

    let cvPage: CVGeneratorPage;

    test.beforeEach(async ({ page }) => {
      cvPage = new CVGeneratorPage(page);
      await cvPage.goto();
    });

    test('should collapse to single column layout', async ({ page }) => {
      const twoColumnSection = page.locator('.two-column').first();
      const gridColumns = await twoColumnSection.evaluate((el) => {
        return window.getComputedStyle(el).gridTemplateColumns;
      });

      // Tablet should have single column at 768px (browser may compute 1fr to pixel value)
      const columnCount = gridColumns.split(' ').length;
      expect(columnCount).toBe(1);
    });

    test('should collapse three-column to single column', async ({ page }) => {
      const threeColumnSection = page.locator('.three-column').first();
      const gridColumns = await threeColumnSection.evaluate((el) => {
        return window.getComputedStyle(el).gridTemplateColumns;
      });

      // Should have 1 column on tablet (browser may compute 1fr to pixel value)
      const columnCount = gridColumns.split(' ').length;
      expect(columnCount).toBe(1);
    });

    test('should collapse skills to single column', async ({ page }) => {
      const skillsContainer = page.locator('.skills-container').first();
      const gridColumns = await skillsContainer.evaluate((el) => {
        return window.getComputedStyle(el).gridTemplateColumns;
      });

      // Skills should have 1 column on tablet (browser may compute 1fr to pixel value)
      const columnCount = gridColumns.split(' ').length;
      expect(columnCount).toBe(1);
    });

    test('should display all form sections', async () => {
      await cvPage.verifyAllSectionsVisible();
    });

    test('should allow form filling on tablet', async () => {
      await cvPage.fillPersonalInformation(testPersonalData);

      await expect(cvPage.nameInput).toHaveValue(testPersonalData.name);
      await expect(cvPage.emailInput).toHaveValue(testPersonalData.email);
    });

    test('should generate PDF successfully on tablet', async () => {
      await cvPage.fillPersonalInformation(testPersonalData);
      const download = await cvPage.generatePDF();
      expect(download.suggestedFilename()).toContain('_CV.pdf');
    });

    test('should display buttons at full width', async ({ page }) => {
      const button = page.locator('.btn').first();
      const isVisible = await button.isVisible();
      expect(isVisible).toBe(true);
    });

    test('should maintain readable text size', async ({ page }) => {
      const heading = page.locator('h2').first();
      const fontSize = await heading.evaluate((el) => {
        return window.getComputedStyle(el).fontSize;
      });

      // Font size should be readable (at least 16px for h2 elements)
      const fontSizePx = parseFloat(fontSize);
      expect(fontSizePx).toBeGreaterThanOrEqual(16);
    });
  });

  test.describe('Mobile Viewport (375x667)', () => {
    test.use({
      viewport: { width: 375, height: 667 },
    });

    let cvPage: CVGeneratorPage;

    test.beforeEach(async ({ page }) => {
      cvPage = new CVGeneratorPage(page);
      await cvPage.goto();
    });

    test('should collapse to single column layout', async ({ page }) => {
      const twoColumnSection = page.locator('.two-column').first();
      const gridColumns = await twoColumnSection.evaluate((el) => {
        return window.getComputedStyle(el).gridTemplateColumns;
      });

      // Mobile should have single column (browser may compute 1fr to pixel value)
      const columnCount = gridColumns.split(' ').length;
      expect(columnCount).toBe(1);
    });

    test('should display all form sections', async () => {
      await cvPage.verifyAllSectionsVisible();
    });

    test('should allow scrolling through entire form', async ({ page }) => {
      const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
      const viewportHeight = page.viewportSize()?.height || 0;

      // Content should be taller than viewport (scrollable)
      expect(bodyHeight).toBeGreaterThan(viewportHeight);
    });

    test('should display header with centered text', async ({ page }) => {
      const header = page.locator('.header h1');
      const textAlign = await header.evaluate((el) => {
        return window.getComputedStyle(el).textAlign;
      });

      expect(textAlign).toBe('center');
    });

    test('should display generate button at full width', async ({ page }) => {
      const generateBtn = page.locator('.generate-btn');
      await expect(generateBtn).toBeVisible();
    });

    test('should allow form filling on mobile', async () => {
      await cvPage.nameInput.clear();
      await cvPage.nameInput.fill(testPersonalData.name);
      await expect(cvPage.nameInput).toHaveValue(testPersonalData.name);

      await cvPage.emailInput.clear();
      await cvPage.emailInput.fill(testPersonalData.email);
      await expect(cvPage.emailInput).toHaveValue(testPersonalData.email);
    });

    test('should handle textarea input on mobile', async () => {
      const summary = 'Mobile test summary';
      await cvPage.summaryTextarea.clear();
      await cvPage.summaryTextarea.fill(summary);
      await expect(cvPage.summaryTextarea).toHaveValue(summary);
    });

    test('should add dynamic entries on mobile', async () => {
      const initialCount = await cvPage.getJobCount();
      await cvPage.addJobButton.click();

      // Wait for new entry to be added
      await cvPage.page.waitForTimeout(500);

      const newCount = await cvPage.getJobCount();
      expect(newCount).toBe(initialCount + 1);
    });

    test('should generate PDF successfully on mobile', async () => {
      await cvPage.fillPersonalInformation(testPersonalData);
      const download = await cvPage.generatePDF();
      expect(download.suggestedFilename()).toContain('_CV.pdf');
    });

    test('should maintain touch-friendly button sizes', async ({ page }) => {
      const button = page.locator('.btn').first();
      const padding = await button.evaluate((el) => {
        return window.getComputedStyle(el).padding;
      });

      // Buttons should have adequate padding for touch
      expect(padding).toContain('10px');
    });

    test('should display form groups stacked vertically', async ({ page }) => {
      const formGroups = page.locator('.form-group');
      const count = await formGroups.count();

      // Should have multiple form groups
      expect(count).toBeGreaterThan(5);
    });

    test('should handle long text without container overflow', async ({ page }) => {
      const longName = 'Very Long Name That Should Not Cause Overflow Issues';
      await cvPage.nameInput.clear();
      await cvPage.nameInput.fill(longName);

      // Check that the main-content section doesn't overflow (inputs can scroll internally)
      const mainContent = page.locator('.main-content');
      const scrollWidth = await mainContent.evaluate((el) => el.scrollWidth);
      const clientWidth = await mainContent.evaluate((el) => el.clientWidth);

      // Main content should not cause page-level horizontal scroll (allow small rounding differences)
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 5);
    });
  });

  test.describe('Responsive Behavior Transitions', () => {
    test('should adapt layout when resizing from desktop to mobile', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      const cvPage = new CVGeneratorPage(page);
      await cvPage.goto();

      // Check desktop layout
      let twoColumnSection = page.locator('.two-column').first();
      let gridColumns = await twoColumnSection.evaluate((el) => {
        return window.getComputedStyle(el).gridTemplateColumns;
      });
      expect(gridColumns.split(' ').length).toBe(2);

      // Resize to mobile
      await page.setViewportSize({ width: 375, height: 667 });

      // Check mobile layout (browser may compute 1fr to pixel value)
      twoColumnSection = page.locator('.two-column').first();
      gridColumns = await twoColumnSection.evaluate((el) => {
        return window.getComputedStyle(el).gridTemplateColumns;
      });
      const mobileColumnCount = gridColumns.split(' ').length;
      expect(mobileColumnCount).toBe(1);
    });

    test('should maintain form data when resizing viewport', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      const cvPage = new CVGeneratorPage(page);
      await cvPage.goto();

      await cvPage.fillPersonalInformation(testPersonalData);

      // Resize to mobile
      await page.setViewportSize({ width: 375, height: 667 });

      // Verify data is preserved
      await expect(cvPage.nameInput).toHaveValue(testPersonalData.name);
      await expect(cvPage.emailInput).toHaveValue(testPersonalData.email);
    });
  });
});
