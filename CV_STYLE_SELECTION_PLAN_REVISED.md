# CV Generator Style Selection - Revised Implementation Plan

## Executive Summary

This plan implements a static thumbnail gallery approach for CV style selection, avoiding dual-rendering complexity. The architecture leverages the existing `styleConfig.ts` system, stores only essential data (style ID + CV data), and uses pre-generated static thumbnails for instant preview. Each phase delivers incremental value over realistic 2-3 week timelines for a single engineer.

**Current State**: Basic 2-style system works (Modern, Minimalist). HTML UI exists. E2E and unit tests passing.

**Target State**: Polished multi-style selection with static thumbnail gallery, expanded to 5 styles, with persistence and excellent UX.

---

## Goals & Objectives

### Primary Goal

Enable users to select from multiple professionally-designed CV styles with visual preview, without maintaining dual rendering engines.

### Success Metrics

- Static thumbnail gallery loads in <200ms
- High test coverage for style switching and persistence
- 5 distinct styles available by Phase 3 completion
- Zero rendering drift between thumbnails and PDFs (single source of truth)
- User can switch styles and regenerate PDFs seamlessly

### Non-Goals (Out of Scope)

- Custom style builder/editor (future enhancement)
- Density controls (separate feature)
- Dynamic thumbnail rendering (explicitly avoided)
- Per-style font/color customization UI (users customize globally for now)

---

## Technical Architecture

### Static Thumbnail Approach

**Rationale**: Avoids dual-rendering complexity, drift, and maintenance burden.

**Implementation**:

1. Pre-generate style thumbnails using sample CV data
2. Store as static PNG/WebP images in `public/thumbnails/`
3. Gallery displays `<img>` tags with lazy loading
4. Thumbnails regenerated manually when styles change (documented process)

**Directory Structure**:

```
public/
└── thumbnails/
    ├── modern.png
    ├── minimalist.png
    ├── professional.png
    ├── creative.png
    └── executive.png
```

**Benefits**:

- Zero runtime rendering overhead
- No drift between preview and PDF (same jsPDF renderer)
- Single test suite (no Canvas testing needed)
- Instant load times
- Simple to maintain

### Persistence Strategy (Simplified)

**Store Only**:

- `selectedStyleId`: string (e.g., "modern")
- `cvData`: existing CV form data

**Do NOT Store**:

- Colors, fonts, density (user can't customize per-style yet)
- Style definitions (these come from styleConfig.ts)

**LocalStorage Schema**:

```typescript
interface PersistedData {
  version: string;         // "1.0" for schema versioning
  selectedStyle: CVStyle;  // "modern" | "minimalist" | "professional" | etc.
  cvData: CVData;          // existing structure
}
```

### Type System Extensions

**Expand CVStyle Union**:

```typescript
// types.ts
export type CVStyle =
  | 'modern'
  | 'minimalist'
  | 'professional'  // Phase 3.1
  | 'creative'      // Phase 3.2
  | 'executive';    // Phase 3.3
```

**Metadata System**:

```typescript
// styles/styleMetadata.ts
export interface StyleMetadata {
  id: CVStyle;
  displayName: string;
  description: string;
  thumbnail: string;         // path to static image
  tags: string[];            // e.g., ["modern", "colorful"]
  recommendedFor: string[];  // e.g., ["tech", "creative"]
}

export const styleMetadata: Record<CVStyle, StyleMetadata> = {
  modern: {
    id: 'modern',
    displayName: 'Modern',
    description: 'Clean design with colored header and rounded corners',
    thumbnail: '/thumbnails/modern.png',
    tags: ['colorful', 'rounded'],
    recommendedFor: ['tech', 'marketing', 'general']
  },
  // ... etc
};
```

### Font Selection (Freely Available Fonts Only)

**Google Fonts** (free, easy embedding):

- Roboto (modern, sans-serif)
- Open Sans (clean, readable)
- Lora (elegant, serif)
- Merriweather (classic, serif)
- Montserrat (geometric, sans-serif)

**System Fonts** (already available):

- Helvetica (current default)
- Arial
- Georgia
- Times New Roman
- Courier New

**Implementation**: Use jsPDF's font embedding or fallback to system fonts.

---

## Phase 1: Foundation (2-3 weeks)

### Objective

Establish solid architecture with 2 working styles, basic thumbnail gallery, and persistence. **No density controls, no complex E2E tests yet.**

### Milestone 1.1: Architecture Refactor (Week 1)

**Tasks**:

- [ ] Create `src/styles/styleMetadata.ts` with metadata for Modern + Minimalist
  - DisplayName, description, thumbnail path, tags
  - Export `styleMetadata` registry
  - Export helper: `getStyleMetadata(id: CVStyle)`

- [ ] Update `src/types.ts`
  - Keep existing `CVStyle = 'modern' | 'minimalist'` (no new styles yet)
  - Ensure `CVData.cvStyle` already exists (already done)

- [ ] Create thumbnail generation script `scripts/generateThumbnails.ts`
  - Use sample CV data (hard-coded realistic profile)
  - Generate PDFs for each style using existing `pdfGenerator.ts`
  - Convert first page to PNG using `pdf-to-png` library
  - Save to `public/thumbnails/{styleId}.png`
  - Document usage in script comments

- [ ] Generate initial thumbnails
  - Run script for Modern and Minimalist
  - Verify thumbnails look professional (300px width)
  - Commit to repo

**Deliverable**: Architecture foundation with static thumbnails for 2 styles.

**Testing**:

- Unit test `styleMetadata.ts` (validate all metadata complete)
- Manual verification: thumbnails render correctly

### Milestone 1.2: Basic Persistence (Week 1-2)

**Tasks**:

- [ ] Create `src/persistence.ts` module
  - `saveData(cvData: CVData, styleId: CVStyle): void`
  - `loadData(): { cvData: CVData; styleId: CVStyle } | null`
  - `clearData(): void`
  - Version schema: `{ version: "1.0", selectedStyle, cvData }`
  - Error handling for corrupted localStorage

- [ ] Integrate persistence into `src/formHandler.ts`
  - Save on every significant form change (debounced 500ms)
  - Load on page initialization
  - Restore style selector value

- [ ] Update `src/main.ts`
  - Call `loadData()` on init
  - Populate form fields with loaded data
  - Set style selector to loaded style

**Deliverable**: Form data and style selection persist across page reloads.

**Testing**:

- Unit tests for `persistence.ts` (save, load, clear, version handling)
- Manual testing: fill form, reload, verify restoration

### Milestone 1.3: Style Switching Integration (Week 2)

**Tasks**:

- [ ] Update `src/pdfGenerator.ts`
  - Already uses `getStyleConfig(data.cvStyle)` - verify it works
  - Ensure theme color and font are applied correctly per style

- [ ] Update HTML selector event handler
  - Listen to `#cv-style` change event
  - Trigger save to persistence on change
  - No preview needed yet (thumbnails are static)

- [ ] Verify E2E tests pass
  - Existing `tests/e2e/styleSelector.spec.ts` covers:
    - Style selector UI
    - Modern PDF generation
    - Minimalist PDF generation
    - Style switching
  - Fix any broken tests from refactor

**Deliverable**: Users can select styles, generate PDFs, and selection persists.

**Testing**:

- Run existing E2E suite (`tests/e2e/styleSelector.spec.ts`)
- Verify no regressions

### Milestone 1.4: Basic Unit Tests (Week 2-3)

**Tasks**:

- [ ] Expand `tests/unit/styleConfig.test.ts`
  - Already comprehensive, verify still passing
  - Add tests for any new helper functions

- [ ] Create `tests/unit/styleMetadata.test.ts`
  - Test metadata completeness (all styles have required fields)
  - Test `getStyleMetadata()` helper
  - Test thumbnail paths are valid

- [ ] Create `tests/unit/persistence.test.ts`
  - Mock localStorage
  - Test save/load/clear operations
  - Test schema versioning
  - Test error handling (corrupted data)

**Deliverable**: Solid unit test coverage for new modules.

**Testing**:

- Run `npm run test:unit`
- Achieve >90% coverage on new modules

### Phase 1 Success Criteria

- [x] 2 styles (Modern, Minimalist) working with static thumbnails
- [x] Style selection persists across page reloads
- [x] User can switch styles and regenerate PDFs
- [x] Existing E2E tests pass without modification
- [x] Unit tests cover new modules (>90% coverage)
- [x] Thumbnails load in <200ms
- [x] Documentation: thumbnail regeneration process

**Risk Mitigation**:

- If thumbnail generation script is complex, use manual screenshot process initially
- If persistence has edge cases, start with happy path only

---

## Phase 2: Thumbnail Gallery UI (2-3 weeks)

### Objective

Replace dropdown selector with visual thumbnail gallery. Improve UX with hover states, descriptions, and responsive layout.

### Milestone 2.1: Gallery Component HTML/CSS (Week 1)

**Tasks**:

- [ ] Design gallery layout
  - 2-column grid on desktop (600px+ width)
  - 1-column stack on mobile
  - Each card: thumbnail image + name + short description
  - Selected state: border highlight (theme color)
  - Hover state: subtle shadow

- [ ] Update `index.html`
  - Replace `<select id="cv-style">` with `<div id="style-gallery">`
  - Keep accessible (ARIA roles, keyboard navigation)
  - Move to new section above form (prominent placement)

- [ ] Create CSS styles (`src/styles/gallery.css`)
  - Responsive grid layout
  - Card design (border, shadow, hover effects)
  - Selected state highlighting
  - Lazy loading for thumbnails

- [ ] Implement gallery rendering in `src/main.ts`
  - Dynamically generate gallery cards from `styleMetadata`
  - Attach click handlers to select style
  - Keyboard navigation (arrow keys, Enter to select)

**Deliverable**: Visual gallery UI replaces dropdown selector.

**Testing**:

- Manual: verify responsive layout on mobile/tablet/desktop
- Manual: test keyboard navigation
- Manual: verify selected state highlights correctly

### Milestone 2.2: Gallery Interactions (Week 1-2)

**Tasks**:

- [ ] Implement selection logic
  - Click card to select style
  - Update `selectedStyleId` state
  - Visual feedback (border highlight)
  - Save to persistence

- [ ] Add "More Info" tooltips
  - Hover over card shows full description
  - Display tags (e.g., "Modern, Colorful")
  - Display "Recommended for: Tech, Marketing"

- [ ] Add "Preview" modal (optional enhancement)
  - Click thumbnail opens larger view
  - Shows full-page thumbnail (if available)
  - Close with X or ESC key

**Deliverable**: Interactive gallery with selection, tooltips, and optional preview.

**Testing**:

- Manual: test all interactions
- Manual: verify tooltips display correctly
- Manual: verify persistence still works

### Milestone 2.3: E2E Tests for Gallery (Week 2-3)

**Tasks**:

- [ ] Create `tests/e2e/styleGallery.spec.ts`
  - Test gallery renders all styles
  - Test clicking card selects style
  - Test selected state is visible
  - Test keyboard navigation (Tab, Arrow keys, Enter)
  - Test accessibility (ARIA attributes, labels)
  - Test responsive layout (mobile, tablet, desktop viewports)

- [ ] Update existing `tests/e2e/styleSelector.spec.ts`
  - Remove dropdown-specific tests
  - Keep PDF generation tests (still valid)
  - Update selectors to target gallery cards

**Deliverable**: Comprehensive E2E coverage for gallery UI.

**Testing**:

- Run `npm run test:e2e`
- Verify all tests pass

### Milestone 2.4: Visual Regression Testing (Week 3)

**Tasks**:

- [ ] Add Playwright screenshot tests for gallery
  - Capture gallery in default state
  - Capture gallery with style selected
  - Capture gallery on mobile/tablet/desktop
  - Store baselines in `tests/e2e/screenshots/`

- [ ] Document visual testing process
  - How to update baselines when thumbnails change
  - CI/CD integration considerations

**Deliverable**: Visual regression tests to catch UI breakage.

**Testing**:

- Run visual regression tests
- Verify baselines are correct

### Phase 2 Success Criteria

- [x] Visual gallery replaces dropdown selector
- [x] Gallery is responsive (mobile, tablet, desktop)
- [x] Clicking card selects style and updates persistence
- [x] Keyboard navigation works (accessible)
- [x] E2E tests cover gallery interactions
- [x] Visual regression tests capture gallery states
- [x] Gallery loads in <200ms (static images)

**Risk Mitigation**:

- If responsive CSS is complex, start with desktop-only, add mobile later
- If visual tests are flaky, use higher tolerance thresholds

---

## Phase 3: New Styles (3 weeks, 1 week per style)

### Objective

Add 3 new professional styles: Professional, Creative, Executive. Each style requires design, implementation, testing, and thumbnail generation.

**Approach**: Add one style at a time with proper QA. Avoid rushing.

### Milestone 3.1: Professional Style (Week 1)

**Tasks**:

- [ ] Design Professional style
  - Concept: Traditional corporate aesthetic
  - Features: Serif fonts (Georgia/Lora), formal layout, conservative colors
  - Sketch layout on paper or Figma
  - Define `StyleConfig` values

- [ ] Implement `src/styles/professionalStyle.ts`
  - Define complete `StyleConfig`
  - Match existing pattern (Modern, Minimalist)
  - Use conservative colors (navy, gray)
  - Use serif fonts (Georgia or embedded Lora)

- [ ] Update `src/types.ts`
  - Add `'professional'` to `CVStyle` union

- [ ] Update `src/styles/styleConfig.ts`
  - Add case for `'professional'` in `getStyleConfig()`

- [ ] Update `src/styles/styleMetadata.ts`
  - Add metadata for Professional style

- [ ] Generate thumbnail
  - Run thumbnail generation script
  - Verify professional appearance

- [ ] Test PDF generation
  - Manual test: fill form, select Professional, generate PDF
  - Verify layout, fonts, colors

**Deliverable**: Professional style working end-to-end.

**Testing**:

- Unit tests: add Professional to `tests/unit/styleConfig.test.ts`
- E2E tests: add Professional to generation tests
- Manual QA: verify PDF looks professional

### Milestone 3.2: Creative Style (Week 2)

**Tasks**:

- [ ] Design Creative style
  - Concept: Bold, modern, colorful for creative industries
  - Features: Sans-serif fonts (Montserrat/Roboto), asymmetric layout, vibrant colors
  - Define `StyleConfig` values

- [ ] Implement `src/styles/creativeStyle.ts`
  - Define complete `StyleConfig`
  - Use bright accent colors
  - Experiment with bolder typography hierarchy

- [ ] Update `src/types.ts`
  - Add `'creative'` to `CVStyle` union

- [ ] Update `src/styles/styleConfig.ts`
  - Add case for `'creative'`

- [ ] Update `src/styles/styleMetadata.ts`
  - Add metadata for Creative style

- [ ] Generate thumbnail
  - Run script
  - Verify creative aesthetic

- [ ] Test PDF generation

**Deliverable**: Creative style working end-to-end.

**Testing**:

- Same as Professional (unit, E2E, manual)

### Milestone 3.3: Executive Style (Week 3)

**Tasks**:

- [ ] Design Executive style
  - Concept: Luxurious, minimalist, high-end for executives/leadership
  - Features: Elegant serif (Merriweather), generous white space, subtle colors
  - Define `StyleConfig` values

- [ ] Implement `src/styles/executiveStyle.ts`
  - Define complete `StyleConfig`
  - Emphasize white space and typography
  - Use muted, sophisticated colors

- [ ] Update `src/types.ts`
  - Add `'executive'` to `CVStyle` union

- [ ] Update `src/styles/styleConfig.ts`
  - Add case for `'executive'`

- [ ] Update `src/styles/styleMetadata.ts`
  - Add metadata for Executive style

- [ ] Generate thumbnail
  - Run script
  - Verify luxury/executive feel

- [ ] Test PDF generation

**Deliverable**: Executive style working end-to-end.

**Testing**:

- Same as Professional and Creative

### Milestone 3.4: Final Polish & Documentation (Week 3)

**Tasks**:

- [ ] Update README
  - Document 5 available styles
  - Screenshot of gallery
  - Instructions for regenerating thumbnails

- [ ] Create style design guide
  - Document when to use each style
  - Target industries/roles
  - Design principles per style

- [ ] Performance audit
  - Verify gallery loads in <200ms
  - Optimize thumbnail file sizes (WebP compression)
  - Lazy loading if needed

- [ ] Final E2E test sweep
  - Run full suite against all 5 styles
  - Fix any flaky tests

**Deliverable**: Polished feature with 5 styles and complete documentation.

**Testing**:

- Full regression test suite
- Manual smoke test all 5 styles

### Phase 3 Success Criteria

- [x] 5 distinct styles available (Modern, Minimalist, Professional, Creative, Executive)
- [x] Each style has unique visual identity
- [x] All thumbnails generated and committed
- [x] All E2E tests pass for all styles
- [x] Documentation complete (README, style guide)
- [x] Gallery loads in <200ms
- [x] User feedback incorporated (if pilot tested)

**Risk Mitigation**:

- If design takes longer than expected, simplify Creative/Executive styles
- If fonts cause licensing issues, fallback to system fonts only
- If one style breaks tests, defer to Phase 4 (launch with 4 styles)

---

## Implementation Details

### Thumbnail Generation Process

**Script**: `scripts/generateThumbnails.ts`

```typescript
import jsPDF from 'jspdf';
import { pdfToPng } from 'pdf-to-png-converter';
import fs from 'fs';
import path from 'path';
import type { CVData, CVStyle } from '../src/types';
import { generatePDF } from '../src/pdfGenerator';

// Sample CV data for thumbnails
const sampleData: CVData = {
  personal: {
    name: 'Alex Johnson',
    title: 'Senior Software Engineer',
    phone: '+1 (555) 123-4567',
    email: 'alex.johnson@example.com',
    location: 'San Francisco, CA',
    summary: 'Experienced software engineer with 8+ years building scalable web applications. Passionate about clean code and mentoring junior developers.'
  },
  skills: {
    'Languages': ['TypeScript', 'Python', 'Go', 'SQL'],
    'Frontend': ['React', 'Vue.js', 'CSS/Sass'],
    'Backend': ['Node.js', 'Django', 'PostgreSQL'],
    'DevOps': ['Docker', 'Kubernetes', 'AWS', 'CI/CD']
  },
  jobs: [
    {
      title: 'Senior Software Engineer',
      dates: 'Jan 2020 - Present',
      company: 'Tech Innovations Inc.',
      location: 'San Francisco, CA',
      responsibilities: [
        'Led development of microservices architecture serving 2M+ users',
        'Mentored team of 5 junior engineers',
        'Reduced API latency by 40% through optimization'
      ]
    },
    {
      title: 'Software Engineer',
      dates: 'Jun 2017 - Dec 2019',
      company: 'StartupXYZ',
      location: 'Palo Alto, CA',
      responsibilities: [
        'Built responsive frontend using React and TypeScript',
        'Implemented RESTful APIs with Node.js and PostgreSQL'
      ]
    }
  ],
  education: [
    {
      degree: 'B.S. Computer Science',
      years: '2013 - 2017',
      institution: 'University of California, Berkeley'
    }
  ],
  certifications: [
    'AWS Certified Solutions Architect',
    'Certified Kubernetes Administrator'
  ],
  references: [
    { name: 'Sarah Williams', title: 'Engineering Manager', company: 'Tech Innovations Inc.' },
    { name: 'Michael Chen', title: 'CTO', company: 'StartupXYZ' }
  ],
  cvStyle: 'modern', // will be overridden
  themeColor: '#667eea',
  fontFamily: 'helvetica'
};

async function generateThumbnail(styleId: CVStyle) {
  const outputDir = path.join(__dirname, '../public/thumbnails');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Generate PDF with this style
  const cvData = { ...sampleData, cvStyle: styleId };
  const doc = generatePDFDocument(cvData); // internal version that returns doc instead of saving

  // Save PDF to temp file
  const tempPdfPath = path.join(outputDir, `${styleId}_temp.pdf`);
  fs.writeFileSync(tempPdfPath, doc.output('arraybuffer'));

  // Convert first page to PNG
  const pngPages = await pdfToPng(tempPdfPath, {
    outputFolder: outputDir,
    width: 300, // thumbnail width
    viewportScale: 2.0 // high quality
  });

  // Rename first page
  const thumbnailPath = path.join(outputDir, `${styleId}.png`);
  fs.renameSync(pngPages[0].path, thumbnailPath);

  // Clean up temp PDF
  fs.unlinkSync(tempPdfPath);

  console.log(`✓ Generated thumbnail for ${styleId}: ${thumbnailPath}`);
}

async function main() {
  const styles: CVStyle[] = ['modern', 'minimalist', 'professional', 'creative', 'executive'];

  for (const style of styles) {
    await generateThumbnail(style);
  }

  console.log('\n✓ All thumbnails generated successfully!');
}

main().catch(console.error);
```

**Usage**:

```bash
npm run generate-thumbnails
```

**When to Regenerate**:

- After modifying any `StyleConfig` in `src/styles/`
- After changing sample data in script
- Before releasing new style
- During design iteration

### Persistence Module

**File**: `src/persistence.ts`

```typescript
import type { CVData, CVStyle } from './types';

const STORAGE_KEY = 'cv-generator-data';
const CURRENT_VERSION = '1.0';

interface PersistedData {
  version: string;
  selectedStyle: CVStyle;
  cvData: CVData;
}

export function saveData(cvData: CVData, selectedStyle: CVStyle): void {
  try {
    const data: PersistedData = {
      version: CURRENT_VERSION,
      selectedStyle,
      cvData
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save data to localStorage:', error);
  }
}

export function loadData(): { cvData: CVData; selectedStyle: CVStyle } | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const data: PersistedData = JSON.parse(stored);

    // Version check (for future migrations)
    if (data.version !== CURRENT_VERSION) {
      console.warn('Data version mismatch. Clearing old data.');
      clearData();
      return null;
    }

    return {
      cvData: data.cvData,
      selectedStyle: data.selectedStyle
    };
  } catch (error) {
    console.error('Failed to load data from localStorage:', error);
    clearData(); // Clear corrupted data
    return null;
  }
}

export function clearData(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear localStorage:', error);
  }
}
```

### Style Metadata Registry

**File**: `src/styles/styleMetadata.ts`

```typescript
import type { CVStyle } from '../types';

export interface StyleMetadata {
  id: CVStyle;
  displayName: string;
  description: string;
  thumbnail: string;
  tags: string[];
  recommendedFor: string[];
}

export const styleMetadata: Record<CVStyle, StyleMetadata> = {
  modern: {
    id: 'modern',
    displayName: 'Modern',
    description: 'Clean and contemporary design with colorful header and rounded corners. Perfect for tech and creative roles.',
    thumbnail: '/thumbnails/modern.png',
    tags: ['colorful', 'rounded', 'contemporary'],
    recommendedFor: ['Software Engineer', 'Designer', 'Marketing Manager']
  },
  minimalist: {
    id: 'minimalist',
    displayName: 'Minimalist Modern',
    description: 'Sleek minimalist design with sharp lines and maximum white space. Ideal for design-conscious professionals.',
    thumbnail: '/thumbnails/minimalist.png',
    tags: ['clean', 'minimal', 'sharp'],
    recommendedFor: ['Product Manager', 'Architect', 'Consultant']
  },
  professional: {
    id: 'professional',
    displayName: 'Professional',
    description: 'Traditional corporate design with serif fonts and formal layout. Best for conservative industries.',
    thumbnail: '/thumbnails/professional.png',
    tags: ['formal', 'traditional', 'serif'],
    recommendedFor: ['Finance Professional', 'Legal', 'Healthcare']
  },
  creative: {
    id: 'creative',
    displayName: 'Creative',
    description: 'Bold and vibrant design with asymmetric layout and striking colors. For creative industries.',
    thumbnail: '/thumbnails/creative.png',
    tags: ['bold', 'vibrant', 'asymmetric'],
    recommendedFor: ['Graphic Designer', 'Artist', 'Creative Director']
  },
  executive: {
    id: 'executive',
    displayName: 'Executive',
    description: 'Luxurious minimalist design with elegant typography and generous spacing. For senior leadership.',
    thumbnail: '/thumbnails/executive.png',
    tags: ['elegant', 'luxury', 'spacious'],
    recommendedFor: ['C-Level Executive', 'Director', 'VP']
  }
};

export function getStyleMetadata(id: CVStyle): StyleMetadata {
  return styleMetadata[id];
}

export function getAllStyleMetadata(): StyleMetadata[] {
  return Object.values(styleMetadata);
}
```

---

## Testing Strategy

### Unit Tests

**Coverage Areas**:

- `styleConfig.ts`: All style configs have valid structure
- `styleMetadata.ts`: All metadata complete and valid
- `persistence.ts`: Save, load, clear, versioning, error handling
- Individual style files: Validate config completeness

**Target**: >90% line coverage on new modules

**Tools**: Vitest, existing test infrastructure

### E2E Tests

**Coverage Areas**:

- Gallery UI rendering
- Style selection (click, keyboard)
- PDF generation with each style
- Persistence across reload
- Accessibility (ARIA, keyboard nav)
- Responsive layouts

**Tools**: Playwright, existing E2E setup

**Key Files**:

- `tests/e2e/styleGallery.spec.ts` (new)
- `tests/e2e/styleSelector.spec.ts` (update)
- `tests/e2e/pdfGeneration.spec.ts` (expand for all styles)

### Visual Regression Tests

**Coverage Areas**:

- Gallery default state
- Gallery with selection
- Gallery responsive (mobile/tablet/desktop)
- PDF first-page screenshots per style (optional)

**Tools**: Playwright screenshot comparison

**Process**:

- Capture baselines in CI
- Compare on every PR
- Manual review on failures

### Manual Testing Checklist

**Before Each Release**:

- [ ] All 5 styles generate valid PDFs
- [ ] Gallery loads in <200ms
- [ ] Thumbnails match PDF output
- [ ] Persistence works across reload
- [ ] Keyboard navigation functional
- [ ] Mobile layout responsive
- [ ] No console errors
- [ ] Accessibility audit passes (Lighthouse)

---

## Deployment Plan

### Phase 1 Deployment

- Deploy with 2 styles (Modern, Minimalist)
- Feature flag: enable for beta users first
- Monitor for bugs/feedback
- Full rollout after 1 week

### Phase 2 Deployment

- Deploy gallery UI as default
- Remove old dropdown selector
- Monitor gallery load performance
- A/B test if possible (gallery vs dropdown)

### Phase 3 Deployment

- Deploy new styles incrementally (1 per week)
- Announce each new style on social media
- Gather user feedback
- Iterate on designs based on usage

### Rollback Plan

- If gallery has issues, revert to dropdown (feature flag)
- If new style breaks generation, disable that style only
- If persistence corrupts data, clear localStorage and show message

---

## Risk Management

### Identified Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Thumbnail generation script complex | Medium | Medium | Start with manual screenshot process, automate later |
| Font licensing issues | Low | High | Use Google Fonts + system fonts only |
| Persistence edge cases | Medium | Medium | Start with happy path, add error handling incrementally |
| Style design takes longer than expected | High | Medium | Simplify designs, defer polish to Phase 4 |
| E2E tests flaky | Medium | Low | Use Playwright best practices, retries, higher timeouts |
| Gallery CSS complex on mobile | Medium | Medium | Start desktop-only, add responsive later |
| PDF output doesn't match thumbnail | Low | High | Single source of truth (jsPDF), regenerate thumbnails often |

---

## Timeline Summary

| Phase | Duration | Key Deliverables |
|-------|----------|------------------|
| Phase 1: Foundation | 2-3 weeks | Architecture, 2 styles, persistence, basic tests |
| Phase 2: Gallery UI | 2-3 weeks | Visual gallery, interactions, E2E tests, visual regression |
| Phase 3: New Styles | 3 weeks | 3 new styles (Professional, Creative, Executive), documentation |
| **Total** | **7-9 weeks** | **5 styles, gallery UI, complete feature** |

**Single Engineer Capacity**: Assumes 30-40 hours/week, realistic velocity, buffer for bugs/QA.

---

## Success Criteria (Revised - Achievable)

### Phase 1

- [x] Style selection persists across reload
- [x] 2 styles work end-to-end (Modern, Minimalist)
- [x] Static thumbnails load in <200ms
- [x] Existing E2E tests pass
- [x] Unit test coverage >90% on new modules

### Phase 2

- [x] Gallery replaces dropdown selector
- [x] Gallery is responsive (mobile, tablet, desktop)
- [x] E2E tests cover gallery interactions
- [x] Visual regression tests in place
- [x] Accessibility audit passes (keyboard nav, ARIA)

### Phase 3

- [x] 5 distinct professional styles available
- [x] Each style has unique identity (tested manually)
- [x] All thumbnails generated and match PDFs
- [x] Documentation complete (README, style guide)
- [x] Performance audit passes (gallery <200ms)

### Overall

- [x] Zero rendering drift (single jsPDF renderer)
- [x] High test coverage (>85% E2E scenarios)
- [x] Fast load times (<200ms gallery, <1s PDF generation)
- [x] Accessible (WCAG 2.1 AA compliant)
- [x] User feedback positive (if pilot tested)

---

## Future Enhancements (Post Phase 3)

**Not in current scope, but documented for future**:

1. **Custom Style Builder**
   - UI to customize colors, fonts, spacing per style
   - Save custom styles to localStorage
   - Export/import custom configs

2. **Density Controls**
   - Compact, Regular, Spacious variants per style
   - Separate feature, requires layout refactor

3. **Dynamic Thumbnail Rendering**
   - Render thumbnails on-the-fly using user's CV data
   - Requires Canvas/WebGL renderer (significant effort)

4. **More Styles**
   - Academic, Technical, Freelancer, etc.
   - Community-contributed styles

5. **Export Other Formats**
   - Word (.docx) export
   - HTML export
   - JSON export/import

6. **Live Preview Panel**
   - Side-by-side form + PDF preview
   - Updates as user types (debounced)

---

## Appendix

### A. Thumbnail Regeneration Checklist

When to regenerate thumbnails:

- [ ] After modifying any `src/styles/*.ts` file
- [ ] After changing sample data in `scripts/generateThumbnails.ts`
- [ ] Before releasing a new style
- [ ] During design iteration (weekly during Phase 3)

How to regenerate:

```bash
npm run generate-thumbnails
git add public/thumbnails/*.png
git commit -m "Update style thumbnails"
```

### B. Style Design Guidelines

**Each style must**:

- Have complete `StyleConfig` (all properties defined)
- Use freely available fonts (Google Fonts or system)
- Generate valid PDF (tested manually)
- Have distinct visual identity (different from existing styles)
- Include thumbnail in `public/thumbnails/`
- Have metadata in `styleMetadata.ts`

**Design principles**:

- Modern: Colorful, rounded, tech-focused
- Minimalist: Clean, sharp, maximum white space
- Professional: Formal, serif fonts, conservative
- Creative: Bold, vibrant, asymmetric
- Executive: Elegant, luxurious, spacious

### C. Dependencies

**Existing**:

- jsPDF (PDF generation)
- Playwright (E2E testing)
- Vitest (unit testing)

**New** (for thumbnail generation):

- `pdf-to-png-converter` (or similar)
- `sharp` (image optimization, optional)

**Font Embedding** (if needed):

- Google Fonts API or download fonts
- jsPDF font plugins

### D. Accessibility Requirements

**WCAG 2.1 AA Compliance**:

- All interactive elements keyboard accessible
- ARIA labels for gallery cards
- Focus indicators visible
- Color contrast ratio ≥4.5:1
- Alt text for thumbnails
- Screen reader announcements for selection

**Testing Tools**:

- Lighthouse (automated audit)
- axe DevTools (manual testing)
- Keyboard navigation testing (manual)
- Screen reader testing (NVDA/JAWS, optional)

---

## Conclusion

This revised plan provides a **realistic, incremental path** to implementing CV style selection using static thumbnails. By focusing on **achievable goals** (2-3 week phases), **avoiding dual-rendering complexity** (static thumbnails), and **storing only essential data** (style ID + CV data), we eliminate the major risks from the previous plan.

**Key Improvements**:

1. ✅ Static thumbnails (no Canvas drift)
2. ✅ Realistic timelines (2-3 weeks per phase, single engineer)
3. ✅ Simplified persistence (only style ID + CV data)
4. ✅ Incremental value (each phase delivers working feature)
5. ✅ Achievable success criteria (no "100% coverage" or "sub-50ms" mandates)
6. ✅ Freely available fonts (Google Fonts + system fonts)

**Next Steps**:

1. Review and approve this plan
2. Create GitHub issues for Phase 1 milestones
3. Begin Milestone 1.1 (Architecture Refactor)
4. Iterate based on feedback

**Questions? Feedback?** Please review and confirm before implementation begins.
