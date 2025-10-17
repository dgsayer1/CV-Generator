import { test, expect } from '@playwright/test';
import { CVGeneratorPage } from './page-objects/CVGeneratorPage';
import {
  testJob1,
  testJob2,
  testEducation1,
  testEducation2,
  testCertification1,
  testCertification2,
  testPersonalData
} from './fixtures/test-data';

test.describe('Dynamic Forms - Add/Remove Entries', () => {
  let cvPage: CVGeneratorPage;

  test.beforeEach(async ({ page }) => {
    cvPage = new CVGeneratorPage(page);
    await cvPage.goto();
  });

  test.describe('Work Experience', () => {
    test('should start with one job entry', async () => {
      const initialCount = await cvPage.getJobCount();
      expect(initialCount).toBe(1);
    });

    test('should add a new job entry', async () => {
      const initialCount = await cvPage.getJobCount();

      await cvPage.addJob(testJob1);

      const newCount = await cvPage.getJobCount();
      expect(newCount).toBe(initialCount + 1);
    });

    test('should add multiple job entries', async () => {
      const initialCount = await cvPage.getJobCount();

      await cvPage.addJob(testJob1);
      await cvPage.addJob(testJob2);

      const newCount = await cvPage.getJobCount();
      expect(newCount).toBe(initialCount + 2);
    });

    test('should remove a job entry', async () => {
      await cvPage.addJob(testJob1);
      const countAfterAdd = await cvPage.getJobCount();

      await cvPage.removeLastJob();

      const countAfterRemove = await cvPage.getJobCount();
      expect(countAfterRemove).toBe(countAfterAdd - 1);
    });

    test('should display remove button on newly added jobs', async () => {
      await cvPage.addJob(testJob1);

      const jobEntries = cvPage.page.locator('.job-entry');
      const lastJobEntry = jobEntries.last();
      const removeButton = lastJobEntry.getByRole('button', { name: 'Remove' });

      await expect(removeButton).toBeVisible();
    });

    test('should preserve data in existing jobs when adding new ones', async () => {
      const firstJobEntry = cvPage.page.locator('.job-entry').first();
      const originalTitle = await firstJobEntry.locator('.job-title').inputValue();

      await cvPage.addJob(testJob1);

      const updatedTitle = await firstJobEntry.locator('.job-title').inputValue();
      expect(updatedTitle).toBe(originalTitle);
    });

    test('should render newly added job with all fields', async () => {
      await cvPage.addJob(testJob1);

      const jobEntries = cvPage.page.locator('.job-entry');
      const lastJobEntry = jobEntries.last();

      await expect(lastJobEntry.locator('.job-title')).toHaveValue(testJob1.title);
      await expect(lastJobEntry.locator('.job-dates-picker')).toBeVisible();
      await expect(lastJobEntry.locator('.job-company')).toHaveValue(testJob1.company);
      await expect(lastJobEntry.locator('.job-location')).toHaveValue(testJob1.location);
      await expect(lastJobEntry.locator('.job-resp')).toHaveValue(testJob1.responsibilities);
    });
  });

  test.describe('Education', () => {
    test('should start with one education entry', async () => {
      const initialCount = await cvPage.getEducationCount();
      expect(initialCount).toBe(1);
    });

    test('should add a new education entry', async () => {
      const initialCount = await cvPage.getEducationCount();

      await cvPage.addEducation(testEducation1);

      const newCount = await cvPage.getEducationCount();
      expect(newCount).toBe(initialCount + 1);
    });

    test('should add multiple education entries', async () => {
      const initialCount = await cvPage.getEducationCount();

      await cvPage.addEducation(testEducation1);
      await cvPage.addEducation(testEducation2);

      const newCount = await cvPage.getEducationCount();
      expect(newCount).toBe(initialCount + 2);
    });

    test('should remove an education entry', async () => {
      await cvPage.addEducation(testEducation1);
      const countAfterAdd = await cvPage.getEducationCount();

      await cvPage.removeLastEducation();

      const countAfterRemove = await cvPage.getEducationCount();
      expect(countAfterRemove).toBe(countAfterAdd - 1);
    });

    test('should display remove button on newly added education', async () => {
      await cvPage.addEducation(testEducation1);

      const eduEntries = cvPage.page.locator('.education-entry');
      const lastEduEntry = eduEntries.last();
      const removeButton = lastEduEntry.getByRole('button', { name: 'Remove' });

      await expect(removeButton).toBeVisible();
    });

    test('should render newly added education with all fields', async () => {
      await cvPage.addEducation(testEducation1);

      const eduEntries = cvPage.page.locator('.education-entry');
      const lastEduEntry = eduEntries.last();

      await expect(lastEduEntry.locator('.edu-degree')).toHaveValue(testEducation1.degree);
      await expect(lastEduEntry.locator('.edu-years-picker')).toBeVisible();
      await expect(lastEduEntry.locator('.edu-institution')).toHaveValue(testEducation1.institution);
    });
  });

  test.describe('Certifications', () => {
    test('should start with three certification entries', async () => {
      const initialCount = await cvPage.getCertificationCount();
      expect(initialCount).toBe(3);
    });

    test('should add a new certification entry', async () => {
      const initialCount = await cvPage.getCertificationCount();

      await cvPage.addCertification(testCertification1);

      const newCount = await cvPage.getCertificationCount();
      expect(newCount).toBe(initialCount + 1);
    });

    test('should add multiple certification entries', async () => {
      const initialCount = await cvPage.getCertificationCount();

      await cvPage.addCertification(testCertification1);
      await cvPage.addCertification(testCertification2);

      const newCount = await cvPage.getCertificationCount();
      expect(newCount).toBe(initialCount + 2);
    });

    test('should remove a certification entry', async () => {
      await cvPage.addCertification(testCertification1);
      const countAfterAdd = await cvPage.getCertificationCount();

      await cvPage.removeLastCertification();

      const countAfterRemove = await cvPage.getCertificationCount();
      expect(countAfterRemove).toBe(countAfterAdd - 1);
    });

    test('should display remove button on newly added certification', async () => {
      await cvPage.addCertification(testCertification1);

      const certEntries = cvPage.page.locator('.cert-entry');
      const lastCertEntry = certEntries.last();
      const removeButton = lastCertEntry.getByRole('button', { name: 'Remove' });

      await expect(removeButton).toBeVisible();
    });

    test('should render newly added certification with correct value', async () => {
      await cvPage.addCertification(testCertification1);

      const certEntries = cvPage.page.locator('.cert-entry');
      const lastCertEntry = certEntries.last();

      await expect(lastCertEntry.locator('.certification')).toHaveValue(testCertification1);
    });
  });

  test.describe('PDF Generation with Multiple Entries', () => {
    test('should generate PDF with multiple jobs', async () => {
      await cvPage.fillPersonalInformation(testPersonalData);
      await cvPage.addJob(testJob1);
      await cvPage.addJob(testJob2);

      const download = await cvPage.generatePDF();

      expect(download.suggestedFilename()).toContain('_CV.pdf');
      await cvPage.verifySuccessMessage();
    });

    test('should generate PDF with multiple education entries', async () => {
      await cvPage.fillPersonalInformation(testPersonalData);
      await cvPage.addEducation(testEducation1);
      await cvPage.addEducation(testEducation2);

      const download = await cvPage.generatePDF();

      expect(download.suggestedFilename()).toContain('_CV.pdf');
      await cvPage.verifySuccessMessage();
    });

    test('should generate PDF with multiple certifications', async () => {
      await cvPage.fillPersonalInformation(testPersonalData);
      await cvPage.addCertification(testCertification1);
      await cvPage.addCertification(testCertification2);

      const download = await cvPage.generatePDF();

      expect(download.suggestedFilename()).toContain('_CV.pdf');
      await cvPage.verifySuccessMessage();
    });

    test('should generate PDF with all dynamic entries populated', async () => {
      await cvPage.fillPersonalInformation(testPersonalData);
      await cvPage.addJob(testJob1);
      await cvPage.addEducation(testEducation1);
      await cvPage.addCertification(testCertification1);

      const download = await cvPage.generatePDF();

      expect(download.suggestedFilename()).toContain('_CV.pdf');
      await cvPage.verifySuccessMessage();
    });
  });
});
