# CV Generator

[![Build and Deploy](https://github.com/yourusername/cv-generator/actions/workflows/deploy.yml/badge.svg)](https://github.com/yourusername/cv-generator/actions/workflows/deploy.yml)
[![CI](https://github.com/yourusername/cv-generator/actions/workflows/ci.yml/badge.svg)](https://github.com/yourusername/cv-generator/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/yourusername/cv-generator/branch/main/graph/badge.svg)](https://codecov.io/gh/yourusername/cv-generator)

A modern, client-side web application for creating professional CVs with live preview and PDF export functionality. Built with TypeScript, Vite, and jsPDF.

## Features

- **Interactive Form Builder**: Dynamic sections for personal info, work experience, education, certifications, and references
- **Real-time PDF Generation**: Instantly generate professional PDFs with custom formatting
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Type-Safe**: Built with TypeScript in strict mode for reliability
- **No Backend Required**: 100% client-side, your data never leaves your browser
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
│   ├── main.ts              # Entry point and event listeners
│   ├── types.ts             # TypeScript interfaces
│   ├── formHandler.ts       # Form data collection
│   ├── entryManager.ts      # Dynamic entry add/remove
│   ├── pdfGenerator.ts      # PDF generation logic
│   ├── pdfHelpers.ts        # PDF utility functions
│   ├── validation.ts        # Form validation
│   └── styles/
│       └── main.css         # Application styles
├── tests/
│   ├── unit/                # Unit tests
│   └── e2e/                 # Playwright E2E tests
├── index.html               # HTML shell
├── package.json
├── tsconfig.json
├── vite.config.ts
└── playwright.config.ts
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

## Color Scheme

- Primary: `#667eea` (purple)
- Secondary: `#764ba2` (darker purple)
- Background: `#f0f2f5`
- Text Dark: `#2d3748`
- Text Grey: `#666666`

## Features in Detail

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
