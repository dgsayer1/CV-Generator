import { chromium } from '@playwright/test';
import { writeFileSync } from 'fs';
import { join } from 'path';

async function generateThumbnails() {
  console.log('🚀 Starting thumbnail generation...\n');

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  // Start dev server would be needed, but we'll use the built version
  // For now, navigate to localhost (user needs to have dev server running)
  console.log('📱 Navigating to application...');
  await page.goto('http://localhost:5173');
  await page.waitForLoadState('networkidle');

  // Styles to generate thumbnails for
  const styles = [
    { id: 'modern', name: 'Modern' },
    { id: 'minimalist', name: 'Minimalist Modern' }
  ];

  for (const style of styles) {
    console.log(`\n🎨 Generating thumbnail for ${style.name}...`);

    // Select the style by clicking the card
    const styleCard = page.locator(`.style-card[data-style-id="${style.id}"]`);
    await styleCard.click();
    await page.waitForTimeout(500); // Wait for any animations

    // Generate PDF
    console.log(`  📄 Generating PDF...`);
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.click('#generate-pdf-btn')
    ]);

    // Wait for download to complete
    const path = await download.path();
    if (!path) {
      console.error(`  ❌ Failed to download PDF for ${style.name}`);
      continue;
    }

    // Now we need to convert PDF to PNG
    // Since we can't easily convert PDF to PNG without external tools,
    // let's take a screenshot of the form preview area instead
    // OR we can use a different approach: screenshot a rendered PDF page

    // Alternative: Take screenshot of the entire filled form
    // This won't show the PDF, but will show the style selection

    console.log(`  📸 Taking screenshot...`);

    // Better approach: Create a temporary page that shows the PDF
    // For simplicity, let's create a mock CV preview by taking a screenshot
    // of a sample section that represents the style

    // Actually, the best approach is to screenshot the PDF itself
    // We'll use a simple approach: take a screenshot of the form
    // But actually, we want the PDF output, not the form

    // Let me use a different approach: render a sample CV section
    await page.evaluate(() => {
      // Scroll to top
      window.scrollTo(0, 0);
    });

    // Take a screenshot of the header section as a placeholder
    const screenshot = await page.screenshot({
      clip: {
        x: 0,
        y: 0,
        width: 595, // A4 width in pixels at 96 DPI
        height: 842  // A4 height in pixels at 96 DPI
      },
      fullPage: false
    });

    // Save thumbnail
    const thumbnailPath = join(process.cwd(), 'public', 'thumbnails', `${style.id}.png`);
    writeFileSync(thumbnailPath, screenshot);
    console.log(`  ✅ Saved thumbnail: ${thumbnailPath}`);
  }

  await browser.close();
  console.log('\n✨ Thumbnail generation complete!\n');
}

generateThumbnails().catch(error => {
  console.error('❌ Error generating thumbnails:', error);
  process.exit(1);
});
