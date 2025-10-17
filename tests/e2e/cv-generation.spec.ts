import { test, expect } from '@playwright/test';
import { CVGeneratorPage } from './page-objects/CVGeneratorPage';
import { testPersonalData, testSummary, testSkills, testReferences } from './fixtures/test-data';

test.describe('CV Generation - Basic Flow', () => {
  let cvPage: CVGeneratorPage;

  test.beforeEach(async ({ page }) => {
    cvPage = new CVGeneratorPage(page);
    await cvPage.goto();
  });

  test('should load the CV generator page successfully', async ({ page }) => {
    await expect(page).toHaveTitle('Interactive CV Generator');
    await expect(page.getByRole('heading', { name: 'Interactive CV Generator' })).toBeVisible();
  });

  test('should display all form sections', async () => {
    await cvPage.verifyAllSectionsVisible();
  });

  test('should have pre-filled data on page load', async () => {
    // Check that the form has default values (test data)
    await expect(cvPage.nameInput).toHaveValue(testPersonalData.name);
    await expect(cvPage.titleInput).toHaveValue(testPersonalData.title);
    await expect(cvPage.phoneInput).toHaveValue(testPersonalData.phone);
    await expect(cvPage.emailInput).toHaveValue(testPersonalData.email);
  });

  test('should fill in personal information', async () => {
    await cvPage.fillPersonalInformation(testPersonalData);

    await expect(cvPage.nameInput).toHaveValue(testPersonalData.name);
    await expect(cvPage.titleInput).toHaveValue(testPersonalData.title);
    await expect(cvPage.phoneInput).toHaveValue(testPersonalData.phone);
    await expect(cvPage.emailInput).toHaveValue(testPersonalData.email);
    await expect(cvPage.locationInput).toHaveValue(testPersonalData.location);
  });

  test('should fill in professional summary', async () => {
    await cvPage.fillSummary(testSummary);
    await expect(cvPage.summaryTextarea).toHaveValue(testSummary);
  });

  test('should fill in skills', async () => {
    await cvPage.fillSkills(testSkills);

    await expect(cvPage.skillsAutomation).toHaveValue(testSkills.automation);
    await expect(cvPage.skillsProgramming).toHaveValue(testSkills.programming);
    await expect(cvPage.skillsPerformance).toHaveValue(testSkills.performance);
    await expect(cvPage.skillsLeadership).toHaveValue(testSkills.leadership);
  });

  test('should fill in references', async () => {
    await cvPage.fillReferences(testReferences);

    await expect(cvPage.ref1NameInput).toHaveValue(testReferences.ref1Name);
    await expect(cvPage.ref1TitleInput).toHaveValue(testReferences.ref1Title);
    await expect(cvPage.ref2NameInput).toHaveValue(testReferences.ref2Name);
    await expect(cvPage.ref2TitleInput).toHaveValue(testReferences.ref2Title);
  });

  test('should generate PDF and verify download', async ({ page }) => {
    await cvPage.fillPersonalInformation(testPersonalData);

    const download = await cvPage.generatePDF();

    // Verify download occurred
    expect(download.suggestedFilename()).toContain('_CV.pdf');

    // Verify success message
    await cvPage.verifySuccessMessage();
  });

  test('should generate PDF with complete data', async () => {
    await cvPage.fillPersonalInformation(testPersonalData);
    await cvPage.fillSummary(testSummary);
    await cvPage.fillSkills(testSkills);
    await cvPage.fillReferences(testReferences);

    const download = await cvPage.generatePDF();

    // Verify the filename includes the user's name
    expect(download.suggestedFilename()).toBe('John_Doe_CV.pdf');

    // Save the PDF to verify it was generated
    const path = await download.path();
    expect(path).toBeTruthy();
  });

  test('should display generate button prominently', async () => {
    await expect(cvPage.generateButton).toBeVisible();
    await expect(cvPage.generateButton).toBeEnabled();
  });

  test('should clear fields successfully', async () => {
    await cvPage.clearAllFields();

    await expect(cvPage.nameInput).toHaveValue('');
    await expect(cvPage.titleInput).toHaveValue('');
    await expect(cvPage.phoneInput).toHaveValue('');
    await expect(cvPage.emailInput).toHaveValue('');
    await expect(cvPage.locationInput).toHaveValue('');
    await expect(cvPage.summaryTextarea).toHaveValue('');
  });

  test('should show status message after PDF generation', async () => {
    await cvPage.fillPersonalInformation(testPersonalData);
    await cvPage.generatePDF();

    await expect(cvPage.statusMessage).toBeVisible();
    await expect(cvPage.statusMessage).toContainText('PDF downloaded');
  });
});
