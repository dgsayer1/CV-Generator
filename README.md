# CV Generator

[![Build and Deploy](https://github.com/dgsayer1/CV-Generator/actions/workflows/deploy.yml/badge.svg)](https://github.com/dgsayer1/CV-Generator/actions/workflows/deploy.yml)
[![CI](https://github.com/dgsayer1/CV-Generator/actions/workflows/ci.yml/badge.svg)](https://github.com/dgsayer1/CV-Generator/actions/workflows/ci.yml)
![Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen)

A modern, client-side web application for creating professional CVs with live preview and PDF export functionality. Built with TypeScript, Vite, and jsPDF.

## 🚀 [Live Demo](https://dgsayer1.github.io/CV-Generator/)

## Features

- **Multiple CV Styles**: Choose from 4 professionally designed templates (Modern, Minimalist, Professional, Tech/Startup)
- **Interactive Form Builder**: Dynamic sections for personal info, work experience, education, certifications, and references
- **Real-time PDF Generation**: Instantly generate professional PDFs with custom formatting and colors
- **Theme Customization**: Customize theme color and font selection for your PDF output
- **Data Import/Export**: Load CV data from JSON templates or export your data for backup
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Type-Safe**: Built with TypeScript in strict mode for reliability
- **No Backend Required**: 100% client-side, your data never leaves your browser
- **Auto-Save**: Automatic localStorage persistence - never lose your work
- **Modern Stack**: Vite for blazing fast development and optimized production builds
- **Comprehensive Testing**: 114 unit tests + 99 E2E tests across 5 browser configurations

## Tech Stack

- **Build Tool**: Vite 6.x
- **Language**: TypeScript (strict mode)
- **PDF Generation**: jsPDF 2.5.x
- **Testing**: Vitest + Playwright
- **Styling**: Vanilla CSS with gradient theme

## Project Structure

```
cv-generator/
├── src/
│   ├── main.ts                    # Entry point and event listeners
│   ├── types.ts                   # TypeScript interfaces
│   ├── formHandler.ts             # Form data collection
│   ├── entryManager.ts            # Dynamic entry add/remove
│   ├── pdfGenerator.ts            # PDF generation orchestration
│   ├── pdfHelpers.ts              # PDF utility functions
│   ├── validation.ts              # Form validation
│   ├── persistence.ts             # localStorage management
│   ├── jsonLoader.ts              # JSON import/export
│   ├── defaultData.ts             # Demo data
│   ├── datePicker.ts              # Date range picker
│   └── styles/
│       ├── main.css               # Application styles
│       ├── gallery.css            # Style gallery layout
│       ├── styleConfig.ts         # Style registry
│       ├── styleMetadata.ts       # Style descriptions
│       ├── modernStyle.ts         # Modern CV template
│       ├── minimalistStyle.ts     # Minimalist CV template
│       ├── professionalStyle.ts   # Professional CV template
│       └── techStyle.ts           # Tech/Startup CV template
├── tests/
│   ├── unit/                      # 114 unit tests (Vitest)
│   └── e2e/                       # 99 E2E tests (Playwright)
├── public/
│   └── thumbnails/                # Style preview thumbnails
├── index.html                     # HTML shell
├── package.json
├── tsconfig.json
├── vite.config.ts
└── vitest.config.mts
```

## Quick Start

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173 in your browser
```

### Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

## Available Scripts

```bash
npm run dev              # Start dev server with hot reload
npm run build            # Build for production
npm run preview          # Preview production build
npm run test             # Run unit tests (watch mode)
npm run test:run         # Run unit tests (single run)
npm run test:coverage    # Run tests with coverage report
npm run test:e2e         # Run E2E tests across all browsers
npm run test:e2e:ui      # Run E2E tests in interactive UI mode
npm run test:e2e:debug   # Debug E2E tests
```

## Testing

### Unit Tests (Vitest)

**114 tests** covering all business logic with **100% statement coverage**:

- Form validation (email, phone, required fields)
- Data transformation and collection
- PDF helper functions
- Dynamic entry management

```bash
npm run test              # Watch mode
npm run test:coverage     # Generate coverage report
```

### E2E Tests (Playwright)

**99 tests** across **5 browser configurations** (Chromium, Firefox, WebKit, Tablet, Mobile):

- Complete CV generation workflow
- Dynamic form entry management
- Form validation and error handling
- Responsive layout verification
- PDF output validation

```bash
npm run test:e2e         # Run all E2E tests
npm run test:e2e:ui      # Interactive mode with UI
npm run test:e2e:debug   # Debug mode with browser
```

### Test Documentation

Full test documentation available in:
- Unit tests: `tests/unit/README.md` (if exists)
- E2E tests: `tests/e2e/README.md`

## TypeScript Configuration

Strict mode enabled with:
- `noUnusedLocals`
- `noUnusedParameters`
- `noFallthroughCasesInSwitch`
- `noImplicitReturns`
- `noUncheckedIndexedAccess`
- `exactOptionalPropertyTypes`

## CV Style Templates

The application includes 4 professionally designed CV templates, each with unique layouts and design elements:

### 🎨 Modern (Default)
- Clean, contemporary design with gradient header
- Two-column skills layout
- Color accents for section headers
- Ideal for: Tech professionals, designers, modern industries

### ✨ Minimalist
- Ultra-clean design with minimal visual elements
- Focus on content and readability
- Subtle section dividers
- Ideal for: Traditional industries, academic positions

### 💼 Professional
- Classic business-oriented layout
- Structured format with clear hierarchy
- Conservative color palette
- Ideal for: Corporate roles, management positions, consulting

### 🚀 Tech/Startup
- Bold, contemporary design
- Modern typography and spacing
- Technical aesthetic with code-like elements
- Ideal for: Software engineers, tech startups, creative tech roles

All styles support:
- Custom theme color selection
- Font customization (Helvetica, Times, Courier)
- Automatic layout adjustments for content length
- Responsive PDF generation

## Color Scheme

**Default Theme**: Purple gradient (`#667eea` to `#764ba2`)

The theme color is fully customizable via the color picker in the header. Your selected color will be applied to:
- PDF header gradients
- Section headers and accents
- Interactive elements in the form

**UI Colors**:
- Background: `#f0f2f5`
- Text Dark: `#2d3748`
- Text Grey: `#666666`

## Features in Detail

### CV Style Selection

- **Visual Gallery**: Browse and select from 4 CV templates with thumbnail previews
- **Live Preview**: See style descriptions and key features before selection
- **Persistent Choice**: Your selected style is saved and remembered
- **Easy Switching**: Change styles anytime with instant PDF updates
- **Keyboard Navigation**: Full keyboard support for accessibility

### Personal Information

- Full name and professional title
- Contact details (phone, email, location)
- Professional summary with multi-line support

### Work Experience

- Multiple job entries with add/remove functionality
- Job title, company, location, and dates
- Multi-line responsibilities with bullet points in PDF

### Education

- Multiple education entries
- Degree, institution, and years
- Clean formatting in generated PDF

### Certifications

- Dynamic certification list
- Simple add/remove interface
- Bullet-point formatting in PDF

### Skills & Expertise

- Categorized skills (Test Automation, Programming, Performance Testing, Leadership)
- Comma-separated input with automatic parsing
- Two-column layout in PDF

### References

- Two reference entries
- Name and title fields
- Professional formatting with privacy note

## PDF Output

Generated PDFs feature:

- Professional gradient header (#667eea to #764ba2)
- Clean typography with Helvetica font family
- Consistent spacing and alignment
- Automatic page breaks for long content
- Color-coded sections with purple accents

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Android)

## Deployment

This project includes automated CI/CD with GitHub Actions for continuous deployment.

### Automated Deployment (GitHub Pages)

Push to main branch triggers automatic deployment:
- All tests must pass
- TypeScript compilation check
- Production build and deployment

Full deployment documentation available in `DEPLOYMENT.md` covering:
- GitHub Pages (automated & manual)
- Netlify deployment
- Vercel deployment
- Custom server setup (Nginx/Apache)
- Domain configuration

### Quick Deploy

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Privacy & Security

- **No data collection**: All processing happens in your browser
- **No server communication**: No API calls or data transmission
- **Client-side only**: Your information never leaves your device
- **No cookies or tracking**: Zero analytics or third-party scripts

## Default Data

The application includes pre-filled demo data (Daniel Sayer's CV) for demonstration purposes.

## Contributing

This is a personal project, but suggestions and bug reports are welcome via GitHub issues.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Author

Daniel Sayer - QA Lead & Software Engineer

## Acknowledgments

- Built with [Vite](https://vitejs.dev/)
- PDF generation powered by [jsPDF](https://github.com/parallax/jsPDF)
- Testing with [Vitest](https://vitest.dev/) and [Playwright](https://playwright.dev/)
