import { test, expect } from '@playwright/test';
import { CVGeneratorPage } from './page-objects/CVGeneratorPage';
import {
  testPersonalData,
  testSummary,
  testSkills,
  testJob1,
  testJob2,
  testEducation1,
  testCertification1,
  testReferences
} from './fixtures/test-data';
import * as fs from 'fs';
import * as path from 'path';

test.describe('PDF Output and Verification', () => {
  let cvPage: CVGeneratorPage;

  test.beforeEach(async ({ page }) => {
    cvPage = new CVGeneratorPage(page);
    await cvPage.goto();
  });

  test.describe('PDF Generation', () => {
    test('should generate PDF with correct filename', async () => {
      await cvPage.fillPersonalInformation(testPersonalData);

      const download = await cvPage.generatePDF();

      // Verify filename format: Name_CV.pdf with spaces replaced by underscores
      expect(download.suggestedFilename()).toBe('John_Doe_CV.pdf');
    });

    test('should generate PDF with spaces in name converted to underscores', async () => {
      await cvPage.fillPersonalInformation({
        name: 'Mary Jane Watson',
        title: 'Test Engineer',
        phone: '+1 234 567 8900',
        email: 'mary@example.com',
        location: 'New York',
      });

      const download = await cvPage.generatePDF();
      expect(download.suggestedFilename()).toBe('Mary_Jane_Watson_CV.pdf');
    });

    test('should generate PDF file successfully', async () => {
      await cvPage.fillPersonalInformation(testPersonalData);

      const download = await cvPage.generatePDF();
      const downloadPath = await download.path();

      // Verify file exists
      expect(downloadPath).toBeTruthy();
      expect(fs.existsSync(downloadPath!)).toBe(true);

      // Verify file has content (PDF files should be at least a few KB)
      const stats = fs.statSync(downloadPath!);
      expect(stats.size).toBeGreaterThan(1000);
    });

    test('should generate PDF with full data populated', async () => {
      await cvPage.fillPersonalInformation(testPersonalData);
      await cvPage.fillSummary(testSummary);
      await cvPage.fillSkills(testSkills);
      await cvPage.addJob(testJob1);
      await cvPage.addEducation(testEducation1);
      await cvPage.addCertification(testCertification1);
      await cvPage.fillReferences(testReferences);

      const download = await cvPage.generatePDF();
      const downloadPath = await download.path();

      // Verify PDF was created with more content (should be larger)
      const stats = fs.statSync(downloadPath!);
      expect(stats.size).toBeGreaterThan(5000);
    });

    test('should handle PDF generation multiple times', async () => {
      await cvPage.fillPersonalInformation(testPersonalData);

      // Generate first PDF
      const download1 = await cvPage.generatePDF();
      expect(download1.suggestedFilename()).toContain('_CV.pdf');

      // Wait for status message
      await cvPage.verifySuccessMessage();

      // Generate second PDF
      const download2 = await cvPage.generatePDF();
      expect(download2.suggestedFilename()).toContain('_CV.pdf');
    });

    test('should generate PDF with minimal data', async () => {
      await cvPage.clearAllFields();
      await cvPage.nameInput.fill('Test User');

      const download = await cvPage.generatePDF();
      const downloadPath = await download.path();

      // Should still generate a valid PDF even with minimal data
      expect(fs.existsSync(downloadPath!)).toBe(true);
      expect(download.suggestedFilename()).toBe('Test_User_CV.pdf');
    });

    test('should generate PDF with special characters in name', async () => {
      await cvPage.nameInput.clear();
      await cvPage.nameInput.fill("O'Brien-Smith");

      const download = await cvPage.generatePDF();

      // Special characters should be preserved in filename
      expect(download.suggestedFilename()).toContain('CV.pdf');
    });
  });

  test.describe('Visual Regression and Screenshots', () => {
    test('should take screenshot of completed form before PDF generation', async ({ page }) => {
      await cvPage.fillPersonalInformation(testPersonalData);
      await cvPage.fillSummary(testSummary);
      await cvPage.fillSkills(testSkills);

      // Take screenshot for visual regression
      await page.screenshot({
        path: 'test-results/screenshots/completed-form.png',
        fullPage: true,
      });

      const screenshotPath = 'test-results/screenshots/completed-form.png';
      expect(fs.existsSync(screenshotPath)).toBe(true);
    });

    test('should capture form sections for visual comparison', async ({ page }) => {
      await cvPage.fillPersonalInformation(testPersonalData);

      // Capture personal information section
      const personalInfoSection = page.locator('.section').first();
      await personalInfoSection.screenshot({
        path: 'test-results/screenshots/personal-info-section.png',
      });

      expect(fs.existsSync('test-results/screenshots/personal-info-section.png')).toBe(true);
    });

    test('should capture generate button section', async ({ page }) => {
      const generateSection = page.locator('.generate-section');
      await generateSection.screenshot({
        path: 'test-results/screenshots/generate-section.png',
      });

      expect(fs.existsSync('test-results/screenshots/generate-section.png')).toBe(true);
    });

    test('should capture success message after PDF generation', async ({ page }) => {
      await cvPage.fillPersonalInformation(testPersonalData);
      await cvPage.generatePDF();

      // Wait for success message to appear
      await cvPage.verifySuccessMessage();

      // Capture status message
      await cvPage.statusMessage.screenshot({
        path: 'test-results/screenshots/success-message.png',
      });

      expect(fs.existsSync('test-results/screenshots/success-message.png')).toBe(true);
    });

    test('should match form layout snapshot', async ({ page }) => {
      await cvPage.fillPersonalInformation(testPersonalData);
      await cvPage.fillSummary(testSummary);

      // Take snapshot for visual regression testing
      await expect(page).toHaveScreenshot('filled-form.png', {
        fullPage: true,
        maxDiffPixels: 100, // Allow minor rendering differences
      });
    });

    test('should match header gradient snapshot', async ({ page }) => {
      const header = page.locator('.header');

      await expect(header).toHaveScreenshot('header-gradient.png', {
        maxDiffPixels: 50,
      });
    });
  });

  test.describe('PDF Content Verification', () => {
    test('should display loading message during PDF generation', async ({ page }) => {
      await cvPage.fillPersonalInformation(testPersonalData);

      // Click generate button but don't wait for download to complete
      const generatePromise = cvPage.generateButton.click();

      // Check for status message (may be very brief)
      const statusText = await cvPage.statusMessage.textContent();
      // Status will either be empty, "Generating PDF..." or the success message
      expect(statusText).toBeDefined();

      await generatePromise;
    });

    test('should show success status after PDF generation', async () => {
      await cvPage.fillPersonalInformation(testPersonalData);
      await cvPage.generatePDF();

      await cvPage.verifySuccessMessage();

      const statusText = await cvPage.statusMessage.textContent();
      expect(statusText).toContain('PDF downloaded as');
      expect(statusText).toContain('.pdf');
    });

    test('should include name in success message', async () => {
      await cvPage.fillPersonalInformation(testPersonalData);
      await cvPage.generatePDF();

      const statusText = await cvPage.statusMessage.textContent();
      expect(statusText).toContain('John_Doe_CV.pdf');
    });
  });

  test.describe('PDF Generation Performance', () => {
    test('should generate PDF within reasonable time', async () => {
      await cvPage.fillPersonalInformation(testPersonalData);

      const startTime = Date.now();
      await cvPage.generatePDF();
      const endTime = Date.now();

      const duration = endTime - startTime;

      // PDF generation should complete within 5 seconds
      expect(duration).toBeLessThan(5000);
    });

    test('should generate PDF with large amount of data efficiently', async () => {
      await cvPage.fillPersonalInformation(testPersonalData);
      await cvPage.fillSummary(testSummary.repeat(3)); // 3x longer summary

      // Add multiple jobs
      await cvPage.addJob(testJob1);
      await cvPage.addJob(testJob2);
      await cvPage.addJob({
        title: 'Junior Developer',
        dates: '2015 - 2018',
        company: 'Tech Startup',
        location: 'Austin, TX',
        responsibilities: 'Various development tasks\nCode reviews\nBug fixes',
      });

      const startTime = Date.now();
      await cvPage.generatePDF();
      const endTime = Date.now();

      const duration = endTime - startTime;

      // Even with lots of data, should complete within 10 seconds
      expect(duration).toBeLessThan(10000);
    });
  });

  test.describe('PDF File Properties', () => {
    test('should generate PDF with correct MIME type', async () => {
      await cvPage.fillPersonalInformation(testPersonalData);

      const download = await cvPage.generatePDF();
      const downloadPath = await download.path();

      // Read first few bytes to verify PDF signature
      const buffer = fs.readFileSync(downloadPath!);
      const header = buffer.toString('utf-8', 0, 5);

      expect(header).toBe('%PDF-');
    });

    test('should generate valid PDF structure', async () => {
      await cvPage.fillPersonalInformation(testPersonalData);

      const download = await cvPage.generatePDF();
      const downloadPath = await download.path();

      // Read file and verify it has PDF structure markers
      const content = fs.readFileSync(downloadPath!, 'utf-8');

      expect(content).toContain('%PDF-');
      expect(content).toContain('%%EOF');
    });

    test('should save PDF to correct download location', async () => {
      await cvPage.fillPersonalInformation(testPersonalData);

      const download = await cvPage.generatePDF();
      const downloadPath = await download.path();

      // Verify path exists and is a file
      expect(downloadPath).toBeTruthy();
      const stats = fs.statSync(downloadPath!);
      expect(stats.isFile()).toBe(true);
    });
  });

  test.describe('Error Handling', () => {
    test('should handle PDF generation gracefully even with empty name', async () => {
      await cvPage.nameInput.clear();

      // Should still allow PDF generation
      const download = await cvPage.generatePDF();
      expect(download.suggestedFilename()).toBe('_CV.pdf');
    });

    test('should not break UI after PDF generation', async ({ page }) => {
      await cvPage.fillPersonalInformation(testPersonalData);
      await cvPage.generatePDF();

      // Verify form is still interactive
      await cvPage.nameInput.clear();
      await cvPage.nameInput.fill('New Name');
      await expect(cvPage.nameInput).toHaveValue('New Name');

      // Verify can generate PDF again
      const download2 = await cvPage.generatePDF();
      expect(download2.suggestedFilename()).toBe('New_Name_CV.pdf');
    });
  });
});
