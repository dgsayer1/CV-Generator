import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create SVG thumbnails that match actual PDF styles
const WIDTH = 300;
const HEIGHT = 424;

// Modern style: colored header, rounded corners, light boxes
const modernSVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="${WIDTH}" height="${HEIGHT}" fill="#ffffff"/>

  <!-- Colored header with gradient (matching #667eea theme) -->
  <defs>
    <linearGradient id="modernGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${WIDTH}" height="60" fill="url(#modernGradient)"/>

  <!-- Name and title in header (white text on colored background) -->
  <text x="20" y="28" font-family="Helvetica, Arial, sans-serif" font-size="16" font-weight="bold" fill="#ffffff">JOHN DOE</text>
  <text x="20" y="45" font-family="Helvetica, Arial, sans-serif" font-size="9" fill="#ffffff">Software Engineer</text>

  <!-- Contact info -->
  <text x="20" y="75" font-family="Helvetica, Arial, sans-serif" font-size="7" fill="#2d3748">📧 john.doe@example.com</text>
  <text x="20" y="85" font-family="Helvetica, Arial, sans-serif" font-size="7" fill="#2d3748">📍 San Francisco, CA</text>

  <!-- Summary section -->
  <text x="20" y="105" font-family="Helvetica, Arial, sans-serif" font-size="10" font-weight="bold" fill="#2d3748">Professional Summary</text>
  <line x1="20" y1="108" x2="280" y2="108" stroke="#667eea" stroke-width="1"/>
  <text x="20" y="120" font-family="Helvetica, Arial, sans-serif" font-size="7.5" fill="#4a5568">Experienced software engineer with expertise in full-stack</text>
  <text x="20" y="130" font-family="Helvetica, Arial, sans-serif" font-size="7.5" fill="#4a5568">development and cloud architecture.</text>

  <!-- Skills section -->
  <text x="20" y="150" font-family="Helvetica, Arial, sans-serif" font-size="10" font-weight="bold" fill="#2d3748">Skills</text>
  <line x1="20" y1="153" x2="280" y2="153" stroke="#667eea" stroke-width="1"/>

  <!-- Skill pills with rounded corners -->
  <rect x="20" y="160" width="60" height="16" rx="2" fill="#ffffff" stroke="#e5e7eb" stroke-width="0.5"/>
  <text x="26" y="171" font-family="Helvetica, Arial, sans-serif" font-size="7" fill="#4a5568">TypeScript</text>

  <rect x="85" y="160" width="40" height="16" rx="2" fill="#ffffff" stroke="#e5e7eb" stroke-width="0.5"/>
  <text x="91" y="171" font-family="Helvetica, Arial, sans-serif" font-size="7" fill="#4a5568">React</text>

  <rect x="130" y="160" width="45" height="16" rx="2" fill="#ffffff" stroke="#e5e7eb" stroke-width="0.5"/>
  <text x="136" y="171" font-family="Helvetica, Arial, sans-serif" font-size="7" fill="#4a5568">Node.js</text>

  <!-- Work Experience -->
  <text x="20" y="195" font-family="Helvetica, Arial, sans-serif" font-size="10" font-weight="bold" fill="#2d3748">Work Experience</text>
  <line x1="20" y1="198" x2="280" y2="198" stroke="#667eea" stroke-width="1"/>

  <!-- Job box with rounded corners and light background -->
  <rect x="20" y="205" width="260" height="55" rx="2" fill="#f9fafb" stroke="#e5e7eb" stroke-width="0.5"/>
  <text x="26" y="218" font-family="Helvetica, Arial, sans-serif" font-size="9" font-weight="bold" fill="#2d3748">Senior Software Engineer</text>
  <text x="26" y="228" font-family="Helvetica, Arial, sans-serif" font-size="8" fill="#666666">Tech Corp</text>

  <!-- Date badge (outlined) -->
  <rect x="210" y="210" width="60" height="14" rx="1.5" fill="none" stroke="#667eea" stroke-width="0.5"/>
  <text x="215" y="220" font-family="Helvetica, Arial, sans-serif" font-size="7" fill="#667eea">2020 - 2024</text>

  <text x="26" y="240" font-family="Helvetica, Arial, sans-serif" font-size="7" fill="#555555">• Led development of microservices architecture</text>
  <text x="26" y="250" font-family="Helvetica, Arial, sans-serif" font-size="7" fill="#555555">• Mentored junior developers</text>

  <!-- Education -->
  <text x="20" y="280" font-family="Helvetica, Arial, sans-serif" font-size="10" font-weight="bold" fill="#2d3748">Education</text>
  <line x1="20" y1="283" x2="280" y2="283" stroke="#667eea" stroke-width="1"/>

  <rect x="20" y="290" width="260" height="40" rx="2" fill="#f9fafb" stroke="#e5e7eb" stroke-width="0.5"/>
  <text x="26" y="303" font-family="Helvetica, Arial, sans-serif" font-size="9" font-weight="bold" fill="#2d3748">B.S. in Computer Science</text>
  <text x="26" y="313" font-family="Helvetica, Arial, sans-serif" font-size="8" fill="#666666">University of California</text>

  <rect x="210" y="295" width="60" height="14" rx="1.5" fill="none" stroke="#667eea" stroke-width="0.5"/>
  <text x="230" y="305" font-family="Helvetica, Arial, sans-serif" font-size="7" fill="#667eea">2018</text>
</svg>`;

// Minimalist style: white header, sharp corners, minimal boxes
const minimalistSVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="${WIDTH}" height="${HEIGHT}" fill="#ffffff"/>

  <!-- White header (no color) with more margin (18mm vs 15mm) -->
  <text x="25" y="35" font-family="Helvetica, Arial, sans-serif" font-size="15" font-weight="bold" fill="#2d3748">JOHN DOE</text>
  <text x="25" y="50" font-family="Helvetica, Arial, sans-serif" font-size="8.5" fill="#667eea">Software Engineer</text>

  <!-- Thin divider line -->
  <line x1="25" y1="58" x2="275" y2="58" stroke="#c8c8c8" stroke-width="0.3"/>

  <!-- Contact info -->
  <text x="25" y="70" font-family="Helvetica, Arial, sans-serif" font-size="6.5" fill="#666666">john.doe@example.com  •  San Francisco, CA</text>

  <!-- Summary section -->
  <text x="25" y="88" font-family="Helvetica, Arial, sans-serif" font-size="9" font-weight="bold" fill="#2d3748" letter-spacing="0.5">PROFESSIONAL SUMMARY</text>
  <line x1="25" y1="91" x2="275" y2="91" stroke="#c8c8c8" stroke-width="0.2"/>
  <text x="25" y="102" font-family="Helvetica, Arial, sans-serif" font-size="7.5" fill="#4a5568">Experienced software engineer with expertise in full-stack</text>
  <text x="25" y="111" font-family="Helvetica, Arial, sans-serif" font-size="7.5" fill="#4a5568">development and cloud architecture.</text>

  <!-- Skills section -->
  <text x="25" y="130" font-family="Helvetica, Arial, sans-serif" font-size="9" font-weight="bold" fill="#2d3748" letter-spacing="0.5">SKILLS</text>
  <line x1="25" y1="133" x2="275" y2="133" stroke="#c8c8c8" stroke-width="0.2"/>

  <!-- Skill pills with sharp corners (no border radius) -->
  <rect x="25" y="140" width="60" height="15" rx="0" fill="#ffffff" stroke="#c8c8c8" stroke-width="0.3"/>
  <text x="30" y="150" font-family="Helvetica, Arial, sans-serif" font-size="7" fill="#4a5568">TypeScript</text>

  <rect x="90" y="140" width="40" height="15" rx="0" fill="#ffffff" stroke="#c8c8c8" stroke-width="0.3"/>
  <text x="95" y="150" font-family="Helvetica, Arial, sans-serif" font-size="7" fill="#4a5568">React</text>

  <rect x="135" y="140" width="45" height="15" rx="0" fill="#ffffff" stroke="#c8c8c8" stroke-width="0.3"/>
  <text x="140" y="150" font-family="Helvetica, Arial, sans-serif" font-size="7" fill="#4a5568">Node.js</text>

  <!-- Work Experience -->
  <text x="25" y="175" font-family="Helvetica, Arial, sans-serif" font-size="9" font-weight="bold" fill="#2d3748" letter-spacing="0.5">WORK EXPERIENCE</text>
  <line x1="25" y1="178" x2="275" y2="178" stroke="#c8c8c8" stroke-width="0.2"/>

  <!-- Job box with sharp corners and almost-white background -->
  <rect x="25" y="185" width="250" height="55" rx="0" fill="#fcfcfc" stroke="#c8c8c8" stroke-width="0.3"/>
  <text x="30" y="198" font-family="Helvetica, Arial, sans-serif" font-size="9" font-weight="bold" fill="#2d3748">Senior Software Engineer</text>
  <text x="30" y="208" font-family="Helvetica, Arial, sans-serif" font-size="7.5" fill="#666666">Tech Corp</text>

  <!-- Date badge (sharp corners, outlined) -->
  <rect x="210" y="190" width="55" height="13" rx="0" fill="none" stroke="#c8c8c8" stroke-width="0.3"/>
  <text x="215" y="199" font-family="Helvetica, Arial, sans-serif" font-size="7" fill="#666666">2020 - 2024</text>

  <text x="30" y="220" font-family="Helvetica, Arial, sans-serif" font-size="7" fill="#555555">• Led development of microservices architecture</text>
  <text x="30" y="230" font-family="Helvetica, Arial, sans-serif" font-size="7" fill="#555555">• Mentored junior developers</text>

  <!-- Education -->
  <text x="25" y="260" font-family="Helvetica, Arial, sans-serif" font-size="9" font-weight="bold" fill="#2d3748" letter-spacing="0.5">EDUCATION</text>
  <line x1="25" y1="263" x2="275" y2="263" stroke="#c8c8c8" stroke-width="0.2"/>

  <rect x="25" y="270" width="250" height="38" rx="0" fill="#fcfcfc" stroke="#c8c8c8" stroke-width="0.3"/>
  <text x="30" y="283" font-family="Helvetica, Arial, sans-serif" font-size="9" font-weight="bold" fill="#2d3748">B.S. in Computer Science</text>
  <text x="30" y="293" font-family="Helvetica, Arial, sans-serif" font-size="7.5" fill="#666666">University of California</text>

  <rect x="210" y="275" width="55" height="13" rx="0" fill="none" stroke="#c8c8c8" stroke-width="0.3"/>
  <text x="230" y="284" font-family="Helvetica, Arial, sans-serif" font-size="7" fill="#666666">2018</text>
</svg>`;

// Professional style: white header, sharp corners, navy accents, filled badges
const professionalSVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="${WIDTH}" height="${HEIGHT}" fill="#ffffff"/>

  <!-- White header with generous margins (20mm) -->
  <text x="28" y="38" font-family="Georgia, Times, serif" font-size="15" font-weight="bold" fill="#1e293b">JOHN DOE</text>
  <text x="28" y="53" font-family="Georgia, Times, serif" font-size="9" fill="#475569">Software Engineer</text>

  <!-- Navy blue divider line (thicker: 0.8) -->
  <line x1="28" y1="61" x2="272" y2="61" stroke="#1e3a8a" stroke-width="0.8"/>

  <!-- Contact info -->
  <text x="28" y="73" font-family="Georgia, Times, serif" font-size="6.5" fill="#64748b">john.doe@example.com  •  San Francisco, CA</text>

  <!-- Summary section -->
  <text x="28" y="93" font-family="Georgia, Times, serif" font-size="9.5" font-weight="bold" fill="#1e293b">PROFESSIONAL SUMMARY</text>
  <line x1="28" y1="96" x2="272" y2="96" stroke="#1e3a8a" stroke-width="0.5"/>
  <text x="28" y="108" font-family="Georgia, Times, serif" font-size="7.5" fill="#475569">Experienced software engineer with expertise in full-stack</text>
  <text x="28" y="118" font-family="Georgia, Times, serif" font-size="7.5" fill="#475569">development and cloud architecture.</text>

  <!-- Skills section -->
  <text x="28" y="139" font-family="Georgia, Times, serif" font-size="9.5" font-weight="bold" fill="#1e293b">SKILLS</text>
  <line x1="28" y1="142" x2="272" y2="142" stroke="#1e3a8a" stroke-width="0.5"/>

  <!-- Skill pills with sharp corners and navy borders -->
  <rect x="28" y="149" width="60" height="15" rx="0" fill="#ffffff" stroke="#1e3a8a" stroke-width="0.4"/>
  <text x="33" y="159" font-family="Georgia, Times, serif" font-size="7" fill="#475569">TypeScript</text>

  <rect x="93" y="149" width="40" height="15" rx="0" fill="#ffffff" stroke="#1e3a8a" stroke-width="0.4"/>
  <text x="98" y="159" font-family="Georgia, Times, serif" font-size="7" fill="#475569">React</text>

  <rect x="138" y="149" width="45" height="15" rx="0" fill="#ffffff" stroke="#1e3a8a" stroke-width="0.4"/>
  <text x="143" y="159" font-family="Georgia, Times, serif" font-size="7" fill="#475569">Node.js</text>

  <!-- Work Experience -->
  <text x="28" y="182" font-family="Georgia, Times, serif" font-size="9.5" font-weight="bold" fill="#1e293b">WORK EXPERIENCE</text>
  <line x1="28" y1="185" x2="272" y2="185" stroke="#1e3a8a" stroke-width="0.5"/>

  <!-- Job box with sharp corners and light background -->
  <rect x="28" y="192" width="244" height="58" rx="0" fill="#f8fafc" stroke="#cbd5e1" stroke-width="0.4"/>
  <text x="33" y="205" font-family="Georgia, Times, serif" font-size="9" font-weight="bold" fill="#1e293b">Senior Software Engineer</text>
  <text x="33" y="216" font-family="Georgia, Times, serif" font-size="7.5" fill="#475569">Tech Corp</text>

  <!-- Filled date badge (navy background) -->
  <rect x="210" y="197" width="55" height="13" rx="0" fill="#1e3a8a" stroke="none"/>
  <text x="215" y="206" font-family="Georgia, Times, serif" font-size="7" fill="#ffffff">2020 - 2024</text>

  <text x="33" y="228" font-family="Georgia, Times, serif" font-size="7" fill="#64748b">• Led development of microservices architecture</text>
  <text x="33" y="238" font-family="Georgia, Times, serif" font-size="7" fill="#64748b">• Mentored junior developers</text>

  <!-- Education -->
  <text x="28" y="270" font-family="Georgia, Times, serif" font-size="9.5" font-weight="bold" fill="#1e293b">EDUCATION</text>
  <line x1="28" y1="273" x2="272" y2="273" stroke="#1e3a8a" stroke-width="0.5"/>

  <rect x="28" y="280" width="244" height="40" rx="0" fill="#f8fafc" stroke="#cbd5e1" stroke-width="0.4"/>
  <text x="33" y="293" font-family="Georgia, Times, serif" font-size="9" font-weight="bold" fill="#1e293b">B.S. in Computer Science</text>
  <text x="33" y="304" font-family="Georgia, Times, serif" font-size="7.5" fill="#475569">University of California</text>

  <rect x="210" y="285" width="55" height="13" rx="0" fill="#1e3a8a" stroke="none"/>
  <text x="230" y="294" font-family="Georgia, Times, serif" font-size="7" fill="#ffffff">2018</text>
</svg>`;

// Tech/Startup style: SIDEBAR LAYOUT - left column (contact/skills) + right column (experience)
const techSVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="${WIDTH}" height="${HEIGHT}" fill="#ffffff"/>

  <!-- Left sidebar background (light teal) -->
  <rect x="0" y="0" width="85" height="424" fill="#f0fdfa"/>

  <!-- Compact header (no colored background) -->
  <text x="15" y="20" font-family="Helvetica, Arial, sans-serif" font-size="16" font-weight="bold" fill="#1e293b">JOHN DOE</text>
  <text x="15" y="30" font-family="Helvetica, Arial, sans-serif" font-size="9" fill="#14b8a6">Software Developer</text>

  <!-- SIDEBAR: Contact Section -->
  <text x="15" y="50" font-family="Helvetica, Arial, sans-serif" font-size="9" font-weight="bold" fill="#1e293b">CONTACT</text>
  <line x1="15" y1="52" x2="85" y2="52" stroke="#14b8a6" stroke-width="0.8"/>

  <text x="15" y="62" font-family="Helvetica, Arial, sans-serif" font-size="6.5" font-weight="bold" fill="#64748b">Phone</text>
  <text x="15" y="68" font-family="Helvetica, Arial, sans-serif" font-size="6.5" fill="#64748b">+1 234 567 8900</text>

  <text x="15" y="78" font-family="Helvetica, Arial, sans-serif" font-size="6.5" font-weight="bold" fill="#64748b">Email</text>
  <text x="15" y="84" font-family="Helvetica, Arial, sans-serif" font-size="6.5" fill="#64748b">john@example.com</text>

  <text x="15" y="94" font-family="Helvetica, Arial, sans-serif" font-size="6.5" font-weight="bold" fill="#64748b">Location</text>
  <text x="15" y="100" font-family="Helvetica, Arial, sans-serif" font-size="6.5" fill="#64748b">San Francisco, CA</text>

  <!-- SIDEBAR: Skills Section -->
  <text x="15" y="118" font-family="Helvetica, Arial, sans-serif" font-size="9" font-weight="bold" fill="#1e293b">SKILLS</text>
  <line x1="15" y1="120" x2="85" y2="120" stroke="#14b8a6" stroke-width="0.8"/>

  <text x="15" y="130" font-family="Helvetica, Arial, sans-serif" font-size="7.5" font-weight="bold" fill="#1e293b">Frontend</text>
  <text x="15" y="137" font-family="Helvetica, Arial, sans-serif" font-size="6.5" fill="#64748b">• React</text>
  <text x="15" y="143" font-family="Helvetica, Arial, sans-serif" font-size="6.5" fill="#64748b">• TypeScript</text>
  <text x="15" y="149" font-family="Helvetica, Arial, sans-serif" font-size="6.5" fill="#64748b">• Vue.js</text>

  <text x="15" y="162" font-family="Helvetica, Arial, sans-serif" font-size="7.5" font-weight="bold" fill="#1e293b">Backend</text>
  <text x="15" y="169" font-family="Helvetica, Arial, sans-serif" font-size="6.5" fill="#64748b">• Node.js</text>
  <text x="15" y="175" font-family="Helvetica, Arial, sans-serif" font-size="6.5" fill="#64748b">• Python</text>

  <!-- MAIN CONTENT: Summary Section -->
  <text x="110" y="50" font-family="Helvetica, Arial, sans-serif" font-size="10" font-weight="bold" fill="#1e293b">PROFESSIONAL SUMMARY</text>
  <line x1="110" y1="52" x2="285" y2="52" stroke="#14b8a6" stroke-width="0.5"/>

  <text x="110" y="63" font-family="Helvetica, Arial, sans-serif" font-size="7.5" fill="#1e293b">Experienced software developer with expertise in full-stack</text>
  <text x="110" y="71" font-family="Helvetica, Arial, sans-serif" font-size="7.5" fill="#1e293b">development. Passionate about creating scalable solutions.</text>

  <!-- MAIN CONTENT: Work Experience -->
  <text x="110" y="90" font-family="Helvetica, Arial, sans-serif" font-size="10" font-weight="bold" fill="#1e293b">WORK EXPERIENCE</text>
  <line x1="110" y1="92" x2="285" y2="92" stroke="#14b8a6" stroke-width="0.5"/>

  <text x="110" y="103" font-family="Helvetica, Arial, sans-serif" font-size="9" font-weight="bold" fill="#1e293b">Senior Software Engineer</text>
  <text x="250" y="103" font-family="Helvetica, Arial, sans-serif" font-size="7" fill="#14b8a6">2020 - 2024</text>
  <text x="110" y="111" font-family="Helvetica, Arial, sans-serif" font-size="7.5" fill="#64748b">Tech Startup Inc. | San Francisco</text>
  <text x="110" y="120" font-family="Helvetica, Arial, sans-serif" font-size="7" fill="#1e293b">• Led development of microservices architecture</text>
  <text x="110" y="127" font-family="Helvetica, Arial, sans-serif" font-size="7" fill="#1e293b">• Mentored junior engineers on best practices</text>

  <text x="110" y="142" font-family="Helvetica, Arial, sans-serif" font-size="9" font-weight="bold" fill="#1e293b">Software Engineer</text>
  <text x="250" y="142" font-family="Helvetica, Arial, sans-serif" font-size="7" fill="#14b8a6">2018 - 2020</text>
  <text x="110" y="150" font-family="Helvetica, Arial, sans-serif" font-size="7.5" fill="#64748b">StartupXYZ | Remote</text>
  <text x="110" y="159" font-family="Helvetica, Arial, sans-serif" font-size="7" fill="#1e293b">• Built responsive web applications</text>
  <text x="110" y="166" font-family="Helvetica, Arial, sans-serif" font-size="7" fill="#1e293b">• Implemented CI/CD pipelines</text>

  <!-- MAIN CONTENT: Education -->
  <text x="110" y="185" font-family="Helvetica, Arial, sans-serif" font-size="10" font-weight="bold" fill="#1e293b">EDUCATION</text>
  <line x1="110" y1="187" x2="285" y2="187" stroke="#14b8a6" stroke-width="0.5"/>

  <text x="110" y="198" font-family="Helvetica, Arial, sans-serif" font-size="8" font-weight="bold" fill="#1e293b">B.S. in Computer Science</text>
  <text x="260" y="198" font-family="Helvetica, Arial, sans-serif" font-size="7" fill="#14b8a6">2018</text>
  <text x="110" y="206" font-family="Helvetica, Arial, sans-serif" font-size="7" fill="#64748b">University of California</text>
</svg>`;

// Ensure thumbnails directory exists
const thumbnailsDir = path.join(__dirname, '..', 'public', 'thumbnails');
if (!fs.existsSync(thumbnailsDir)) {
  fs.mkdirSync(thumbnailsDir, { recursive: true });
}

// Save SVG files
fs.writeFileSync(path.join(thumbnailsDir, 'modern.svg'), modernSVG);
fs.writeFileSync(path.join(thumbnailsDir, 'minimalist.svg'), minimalistSVG);
fs.writeFileSync(path.join(thumbnailsDir, 'professional.svg'), professionalSVG);
fs.writeFileSync(path.join(thumbnailsDir, 'tech.svg'), techSVG);

console.log('✓ Accurate thumbnails generated successfully');
console.log('  - public/thumbnails/modern.svg');
console.log('  - public/thumbnails/minimalist.svg');
console.log('  - public/thumbnails/professional.svg');
console.log('  - public/thumbnails/tech.svg');
console.log('\nKey differences visible in thumbnails:');
console.log('  Modern: Colored gradient header, rounded corners, full-width layout');
console.log('  Minimalist: White header, sharp corners, more whitespace, full-width layout');
console.log('  Professional: White header, navy accents, filled badges, serif fonts');
console.log('  Tech: SIDEBAR LAYOUT - left column (contact/skills) + right column (experience)');
