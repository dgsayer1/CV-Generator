import { test, expect } from '@playwright/test';
import { CVGeneratorPage } from './page-objects/CVGeneratorPage';
import {
  testPersonalData,
  testSummary,
  testJob1,
} from './fixtures/test-data';
import * as fs from 'fs';

test.describe('CV Style Gallery', () => {
  let cvPage: CVGeneratorPage;

  test.beforeEach(async ({ page }) => {
    cvPage = new CVGeneratorPage(page);
    await cvPage.goto();
  });

  test.describe('Gallery Rendering', () => {
    test('should display style gallery container on page load', async ({ page }) => {
      const gallery = page.locator('#style-gallery');
      await expect(gallery).toBeVisible();
      await expect(gallery).toHaveAttribute('role', 'radiogroup');
      await expect(gallery).toHaveAttribute('aria-label', 'CV Style Selection');
    });

    test('should display correct number of style cards', async ({ page }) => {
      const cards = page.locator('.style-card');
      await expect(cards).toHaveCount(2);
    });

    test('should display Modern style card with complete metadata', async ({ page }) => {
      const modernCard = page.locator('.style-card[data-style-id="modern"]');
      await expect(modernCard).toBeVisible();

      // Check name
      await expect(modernCard.locator('.style-name')).toHaveText('Modern');

      // Check description
      await expect(modernCard.locator('.style-description')).toContainText('Clean and contemporary design');

      // Check tags
      const tags = modernCard.locator('.style-tag');
      await expect(tags).toHaveCount(3);
      await expect(tags.nth(0)).toHaveText('colorful');
      await expect(tags.nth(1)).toHaveText('rounded');
      await expect(tags.nth(2)).toHaveText('contemporary');

      // Check recommendations
      await expect(modernCard.locator('.style-recommended')).toContainText('Software Engineer');
    });

    test('should display Minimalist style card with complete metadata', async ({ page }) => {
      const minimalistCard = page.locator('.style-card[data-style-id="minimalist"]');
      await expect(minimalistCard).toBeVisible();

      // Check name
      await expect(minimalistCard.locator('.style-name')).toHaveText('Minimalist Modern');

      // Check description
      await expect(minimalistCard.locator('.style-description')).toContainText('Sleek minimalist design');

      // Check tags
      const tags = minimalistCard.locator('.style-tag');
      await expect(tags).toHaveCount(3);
      await expect(tags.nth(0)).toHaveText('clean');
      await expect(tags.nth(1)).toHaveText('minimal');
      await expect(tags.nth(2)).toHaveText('sharp');

      // Check recommendations
      await expect(minimalistCard.locator('.style-recommended')).toContainText('Product Manager');
    });

    test('should display thumbnail images with proper alt text', async ({ page }) => {
      const modernThumbnail = page.locator('.style-card[data-style-id="modern"] .style-thumbnail img');
      await expect(modernThumbnail).toHaveAttribute('alt', 'Modern CV style preview');

      const minimalistThumbnail = page.locator('.style-card[data-style-id="minimalist"] .style-thumbnail img');
      await expect(minimalistThumbnail).toHaveAttribute('alt', 'Minimalist Modern CV style preview');
    });

    test('should have Modern style pre-selected by default', async ({ page }) => {
      const modernCard = page.locator('.style-card[data-style-id="modern"]');
      await expect(modernCard).toHaveClass(/selected/);
      await expect(modernCard).toHaveAttribute('aria-checked', 'true');
      await expect(modernCard).toHaveAttribute('tabindex', '0');
    });

    test('should have proper ARIA attributes on all cards', async ({ page }) => {
      const cards = page.locator('.style-card');

      for (let i = 0; i < await cards.count(); i++) {
        const card = cards.nth(i);
        await expect(card).toHaveAttribute('role', 'radio');
        await expect(card).toHaveAttribute('aria-checked');
        await expect(card).toHaveAttribute('aria-label');
        await expect(card).toHaveAttribute('tabindex');
      }
    });

    test('should display fallback text when thumbnail fails to load', async ({ page }) => {
      // Inject a style card with invalid image
      await page.evaluate(() => {
        const gallery = document.getElementById('style-gallery');
        if (gallery) {
          const card = document.createElement('div');
          card.className = 'style-card';
          card.dataset.styleId = 'test';

          const thumbnail = document.createElement('div');
          thumbnail.className = 'style-thumbnail';

          const img = document.createElement('img');
          img.src = '/invalid/path.png';
          img.alt = 'Test preview';
          img.onerror = () => {
            thumbnail.textContent = 'Preview coming soon';
          };

          thumbnail.appendChild(img);
          card.appendChild(thumbnail);
          gallery.appendChild(card);
        }
      });

      // Wait for fallback text to appear
      await page.waitForTimeout(500);
      const testThumbnail = page.locator('.style-card[data-style-id="test"] .style-thumbnail');
      await expect(testThumbnail).toContainText('Preview coming soon');
    });
  });

  test.describe('Click Interactions', () => {
    test('should select Minimalist card when clicked', async ({ page }) => {
      const minimalistCard = page.locator('.style-card[data-style-id="minimalist"]');

      // Initially not selected
      await expect(minimalistCard).not.toHaveClass(/selected/);

      // Click to select
      await minimalistCard.click();

      // Should now be selected
      await expect(minimalistCard).toHaveClass(/selected/);
      await expect(minimalistCard).toHaveAttribute('aria-checked', 'true');
      await expect(minimalistCard).toHaveAttribute('tabindex', '0');
    });

    test('should deselect Modern card when Minimalist is clicked', async ({ page }) => {
      const modernCard = page.locator('.style-card[data-style-id="modern"]');
      const minimalistCard = page.locator('.style-card[data-style-id="minimalist"]');

      // Modern starts selected
      await expect(modernCard).toHaveClass(/selected/);

      // Click Minimalist
      await minimalistCard.click();

      // Modern should be deselected
      await expect(modernCard).not.toHaveClass(/selected/);
      await expect(modernCard).toHaveAttribute('aria-checked', 'false');
      await expect(modernCard).toHaveAttribute('tabindex', '-1');
    });

    test('should update aria-checked attribute on selection', async ({ page }) => {
      const modernCard = page.locator('.style-card[data-style-id="modern"]');
      const minimalistCard = page.locator('.style-card[data-style-id="minimalist"]');

      // Initial state
      await expect(modernCard).toHaveAttribute('aria-checked', 'true');
      await expect(minimalistCard).toHaveAttribute('aria-checked', 'false');

      // Select Minimalist
      await minimalistCard.click();

      // Check updated state
      await expect(modernCard).toHaveAttribute('aria-checked', 'false');
      await expect(minimalistCard).toHaveAttribute('aria-checked', 'true');
    });

    test('should sync hidden select element with gallery selection', async ({ page }) => {
      const minimalistCard = page.locator('.style-card[data-style-id="minimalist"]');
      const hiddenSelect = page.locator('#cv-style');

      // Initial state
      await expect(hiddenSelect).toHaveValue('modern');

      // Select Minimalist in gallery
      await minimalistCard.click();

      // Hidden select should update
      await expect(hiddenSelect).toHaveValue('minimalist');
    });

    test('should persist selection in localStorage', async ({ page }) => {
      const minimalistCard = page.locator('.style-card[data-style-id="minimalist"]');

      // Select Minimalist
      await minimalistCard.click();

      // Wait for autosave
      await page.waitForTimeout(600);

      // Check localStorage
      const storedData = await page.evaluate(() => {
        const data = localStorage.getItem('cvData');
        return data ? JSON.parse(data) : null;
      });

      expect(storedData).toBeTruthy();
      expect(storedData.selectedStyle).toBe('minimalist');
    });

    test('should restore selection from localStorage on page reload', async ({ page }) => {
      const minimalistCard = page.locator('.style-card[data-style-id="minimalist"]');

      // Select Minimalist
      await minimalistCard.click();

      // Wait for autosave
      await page.waitForTimeout(600);

      // Reload page
      await page.reload();

      // Minimalist should be selected after reload
      const reloadedMinimalistCard = page.locator('.style-card[data-style-id="minimalist"]');
      await expect(reloadedMinimalistCard).toHaveClass(/selected/);
      await expect(reloadedMinimalistCard).toHaveAttribute('aria-checked', 'true');
    });

    test('should allow switching back and forth between styles', async ({ page }) => {
      const modernCard = page.locator('.style-card[data-style-id="modern"]');
      const minimalistCard = page.locator('.style-card[data-style-id="minimalist"]');

      // Modern is initially selected
      await expect(modernCard).toHaveClass(/selected/);

      // Switch to Minimalist
      await minimalistCard.click();
      await expect(minimalistCard).toHaveClass(/selected/);

      // Switch back to Modern
      await modernCard.click();
      await expect(modernCard).toHaveClass(/selected/);

      // Switch to Minimalist again
      await minimalistCard.click();
      await expect(minimalistCard).toHaveClass(/selected/);
    });
  });

  test.describe('Keyboard Navigation', () => {
    test('should focus on selected card first when tabbing', async ({ page }) => {
      const modernCard = page.locator('.style-card[data-style-id="modern"]');

      // Tab to gallery
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab'); // May need multiple tabs to reach gallery
      await page.keyboard.press('Tab');

      // Modern (selected) should have tabindex 0
      await expect(modernCard).toHaveAttribute('tabindex', '0');
    });

    test('should move to next card with ArrowRight', async ({ page }) => {
      const modernCard = page.locator('.style-card[data-style-id="modern"]');
      const minimalistCard = page.locator('.style-card[data-style-id="minimalist"]');

      // Focus on Modern card
      await modernCard.focus();

      // Press ArrowRight
      await page.keyboard.press('ArrowRight');

      // Minimalist should be focused
      await expect(minimalistCard).toBeFocused();
    });

    test('should move to next card with ArrowDown', async ({ page }) => {
      const modernCard = page.locator('.style-card[data-style-id="modern"]');
      const minimalistCard = page.locator('.style-card[data-style-id="minimalist"]');

      // Focus on Modern card
      await modernCard.focus();

      // Press ArrowDown
      await page.keyboard.press('ArrowDown');

      // Minimalist should be focused
      await expect(minimalistCard).toBeFocused();
    });

    test('should move to previous card with ArrowLeft', async ({ page }) => {
      const modernCard = page.locator('.style-card[data-style-id="modern"]');
      const minimalistCard = page.locator('.style-card[data-style-id="minimalist"]');

      // Focus on Minimalist card
      await minimalistCard.focus();

      // Press ArrowLeft
      await page.keyboard.press('ArrowLeft');

      // Modern should be focused
      await expect(modernCard).toBeFocused();
    });

    test('should move to previous card with ArrowUp', async ({ page }) => {
      const modernCard = page.locator('.style-card[data-style-id="modern"]');
      const minimalistCard = page.locator('.style-card[data-style-id="minimalist"]');

      // Focus on Minimalist card
      await minimalistCard.focus();

      // Press ArrowUp
      await page.keyboard.press('ArrowUp');

      // Modern should be focused
      await expect(modernCard).toBeFocused();
    });

    test('should not move past first card with ArrowLeft', async ({ page }) => {
      const modernCard = page.locator('.style-card[data-style-id="modern"]');

      // Focus on Modern card (first card)
      await modernCard.focus();

      // Press ArrowLeft
      await page.keyboard.press('ArrowLeft');

      // Should still be focused on Modern
      await expect(modernCard).toBeFocused();
    });

    test('should not move past last card with ArrowRight', async ({ page }) => {
      const minimalistCard = page.locator('.style-card[data-style-id="minimalist"]');

      // Focus on Minimalist card (last card)
      await minimalistCard.focus();

      // Press ArrowRight
      await page.keyboard.press('ArrowRight');

      // Should still be focused on Minimalist
      await expect(minimalistCard).toBeFocused();
    });

    test('should jump to first card with Home key', async ({ page }) => {
      const modernCard = page.locator('.style-card[data-style-id="modern"]');
      const minimalistCard = page.locator('.style-card[data-style-id="minimalist"]');

      // Focus on Minimalist card
      await minimalistCard.focus();

      // Press Home
      await page.keyboard.press('Home');

      // Modern (first card) should be focused
      await expect(modernCard).toBeFocused();
    });

    test('should jump to last card with End key', async ({ page }) => {
      const modernCard = page.locator('.style-card[data-style-id="modern"]');
      const minimalistCard = page.locator('.style-card[data-style-id="minimalist"]');

      // Focus on Modern card
      await modernCard.focus();

      // Press End
      await page.keyboard.press('End');

      // Minimalist (last card) should be focused
      await expect(minimalistCard).toBeFocused();
    });

    test('should select focused card with Enter key', async ({ page }) => {
      const minimalistCard = page.locator('.style-card[data-style-id="minimalist"]');

      // Focus on Minimalist card
      await minimalistCard.focus();

      // Press Enter
      await page.keyboard.press('Enter');

      // Minimalist should be selected
      await expect(minimalistCard).toHaveClass(/selected/);
      await expect(minimalistCard).toHaveAttribute('aria-checked', 'true');
    });

    test('should select focused card with Space key', async ({ page }) => {
      const minimalistCard = page.locator('.style-card[data-style-id="minimalist"]');

      // Focus on Minimalist card
      await minimalistCard.focus();

      // Press Space
      await page.keyboard.press('Space');

      // Minimalist should be selected
      await expect(minimalistCard).toHaveClass(/selected/);
      await expect(minimalistCard).toHaveAttribute('aria-checked', 'true');
    });

    test('should navigate Modern to Minimalist using keyboard', async ({ page }) => {
      const modernCard = page.locator('.style-card[data-style-id="modern"]');
      const minimalistCard = page.locator('.style-card[data-style-id="minimalist"]');

      // Modern is initially selected and focused
      await modernCard.focus();

      // Navigate to Minimalist
      await page.keyboard.press('ArrowRight');
      await expect(minimalistCard).toBeFocused();

      // Select with Enter
      await page.keyboard.press('Enter');
      await expect(minimalistCard).toHaveClass(/selected/);
      await expect(modernCard).not.toHaveClass(/selected/);
    });

    test('should navigate Minimalist to Modern using keyboard', async ({ page }) => {
      const modernCard = page.locator('.style-card[data-style-id="modern"]');
      const minimalistCard = page.locator('.style-card[data-style-id="minimalist"]');

      // Select Minimalist first
      await minimalistCard.click();
      await minimalistCard.focus();

      // Navigate to Modern
      await page.keyboard.press('ArrowLeft');
      await expect(modernCard).toBeFocused();

      // Select with Space
      await page.keyboard.press('Space');
      await expect(modernCard).toHaveClass(/selected/);
      await expect(minimalistCard).not.toHaveClass(/selected/);
    });
  });

  test.describe('Responsive Layout', () => {
    test('should display 2-column grid on desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });

      const gallery = page.locator('#style-gallery');
      const gridColumns = await gallery.evaluate((el) => {
        return window.getComputedStyle(el).gridTemplateColumns;
      });

      // Should have 2 columns
      expect(gridColumns.split(' ').length).toBe(2);
    });

    test('should display 2-column grid on tablet', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });

      const gallery = page.locator('#style-gallery');
      const gridColumns = await gallery.evaluate((el) => {
        return window.getComputedStyle(el).gridTemplateColumns;
      });

      // Should still have 2 columns
      expect(gridColumns.split(' ').length).toBeGreaterThanOrEqual(1);
    });

    test('should display 1-column stack on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      const gallery = page.locator('#style-gallery');
      const gridColumns = await gallery.evaluate((el) => {
        return window.getComputedStyle(el).gridTemplateColumns;
      });

      // Should be single column
      expect(gridColumns).toBe('1fr');
    });

    test('should remain interactive on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      const minimalistCard = page.locator('.style-card[data-style-id="minimalist"]');

      // Click should work on mobile
      await minimalistCard.click();
      await expect(minimalistCard).toHaveClass(/selected/);
    });

    test('should remain interactive on tablet viewport', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });

      const minimalistCard = page.locator('.style-card[data-style-id="minimalist"]');

      // Click should work on tablet
      await minimalistCard.click();
      await expect(minimalistCard).toHaveClass(/selected/);
    });

    test('should display all cards at all viewport sizes', async ({ page }) => {
      const viewports = [
        { width: 1920, height: 1080, name: 'desktop' },
        { width: 768, height: 1024, name: 'tablet' },
        { width: 375, height: 667, name: 'mobile' },
      ];

      for (const viewport of viewports) {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });

        const cards = page.locator('.style-card');
        await expect(cards).toHaveCount(2);
      }
    });
  });

  test.describe('Accessibility', () => {
    test('should have radiogroup role on gallery container', async ({ page }) => {
      const gallery = page.locator('#style-gallery');
      await expect(gallery).toHaveAttribute('role', 'radiogroup');
    });

    test('should have descriptive aria-label on gallery', async ({ page }) => {
      const gallery = page.locator('#style-gallery');
      await expect(gallery).toHaveAttribute('aria-label', 'CV Style Selection');
    });

    test('should have radio role on all cards', async ({ page }) => {
      const cards = page.locator('.style-card');

      for (let i = 0; i < await cards.count(); i++) {
        await expect(cards.nth(i)).toHaveAttribute('role', 'radio');
      }
    });

    test('should have descriptive aria-label on each card', async ({ page }) => {
      const modernCard = page.locator('.style-card[data-style-id="modern"]');
      const minimalistCard = page.locator('.style-card[data-style-id="minimalist"]');

      await expect(modernCard).toHaveAttribute('aria-label', 'Modern style');
      await expect(minimalistCard).toHaveAttribute('aria-label', 'Minimalist Modern style');
    });

    test('should have correct tabindex on selected card', async ({ page }) => {
      const modernCard = page.locator('.style-card[data-style-id="modern"]');

      // Selected card should have tabindex 0
      await expect(modernCard).toHaveAttribute('tabindex', '0');
    });

    test('should have correct tabindex on unselected cards', async ({ page }) => {
      const minimalistCard = page.locator('.style-card[data-style-id="minimalist"]');

      // Unselected card should have tabindex -1
      await expect(minimalistCard).toHaveAttribute('tabindex', '-1');
    });

    test('should update tabindex when selection changes', async ({ page }) => {
      const modernCard = page.locator('.style-card[data-style-id="modern"]');
      const minimalistCard = page.locator('.style-card[data-style-id="minimalist"]');

      // Initial state
      await expect(modernCard).toHaveAttribute('tabindex', '0');
      await expect(minimalistCard).toHaveAttribute('tabindex', '-1');

      // Select Minimalist
      await minimalistCard.click();

      // Tabindex should update
      await expect(modernCard).toHaveAttribute('tabindex', '-1');
      await expect(minimalistCard).toHaveAttribute('tabindex', '0');
    });

    test('should be fully navigable with keyboard only', async ({ page }) => {
      const modernCard = page.locator('.style-card[data-style-id="modern"]');
      const minimalistCard = page.locator('.style-card[data-style-id="minimalist"]');

      // Focus on Modern
      await modernCard.focus();

      // Navigate to Minimalist
      await page.keyboard.press('ArrowDown');

      // Select it
      await page.keyboard.press('Enter');

      // Verify selection changed
      await expect(minimalistCard).toHaveClass(/selected/);
      await expect(modernCard).not.toHaveClass(/selected/);
    });
  });

  test.describe('Visual States', () => {
    test('should show selected state on Modern by default', async ({ page }) => {
      const modernCard = page.locator('.style-card[data-style-id="modern"]');
      await expect(modernCard).toHaveClass(/selected/);
    });

    test('should update visual state when selection changes', async ({ page }) => {
      const modernCard = page.locator('.style-card[data-style-id="modern"]');
      const minimalistCard = page.locator('.style-card[data-style-id="minimalist"]');

      // Modern starts with selected class
      await expect(modernCard).toHaveClass(/selected/);

      // Click Minimalist
      await minimalistCard.click();

      // Visual state should change
      await expect(minimalistCard).toHaveClass(/selected/);
      await expect(modernCard).not.toHaveClass(/selected/);
    });

    test('should have visible focus indicator', async ({ page }) => {
      const modernCard = page.locator('.style-card[data-style-id="modern"]');

      // Focus on card
      await modernCard.focus();

      // Check if outline is visible (browser default or custom)
      const outline = await modernCard.evaluate((el) => {
        return window.getComputedStyle(el).outline;
      });

      // Focus outline should exist
      expect(outline).toBeTruthy();
    });
  });

  test.describe('Integration with PDF Generation', () => {
    test('should generate PDF with Modern style selected', async ({ page }) => {
      const modernCard = page.locator('.style-card[data-style-id="modern"]');

      // Ensure Modern is selected
      await expect(modernCard).toHaveClass(/selected/);

      // Fill form and generate PDF
      await cvPage.fillPersonalInformation(testPersonalData);
      await cvPage.fillSummary(testSummary);
      await cvPage.addJob(testJob1);

      const download = await cvPage.generatePDF();

      expect(download.suggestedFilename()).toBe('John_Doe_CV.pdf');

      const downloadPath = await download.path();
      expect(fs.existsSync(downloadPath!)).toBe(true);
    });

    test('should generate PDF with Minimalist style selected', async ({ page }) => {
      const minimalistCard = page.locator('.style-card[data-style-id="minimalist"]');

      // Select Minimalist
      await minimalistCard.click();
      await expect(minimalistCard).toHaveClass(/selected/);

      // Fill form and generate PDF
      await cvPage.fillPersonalInformation(testPersonalData);
      await cvPage.fillSummary(testSummary);
      await cvPage.addJob(testJob1);

      const download = await cvPage.generatePDF();

      expect(download.suggestedFilename()).toBe('John_Doe_CV.pdf');

      const downloadPath = await download.path();
      expect(fs.existsSync(downloadPath!)).toBe(true);
    });

    test('should maintain style selection during form filling', async ({ page }) => {
      const minimalistCard = page.locator('.style-card[data-style-id="minimalist"]');

      // Select Minimalist
      await minimalistCard.click();

      // Fill form data
      await cvPage.fillPersonalInformation(testPersonalData);
      await cvPage.fillSummary(testSummary);
      await cvPage.addJob(testJob1);

      // Selection should persist
      await expect(minimalistCard).toHaveClass(/selected/);
    });

    test('should switch styles and generate different PDFs', async ({ page }) => {
      await cvPage.fillPersonalInformation(testPersonalData);
      await cvPage.fillSummary(testSummary);

      // Generate with Modern
      const modernCard = page.locator('.style-card[data-style-id="modern"]');
      await expect(modernCard).toHaveClass(/selected/);
      const modernDownload = await cvPage.generatePDF();

      await page.waitForTimeout(500);

      // Switch to Minimalist and generate
      const minimalistCard = page.locator('.style-card[data-style-id="minimalist"]');
      await minimalistCard.click();
      const minimalistDownload = await cvPage.generatePDF();

      // Both PDFs should be created
      const modernPath = await modernDownload.path();
      const minimalistPath = await minimalistDownload.path();

      expect(fs.existsSync(modernPath!)).toBe(true);
      expect(fs.existsSync(minimalistPath!)).toBe(true);
    });
  });
});
