import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create SVG thumbnails as placeholders
const WIDTH = 300;
const HEIGHT = 424;

const modernSVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="${WIDTH}" height="${HEIGHT}" fill="#ffffff"/>

  <!-- Purple gradient sidebar -->
  <defs>
    <linearGradient id="modernGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="100" height="${HEIGHT}" fill="url(#modernGradient)"/>

  <!-- Name on sidebar -->
  <text x="10" y="40" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#ffffff">John Doe</text>
  <text x="10" y="60" font-family="Arial, sans-serif" font-size="12" fill="#ffffff">Software Engineer</text>

  <!-- Content area -->
  <text x="120" y="40" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#1a202c">Work Experience</text>

  <text x="120" y="70" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#2d3748">Senior Developer</text>
  <text x="120" y="90" font-family="Arial, sans-serif" font-size="11" fill="#4a5568">Tech Company</text>

  <line x1="120" y1="110" x2="280" y2="110" stroke="#e2e8f0" stroke-width="1"/>

  <text x="120" y="140" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#2d3748">Lead Engineer</text>
  <text x="120" y="160" font-family="Arial, sans-serif" font-size="11" fill="#4a5568">Previous Company</text>

  <text x="120" y="200" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#1a202c">Education</text>
  <text x="120" y="230" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#2d3748">Computer Science</text>
  <text x="120" y="250" font-family="Arial, sans-serif" font-size="11" fill="#4a5568">University</text>
</svg>`;

const minimalistSVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="${WIDTH}" height="${HEIGHT}" fill="#ffffff"/>

  <!-- Header -->
  <text x="20" y="50" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#2d3748">John Doe</text>
  <text x="20" y="75" font-family="Arial, sans-serif" font-size="14" fill="#667eea">Software Engineer</text>

  <!-- Divider -->
  <line x1="20" y1="90" x2="280" y2="90" stroke="#cbd5e0" stroke-width="1"/>

  <!-- Work Experience Section -->
  <text x="20" y="120" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#2d3748" letter-spacing="0.5">WORK EXPERIENCE</text>

  <text x="20" y="145" font-family="Arial, sans-serif" font-size="12" fill="#4a5568">Senior Developer</text>
  <text x="20" y="165" font-family="Arial, sans-serif" font-size="11" fill="#718096">Tech Company • 2020-Present</text>

  <text x="20" y="190" font-family="Arial, sans-serif" font-size="12" fill="#4a5568">Lead Engineer</text>
  <text x="20" y="210" font-family="Arial, sans-serif" font-size="11" fill="#718096">Previous Company • 2018-2020</text>

  <!-- Education Section -->
  <text x="20" y="250" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#2d3748" letter-spacing="0.5">EDUCATION</text>

  <text x="20" y="275" font-family="Arial, sans-serif" font-size="12" fill="#4a5568">Computer Science</text>
  <text x="20" y="295" font-family="Arial, sans-serif" font-size="11" fill="#718096">University • 2016-2020</text>

  <!-- Skills Section -->
  <text x="20" y="335" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#2d3748" letter-spacing="0.5">SKILLS</text>

  <rect x="20" y="345" width="70" height="20" rx="10" fill="#edf2f7"/>
  <text x="30" y="359" font-family="Arial, sans-serif" font-size="11" fill="#4a5568">TypeScript</text>

  <rect x="100" y="345" width="50" height="20" rx="10" fill="#edf2f7"/>
  <text x="110" y="359" font-family="Arial, sans-serif" font-size="11" fill="#4a5568">React</text>
</svg>`;

// Ensure thumbnails directory exists
const thumbnailsDir = path.join(__dirname, '..', 'public', 'thumbnails');
if (!fs.existsSync(thumbnailsDir)) {
  fs.mkdirSync(thumbnailsDir, { recursive: true });
}

// Save SVG files
fs.writeFileSync(path.join(thumbnailsDir, 'modern.svg'), modernSVG);
fs.writeFileSync(path.join(thumbnailsDir, 'minimalist.svg'), minimalistSVG);

console.log('✓ Placeholder thumbnails generated successfully');
console.log('  - public/thumbnails/modern.svg');
console.log('  - public/thumbnails/minimalist.svg');
console.log('\nNote: SVG files created. For PNG conversion, use an image tool or install sharp.');
