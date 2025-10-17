import { Page, Locator, expect, Download } from '@playwright/test';

export class CVGeneratorPage {
  readonly page: Page;

  // Personal Information
  readonly nameInput: Locator;
  readonly titleInput: Locator;
  readonly phoneInput: Locator;
  readonly emailInput: Locator;
  readonly locationInput: Locator;

  // Summary
  readonly summaryTextarea: Locator;

  // Skills
  readonly skillsContainer: Locator;
  readonly addSkillCategoryButton: Locator;

  // Work Experience
  readonly jobsContainer: Locator;
  readonly addJobButton: Locator;

  // Education
  readonly educationContainer: Locator;
  readonly addEducationButton: Locator;

  // Certifications
  readonly certificationsContainer: Locator;
  readonly addCertificationButton: Locator;

  // References
  readonly ref1NameInput: Locator;
  readonly ref1JobTitleInput: Locator;
  readonly ref1CompanyInput: Locator;
  readonly ref2NameInput: Locator;
  readonly ref2JobTitleInput: Locator;
  readonly ref2CompanyInput: Locator;

  // Generate
  readonly generateButton: Locator;
  readonly statusMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    // Personal Information
    this.nameInput = page.locator('#name');
    this.titleInput = page.locator('#title');
    this.phoneInput = page.locator('#phone');
    this.emailInput = page.locator('#email');
    this.locationInput = page.locator('#location');

    // Summary
    this.summaryTextarea = page.locator('#summary');

    // Skills
    this.skillsContainer = page.locator('#skills-container');
    this.addSkillCategoryButton = page.getByRole('button', { name: '+ Add Skill Category' });

    // Work Experience
    this.jobsContainer = page.locator('#jobs-container');
    this.addJobButton = page.getByRole('button', { name: '+ Add Another Job' });

    // Education
    this.educationContainer = page.locator('#education-container');
    this.addEducationButton = page.getByRole('button', { name: '+ Add Another Education' });

    // Certifications
    this.certificationsContainer = page.locator('#certifications-container');
    this.addCertificationButton = page.getByRole('button', { name: '+ Add Another Certification' });

    // References
    this.ref1NameInput = page.locator('#ref1-name');
    this.ref1JobTitleInput = page.locator('#ref1-job-title');
    this.ref1CompanyInput = page.locator('#ref1-company');
    this.ref2NameInput = page.locator('#ref2-name');
    this.ref2JobTitleInput = page.locator('#ref2-job-title');
    this.ref2CompanyInput = page.locator('#ref2-company');

    // Generate
    this.generateButton = page.getByRole('button', { name: 'Generate PDF' });
    this.statusMessage = page.locator('#status');
  }

  async goto() {
    await this.page.goto('/');
  }

  async verifyAllSectionsVisible() {
    await expect(this.page.getByRole('heading', { name: 'Personal Information' })).toBeVisible();
    await expect(this.page.getByRole('heading', { name: 'Professional Summary' })).toBeVisible();
    await expect(this.page.getByRole('heading', { name: 'Skills & Expertise' })).toBeVisible();
    await expect(this.page.getByRole('heading', { name: 'Work Experience' })).toBeVisible();
    await expect(this.page.getByRole('heading', { name: 'Education' })).toBeVisible();
    await expect(this.page.getByRole('heading', { name: 'Certifications' })).toBeVisible();
    await expect(this.page.getByRole('heading', { name: 'References' })).toBeVisible();
  }

  async fillPersonalInformation(data: {
    name: string;
    title: string;
    phone: string;
    email: string;
    location: string;
  }) {
    await this.nameInput.clear();
    await this.nameInput.fill(data.name);
    await this.titleInput.clear();
    await this.titleInput.fill(data.title);
    await this.phoneInput.clear();
    await this.phoneInput.fill(data.phone);
    await this.emailInput.clear();
    await this.emailInput.fill(data.email);
    await this.locationInput.clear();
    await this.locationInput.fill(data.location);
  }

  async fillSummary(summary: string) {
    await this.summaryTextarea.clear();
    await this.summaryTextarea.fill(summary);
  }

  async fillSkills(skills: Record<string, string[]>) {
    // Wait for default data to load
    await this.page.waitForSelector('.skill-category', { timeout: 10000 });

    // Clear existing skill categories
    const existingCategories = this.page.locator('.skill-category');
    const count = await existingCategories.count();
    for (let i = 0; i < count; i++) {
      await existingCategories.first().locator('button:has-text("Remove Category")').click();
    }

    // Add new skill categories
    for (const [categoryName, skillItems] of Object.entries(skills)) {
      await this.addSkillCategoryButton.click();

      const categories = this.page.locator('.skill-category');
      const lastCategory = categories.last();

      // Fill category name
      await lastCategory.locator('.skill-category-name').fill(categoryName);

      // Clear the default skill item and add all skills
      const skillInputs = lastCategory.locator('.skill-item-input');
      const firstInput = skillInputs.first();
      await firstInput.fill(skillItems[0]);

      // Add remaining skills
      for (let i = 1; i < skillItems.length; i++) {
        await lastCategory.locator('button:has-text("+ Add Skill")').click();
        await skillInputs.nth(i).fill(skillItems[i]);
      }
    }
  }

  async getSkillCategoryCount(): Promise<number> {
    return await this.page.locator('.skill-category').count();
  }

  async getSkillsInCategory(categoryIndex: number): Promise<string[]> {
    const category = this.page.locator('.skill-category').nth(categoryIndex);
    const skillInputs = category.locator('.skill-item-input');
    const count = await skillInputs.count();
    const skills: string[] = [];
    for (let i = 0; i < count; i++) {
      skills.push(await skillInputs.nth(i).inputValue());
    }
    return skills;
  }

  async addJob(data: {
    title: string;
    dates: string;
    company: string;
    location: string;
    responsibilities: string;
  }) {
    await this.addJobButton.click();

    const jobEntries = this.page.locator('.job-entry');
    const lastJobEntry = jobEntries.last();

    await lastJobEntry.locator('.job-title').fill(data.title);

    // Fill date picker for jobs
    await this.fillDatePicker(lastJobEntry.locator('.job-dates-picker'), data.dates);

    await lastJobEntry.locator('.job-company').fill(data.company);
    await lastJobEntry.locator('.job-location').fill(data.location);
    await lastJobEntry.locator('.job-resp').fill(data.responsibilities);
  }

  async removeLastJob() {
    const jobEntries = this.page.locator('.job-entry');
    const count = await jobEntries.count();
    if (count > 1) {
      await jobEntries.last().getByRole('button', { name: 'Remove' }).click();
    }
  }

  async getJobCount(): Promise<number> {
    return await this.page.locator('.job-entry').count();
  }

  async addEducation(data: {
    degree: string;
    years: string;
    institution: string;
  }) {
    await this.addEducationButton.click();

    const eduEntries = this.page.locator('.education-entry');
    const lastEduEntry = eduEntries.last();

    await lastEduEntry.locator('.edu-degree').fill(data.degree);

    // Fill date picker for education
    await this.fillDatePicker(lastEduEntry.locator('.edu-years-picker'), data.years);

    await lastEduEntry.locator('.edu-institution').fill(data.institution);
  }

  async removeLastEducation() {
    const eduEntries = this.page.locator('.education-entry');
    const count = await eduEntries.count();
    if (count > 1) {
      await eduEntries.last().getByRole('button', { name: 'Remove' }).click();
    }
  }

  async getEducationCount(): Promise<number> {
    return await this.page.locator('.education-entry').count();
  }

  async addCertification(certification: string) {
    await this.addCertificationButton.click();

    const certEntries = this.page.locator('.cert-entry');
    const lastCertEntry = certEntries.last();

    await lastCertEntry.locator('.certification').fill(certification);
  }

  async removeLastCertification() {
    const certEntries = this.page.locator('.cert-entry');
    const count = await certEntries.count();
    if (count > 3) { // Original has 3 certs
      await certEntries.last().getByRole('button', { name: 'Remove' }).click();
    }
  }

  async getCertificationCount(): Promise<number> {
    return await this.page.locator('.cert-entry').count();
  }

  async fillReferences(data: {
    ref1Name?: string;
    ref1JobTitle?: string;
    ref1Company?: string;
    ref2Name?: string;
    ref2JobTitle?: string;
    ref2Company?: string;
  }) {
    if (data.ref1Name) {
      await this.ref1NameInput.clear();
      await this.ref1NameInput.fill(data.ref1Name);
    }
    if (data.ref1JobTitle) {
      await this.ref1JobTitleInput.clear();
      await this.ref1JobTitleInput.fill(data.ref1JobTitle);
    }
    if (data.ref1Company) {
      await this.ref1CompanyInput.clear();
      await this.ref1CompanyInput.fill(data.ref1Company);
    }
    if (data.ref2Name) {
      await this.ref2NameInput.clear();
      await this.ref2NameInput.fill(data.ref2Name);
    }
    if (data.ref2JobTitle) {
      await this.ref2JobTitleInput.clear();
      await this.ref2JobTitleInput.fill(data.ref2JobTitle);
    }
    if (data.ref2Company) {
      await this.ref2CompanyInput.clear();
      await this.ref2CompanyInput.fill(data.ref2Company);
    }
  }

  async generatePDF(): Promise<Download> {
    const downloadPromise = this.page.waitForEvent('download');
    await this.generateButton.click();
    return await downloadPromise;
  }

  async verifySuccessMessage() {
    await expect(this.statusMessage).toContainText('PDF downloaded as');
  }

  async clearAllFields() {
    await this.nameInput.clear();
    await this.titleInput.clear();
    await this.phoneInput.clear();
    await this.emailInput.clear();
    await this.locationInput.clear();
    await this.summaryTextarea.clear();
  }

  async verifyGridColumns(expectedColumns: number) {
    const twoColumnSection = this.page.locator('.two-column').first();
    const computedStyle = await twoColumnSection.evaluate((el) => {
      return window.getComputedStyle(el).gridTemplateColumns;
    });

    const columnCount = computedStyle.split(' ').length;
    expect(columnCount).toBe(expectedColumns);
  }

  async verifyResponsiveLayout(viewport: 'desktop' | 'tablet' | 'mobile') {
    const twoColumnSection = this.page.locator('.two-column').first();
    const computedStyle = await twoColumnSection.evaluate((el) => {
      return window.getComputedStyle(el).gridTemplateColumns;
    });

    if (viewport === 'mobile' || viewport === 'tablet') {
      // Should be single column on mobile/tablet
      expect(computedStyle).toBe('1fr');
    } else {
      // Should be two columns on desktop
      expect(computedStyle.split(' ').length).toBe(2);
    }
  }

  async fillDatePicker(datePickerLocator: Locator, dateString: string) {
    // Parse date string (e.g., "Jan 2020 - Dec 2023" or "2025 - Present")
    const parts = dateString.split('-').map(p => p.trim());

    if (parts.length === 0) return;

    // Parse start date
    const startParts = parts[0].split(/\s+/);
    const startSelects = datePickerLocator.locator('select');

    if (startParts.length === 2) {
      // Month Year format
      const isMonthFirst = !/^\d{4}$/.test(startParts[0]);
      if (isMonthFirst) {
        await startSelects.nth(0).selectOption(startParts[0]); // Start month
        await startSelects.nth(1).selectOption(startParts[1]); // Start year
      } else {
        await startSelects.nth(0).selectOption(startParts[1]); // Start month
        await startSelects.nth(1).selectOption(startParts[0]); // Start year
      }
    } else if (startParts.length === 1) {
      // Just year or just month
      const isYear = /^\d{4}$/.test(startParts[0]);
      if (isYear) {
        await startSelects.nth(1).selectOption(startParts[0]); // Start year
      } else {
        await startSelects.nth(0).selectOption(startParts[0]); // Start month
      }
    }

    // Parse end date
    if (parts.length >= 2) {
      const endString = parts[1].toLowerCase();
      if (endString === 'present') {
        // Check the "Present" checkbox
        await datePickerLocator.locator('.present-checkbox').check();
      } else {
        const endParts = parts[1].split(/\s+/);
        if (endParts.length === 2) {
          const isMonthFirst = !/^\d{4}$/.test(endParts[0]);
          if (isMonthFirst) {
            await startSelects.nth(2).selectOption(endParts[0]); // End month
            await startSelects.nth(3).selectOption(endParts[1]); // End year
          } else {
            await startSelects.nth(2).selectOption(endParts[1]); // End month
            await startSelects.nth(3).selectOption(endParts[0]); // End year
          }
        } else if (endParts.length === 1) {
          const isYear = /^\d{4}$/.test(endParts[0]);
          if (isYear) {
            await startSelects.nth(3).selectOption(endParts[0]); // End year
          } else {
            await startSelects.nth(2).selectOption(endParts[0]); // End month
          }
        }
      }
    }
  }
}
