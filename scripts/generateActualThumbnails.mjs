import { chromium } from '@playwright/test';
import { execSync } from 'child_process';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

async function generateThumbnails() {
  console.log('🚀 Starting thumbnail generation...\n');

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Navigate to local dev server
  console.log('📱 Navigating to application...');
  await page.goto('http://localhost:5173');
  await page.waitForLoadState('networkidle');

  // Fill in sample CV data
  console.log('✍️  Filling sample CV data...');
  await page.fill('#name', 'John Doe');
  await page.fill('#title', 'Software Engineer');
  await page.fill('#email', 'john.doe@example.com');
  await page.fill('#phone', '+1 234 567 8900');
  await page.fill('#location', 'San Francisco, CA');
  await page.fill('#summary', 'Experienced software engineer with expertise in full-stack development, cloud architecture, and team leadership.');

  // Add skills
  await page.click('#add-skill-category-btn');
  await page.waitForTimeout(300);
  const skillInputs = await page.locator('.skill-input').all();
  if (skillInputs.length > 0) {
    await skillInputs[0].fill('TypeScript, React, Node.js, AWS, Docker, Kubernetes');
  }

  // Add work experience
  await page.click('#add-job-btn');
  await page.waitForTimeout(300);
  await page.fill('[id^="job-"][id$="-title"]', 'Senior Software Engineer');
  await page.fill('[id^="job-"][id$="-company"]', 'Tech Corp');
  await page.fill('[id^="job-"][id$="-start-date"]', '2020-01');
  await page.fill('[id^="job-"][id$="-end-date"]', '2024-12');
  await page.fill('[id^="job-"][id$="-responsibilities"]', 'Led development of microservices architecture serving 1M+ users\\nMentored junior developers and improved code quality');

  // Add education
  await page.click('#add-education-btn');
  await page.waitForTimeout(300);
  await page.fill('[id^="education-"][id$="-degree"]', 'Bachelor of Science in Computer Science');
  await page.fill('[id^="education-"][id$="-institution"]', 'University of California');
  await page.fill('[id^="education-"][id$="-graduation-date"]', '2018');

  console.log('✅ Sample data filled\n');

  // Generate thumbnails for both styles
  const styles = ['modern', 'minimalist'];
  const thumbnailsDir = join(projectRoot, 'public', 'thumbnails');

  if (!existsSync(thumbnailsDir)) {
    mkdirSync(thumbnailsDir, { recursive: true });
  }

  for (const styleId of styles) {
    console.log(`\n🎨 Generating thumbnail for ${styleId}...`);

    // Select the style
    await page.click(`.style-card[data-style-id="${styleId}"]`);
    await page.waitForTimeout(500);

    // Generate and download PDF
    console.log(`  📄 Generating PDF...`);
    const downloadPromise = page.waitForEvent('download');
    await page.click('#generate-pdf-btn');
    const download = await downloadPromise;

    const pdfPath = join('/tmp', `cv-${styleId}.pdf`);
    await download.saveAs(pdfPath);
    console.log(`  ✅ PDF saved: ${pdfPath}`);

    // Convert PDF to PNG using ghostscript
    console.log(`  🖼️  Converting to PNG...`);
    const tempPngPath = join('/tmp', `temp-${styleId}.png`);
    const finalPngPath = join(thumbnailsDir, `${styleId}.png`);

    try {
      // Convert first page of PDF to PNG at 150 DPI
      execSync(
        `gs -dSAFER -dBATCH -dNOPAUSE -sDEVICE=png16m -r150 -dFirstPage=1 -dLastPage=1 -sOutputFile="${tempPngPath}" "${pdfPath}" 2>/dev/null`,
        { stdio: 'ignore' }
      );

      // Resize to exact dimensions (300x424)
      execSync(
        `sips -z 424 300 "${tempPngPath}" --out "${finalPngPath}"`,
        { stdio: 'ignore' }
      );

      // Cleanup
      execSync(`rm -f "${tempPngPath}" "${pdfPath}"`);

      console.log(`  ✅ Thumbnail created: ${finalPngPath}`);
    } catch (error) {
      console.error(`  ❌ Error converting ${styleId}:`, error.message);
    }
  }

  await browser.close();
  console.log('\n✨ Thumbnail generation complete!\n');
}

generateThumbnails().catch(error => {
  console.error('❌ Error generating thumbnails:', error);
  process.exit(1);
});
