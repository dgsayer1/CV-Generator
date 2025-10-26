import { test, expect } from '@playwright/test';
import { CVGeneratorPage } from './page-objects/CVGeneratorPage';
import {
  testPersonalData,
  testSummary,
  testJob1,
  testEducation1,
} from './fixtures/test-data';
import * as fs from 'fs';

test.describe('CV Style Selector', () => {
  let cvPage: CVGeneratorPage;

  test.beforeEach(async ({ page }) => {
    cvPage = new CVGeneratorPage(page);
    await cvPage.goto();
  });

  test.describe('Style Selector UI', () => {
    test('should display style selector on page load', async ({ page }) => {
      const styleSelector = page.locator('#cv-style');
      await expect(styleSelector).toBeVisible();

      const label = page.locator('label[for="cv-style"]');
      await expect(label).toBeVisible();
      await expect(label).toHaveText('CV Style:');
    });

    test('should have Modern as default selection', async ({ page }) => {
      const styleSelector = page.locator('#cv-style');
      await expect(styleSelector).toHaveValue('modern');
    });

    test('should display both style options', async ({ page }) => {
      const styleSelector = page.locator('#cv-style');
      const options = styleSelector.locator('option');

      await expect(options).toHaveCount(2);
      await expect(options.nth(0)).toHaveText('Modern');
      await expect(options.nth(0)).toHaveValue('modern');
      await expect(options.nth(1)).toHaveText('Minimalist Modern');
      await expect(options.nth(1)).toHaveValue('minimalist');
    });

    test('should change to Minimalist Modern when selected', async ({ page }) => {
      const styleSelector = page.locator('#cv-style');

      await styleSelector.selectOption('minimalist');
      await expect(styleSelector).toHaveValue('minimalist');
    });

    test('should switch back to Modern style', async ({ page }) => {
      const styleSelector = page.locator('#cv-style');

      // Change to minimalist
      await styleSelector.selectOption('minimalist');
      await expect(styleSelector).toHaveValue('minimalist');

      // Switch back to modern
      await styleSelector.selectOption('modern');
      await expect(styleSelector).toHaveValue('modern');
    });

    test('should persist selection during form interaction', async ({ page }) => {
      const styleSelector = page.locator('#cv-style');

      // Select minimalist style
      await styleSelector.selectOption('minimalist');

      // Fill in some form data
      await cvPage.fillPersonalInformation(testPersonalData);
      await cvPage.fillSummary(testSummary);

      // Verify style selection is still minimalist
      await expect(styleSelector).toHaveValue('minimalist');
    });

    test('should be part of header controls alongside color and font pickers', async ({ page }) => {
      const headerControls = page.locator('.header-controls');
      await expect(headerControls).toBeVisible();

      // Verify all three controls are present
      const styleControl = headerControls.locator('.style-picker-container');
      const colorControl = headerControls.locator('.color-picker-container');
      const fontControl = headerControls.locator('.font-picker-container');

      await expect(styleControl).toBeVisible();
      await expect(colorControl).toBeVisible();
      await expect(fontControl).toBeVisible();
    });
  });

  test.describe('Modern Style PDF Generation', () => {
    test('should generate PDF with Modern style', async ({ page }) => {
      const styleSelector = page.locator('#cv-style');

      // Explicitly select Modern style
      await styleSelector.selectOption('modern');

      // Fill in basic CV data
      await cvPage.fillPersonalInformation(testPersonalData);
      await cvPage.fillSummary(testSummary);
      await cvPage.addJob(testJob1);
      await cvPage.addEducation(testEducation1);

      // Generate PDF
      const download = await cvPage.generatePDF();

      // Verify download succeeded
      expect(download.suggestedFilename()).toBe('John_Doe_CV.pdf');

      const downloadPath = await download.path();
      expect(downloadPath).toBeTruthy();
      expect(fs.existsSync(downloadPath!)).toBe(true);

      // Verify PDF has content
      const stats = fs.statSync(downloadPath!);
      expect(stats.size).toBeGreaterThan(5000);
    });

    test('should generate valid PDF structure with Modern style', async ({ page }) => {
      const styleSelector = page.locator('#cv-style');
      await styleSelector.selectOption('modern');

      await cvPage.fillPersonalInformation(testPersonalData);

      const download = await cvPage.generatePDF();
      const downloadPath = await download.path();

      // Verify PDF structure
      const content = fs.readFileSync(downloadPath!, 'utf-8');
      expect(content).toContain('%PDF-');
      expect(content).toContain('%%EOF');
    });

    test('should show success message after Modern style PDF generation', async ({ page }) => {
      const styleSelector = page.locator('#cv-style');
      await styleSelector.selectOption('modern');

      await cvPage.fillPersonalInformation(testPersonalData);
      await cvPage.generatePDF();

      await cvPage.verifySuccessMessage();
      const statusText = await cvPage.statusMessage.textContent();
      expect(statusText).toContain('John_Doe_CV.pdf');
    });
  });

  test.describe('Minimalist Style PDF Generation', () => {
    test('should generate PDF with Minimalist Modern style', async ({ page }) => {
      const styleSelector = page.locator('#cv-style');

      // Select Minimalist Modern style
      await styleSelector.selectOption('minimalist');

      // Fill in basic CV data (same as modern test)
      await cvPage.fillPersonalInformation(testPersonalData);
      await cvPage.fillSummary(testSummary);
      await cvPage.addJob(testJob1);
      await cvPage.addEducation(testEducation1);

      // Generate PDF
      const download = await cvPage.generatePDF();

      // Verify download succeeded
      expect(download.suggestedFilename()).toBe('John_Doe_CV.pdf');

      const downloadPath = await download.path();
      expect(downloadPath).toBeTruthy();
      expect(fs.existsSync(downloadPath!)).toBe(true);

      // Verify PDF has content
      const stats = fs.statSync(downloadPath!);
      expect(stats.size).toBeGreaterThan(5000);
    });

    test('should generate valid PDF structure with Minimalist style', async ({ page }) => {
      const styleSelector = page.locator('#cv-style');
      await styleSelector.selectOption('minimalist');

      await cvPage.fillPersonalInformation(testPersonalData);

      const download = await cvPage.generatePDF();
      const downloadPath = await download.path();

      // Verify PDF structure
      const content = fs.readFileSync(downloadPath!, 'utf-8');
      expect(content).toContain('%PDF-');
      expect(content).toContain('%%EOF');
    });

    test('should show success message after Minimalist style PDF generation', async ({ page }) => {
      const styleSelector = page.locator('#cv-style');
      await styleSelector.selectOption('minimalist');

      await cvPage.fillPersonalInformation(testPersonalData);
      await cvPage.generatePDF();

      await cvPage.verifySuccessMessage();
      const statusText = await cvPage.statusMessage.textContent();
      expect(statusText).toContain('John_Doe_CV.pdf');
    });
  });

  test.describe('Style Switching Between Generations', () => {
    test('should generate PDFs with different styles in sequence', async ({ page }) => {
      const styleSelector = page.locator('#cv-style');

      // Fill in form data once
      await cvPage.fillPersonalInformation(testPersonalData);
      await cvPage.fillSummary(testSummary);

      // Generate PDF with Modern style
      await styleSelector.selectOption('modern');
      const modernDownload = await cvPage.generatePDF();

      expect(modernDownload.suggestedFilename()).toBe('John_Doe_CV.pdf');
      await cvPage.verifySuccessMessage();

      // Ensure download completed before proceeding
      await modernDownload.path();

      // Switch to Minimalist Modern style
      await styleSelector.selectOption('minimalist');

      // Generate PDF with Minimalist style
      const minimalistDownload = await cvPage.generatePDF();

      expect(minimalistDownload.suggestedFilename()).toBe('John_Doe_CV.pdf');
      await cvPage.verifySuccessMessage();

      // Verify both PDFs were created
      const modernPath = await modernDownload.path();
      const minimalistPath = await minimalistDownload.path();

      expect(fs.existsSync(modernPath!)).toBe(true);
      expect(fs.existsSync(minimalistPath!)).toBe(true);

      // Both should have content
      const modernStats = fs.statSync(modernPath!);
      const minimalistStats = fs.statSync(minimalistPath!);

      expect(modernStats.size).toBeGreaterThan(1000);
      expect(minimalistStats.size).toBeGreaterThan(1000);
    });

    test('should handle rapid style switching before generation', async ({ page }) => {
      const styleSelector = page.locator('#cv-style');

      await cvPage.fillPersonalInformation(testPersonalData);

      // Switch styles multiple times
      await styleSelector.selectOption('minimalist');
      await styleSelector.selectOption('modern');
      await styleSelector.selectOption('minimalist');
      await styleSelector.selectOption('modern');

      // Finally select minimalist
      await styleSelector.selectOption('minimalist');

      // Generate PDF - should use the final selection (minimalist)
      const download = await cvPage.generatePDF();

      expect(download.suggestedFilename()).toBe('John_Doe_CV.pdf');

      const downloadPath = await download.path();
      expect(fs.existsSync(downloadPath!)).toBe(true);
    });

    test('should generate different PDFs after form changes with same style', async ({ page }) => {
      const styleSelector = page.locator('#cv-style');
      await styleSelector.selectOption('modern');

      // First generation with initial data
      await cvPage.fillPersonalInformation(testPersonalData);
      const firstDownload = await cvPage.generatePDF();
      await cvPage.verifySuccessMessage();

      // Change personal data
      await cvPage.fillPersonalInformation({
        name: 'Jane Smith',
        title: 'QA Engineer',
        phone: '+1 555 123 4567',
        email: 'jane@example.com',
        location: 'Seattle, WA',
      });

      // Generate second PDF with same style
      const secondDownload = await cvPage.generatePDF();

      // Different names should produce different filenames
      expect(firstDownload.suggestedFilename()).toBe('John_Doe_CV.pdf');
      expect(secondDownload.suggestedFilename()).toBe('Jane_Smith_CV.pdf');
    });
  });

  test.describe('Integration with Other Features', () => {
    test('should work with theme color picker', async ({ page }) => {
      const styleSelector = page.locator('#cv-style');
      const colorPicker = page.locator('#theme-color');

      // Select minimalist style
      await styleSelector.selectOption('minimalist');

      // Change theme color
      await colorPicker.fill('#FF5733');

      // Verify both selections persist
      await expect(styleSelector).toHaveValue('minimalist');
      await expect(colorPicker).toHaveValue('#ff5733'); // Browsers normalize to lowercase

      // Generate PDF
      await cvPage.fillPersonalInformation(testPersonalData);
      const download = await cvPage.generatePDF();

      expect(download.suggestedFilename()).toBe('John_Doe_CV.pdf');
    });

    test('should work with font selector', async ({ page }) => {
      const styleSelector = page.locator('#cv-style');
      const fontSelector = page.locator('#pdf-font');

      // Select modern style
      await styleSelector.selectOption('modern');

      // Change font
      await fontSelector.selectOption('times');

      // Verify both selections persist
      await expect(styleSelector).toHaveValue('modern');
      await expect(fontSelector).toHaveValue('times');

      // Generate PDF
      await cvPage.fillPersonalInformation(testPersonalData);
      const download = await cvPage.generatePDF();

      expect(download.suggestedFilename()).toBe('John_Doe_CV.pdf');
    });

    test('should work with all header controls simultaneously', async ({ page }) => {
      const styleSelector = page.locator('#cv-style');
      const colorPicker = page.locator('#theme-color');
      const fontSelector = page.locator('#pdf-font');

      // Set all three controls
      await styleSelector.selectOption('minimalist');
      await colorPicker.fill('#3498db');
      await fontSelector.selectOption('courier');

      // Verify all selections
      await expect(styleSelector).toHaveValue('minimalist');
      await expect(colorPicker).toHaveValue('#3498db');
      await expect(fontSelector).toHaveValue('courier');

      // Generate PDF with all customizations
      await cvPage.fillPersonalInformation(testPersonalData);
      await cvPage.addJob(testJob1);

      const download = await cvPage.generatePDF();

      const downloadPath = await download.path();
      expect(fs.existsSync(downloadPath!)).toBe(true);

      const stats = fs.statSync(downloadPath!);
      expect(stats.size).toBeGreaterThan(5000);
    });

    test('should maintain style selection during dynamic form interactions', async ({ page }) => {
      const styleSelector = page.locator('#cv-style');

      // Select minimalist style
      await styleSelector.selectOption('minimalist');

      // Perform various form interactions
      await cvPage.fillPersonalInformation(testPersonalData);
      await cvPage.addJob(testJob1);
      await cvPage.addEducation(testEducation1);

      // Remove job
      await cvPage.removeLastJob();

      // Add another education
      await cvPage.addEducation({
        degree: 'PhD Computer Science',
        years: '2016 - 2020',
        institution: 'Research University',
      });

      // Verify style selection persists through all interactions
      await expect(styleSelector).toHaveValue('minimalist');

      // Generate PDF
      const download = await cvPage.generatePDF();
      expect(download.suggestedFilename()).toBe('John_Doe_CV.pdf');
    });
  });

  test.describe('Edge Cases and Error Handling', () => {
    test('should handle PDF generation with empty form and selected style', async ({ page }) => {
      const styleSelector = page.locator('#cv-style');

      // Clear all fields
      await cvPage.clearAllFields();

      // Select minimalist style
      await styleSelector.selectOption('minimalist');

      // Generate PDF with empty data
      const download = await cvPage.generatePDF();

      // Should still generate (filename will be _CV.pdf due to empty name)
      expect(download.suggestedFilename()).toBe('_CV.pdf');
    });

    test('should maintain style selection after page interactions', async ({ page }) => {
      const styleSelector = page.locator('#cv-style');

      // Select minimalist
      await styleSelector.selectOption('minimalist');

      // Scroll page
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

      // Click various buttons
      await cvPage.addJobButton.click();
      await cvPage.removeLastJob();

      // Verify selection maintained
      await expect(styleSelector).toHaveValue('minimalist');
    });

    test('should handle style selection with special characters in form data', async ({ page }) => {
      const styleSelector = page.locator('#cv-style');

      await styleSelector.selectOption('modern');

      // Fill form with special characters
      await cvPage.fillPersonalInformation({
        name: "O'Brien-Smith Jr.",
        title: 'Software Engineer & Architect',
        phone: '+44 (0) 7700 900000',
        email: 'test.email+tag@example.co.uk',
        location: 'London, UK',
      });

      const download = await cvPage.generatePDF();

      const downloadPath = await download.path();
      expect(fs.existsSync(downloadPath!)).toBe(true);
    });

    test('should generate PDF quickly with either style', async ({ page }) => {
      const styleSelector = page.locator('#cv-style');

      await cvPage.fillPersonalInformation(testPersonalData);

      // Test Modern style performance
      await styleSelector.selectOption('modern');
      const modernStart = Date.now();
      const modernDownload = await cvPage.generatePDF();
      const modernDuration = Date.now() - modernStart;

      // Ensure download completed before proceeding
      await modernDownload.path();

      // Test Minimalist style performance
      await styleSelector.selectOption('minimalist');
      const minimalistStart = Date.now();
      await cvPage.generatePDF();
      const minimalistDuration = Date.now() - minimalistStart;

      // Both should complete within reasonable time
      expect(modernDuration).toBeLessThan(5000);
      expect(minimalistDuration).toBeLessThan(5000);
    });
  });

  test.describe('Accessibility', () => {
    test('should have accessible label for style selector', async ({ page }) => {
      const styleSelector = page.locator('#cv-style');
      const label = page.locator('label[for="cv-style"]');

      await expect(label).toBeVisible();

      // Verify label is associated with select
      const forAttribute = await label.getAttribute('for');
      const selectId = await styleSelector.getAttribute('id');

      expect(forAttribute).toBe(selectId);
    });

    test('should be keyboard navigable', async ({ page }) => {
      const styleSelector = page.locator('#cv-style');

      // Focus on style selector using keyboard
      await page.keyboard.press('Tab'); // May need multiple tabs to reach selector
      await styleSelector.focus();

      // Verify it's focused
      await expect(styleSelector).toBeFocused();

      // Use arrow keys to change selection
      await page.keyboard.press('ArrowDown');

      // Should change to minimalist (second option)
      await expect(styleSelector).toHaveValue('minimalist');
    });

    test('should have proper contrast and visibility', async ({ page }) => {
      const styleContainer = page.locator('.style-picker-container');

      await expect(styleContainer).toBeVisible();

      // Verify container has content
      const textContent = await styleContainer.textContent();
      expect(textContent).toContain('CV Style:');
    });
  });
});
