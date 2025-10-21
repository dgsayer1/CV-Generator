# Thumbnail Generation Guide

This guide explains how to manually generate style thumbnails for the CV generator.

## Why Manual Generation?

We use manual thumbnail generation instead of automated scripts to:
- Avoid complex dependencies (Poppler, Sharp with native binaries)
- Reduce CI/CD complexity
- Maintain simplicity (5 minutes for 2-5 styles)
- Ensure thumbnails match actual PDF output exactly

## When to Regenerate Thumbnails

Generate new thumbnails when:
- [ ] A style configuration file is modified (e.g., `src/styles/modernStyle.ts`)
- [ ] A new style is added
- [ ] The PDF rendering logic changes significantly
- [ ] Visual issues are reported with thumbnails

## Manual Generation Process

### Prerequisites
- Application running locally (`npm run dev`)
- Sample CV data loaded (use default data or create realistic sample)
- Screenshot tool (macOS: Cmd+Shift+4, Windows: Snipping Tool, Linux: gnome-screenshot)

### Steps

1. **Start the development server**
   ```bash
   npm run dev
   ```

2. **Open the application in browser**
   - Navigate to `http://localhost:5173` (or your dev server URL)
   - Ensure default sample data is loaded

3. **For each style (Modern, Minimalist, etc.):**

   a. **Select the style**
      - Use the CV Style dropdown to select the target style
      - Verify the selection is active

   b. **Generate the PDF**
      - Click "Generate PDF" button
      - Open the downloaded PDF in a PDF viewer

   c. **Take screenshot of first page**
      - Zoom to 100% (actual size)
      - Take screenshot of entire first page
      - Crop to exact page boundaries (white edges removed)

   d. **Resize and save**
      - Resize image to **300px width** (maintain aspect ratio)
      - For A4 ratio: ~300px × 424px
      - Save as PNG with naming: `{styleId}.png`
        - Example: `modern.png`, `minimalist.png`

4. **Move thumbnails to public directory**
   ```bash
   mkdir -p public/thumbnails
   mv modern.png public/thumbnails/
   mv minimalist.png public/thumbnails/
   # Repeat for other styles...
   ```

5. **Verify thumbnails**
   - Refresh the application
   - Check that thumbnails load correctly
   - Verify image quality and aspect ratio

6. **Commit thumbnails**
   ```bash
   git add public/thumbnails/*.png
   git commit -m "Update style thumbnails"
   ```

## Image Specifications

- **Format**: PNG (for transparency support if needed)
- **Width**: 300px (fixed)
- **Height**: ~424px (A4 aspect ratio: 1:1.414)
- **Quality**: High (no visible compression artifacts)
- **Background**: White (matching PDF output)

## Alternative: Using Browser DevTools

If you prefer programmatic screenshots:

1. Open browser DevTools (F12)
2. Navigate to the PDF in a new tab (use `URL.createObjectURL`)
3. Use DevTools screenshot feature:
   - Chrome: Cmd/Ctrl+Shift+P → "Capture screenshot"
   - Firefox: Right-click → "Take a Screenshot"
4. Follow steps 3d-6 above

## Automation (Future Enhancement)

If the number of styles grows (>10), consider automating with Playwright:

```typescript
// Future: scripts/generateThumbnails.ts
import { chromium } from '@playwright/test';
import { createPDFDocument } from '../src/pdfGenerator';

// Generate PDF → Convert to image → Save
// See Phase 4 of implementation plan for details
```

## Troubleshooting

### Thumbnails don't match PDF output
- Regenerate using the exact same sample data
- Check PDF zoom level is 100%
- Verify style configuration hasn't changed

### Thumbnails look blurry
- Use higher resolution source (600px width, then downsample)
- Ensure PNG compression quality is high
- Use sharp edges (no anti-aliasing on resize)

### File size too large
- Optimize PNG with tools like `pngcrush` or `optipng`
- Target: <100KB per thumbnail
- Use online tools: TinyPNG, ImageOptim

## Sample Data for Thumbnails

Use the default data already in the application, or create a representative sample:

```typescript
// Example data in src/defaultData.ts
export const defaultPersonalInfo = {
  name: 'Alex Johnson',
  title: 'Senior Software Engineer',
  // ... etc
};
```

The default data should be professional and realistic to showcase each style effectively.
