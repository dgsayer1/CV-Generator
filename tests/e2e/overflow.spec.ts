import { test, expect } from '@playwright/test';

test.describe('Overflow Prevention', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for default data to load
    await page.waitForSelector('.job-entry');
  });

  test('work experience entries should not overflow their container', async ({ page }) => {
    const jobEntry = page.locator('.job-entry').first();

    // Get the container width
    const containerBox = await jobEntry.boundingBox();
    expect(containerBox).not.toBeNull();

    // Get all child elements
    const children = jobEntry.locator('*');
    const count = await children.count();

    // Check each child doesn't overflow the parent
    for (let i = 0; i < count; i++) {
      const childBox = await children.nth(i).boundingBox();
      if (childBox && containerBox) {
        // Child's right edge should not exceed parent's right edge (with small tolerance for borders)
        expect(childBox.x + childBox.width).toBeLessThanOrEqual(containerBox.x + containerBox.width + 5);
      }
    }
  });

  test('job responsibilities textarea should not overflow', async ({ page }) => {
    const textarea = page.locator('.job-resp').first();
    const parent = page.locator('.job-entry').first();

    const textareaBox = await textarea.boundingBox();
    const parentBox = await parent.boundingBox();

    expect(textareaBox).not.toBeNull();
    expect(parentBox).not.toBeNull();

    if (textareaBox && parentBox) {
      // Textarea should not exceed parent width
      expect(textareaBox.x + textareaBox.width).toBeLessThanOrEqual(parentBox.x + parentBox.width + 5);
    }
  });

  test('education entries should not overflow', async ({ page }) => {
    const eduEntry = page.locator('.education-entry').first();

    const containerBox = await eduEntry.boundingBox();
    expect(containerBox).not.toBeNull();

    // Check degree and years inputs
    const degreeBox = await eduEntry.locator('.edu-degree').boundingBox();
    const yearsBox = await eduEntry.locator('.edu-years-picker').boundingBox();

    if (degreeBox && yearsBox && containerBox) {
      expect(degreeBox.x + degreeBox.width).toBeLessThanOrEqual(containerBox.x + containerBox.width + 5);
      expect(yearsBox.x + yearsBox.width).toBeLessThanOrEqual(containerBox.x + containerBox.width + 5);
    }
  });

  test('long text in job title should wrap or truncate', async ({ page }) => {
    // Add a job with very long title
    await page.click('#add-job-btn');
    const lastJob = page.locator('.job-entry').last();
    const titleInput = lastJob.locator('.job-title');

    const longTitle = 'A'.repeat(200);
    await titleInput.fill(longTitle);

    // Wait for any layout changes
    await page.waitForTimeout(100);

    const parent = lastJob;
    const titleBox = await titleInput.boundingBox();
    const parentBox = await parent.boundingBox();

    if (titleBox && parentBox) {
      expect(titleBox.x + titleBox.width).toBeLessThanOrEqual(parentBox.x + parentBox.width + 10);
    }
  });

  test('no horizontal scrollbar should appear on job entries', async ({ page }) => {
    const jobEntry = page.locator('.job-entry').first();

    // Check if element has horizontal scroll
    const hasHorizontalScroll = await jobEntry.evaluate((el) => {
      return el.scrollWidth > el.clientWidth;
    });

    expect(hasHorizontalScroll).toBe(false);
  });

  test('screenshot comparison of work experience section', async ({ page }) => {
    const workSection = page.locator('.section:has(h2:text("Work Experience"))');

    // Take screenshot for visual regression
    await expect(workSection).toHaveScreenshot('work-experience-section.png', {
      maxDiffPixels: 100,
    });
  });
});
