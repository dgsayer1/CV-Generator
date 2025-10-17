import { test, expect } from '@playwright/test';
import { CVGeneratorPage } from './page-objects/CVGeneratorPage';
import { invalidEmails, testPersonalData } from './fixtures/test-data';

test.describe('Form Validation', () => {
  let cvPage: CVGeneratorPage;

  test.beforeEach(async ({ page }) => {
    cvPage = new CVGeneratorPage(page);
    await cvPage.goto();
  });

  test.describe('Email Validation', () => {
    test('should accept valid email format', async () => {
      await cvPage.emailInput.clear();
      await cvPage.emailInput.fill('valid.email@example.com');

      // Check browser validation state
      const validationMessage = await cvPage.emailInput.evaluate(
        (el: HTMLInputElement) => el.validationMessage
      );
      expect(validationMessage).toBe('');
    });

    test('should show validation error for invalid email - no @', async ({ page }) => {
      await cvPage.emailInput.clear();
      await cvPage.emailInput.fill('invalidemail');

      const isValid = await cvPage.emailInput.evaluate(
        (el: HTMLInputElement) => el.checkValidity()
      );
      expect(isValid).toBe(false);
    });

    test('should show validation error for invalid email - missing domain', async () => {
      await cvPage.emailInput.clear();
      await cvPage.emailInput.fill('test@');

      const isValid = await cvPage.emailInput.evaluate(
        (el: HTMLInputElement) => el.checkValidity()
      );
      expect(isValid).toBe(false);
    });

    test('should show validation error for invalid email - missing local part', async () => {
      await cvPage.emailInput.clear();
      await cvPage.emailInput.fill('@example.com');

      const isValid = await cvPage.emailInput.evaluate(
        (el: HTMLInputElement) => el.checkValidity()
      );
      expect(isValid).toBe(false);
    });

    test('should validate multiple email formats', async () => {
      const validEmails = [
        'user@example.com',
        'user.name@example.com',
        'user+tag@example.co.uk',
        'user_name@sub.example.com',
      ];

      for (const email of validEmails) {
        await cvPage.emailInput.clear();
        await cvPage.emailInput.fill(email);

        const validationMessage = await cvPage.emailInput.evaluate(
          (el: HTMLInputElement) => el.validationMessage
        );
        expect(validationMessage).toBe('');
      }
    });
  });

  test.describe('Phone Validation', () => {
    test('should accept various phone formats', async () => {
      const validPhones = [
        '+1 234 567 8900',
        '07722 524 190',
        '(555) 123-4567',
        '+44 20 1234 5678',
      ];

      for (const phone of validPhones) {
        await cvPage.phoneInput.clear();
        await cvPage.phoneInput.fill(phone);

        // Phone input is type="tel" which is lenient, just verify it accepts the input
        await expect(cvPage.phoneInput).toHaveValue(phone);
      }
    });

    test('should accept phone with special characters', async () => {
      await cvPage.phoneInput.clear();
      await cvPage.phoneInput.fill('+1 (555) 123-4567');

      await expect(cvPage.phoneInput).toHaveValue('+1 (555) 123-4567');
    });
  });

  test.describe('Required Fields', () => {
    test('should allow PDF generation with empty fields', async () => {
      // The current implementation doesn't enforce required fields
      // It generates PDF even with empty values
      await cvPage.clearAllFields();

      const download = await cvPage.generatePDF();
      expect(download.suggestedFilename()).toContain('_CV.pdf');
    });

    test('should handle missing name gracefully', async () => {
      await cvPage.nameInput.clear();

      const download = await cvPage.generatePDF();

      // When name is empty, filename will be just "_CV.pdf"
      expect(download.suggestedFilename()).toBe('_CV.pdf');
    });

    test('should handle missing job fields', async () => {
      await cvPage.addJob({
        title: '',
        dates: '',
        company: '',
        location: '',
        responsibilities: '',
      });

      const download = await cvPage.generatePDF();
      expect(download.suggestedFilename()).toContain('_CV.pdf');
    });
  });

  test.describe('Text Field Lengths', () => {
    test('should accept long summary text', async () => {
      const longSummary = 'A'.repeat(1000);
      await cvPage.summaryTextarea.clear();
      await cvPage.summaryTextarea.fill(longSummary);

      await expect(cvPage.summaryTextarea).toHaveValue(longSummary);
    });

    test('should accept long job responsibilities', async () => {
      const longResponsibilities = 'Responsibility line\n'.repeat(50);

      await cvPage.addJob({
        title: 'Test Job',
        dates: '2020 - 2023',
        company: 'Test Company',
        location: 'Test Location',
        responsibilities: longResponsibilities,
      });

      const jobEntries = cvPage.page.locator('.job-entry');
      const lastJobEntry = jobEntries.last();

      await expect(lastJobEntry.locator('.job-resp')).toHaveValue(longResponsibilities);
    });

    test('should handle very long names', async () => {
      const longName = 'FirstName MiddleName LastName WithExtraLongSurname';
      await cvPage.nameInput.clear();
      await cvPage.nameInput.fill(longName);

      await expect(cvPage.nameInput).toHaveValue(longName);
    });
  });

  test.describe('Special Characters', () => {
    test('should accept special characters in name', async () => {
      const nameWithSpecialChars = "O'Brien-Smith Jr.";
      await cvPage.nameInput.clear();
      await cvPage.nameInput.fill(nameWithSpecialChars);

      await expect(cvPage.nameInput).toHaveValue(nameWithSpecialChars);
    });

    test('should accept special characters in location', async () => {
      const locationWithSpecialChars = 'São Paulo, Brazil';
      await cvPage.locationInput.clear();
      await cvPage.locationInput.fill(locationWithSpecialChars);

      await expect(cvPage.locationInput).toHaveValue(locationWithSpecialChars);
    });

    test('should accept unicode characters', async () => {
      const unicodeName = '李明 (Li Ming)';
      await cvPage.nameInput.clear();
      await cvPage.nameInput.fill(unicodeName);

      await expect(cvPage.nameInput).toHaveValue(unicodeName);
    });

    test('should handle bullet points in skills', async () => {
      const skillsWithBullets = '• Playwright\n• Cypress\n• Selenium';
      await cvPage.skillsAutomation.clear();
      await cvPage.skillsAutomation.fill(skillsWithBullets);

      await expect(cvPage.skillsAutomation).toHaveValue(skillsWithBullets);
    });
  });

  test.describe('Field Interactions', () => {
    test('should clear field when selecting all and deleting', async () => {
      await cvPage.nameInput.click();
      await cvPage.page.keyboard.press('Control+A');
      await cvPage.page.keyboard.press('Backspace');

      await expect(cvPage.nameInput).toHaveValue('');
    });

    test('should support copy and paste', async () => {
      const testValue = 'Test Summary Content';
      await cvPage.summaryTextarea.clear();
      await cvPage.summaryTextarea.fill(testValue);

      await cvPage.summaryTextarea.click();
      await cvPage.page.keyboard.press('Control+A');
      await cvPage.page.keyboard.press('Control+C');

      await cvPage.nameInput.click();
      await cvPage.page.keyboard.press('Control+V');

      await expect(cvPage.nameInput).toHaveValue(testValue);
    });

    test('should handle tab navigation between fields', async () => {
      await cvPage.nameInput.click();
      await cvPage.page.keyboard.press('Tab');

      const focusedElement = await cvPage.page.evaluate(() => document.activeElement?.id);
      expect(focusedElement).toBe('title');
    });
  });

  test.describe('Form Submission with Various Data States', () => {
    test('should generate PDF with minimal data', async () => {
      await cvPage.clearAllFields();
      await cvPage.nameInput.fill('John Doe');
      await cvPage.emailInput.fill('john@example.com');

      const download = await cvPage.generatePDF();
      expect(download.suggestedFilename()).toBe('John_Doe_CV.pdf');
    });

    test('should generate PDF with complete data', async () => {
      await cvPage.fillPersonalInformation(testPersonalData);
      await cvPage.fillSummary('Complete professional summary');
      await cvPage.fillSkills({
        automation: 'Playwright, Cypress',
        programming: 'TypeScript, JavaScript',
        performance: 'JMeter',
        leadership: 'Team Leadership',
      });

      const download = await cvPage.generatePDF();
      expect(download.suggestedFilename()).toContain('_CV.pdf');
      await cvPage.verifySuccessMessage();
    });
  });
});
