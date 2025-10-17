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
  readonly skillsAutomation: Locator;
  readonly skillsProgramming: Locator;
  readonly skillsPerformance: Locator;
  readonly skillsLeadership: Locator;

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
  readonly ref1TitleInput: Locator;
  readonly ref2NameInput: Locator;
  readonly ref2TitleInput: Locator;

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
    this.skillsAutomation = page.locator('#skills-automation');
    this.skillsProgramming = page.locator('#skills-programming');
    this.skillsPerformance = page.locator('#skills-performance');
    this.skillsLeadership = page.locator('#skills-leadership');

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
    this.ref1TitleInput = page.locator('#ref1-title');
    this.ref2NameInput = page.locator('#ref2-name');
    this.ref2TitleInput = page.locator('#ref2-title');

    // Generate
    this.generateButton = page.getByRole('button', { name: 'Generate PDF' });
    this.statusMessage = page.locator('#status');
  }

  async goto() {
    await this.page.goto('/generator.html');
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

  async fillSkills(data: {
    automation?: string;
    programming?: string;
    performance?: string;
    leadership?: string;
  }) {
    if (data.automation) {
      await this.skillsAutomation.clear();
      await this.skillsAutomation.fill(data.automation);
    }
    if (data.programming) {
      await this.skillsProgramming.clear();
      await this.skillsProgramming.fill(data.programming);
    }
    if (data.performance) {
      await this.skillsPerformance.clear();
      await this.skillsPerformance.fill(data.performance);
    }
    if (data.leadership) {
      await this.skillsLeadership.clear();
      await this.skillsLeadership.fill(data.leadership);
    }
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
    ref1Title?: string;
    ref2Name?: string;
    ref2Title?: string;
  }) {
    if (data.ref1Name) {
      await this.ref1NameInput.clear();
      await this.ref1NameInput.fill(data.ref1Name);
    }
    if (data.ref1Title) {
      await this.ref1TitleInput.clear();
      await this.ref1TitleInput.fill(data.ref1Title);
    }
    if (data.ref2Name) {
      await this.ref2NameInput.clear();
      await this.ref2NameInput.fill(data.ref2Name);
    }
    if (data.ref2Title) {
      await this.ref2TitleInput.clear();
      await this.ref2TitleInput.fill(data.ref2Title);
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
